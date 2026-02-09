'use client';

import { useState, useRef, useEffect } from 'react';

interface Messaggio {
  ruolo: 'utente' | 'bot';
  testo: string;
}

export default function AIChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messaggi, setMessaggi] = useState<Messaggio[]>([
    { ruolo: 'bot', testo: 'Ciao. Sono l\'IA di Nexum. Come posso assisterti?' }
  ]);
  const [inputUtente, setInputUtente] = useState("");
  const [staScrivendo, setStaScrivendo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll verso il basso
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messaggi, isOpen]);

  const inviaMessaggio = async () => {
    if (!inputUtente.trim()) return;
    const nuoviMessaggi = [...messaggi, { ruolo: 'utente' as const, testo: inputUtente }];
    setMessaggi(nuoviMessaggi);
    setStaScrivendo(true);
    const testoDaInviare = inputUtente;
    setInputUtente("");

    try {
      const risposta = await fetch('https://nexum-backend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testo: testoDaInviare }),
      });
      const dati = await risposta.json();
      setMessaggi([...nuoviMessaggi, { ruolo: 'bot', testo: dati.risposta }]);
    } catch (error) {
      setMessaggi([...nuoviMessaggi, { ruolo: 'bot', testo: "Errore di connessione." }]);
    } finally {
      setStaScrivendo(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* FINESTRA POPUP */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-[#1c1f27] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">
            {/* Header Chat */}
            <div className="p-4 bg-black/40 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7c3aed]">chat_bubble</span>
                    Nexum AI
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>

            {/* Messaggi */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 bg-[#111]">
                {messaggi.map((msg, index) => (
                    <div key={index} className={`flex ${msg.ruolo === 'utente' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.ruolo === 'utente' ? 'bg-[#7c3aed] text-white' : 'bg-[#1c1f27] border border-slate-700 text-slate-300'
                        }`}>
                            {msg.testo}
                        </div>
                    </div>
                ))}
                {staScrivendo && <div className="text-xs text-slate-500 animate-pulse ml-2">Nexum sta scrivendo...</div>}
            </div>

            {/* Input */}
            <div className="p-3 bg-[#1c1f27] border-t border-slate-800 flex gap-2">
                <input
                    value={inputUtente}
                    onChange={(e) => setInputUtente(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && inviaMessaggio()}
                    placeholder="Chiedi all'IA..."
                    className="flex-1 bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#7c3aed] outline-none"
                />
                <button onClick={inviaMessaggio} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white p-2 rounded-lg flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-sm">send</span>
                </button>
            </div>
        </div>
      )}

      {/* BOTTONE TONDO (Trigger) - NUOVO */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-[#7c3aed]/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
      >
        {isOpen ? (
            <span className="material-symbols-outlined text-2xl">close</span>
        ) : (
            // ICONA NUVOLETTA (Chat Bubble)
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">chat_bubble</span>
        )}
      </button>
    </div>
  );
}