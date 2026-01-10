import { useState, useEffect } from "react";
import { VitalCard } from "@/components/VitalCard";
import { Droplets, Heart, Thermometer, TrendingUp, Bluetooth } from "lucide-react";
// Importamos 'ref' y 'update' (Para escribir), ya no 'onValue'
import { ref, update } from "firebase/database"; 
import { db } from "@/lib/firebase"; 
import { Button } from "@/components/ui/button"; // Asumo que tienes un componente Button

export default function Vitals() {
  // Estado de conexión Bluetooth (Visual)
  const [bleConnected, setBleConnected] = useState(false);

  const [currentData, setCurrentData] = useState({
    heart: 0,
    oxygen: 0,
    temp: 0,
  });

  const [history, setHistory] = useState<any[]>([]);

  // --- FUNCIÓN CLAVE: PROCESAR Y SUBIR DATOS ---
  // Esta es la función que debes llamar cuando tu código Bluetooth reciba datos reales
  const handleNewReading = (ritmo: number, oxigeno: number, temperatura: number) => {
    
    // 1. Actualizar la Pantalla de la App (Local)
    const newData = { heart: ritmo, oxygen: oxigeno, temp: temperatura };
    setCurrentData(newData);

    // 2. Guardar en Historial Local de la App
    const newEntry = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...newData
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 10));

    // 3. ☁️ SUBIR A FIREBASE (La magia) ☁️
    // Usamos 'update' para no borrar otros datos del paciente (como nombre o edad)
    const updates = {
        "/pacientes/espol01/ritmo": ritmo,
        "/pacientes/espol01/oxigeno": oxigeno,
        "/pacientes/espol01/temperatura": temperatura,
        "/pacientes/espol01/ultima_actualizacion": Date.now()
    };

    update(ref(db), updates)
        .then(() => console.log("Datos subidos a la nube ✅"))
        .catch((error) => console.error("Error subiendo datos:", error));
  };

  // --- SIMULACIÓN DE BLUETOOTH (Para probar sin la ESP32 ahora mismo) ---
  // Borra este useEffect cuando ya tengas tu lógica real de Bluetooth
  useEffect(() => {
    if (!bleConnected) return;

    const intervalo = setInterval(() => {
        // Generamos datos falsos para probar que Firebase recibe la escritura
        const simHeart = 70 + Math.floor(Math.random() * 10);
        const simOx = 96 + Math.floor(Math.random() * 4);
        const simTemp = 36.5 + (Math.random() * 0.5);
        
        // ¡Llamamos a la función principal!
        handleNewReading(simHeart, simOx, Number(simTemp.toFixed(1)));
    }, 3000); // Envía datos cada 3 segundos

    return () => clearInterval(intervalo);
  }, [bleConnected]);

  return (
    <main className="container py-6">
      
      {/* Botón de Conexión (Simulado por ahora) */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-bold">Monitor Personal</h2>
        <Button 
            onClick={() => setBleConnected(!bleConnected)}
            className={bleConnected ? "bg-green-600" : "bg-blue-600"}
        >
            <Bluetooth className="mr-2 h-4 w-4" />
            {bleConnected ? "Conectado a ESP32" : "Conectar Sensor"}
        </Button>
      </div>

      {/* Lecturas en Vivo */}
      <section className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <VitalCard
            title="Ritmo Cardíaco"
            value={currentData.heart}
            unit="bpm"
            icon={<Heart className="h-6 w-6 text-white" />}
            variant="heart"
            status="normal"
            trend="stable"
          />
          <VitalCard
            title="Oxígeno (SpO2)"
            value={currentData.oxygen}
            unit="%"
            icon={<Droplets className="h-6 w-6 text-white" />}
            variant="oxygen"
            status="normal"
            trend="stable"
          />
          <VitalCard
            title="Temperatura"
            value={currentData.temp}
            unit="°C"
            icon={<Thermometer className="h-6 w-6 text-white" />}
            variant="temp"
            status="normal"
            trend="stable"
          />
        </div>
      </section>

      {/* Historial Local */}
      <section className="mb-8">
        <h3 className="mb-4 font-bold text-gray-500">Historial reciente en dispositivo</h3>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="px-4 py-2">Hora</th>
                        <th className="px-4 py-2">BPM</th>
                        <th className="px-4 py-2">SpO2</th>
                        <th className="px-4 py-2">Temp</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((h, i) => (
                        <tr key={i} className="border-t">
                            <td className="px-4 py-2">{h.time}</td>
                            <td className="px-4 py-2">{h.heart}</td>
                            <td className="px-4 py-2">{h.oxygen}%</td>
                            <td className="px-4 py-2">{h.temp}°C</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
    </main>
  );
}