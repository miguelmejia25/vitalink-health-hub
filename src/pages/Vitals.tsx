import { VitalCard } from "@/components/VitalCard";
import { Droplets, Heart, Thermometer, Bluetooth, AlertCircle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBLE } from "@/contexts/BLEContext";
import { cn } from "@/lib/utils";

export default function Vitals() {
  const {
    isConnected,
    isConnecting,
    currentData,
    history,
    connectDevice,
    disconnectDevice,
    error
  } = useBLE();

  // Determinar estado de salud basado en valores
  const getVitalStatus = (type: 'heart' | 'oxygen' | 'temp', value: number): 'normal' | 'warning' => {
    if (type === 'heart') {
      if (value < 60 || value > 100) return 'warning';
    }
    if (type === 'oxygen') {
      if (value < 95) return 'warning';
    }
    if (type === 'temp') {
      if (value < 36 || value > 37.5) return 'warning';
    }
    return 'normal';
  };

  const hasWarnings = 
    getVitalStatus('heart', currentData.heart) === 'warning' ||
    getVitalStatus('oxygen', currentData.oxygen) === 'warning' ||
    getVitalStatus('temp', currentData.temp) === 'warning';

  return (
    <main className="container py-6">
      
      {/* Header con botón de conexión */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">Monitor de Signos Vitales</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              {isConnected ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Conectado al sensor
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  Sin conexión
                </>
              )}
            </p>
          </div>
          
          <Button 
            onClick={isConnected ? disconnectDevice : connectDevice}
            disabled={isConnecting}
            size="lg"
            className={cn(
              "shadow-lg transition-all",
              isConnected 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <Bluetooth className="mr-2 h-5 w-5" />
            {isConnecting 
              ? "Conectando..." 
              : isConnected 
                ? "Desconectar" 
                : "Conectar Sensor"
            }
          </Button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error de Conexión</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Instrucciones si no está conectado */}
        {!isConnected && !error && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-800">
              <strong>Instrucciones:</strong> Presiona "Conectar Sensor" y selecciona tu dispositivo ESP32 de la lista.
              Asegúrate de que el sensor esté encendido y cerca.
            </p>
          </div>
        )}

        {/* Alerta de valores anormales */}
        {isConnected && hasWarnings && (
          <div className="flex items-center gap-3 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              ⚠️ Algunos valores están fuera del rango normal. Consulta a tu médico si persisten.
            </p>
          </div>
        )}
      </div>

      {/* Lecturas en Vivo */}
      <section className="mb-8">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Lecturas Actuales
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <VitalCard
            title="Ritmo Cardíaco"
            value={currentData.heart}
            unit="bpm"
            icon={<Heart className="h-6 w-6 text-white" />}
            variant="heart"
            status={getVitalStatus('heart', currentData.heart)}
            trend="stable"
          />
          <VitalCard
            title="Oxígeno (SpO2)"
            value={currentData.oxygen}
            unit="%"
            icon={<Droplets className="h-6 w-6 text-white" />}
            variant="oxygen"
            status={getVitalStatus('oxygen', currentData.oxygen)}
            trend="stable"
          />
          <VitalCard
            title="Temperatura"
            value={currentData.temp}
            unit="°C"
            icon={<Thermometer className="h-6 w-6 text-white" />}
            variant="temp"
            status={getVitalStatus('temp', currentData.temp)}
            trend="stable"
          />
        </div>
      </section>

      {/* Historial Local */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Historial de Lecturas
          </h3>
          {history.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {history.length} lecturas
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {history.length === 0 ? (
            <div className="p-12 text-center">
              <Bluetooth className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No hay lecturas registradas</p>
              <p className="text-sm text-muted-foreground mt-2">
                {isConnected 
                  ? "Esperando datos del sensor..." 
                  : "Conecta el sensor para comenzar a registrar datos"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Hora</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">
                      <Heart className="h-4 w-4 inline mr-1" />
                      BPM
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">
                      <Droplets className="h-4 w-4 inline mr-1" />
                      SpO2
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">
                      <Thermometer className="h-4 w-4 inline mr-1" />
                      Temp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((entry, i) => {
                    const time = new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });
                    
                    return (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                          {time}
                        </td>
                        <td className={cn(
                          "px-4 py-3 text-right font-medium",
                          getVitalStatus('heart', entry.heart) === 'warning' && "text-yellow-600"
                        )}>
                          {entry.heart}
                        </td>
                        <td className={cn(
                          "px-4 py-3 text-right font-medium",
                          getVitalStatus('oxygen', entry.oxygen) === 'warning' && "text-yellow-600"
                        )}>
                          {entry.oxygen}%
                        </td>
                        <td className={cn(
                          "px-4 py-3 text-right font-medium",
                          getVitalStatus('temp', entry.temp) === 'warning' && "text-yellow-600"
                        )}>
                          {entry.temp}°C
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Última actualización */}
      {isConnected && currentData.timestamp > 0 && (
        <p className="text-xs text-center text-muted-foreground mt-4">
          Última lectura: {new Date(currentData.timestamp).toLocaleTimeString()}
        </p>
      )}
    </main>
  );
}