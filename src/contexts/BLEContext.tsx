import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { db } from '@/lib/firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';

interface VitalData {
  heart: number;
  oxygen: number;
  temp: number;
  timestamp: number;
}

interface BLEContextType {
  isConnected: boolean;
  isConnecting: boolean;
  currentData: VitalData;
  history: VitalData[];
  connectDevice: () => Promise<void>;
  disconnectDevice: () => void;
  error: string | null;
  debug: string;
}

const BLEContext = createContext<BLEContextType | null>(null);

export const BLEProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentData, setCurrentData] = useState<VitalData>({
    heart: 0, oxygen: 0, temp: 0, timestamp: Date.now()
  });
  const [history, setHistory] = useState<VitalData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string>('');
  
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const charRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  // Guardar datos en Firebase
  const saveToFirebase = async (data: VitalData) => {
  try {
    setDebug(`Guardando: HR:${data.heart} O2:${data.oxygen} T:${data.temp}`);
    
    const vitalsRef = ref(db, 'vitals');
    await push(vitalsRef, {
      heart: data.heart,
      oxygen: data.oxygen,
      temp: data.temp,
      timestamp: Date.now()
    });
    
    setDebug('✅ Guardado en Firebase');
  } catch (err: any) {
    setDebug('❌ Error Firebase: ' + err.message);
    console.error('Error Firebase:', err);
  }
};

  const connectDevice = useCallback(async () => {
    if (!navigator.bluetooth) {
      setError('Bluetooth no disponible');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setDebug('Iniciando...');

    try {
      setDebug('Solicitando dispositivo...');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'VitalLink' }, { namePrefix: 'ESP32' }],
        optionalServices: ['12345678-1234-5678-1234-56789abcdef0']
      });

      deviceRef.current = device;
      setDebug('Dispositivo: ' + device.name);

      device.addEventListener('gattserverdisconnected', () => {
        setDebug('Evento: gattserverdisconnected');
        setIsConnected(false);
      });

      setDebug('Conectando GATT...');
      const server = await device.gatt?.connect();
      if (!server) throw new Error('GATT null');

      setDebug('Obteniendo servicio...');
      const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');

      setDebug('Obteniendo característica...');
      const char = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef1');
      charRef.current = char;

      setDebug('Iniciando notificaciones...');
      await char.startNotifications();

      char.addEventListener('characteristicvaluechanged', (event: Event) => {
        try {
          const target = event.target as BluetoothRemoteGATTCharacteristic;
          const value = target.value;
          
          if (!value) {
            setDebug('Valor null');
            return;
          }

          if (value.byteLength >= 4) {
            const heart = value.getUint8(0);
            const oxygen = value.getUint8(1);
            const tempRaw = value.getUint16(2, true);
            const temp = tempRaw / 10;

            const newData: VitalData = {
              heart,
              oxygen,
              temp: Number(temp.toFixed(1)),
              timestamp: Date.now()
            };

            setDebug(`HR:${heart} O2:${oxygen} T:${temp}`);
            setCurrentData(newData);
            setHistory(prev => [newData, ...prev].slice(0, 50));

            // Guardar en Firebase solo si hay datos válidos
            if (heart > 0 || oxygen > 0 || temp > 0) {
              saveToFirebase(newData);
            }
          }
        } catch (e: any) {
          setDebug('Error datos: ' + e.message);
        }
      });

      setIsConnected(true);
      setDebug('Conectado OK');

    } catch (err: any) {
      setError(err.message);
      setDebug('Error: ' + err.message);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectDevice = useCallback(() => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    deviceRef.current = null;
    charRef.current = null;
    setIsConnected(false);
    setDebug('Desconectado manual');
  }, []);

  return (
    <BLEContext.Provider value={{
      isConnected, isConnecting, currentData, history,
      connectDevice, disconnectDevice, error, debug
    }}>
      {children}
    </BLEContext.Provider>
  );
};

export const useBLE = () => {
  const context = useContext(BLEContext);
  if (!context) throw new Error('useBLE debe usarse dentro de BLEProvider');
  return context;
};