'use client';

import { useState, useEffect } from 'react';
import HumanChat from '../components/HumanChat';
import { useRouter } from 'next/navigation';

export default function InboxPage() {
  const router = useRouter();
  const [utenteLoggato, setUtenteLoggato] = useState<any>(null);
  const [conversazioni, setConversazioni] = useState<string[]>([]);
  const [chatAttiva, setChatAttiva] = useState<string | null>(null);

  useEffect(() => {
    const dati = localStorage.getItem('utente_nexum');
    if (!dati) { router.push('/registrazione'); return; }
    const utente = JSON.parse(dati);
    setUtenteLoggato(utente);

    // Carica lista conversazioni
    fetch(`https://nexum-backend.onrender.com/messaggi/conversazioni/${utente.nome}`)
        .then(res => res.json())
        .then(data => setConversazioni(data))
        .catch(console.error);
  }, []);

  if (!utenteLoggato) return <div className="bg-black h-screen"></div>;

  return (
    <div className="flex h-screen overflow-hidden bg-black text-slate-100 font-sans selection:bg-[#7c3aed] selection:text-white">
      
      {/* SIDEBAR (Mini) */}
      <aside className="w-64 bg-black border-r border-slate-900 flex flex-col hidden md:flex">
        <div className="p-6"><img src="/logo.png" className="h-8"/></div>
        <nav className="flex-1 px-4 space-y-1">
             <a href="/" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-[#1c1f27] rounded-lg">
                <span className="material-symbols-outlined">arrow_back</span> Torna alla Home
             </a>
             <div className="my-4 border-t border-slate-900"></div>
             <p className="px-3 text-xs font-bold text-slate-500 uppercase mb-2">Inbox</p>
             {conversazioni.length === 0 && <p className="px-3 text-xs text-slate-600">Nessuna chat recente.</p>}
             {conversazioni.map(nome => (
                 <button 
                    key={nome}
                    onClick={() => setChatAttiva(nome)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${chatAttiva === nome ? 'bg-[#7c3aed] text-white' : 'hover:bg-[#1c1f27] text-slate-300'}`}
                 >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">{nome.charAt(0)}</div>
                    <span className="font-medium truncate">{nome}</span>
                 </button>
             ))}
        </nav>
      </aside>

      {/* AREA CHAT */}
      <main className="flex-1 flex flex-col p-6 bg-black relative">
        {!chatAttiva ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border border-slate-800 rounded-3xl bg-[#1c1f27]/50 border-dashed">
                <span className="material-symbols-outlined text-6xl mb-4 text-[#7c3aed]">forum</span>
                <p>Seleziona una conversazione per iniziare</p>
            </div>
        ) : (
            <div className="flex-1 h-full">
                <HumanChat 
                    mittente={utenteLoggato.nome}
                    destinatario={chatAttiva}
                    onClose={() => setChatAttiva(null)}
                    fullScreen={true} // Modalità Full Screen
                />
            </div>
        )}
      </main>
    </div>
  );
}