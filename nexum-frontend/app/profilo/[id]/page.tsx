'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProfiloPubblico() {
  const params = useParams();
  const router = useRouter();
  const [prof, setProf] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Recupera ID dall'URL
  const idProf = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    // Scarica i dati dei professionisti da Python per trovare quello giusto
    fetch('https://nexum-backend.onrender.com/professionisti')
      .then(res => res.json())
      .then(data => {
        const trovato = data.find((p: any) => p.nome === idProf || p.id.toString() === idProf);
        
        if (trovato) {
            setProf(trovato);
        } else {
            // Fallback
            setProf({
                nome: idProf,
                cognome: "",
                titolo_professionale: "Professionista Nexum",
                descrizione: "Profilo verificato",
                bio: "Questo professionista non ha ancora compilato la biografia pubblica."
            });
        }
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, [idProf]);

  const avviaChat = () => {
      router.push(`/messaggi?chat=${prof.nome}`); 
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-[#7c3aed] selection:text-white pb-24 md:pb-0">
      
      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {/* HEADER NAVIGAZIONE */}
      <nav className="p-4 md:p-6 border-b border-slate-900 flex justify-between items-center bg-black/80 backdrop-blur sticky top-0 z-50">
         <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span> Indietro
         </button>
         <span className="font-bold tracking-widest uppercase text-[10px] md:text-xs text-slate-500">Profilo Pubblico</span>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12">
        
        {/* CARD PRINCIPALE */}
        <div className="bg-[#1c1f27] rounded-3xl border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start shadow-2xl">
            
            {/* Avatar Grande */}
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-lg shadow-[#7c3aed]/20 shrink-0">
                {prof.nome.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-white capitalize">{prof.nome} {prof.cognome}</h1>
                    <p className="text-[#c4b5fd] text-base md:text-lg font-medium mt-1">{prof.titolo_professionale}</p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-3 py-1 bg-black border border-slate-700 rounded-lg text-xs text-slate-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">verified</span> Verificato
                    </span>
                    <span className="px-3 py-1 bg-black border border-slate-700 rounded-lg text-xs text-slate-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">location_on</span> Italia
                    </span>
                </div>

                <p className="text-slate-400 leading-relaxed max-w-2xl text-sm md:text-base">
                    {prof.descrizione || prof.bio}
                </p>

                {/* TASTI AZIONE */}
                <div className="pt-4 flex flex-col sm:flex-row justify-center md:justify-start gap-3 w-full">
                    <button 
                        onClick={avviaChat}
                        className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7c3aed]/20 w-full sm:w-auto"
                    >
                        <span className="material-symbols-outlined">chat</span>
                        Invia Messaggio
                    </button>
                    <button className="bg-transparent border border-slate-600 hover:border-white text-white px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto">
                        Collegati
                    </button>
                </div>
            </div>
        </div>

        {/* DETTAGLI (Grid Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
            <div className="bg-[#111] p-4 md:p-6 rounded-2xl border border-slate-900 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white">98%</h3>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase mt-1">Successo cause</p>
            </div>
            <div className="bg-[#111] p-4 md:p-6 rounded-2xl border border-slate-900 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white">15+</h3>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase mt-1">Anni Esperienza</p>
            </div>
            <div className="bg-[#111] p-4 md:p-6 rounded-2xl border border-slate-900 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white">24h</h3>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase mt-1">Risposta media</p>
            </div>
            <div className="bg-[#111] p-4 md:p-6 rounded-2xl border border-slate-900 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white">Top</h3>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase mt-1">Rating Nexum</p>
            </div>
        </div>

      </main>
    </div>
  );
}