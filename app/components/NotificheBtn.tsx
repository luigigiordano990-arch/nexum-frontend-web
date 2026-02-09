'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Notifica {
  id: number;
  tipo: 'messaggio' | 'network' | 'news';
  titolo: string;
  testo: string;
  time: string;
}

export default function NotificheBtn({ utenteNome }: { utenteNome: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifiche, setNotifiche] = useState<Notifica[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Carica notifiche
  useEffect(() => {
    if (!utenteNome) return;
    
    const fetchNotifiche = () => {
        fetch(`https://nexum-backend.onrender.com/notifiche/${utenteNome}`)
            .then(res => res.json())
            .then(data => setNotifiche(data))
            .catch(console.error);
    };

    fetchNotifiche();
    // Aggiorna ogni 10 secondi
    const interval = setInterval(fetchNotifiche, 10000);
    return () => clearInterval(interval);
  }, [utenteNome]);

  // Chiudi se clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (tipo: string) => {
      switch(tipo) {
          case 'messaggio': return 'mail';
          case 'network': return 'person_add';
          case 'news': return 'article';
          default: return 'notifications';
      }
  };

  const getColor = (tipo: string) => {
      switch(tipo) {
          case 'messaggio': return 'text-[#7c3aed]';
          case 'network': return 'text-blue-500';
          case 'news': return 'text-green-500';
          default: return 'text-slate-400';
      }
  };

  const gestisciClick = (notifica: Notifica) => {
      setIsOpen(false);
      if (notifica.tipo === 'messaggio') router.push('/messaggi');
      if (notifica.tipo === 'news') router.push('/'); // O alla pagina news specifica
      // if (notifica.tipo === 'network') router.push('/network/richieste');
  };

  return (
    <div className="relative" ref={menuRef}>
        {/* BUTTON */}
        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-slate-400 hover:text-white hover:bg-[#1c1f27] rounded-lg relative transition-colors"
        >
            <span className="material-symbols-outlined">notifications</span>
            {notifiche.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#7c3aed] rounded-full border-2 border-black animate-pulse"></span>
            )}
        </button>

        {/* DROPDOWN MENU */}
        {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1c1f27] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-slate-800 bg-black/20 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Notifiche</h4>
                    <span className="text-[10px] bg-[#7c3aed]/20 text-[#7c3aed] px-2 py-0.5 rounded-full font-bold">{notifiche.length} Nuove</span>
                </div>
                
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {notifiche.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                            <span className="material-symbols-outlined text-2xl mb-2 opacity-50">notifications_off</span>
                            <p className="text-xs">Nessuna notifica</p>
                        </div>
                    ) : (
                        notifiche.map((notifica) => (
                            <div 
                                key={notifica.id} 
                                onClick={() => gestisciClick(notifica)}
                                className="p-3 hover:bg-white/5 cursor-pointer border-b border-slate-800/50 last:border-0 flex gap-3 transition-colors group"
                            >
                                <div className={`w-8 h-8 rounded-full bg-[#111] border border-slate-700 flex items-center justify-center shrink-0 ${getColor(notifica.tipo)}`}>
                                    <span className="material-symbols-outlined text-sm">{getIcon(notifica.tipo)}</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h5 className="text-sm font-bold text-white truncate">{notifica.titolo}</h5>
                                        <span className="text-[9px] text-slate-600">{notifica.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate group-hover:text-slate-300 transition-colors">{notifica.testo}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="p-2 bg-black/20 border-t border-slate-800 text-center">
                    <button className="text-[10px] text-slate-500 hover:text-[#7c3aed] font-bold uppercase tracking-wide">Segna tutte come lette</button>
                </div>
            </div>
        )}
    </div>
  );
}