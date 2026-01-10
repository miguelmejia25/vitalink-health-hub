import { useEffect, useState } from "react"; // 1. Importamos Hooks
import { VitalCard } from "@/components/VitalCard";
import { Droplets, Heart, Thermometer, TrendingUp } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
const db = getDatabase();
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPLUpSRjKNtl5wWz1ABdEpiNmSmDNeq-M",
  authDomain: "vitalink-d9c1a.firebaseapp.com",
  databaseURL: "https://vitalink-d9c1a-default-rtdb.firebaseio.com",
  projectId: "vitalink-d9c1a",
  storageBucket: "vitalink-d9c1a.firebasestorage.app",
  messagingSenderId: "1079769204426",
  appId: "1:1079769204426:web:37c811fb12956e1f2d5633",
  measurementId: "G-7TZWKS60WP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default function Vitals() {
  // --- ESTADOS (Datos Vivos) ---
  const [currentData, setCurrentData] = useState({
    heart: 0,
    oxygen: 0,
    temp: 0,
  });

  const [history, setHistory] = useState<any[]>([]);

  // --- LÓGICA DE CONEXIÓN ---
  useEffect(() => {
    // Referencia a la ruta donde tu PWA escribe los datos
    const dataRef = ref(db, 'pacientes/espol01');

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        // 1. Actualizar datos actuales
        // Asegúrate que los nombres coincidan con lo que envía tu PWA 
        // (ej. si enviaste 'ritmo', mapealo a 'heart')
        const newData = {
          heart: data.ritmo || 70,       // Valor por defecto si no llega
          oxygen: data.oxigeno || 98, 
          temp: data.temperatura || 0,
        };
        
        setCurrentData(newData);

        // 2. Agregar al historial (Tabla)
        // Creamos una nueva entrada con la hora actual
        const newEntry = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ...newData
        };

        // Agregamos al principio de la lista y guardamos solo los últimos 10
        setHistory((prev) => [newEntry, ...prev].slice(0, 10));
      }
    });

    return () => unsubscribe(); // Limpieza al salir
  }, []);

  // --- CÁLCULO DE PROMEDIOS (Estadísticas) ---
  const getAverage = (key: string) => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, curr) => acc + curr[key], 0);
    return (sum / history.length).toFixed(1);
  };

  return (
    <main className="container py-6">
      {/* Current Vitals */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Lecturas en Vivo 🔴
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <VitalCard
            title="Heart Rate"
            value={currentData.heart}
            unit="bpm"
            icon={<Heart className="h-6 w-6 text-white" />}
            variant="heart"
            status={currentData.heart > 100 ? "warning" : "normal"} // Lógica simple de alerta
            trend="stable"
          />
          <VitalCard
            title="Oxygen Level"
            value={currentData.oxygen}
            unit="%"
            icon={<Droplets className="h-6 w-6 text-white" />}
            variant="oxygen"
            status={currentData.oxygen < 95 ? "warning" : "normal"}
            trend="stable"
          />
          <VitalCard
            title="Temperature"
            value={currentData.temp}
            unit="°C"
            icon={<Thermometer className="h-6 w-6 text-white" />}
            variant="temp"
            status={currentData.temp > 37.5 ? "warning" : "normal"}
            trend={currentData.temp > 37 ? "up" : "stable"}
          />
        </div>
      </section>

      {/* History */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Historial de Sesión</h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Heart</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">O₂</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Temp</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-center">Esperando datos...</td></tr>
                ) : (
                    history.map((reading, index) => (
                    <tr key={index} className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{reading.time}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{reading.heart} bpm</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{reading.oxygen}%</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{reading.temp}°C</td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stats (Calculadas Automáticamente) */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Estadísticas de la Sesión
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-heart/10">
              <Heart className="h-6 w-6 text-heart" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
              <p className="text-xl font-bold text-foreground">{getAverage('heart')} bpm</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-oxygen/10">
              <Droplets className="h-6 w-6 text-oxygen" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Oxygen</p>
              <p className="text-xl font-bold text-foreground">{getAverage('oxygen')}%</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-temp/10">
              <Thermometer className="h-6 w-6 text-temp" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Temperature</p>
              <p className="text-xl font-bold text-foreground">{getAverage('temp')}°C</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}