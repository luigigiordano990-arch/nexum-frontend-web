'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Importiamo il Router

interface Props {
  mittente: string;
  destinatario: string;
  onClose?: () => void; // Ora è opzionale
  fullScreen?: boolean; 
}

interface Messaggio {
  mittente: string;
  destinatario: string;
  testo: string;
  timestamp: string;
  file_data?: string | null;
  file_name?: string | null;
}

export default function HumanChat({ mittente, destinatario, onClose, fullScreen = false }: Props) {
  const router = useRouter(); // Hook per cambiare pagina
  const [messaggi, setMessaggi] = useState<Messaggio[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Caricamento Messaggi
  useEffect(() => {
    const fetchMessaggi = async () => {
      try {
        const res = await fetch(`https://nexum-backend.onrender.com/messaggi/leggi/${mittente}/${destinatario}`);
        const data = await res.json();
        setMessaggi(data);
      } catch (err) { console.error(err); }
    };
    fetchMessaggi();
    const intervallo = setInterval(fetchMessaggi, 2000);
    return () => clearInterval(intervallo);
  }, [mittente, destinatario]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messaggi]);

  // Invio Messaggio
  const invia = async (fileData?: string, fileName?: string) => {
    if (!input.trim() && !fileData) return;
    
    const payload = {
      mittente,
      destinatario,
      testo: input,
      file_data: fileData || null,
      file_name: fileName || null
    };

    await fetch('https://nexum-backend.onrender.com/messaggi/invia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setMessaggi([...messaggi, { ...payload, timestamp: "..." }]);
    setInput("");
  };

  // Gestione File
  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        invia(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- FUNZIONE PER ANDARE AL PROFILO ---
  const vaiAlProfilo = () => {
      // ORA FUNZIONA DAVVERO
      router.push(`/profilo/public/${destinatario}`); 
      if (!fullScreen && onClose) onClose(); // Chiude il popup se necessario
  };

  // CSS Condizionale: Se fullScreen, occupa tutto lo spazio senza bordi arrotondati strani
  const containerClass = fullScreen 
    ? "flex flex-col h-full bg-[#0a0a0a] w-full" 
    : "fixed bottom-24 right-6 w-80 md:w-96 h-[450px] bg-[#1c1f27] border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50";

  return (
    <div className={containerClass}>
      
      {/* HEADER (Ora Cliccabile) */}
      <div className="p-4 bg-[#111] border-b border-slate-800 flex justify-between items-center shrink-0">
        
        {/* Parte sinistra cliccabile: Porta al profilo */}
        <div 
            onClick={vaiAlProfilo} 
            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group"
            title="Vedi profilo"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#7c3aed]/20 group-hover:scale-105 transition-transform">
            {destinatario.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-white text-base group-hover:text-[#7c3aed] transition-colors">{destinatario}</h3>
            <p className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
            </p>
          </div>
        </div>

        {/* Tasto Chiudi (Solo se è popup, non se è full screen) */}
        {!fullScreen && onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
            </button>
        )}
      </div>

      {/* BODY MESSAGGI */}
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4 bg-black">
        {messaggi.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                <p className="text-xs">Nessun messaggio.</p>
            </div>
        )}
        
        {messaggi.map((msg, idx) => {
          const sonoIo = msg.mittente === mittente;
          return (
            <div key={idx} className={`flex ${sonoIo ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-3xl text-sm shadow-md ${
                sonoIo 
                ? 'bg-[#7c3aed] text-white rounded-br-none' 
                : 'bg-[#1c1f27] text-slate-200 border border-slate-800 rounded-bl-none'
              }`}>
                {/* File Allegato */}
                {msg.file_data && (
                    <a href={msg.file_data} download={msg.file_name || "allegato"} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl mb-2 hover:bg-black/30 transition-colors border border-white/10">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">description</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold truncate text-xs">{msg.file_name}</p>
                            <p className="text-[10px] opacity-70">Scarica file</p>
                        </div>
                    </a>
                )}
                {/* Testo */}
                {msg.testo && <p className="leading-relaxed">{msg.testo}</p>}
                <p className={`text-[10px] text-right mt-2 ${sonoIo ? 'text-white/60' : 'text-slate-500'}`}>{msg.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER INPUT */}
      <div className="p-4 bg-[#111] border-t border-slate-800 flex gap-3 items-center shrink-0">
        <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-[#7c3aed] p-2 transition-colors hover:bg-white/5 rounded-full">
            <span className="material-symbols-outlined text-2xl">attach_file</span>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && invia()}
          placeholder="Scrivi un messaggio..."
          className="flex-1 bg-[#1c1f27] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#7c3aed] outline-none placeholder:text-slate-600 transition-all focus:bg-black"
        />
        <button onClick={() => invia()} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-[#7c3aed]/20 hover:scale-105 active:scale-95">
          <span className="material-symbols-outlined text-xl">send</span>
        </button>
      </div>
    </div>
  );
}