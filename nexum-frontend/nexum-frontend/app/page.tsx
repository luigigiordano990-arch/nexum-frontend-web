'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <--- IMPORTANTE: Importato Link
import HumanChat from './components/HumanChat';
import NotificheBtn from './components/NotificheBtn';

// --- TIPI DI DATI ---
interface News {
  id: number;
  titolo: string;
  categoria: string;
  riassunto: string;
}

interface Professionista {
  id: number;
  nome: string;
  cognome: string;
  titolo_professionale: string;
  descrizione: string;
  premium?: boolean;
}

export default function Home() {
  const router = useRouter();
  
  const [utenteLoggato, setUtenteLoggato] = useState<any>(null);
  const [newsFiltrate, setNewsFiltrate] = useState<News[]>([]);
  const [professionisti, setProfessionisti] = useState<Professionista[]>([]);
  const [professionistiFiltrati, setProfessionistiFiltrati] = useState<Professionista[]>([]);
  const [ricerca, setRicerca] = useState("");

  // --- STATO CHAT UMANA ---
  const [chatPartner, setChatPartner] = useState<string | null>(null);

  // --- 1. CARICAMENTO DATI ---
  useEffect(() => {
    const datiSalvati = localStorage.getItem('utente_nexum');
    if (!datiSalvati) {
        router.push('/registrazione');
        return;
    }
    const utente = JSON.parse(datiSalvati);
    setUtenteLoggato(utente);

    fetch('https://nexum-backend.onrender.com/news')
        .then((res) => res.json())
        .then((data) => setNewsFiltrate(data))
        .catch(console.error);

    fetch('https://nexum-backend.onrender.com/professionisti')
        .then((res) => res.json())
        .then((data) => {
            const dataWithPremium = data.map((p: any, index: number) => ({
                ...p,
                premium: index % 3 === 0 
            }));
            setProfessionisti(dataWithPremium);
            setProfessionistiFiltrati(dataWithPremium);
        })
        .catch(console.error);

  }, [router]);

  // --- 2. GESTIONE RICERCA ---
  useEffect(() => {
    if (ricerca.trim() === "") {
        setProfessionistiFiltrati(professionisti);
    } else {
        const term = ricerca.toLowerCase();
        const filtrati = professionisti.filter(p => 
            p.nome.toLowerCase().includes(term) || 
            p.cognome.toLowerCase().includes(term) ||
            p.titolo_professionale.toLowerCase().includes(term)
        );
        setProfessionistiFiltrati(filtrati);
    }
  }, [ricerca, professionisti]);

  // Funzione che apre la chat
  const apriChatUmana = (e: React.MouseEvent, nomeCollega: string) => {
      e.stopPropagation(); 
      setChatPartner(nomeCollega); 
  };

  // Funzione che apre il profilo pubblico
  const apriProfilo = (nomeCollega: string) => {
      router.push(`/profilo/public/${nomeCollega}`);
  };

  if (!utenteLoggato) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Caricamento...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-black text-slate-100 font-sans selection:bg-[#7c3aed] selection:text-white">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #282e39; border-radius: 10px; }
      `}</style>

      {/* --- CHAT POPUP --- */}
      {chatPartner && (
        <HumanChat 
            mittente={utenteLoggato.nome} 
            destinatario={chatPartner} 
            onClose={() => setChatPartner(null)} 
        />
      )}

      {/* --- SIDEBAR (SOLO DESKTOP) --- */}
      <aside className="w-64 bg-black border-r border-slate-900 flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 flex items-center justify-start">
           <img src="/logo.png" alt="NEXUM" className="h-10 w-auto object-contain" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <div className="px-3 mb-2 text-xs font-bold uppercase text-slate-500 tracking-wider">
            Strumenti
          </div>
          
          {(utenteLoggato.titolo_professionale === "Avvocato") ? (
            <>
              <a href="https://pst.giustizia.it" target="_blank" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-[#1c1f27] rounded-lg transition-colors group">
                <span className="text-sm font-medium group-hover:text-white">Polisweb (PCT)</span>
              </a>
              <a href="https://www.cortedicassazione.it" target="_blank" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-[#1c1f27] rounded-lg transition-colors group">
                <span className="text-sm font-medium group-hover:text-white">Cassazione</span>
              </a>
            </>
          ) : (
            <>
              <a href="https://telematici.agenziaentrate.gov.it" target="_blank" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-[#1c1f27] rounded-lg transition-colors group">
                <span className="text-sm font-medium group-hover:text-white">Cassetto Fiscale</span>
              </a>
              <a href="https://ivaservizi.agenziaentrate.gov.it" target="_blank" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-[#1c1f27] rounded-lg transition-colors group">
                <span className="text-sm font-medium group-hover:text-white">Fatture & Corrisp.</span>
              </a>
            </>
          )}

          <div className="my-4 border-t border-slate-900"></div>

          <a href="/profilo" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-[#1c1f27] rounded-lg transition-colors group">
             <span className="text-sm font-medium group-hover:text-white">Il Mio Profilo</span>
          </a>
          <a href="/clienti" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-[#1c1f27] rounded-lg transition-colors group">
             <span className="text-sm font-medium group-hover:text-white">Gestione Clienti</span>
          </a>
          <a href="/messaggi" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-[#1c1f27] rounded-lg transition-colors group">
             <span className="material-symbols-outlined text-slate-500 group-hover:text-[#7c3aed]">mail</span>
             <span className="text-sm font-medium group-hover:text-white">Messaggi</span>
             <span className="ml-auto w-2 h-2 rounded-full bg-[#7c3aed]"></span>
          </a>
        </nav>

        <div className="p-4 border-t border-slate-900">
          <a href="/profilo" className="flex items-center gap-3 p-2 bg-[#1c1f27] rounded-xl border border-slate-800 hover:border-[#7c3aed] transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-[#7c3aed]/30 group-hover:bg-[#7c3aed] transition-colors overflow-hidden">
                {utenteLoggato.immagineProfilo ? (
                    <img src={utenteLoggato.immagineProfilo} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs font-bold text-[#7c3aed] group-hover:text-white capitalize">{utenteLoggato.nome.charAt(0)}</span>
                )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white capitalize">
                  {utenteLoggato.nome} {utenteLoggato.cognome}
              </p>
              <p className="text-xs text-slate-500 truncate group-hover:text-[#7c3aed] transition-colors">
                  Vedi Profilo
              </p>
            </div>
          </a>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-black">
        
        {/* HEADER RESPONSIVE (MOBILE + DESKTOP) */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-4 bg-black/80 backdrop-blur-md border-b border-slate-900 gap-4">
          
          {/* SEARCH BAR */}
          <div className="relative flex-1 md:flex-none md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input 
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
              className="w-full bg-[#1c1f27] border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed] text-white placeholder:text-slate-500 outline-none transition-all" 
              placeholder="Cerca..." 
              type="text"
            />
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
             
             {/* 1. MESSAGGI (Visibile solo su MOBILE qui, su Desktop è nella sidebar) */}
             <Link href="/messaggi" className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg">
                <span className="material-symbols-outlined">mail</span>
             </Link>

             {/* 2. CAMPANELLO NOTIFICHE */}
             {utenteLoggato && <NotificheBtn utenteNome={utenteLoggato.nome} />}

             {/* Badge Professione (Solo Desktop) */}
             <div className="px-2 md:px-3 py-1 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full text-[10px] md:text-xs text-[#7c3aed] font-bold uppercase tracking-wider hidden sm:block">
                {utenteLoggato.titolo_professionale}
             </div>

             {/* 3. PROFILO (Visibile solo su MOBILE - Cliccabile!) */}
             {/* Su desktop c'è la sidebar, su mobile mostriamo questo pallino che porta al profilo */}
             <Link href="/profilo" className="sm:hidden block">
                 <div className="w-8 h-8 rounded-full bg-[#1c1f27] border border-slate-800 flex items-center justify-center text-[#7c3aed] font-bold text-xs overflow-hidden">
                    {utenteLoggato.immagineProfilo ? (
                        <img src={utenteLoggato.immagineProfilo} className="w-full h-full object-cover" />
                    ) : (
                        utenteLoggato.nome.charAt(0)
                    )}
                 </div>
             </Link>

          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 pb-24 md:pb-6">
            
            {/* SPONSOR */}
            <section>
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">In Evidenza</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {professionisti.filter(p => p.premium).slice(0, 3).map((prof) => (
                        <div key={prof.id} className="bg-gradient-to-br from-[#1c1f27] to-[#111] border border-[#7c3aed]/30 p-4 rounded-2xl flex items-center justify-between hover:shadow-lg hover:shadow-[#7c3aed]/10 transition-all cursor-pointer group">
                            
                            {/* CLIC SU QUESTO BLOCCO APRE IL PROFILO PUBBLICO */}
                            <div className="flex items-center gap-4 cursor-pointer overflow-hidden" onClick={() => apriProfilo(prof.nome)}>
                                <div className="w-12 h-12 rounded-full bg-[#7c3aed] flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {prof.nome.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-white text-sm hover:text-[#7c3aed] transition-colors truncate">{prof.nome} {prof.cognome}</h4>
                                    <p className="text-xs text-[#c4b5fd] truncate">{prof.titolo_professionale}</p>
                                </div>
                            </div>

                            {/* TASTO CHAT RAPIDA */}
                            <button onClick={(e) => apriChatUmana(e, prof.nome)} className="text-slate-500 hover:text-[#7c3aed] group-hover:opacity-100 transition-opacity p-2 shrink-0">
                                <span className="material-symbols-outlined">chat</span>
                            </button>
                        </div>
                    ))}
                 </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLONNA SX: News */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-white">Aggiornamenti</h3>
                    <div className="grid gap-4">
                        {newsFiltrate.map((item) => (
                            <a href={`/news/${item.id}`} key={item.id} className="block">
                                <div className="bg-[#1c1f27] border border-slate-800 p-6 rounded-2xl hover:border-[#7c3aed] transition-all group cursor-pointer relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[#7c3aed]/0 group-hover:bg-[#7c3aed]/5 transition-colors"></div>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 relative z-10 gap-2">
                                        <h4 className="font-bold text-lg text-white group-hover:text-[#c4b5fd] transition-colors line-clamp-2">{item.titolo}</h4>
                                        <span className="bg-[#7c3aed]/10 text-[#a78bfa] text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-[#7c3aed]/20 whitespace-nowrap self-start md:self-auto">
                                            {item.categoria}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 relative z-10">{item.riassunto}</p>
                                    <div className="mt-4 flex items-center gap-2 text-[#7c3aed] text-xs font-bold relative z-10 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        Leggi articolo <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* COLONNA DX: Network */}
                <div className="space-y-6">
                    <div className="bg-[#1c1f27] rounded-3xl border border-slate-800 p-6 h-auto md:h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white">Network</h3>
                            <span className="text-xs text-slate-500">{professionistiFiltrati.length} colleghi</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 max-h-[400px] md:max-h-none">
                            {professionistiFiltrati.length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-4">Nessun risultato.</p>
                            ) : (
                                professionistiFiltrati.map((prof) => ( 
                                    <div key={prof.id} className="p-4 rounded-2xl bg-black border border-slate-800 hover:border-[#7c3aed]/50 transition-all group flex items-center gap-3 justify-between">
                                        
                                        {/* PARTE CLICCABILE -> PROFILO PUBBLICO */}
                                        <div 
                                            className="flex items-center gap-3 flex-1 cursor-pointer overflow-hidden" 
                                            onClick={() => apriProfilo(prof.nome)}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0">
                                                {prof.nome.charAt(0)}{prof.cognome.charAt(0)}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-white truncate hover:text-[#7c3aed] transition-colors">{prof.nome} {prof.cognome}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wide truncate">{prof.titolo_professionale}</p>
                                            </div>
                                        </div>

                                        {/* TASTO CHAT */}
                                        <button 
                                            onClick={(e) => apriChatUmana(e, prof.nome)}
                                            className="px-3 py-2 bg-[#1c1f27] hover:bg-[#7c3aed] text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 border border-slate-700 hover:border-[#7c3aed] shrink-0"
                                        >
                                            <span className="material-symbols-outlined text-sm">chat</span>
                                            <span className="hidden xl:inline">Messaggio</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}