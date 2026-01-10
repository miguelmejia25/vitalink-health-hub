import { ActionButton } from "@/components/ActionButton";
import { SymptomLogger } from "@/components/SymptomLogger";
import { VitalCard } from "@/components/VitalCard";
import {
  Activity,
  AlertTriangle,
  Droplets,
  ExternalLink,
  Heart,
  MessageCircle,
  Phone,
  Thermometer,
  Bluetooth,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBLE } from "@/contexts/BLEContext";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { currentData, isConnected, connectDevice } = useBLE();

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

  return (
    <main className="container py-6">
      
      {/* Alerta de conexión */}
      {!isConnected && (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Bluetooth className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Sensor no conectado</p>
              <p className="text-sm text-blue-700 mt-1">
                Conecta tu sensor ESP32 para ver datos en tiempo real
              </p>
            </div>
            <Button
              onClick={()=>connectDevice()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Conectar
            </Button>
          </div>
        </div>
      )}

      {/* Vitals Section */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Tus Signos Vitales</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              {isConnected ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Datos en vivo
                </>
              ) : (
                "Última lectura guardada"
              )}
            </p>
          </div>
          <Link to="/vitals">
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ver Historial
            </Button>
          </Link>
        </div>

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

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Acciones Rápidas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/doctor">
            <ActionButton
              icon={<MessageCircle className="h-5 w-5 text-primary-foreground" />}
              label="Contactar Doctor"
              sublabel="Dr. Emily Chen • Cardióloga"
              variant="primary"
            />
          </Link>
          <ActionButton
            icon={<Phone className="h-5 w-5 text-emergency-foreground" />}
            label="Contacto de Emergencia"
            sublabel="John Smith • (555) 123-4567"
            variant="emergency"
          />
        </div>
      </section>

      {/* Doctor Dashboard Gateway */}
      <section className="mb-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-vital">
              <Activity className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                Dashboard Médico
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Portal web para que los profesionales de salud vean tus datos y gestionen tu plan de cuidado.
              </p>
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-vital">
                Abrir Dashboard
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Symptom Logger */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h2 className="text-lg font-bold text-foreground">Registrar Síntomas</h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-md">
          <SymptomLogger />
        </div>
      </section>
    </main>
  );
}