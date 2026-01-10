import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

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

          setDebug(`Bytes: ${value.byteLength}`);

          if (value.byteLength >= 4) {
            const heart = value.getUint8(0);
            const oxygen = value.getUint8(1);
            const tempRaw = value.getUint16(2, true);
            const temp = tempRaw / 10;

            setDebug(`HR:${heart} O2:${oxygen} T:${temp}`);

            setCurrentData({
              heart,
              oxygen,
              temp: Number(temp.toFixed(1)),
              timestamp: Date.now()
            });
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