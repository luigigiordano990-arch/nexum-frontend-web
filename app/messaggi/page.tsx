"use client";

import { useState, useEffect, Suspense } from 'react'; // Aggiunto Suspense
import HumanChat from '../components/HumanChat';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Istruzioni per Vercel
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// 1. Creiamo un sottocomponente che contiene la logica della pagina
function InboxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [utenteLoggato, setUtenteLoggato] = useState<any>(null);
  const [conversazioni, setConversazioni] = useState<string[]>([]);
  const [chatAttiva, setChatAttiva] = useState<string | null>(null);

  useEffect(() => {
    const dati = localStorage.getItem('utente_nexum');
    if (!dati) { router.push('/registrazione'); return; }
    const utente = JSON.parse(dati);
    setUtenteLoggato(utente);

    const chatParam = searchParams.get('chat');
    if (chatParam) setChatAttiva(chatParam);

    fetch(`https://nexum-backend.onrender.com/messaggi/conversazioni/${utente.nome}`)
        .then(res => res.json())
        .then(data => setConversazioni(data))
        .catch(console.error);
  }, [router, searchParams]);

  if (!utenteLoggato) return <div className="bg-black h-screen"></div>;

  return (
    <div className="flex h-screen overflow-hidden bg-black text-slate-100 font-sans pb-20 md:pb-0">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #282e39; border-radius: 10px; }
      `}</style>

      <aside className={`w-full md:w-80 bg-[#050505] border-r border-slate-900 flex flex-col shrink-0 z-20 ${chatAttiva ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 md:p-6 h-16 md:h-20 border-b border-slate-900 flex items-center justify-between">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7c3aed]">mail</span> Inbox
            </h1>
            <Link href="/" className="w-8 h-8 rounded-full bg-[#1c1f27] hover:bg-[#7c3aed] text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-sm">home</span>
            </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {conversazioni.length === 0 ? (
                <div className="text-center mt-20 opacity-50 px-6">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-600">chat_bubble_outline</span>
                    <p className="text-sm">Non hai ancora messaggi.</p>
                </div>
            ) : (
                conversazioni.map(nome => (
                    <div 
                        key={nome}
                        onClick={() => setChatAttiva(nome)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 border ${
                            chatAttiva === nome 
                            ? 'bg-[#1c1f27] border-[#7c3aed]/50 shadow-lg' 
                            : 'bg-transparent border-transparent hover:bg-[#111]'
                        }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${chatAttiva === nome ? 'bg-[#7c3aed] text-white' : 'bg-[#1c1f27] text-slate-400'}`}>
                            {nome.charAt(0)}
                        </div>
                        <h4 className={`font-bold truncate ${chatAttiva === nome ? 'text-white' : 'text-slate-300'}`}>{nome}</h4>
                    </div>
                ))
            )}
        </div>
      </aside>

      <main className={`flex-1 flex-col bg-black relative h-full ${chatAttiva ? 'flex' : 'hidden md:flex'}`}>
        {!chatAttiva ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-6 text-center">
                <h2 className="text-2xl font-bold text-slate-300 mb-2">I tuoi Messaggi</h2>
                <p className="text-sm">Seleziona una chat per iniziare.</p>
            </div>
        ) : (
            <div className="h-full w-full flex flex-col">
                <div className="md:hidden flex items-center gap-2 p-3 border-b border-slate-800 bg-[#111]">
                    <button onClick={() => setChatAttiva(null)} className="p-2 text-slate-400">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <span className="font-bold text-white">{chatAttiva}</span>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <HumanChat 
                        mittente={utenteLoggato.nome}
                        destinatario={chatAttiva}
                        fullScreen={true} 
                    />
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

// 2. Esportiamo la pagina principale avvolta in Suspense
export default function InboxPage() {
  return (
    <Suspense fallback={<div className="bg-black h-screen flex items-center justify-center text-white">Caricamento inbox...</div>}>
      <InboxContent />
    </Suspense>
  );
}
