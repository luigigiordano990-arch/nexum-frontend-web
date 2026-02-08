'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Registrazione() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    titolo_professionale: 'Avvocato', // Valore default
    descrizione: ''
  });

  // Gestisce il cambiamento dei campi input
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Invia i dati a Python e salva nel browser
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://nexum-backend.onrender.com/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. SALVA I DATI NEL BROWSER (Così il sito si ricorda di te)
        localStorage.setItem('utente_nexum', JSON.stringify(formData));

        // 2. VAI AL PROFILO
        alert("Registrazione avvenuta! Ti stiamo portando al tuo profilo.");
        router.push('/profilo'); 
      } else {
        alert("Errore: " + (data.errore || "Qualcosa è andato storto"));
      }
    } catch (error) {
      alert("Errore di connessione col server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-[#7c3aed] selection:text-white flex items-center justify-center p-4">
      {/* Import Font Manrope */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 overflow-hidden rounded-3xl bg-black border border-slate-900 shadow-2xl">
        
        {/* COLONNA SINISTRA: Visual & Branding (VIOLA) */}
        <div className="relative bg-[#7c3aed] p-10 flex flex-col justify-between overflow-hidden">
          {/* Cerchi decorativi sfocati */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

          <div className="relative z-10">
            {/* Titolo Visuale */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white text-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">NEXUM</h1>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Il futuro della professione legale.
            </h2>
            <p className="text-purple-100 text-lg leading-relaxed opacity-90">
              Unisciti al network di professionisti che usano l'IA per semplificare il lavoro quotidiano.
            </p>
          </div>

          <div className="relative z-10 mt-10 space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-white">smart_toy</span>
              <div>
                <p className="font-bold text-white">Assistente AI</p>
                <p className="text-xs text-purple-100">Risposte giuridiche immediate</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-white">group</span>
              <div>
                <p className="font-bold text-white">Network</p>
                <p className="text-xs text-purple-100">Profilo pubblico professionale</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNA DESTRA: Form di Registrazione */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-black">
          
          <div className="mb-8">
             <img src="/logo.png" alt="Nexum Logo" className="h-12 w-auto object-contain mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Crea il tuo Account</h3>
            <p className="text-slate-400 text-sm">Inserisci i tuoi dati per accedere alla piattaforma.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nome e Cognome */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nome</label>
                <input 
                  required name="nome" type="text" onChange={handleChange}
                  className="w-full bg-[#111] border border-slate-800 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] rounded-lg text-sm text-white px-4 py-3 outline-none transition-all"
                  placeholder="Mario"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cognome</label>
                <input 
                  required name="cognome" type="text" onChange={handleChange}
                  className="w-full bg-[#111] border border-slate-800 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] rounded-lg text-sm text-white px-4 py-3 outline-none transition-all"
                  placeholder="Rossi"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Professionale</label>
              <div className="relative">
                <input 
                  required name="email" type="email" onChange={handleChange}
                  className="w-full bg-[#111] border border-slate-800 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] rounded-lg text-sm text-white px-4 py-3 pl-10 outline-none transition-all"
                  placeholder="mario.rossi@studio.it"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">mail</span>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input 
                  required name="password" type="password" onChange={handleChange}
                  className="w-full bg-[#111] border border-slate-800 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] rounded-lg text-sm text-white px-4 py-3 pl-10 outline-none transition-all"
                  placeholder="••••••••"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">lock</span>
              </div>
            </div>

            {/* Titolo Professionale */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Titolo</label>
              <div className="relative">
                <select 
                  name="titolo_professionale" onChange={handleChange}
                  className="w-full bg-[#111] border border-slate-800 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] rounded-lg text-sm text-white px-4 py-3 pl-10 appearance-none outline-none cursor-pointer"
                >
                  <option value="Avvocato">Avvocato</option>
                  <option value="Commercialista">Commercialista</option>
                  <option value="Consulente del Lavoro">Consulente del Lavoro</option>
                  <option value="Notaio">Notaio</option>
                </select>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">badge</span>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Descrizione */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Breve Biografia (Per il profilo pubblico)</label>
              <textarea 
                name="descrizione" rows={3} onChange={handleChange}
                className="w-full bg-[#111] border border-slate-800 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] rounded-lg text-sm text-white px-4 py-3 outline-none transition-all resize-none"
                placeholder="Es: Esperto in diritto societario e fusioni internazionali..."
              ></textarea>
            </div>

            {/* Bottone Submit */}
            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#7c3aed]/20 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Elaborazione...</span>
              ) : (
                <>
                  <span>Crea Profilo Professionale</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>

          </form>
          
          <div className="mt-6 text-center">
             <p className="text-sm text-slate-500">Hai già un account? <a href="#" className="text-[#7c3aed] font-bold hover:underline">Accedi qui</a></p>
          </div>
        </div>

      </div>
    </div>
  );
}