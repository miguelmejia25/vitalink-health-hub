import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

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
}

const BLEContext = createContext<BLEContextType | null>(null);

interface BLEProviderProps {
  children: ReactNode;
}

export const BLEProvider = ({ children }: BLEProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentData, setCurrentData] = useState<VitalData>({
    heart: 0,
    oxygen: 0,
    temp: 0,
    timestamp: Date.now()
  });
  const [history, setHistory] = useState<VitalData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);

  // Manejar nuevos datos recibidos
  const handleCharacteristicChange = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    
    if (!value) return;

    // IMPORTANTE: Ajusta este parsing según el formato exacto de tu ESP32
    try {
      const heart = value.getUint8(0);
      const oxygen = value.getUint8(1);
      
      // Temperatura puede venir como uint16 (temp * 10) para evitar decimales
      const tempRaw = value.getUint16(2, true); // true = little endian
      const temp = tempRaw / 10;

      const newData: VitalData = {
        heart,
        oxygen,
        temp: Number(temp.toFixed(1)),
        timestamp: Date.now()
      };

      console.log('📊 Datos recibidos:', newData);

      setCurrentData(newData);
      setHistory(prev => [newData, ...prev].slice(0, 50)); // Mantener últimos 50
      setError(null);

    } catch (err) {
      console.error('Error parseando datos BLE:', err);
      setError('Error al leer datos del sensor');
    }
  }, []);

  // Conectar al dispositivo BLE
 const connectDevice = useCallback(async () => {
  if (!navigator.bluetooth) {
    setError('Bluetooth Web API no disponible en este navegador');
    return;
  }

  setIsConnecting(true);
  setError(null);

  try {
    console.log('🔍 Buscando dispositivo BLE...');

    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { namePrefix: 'VitalLink' },
        { namePrefix: 'ESP32' }
      ],
      optionalServices: ['12345678-1234-5678-1234-56789abcdef0']
    });

    console.log('✅ Dispositivo encontrado:', device.name);

    device.addEventListener('gattserverdisconnected', () => {
      console.log('❌ Dispositivo desconectado');
      setIsConnected(false);
      setError('Dispositivo desconectado');
    });

    const server = await device.gatt?.connect();
    if (!server) throw new Error('No se pudo conectar al servidor GATT');

    console.log('🔗 Conectado al servidor GATT');

    const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
    const characteristic = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef1');

    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicChange);

    console.log('🎉 Notificaciones activadas');

    setDevice(device);
    setCharacteristic(characteristic);
    setIsConnected(true);

  } catch (err: any) {
    console.error('Error BLE:', err);
    setError(err.message || 'Error al conectar con el dispositivo');
    setIsConnected(false);
  } finally {
    setIsConnecting(false);
  }
}, [handleCharacteristicChange]);

  // Desconectar dispositivo
  const disconnectDevice = useCallback(() => {
    if (characteristic) {
      characteristic.removeEventListener('characteristicvaluechanged', handleCharacteristicChange);
    }
    
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    }

    setDevice(null);
    setCharacteristic(null);
    setIsConnected(false);
    console.log('👋 Desconectado');
  }, [device, characteristic, handleCharacteristicChange]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      disconnectDevice();
    };
  }, [disconnectDevice]);

  return (
    <BLEContext.Provider
      value={{
        isConnected,
        isConnecting,
        currentData,
        history,
        connectDevice,
        disconnectDevice,
        error
      }}
    >
      {children}
    </BLEContext.Provider>
  );
};

export const useBLE = () => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useBLE debe usarse dentro de BLEProvider');
  }
  return context;
};