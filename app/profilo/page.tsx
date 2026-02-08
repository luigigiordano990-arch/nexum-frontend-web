'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- INTERFACCE ---
interface Studio {
  anno: string;
  istituto: string;
  titolo: string;
}

interface Post {
  id: number;
  data: string;
  contenuto: string;
  likes: number;
}

export default function ProfiloUtente() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Riferimenti per input file nascosti
  const fileInputProfilo = useRef<HTMLInputElement>(null);
  const fileInputCopertina = useRef<HTMLInputElement>(null);

  // --- STATI DATI ---
  const [nuovoPost, setNuovoPost] = useState("");
  const [mieiPost, setMieiPost] = useState<Post[]>([]);

  // Stato Utente Completo
  const [utente, setUtente] = useState({
    immagineProfilo: "", 
    immagineCopertina: "", 
    nome: "", cognome: "", titolo: "", studio: "",
    email: "", pec: "", telefono: "", indirizzo: "", sitoWeb: "", 
    ordine: "", numeroIscrizione: "", partitaIva: "", 
    biografia: "", lingue: "", anniEsperienza: "0", casiVinti: "0", formazione: [] as Studio[],
    verificato: false
  });

  // --- 1. CARICAMENTO INIZIALE ---
  useEffect(() => {
    const datiSalvati = localStorage.getItem('utente_nexum');
    if (!datiSalvati) {
        router.push('/registrazione'); 
        return;
    }

    const datiReali = JSON.parse(datiSalvati);
    setUtente(prev => ({
        ...prev,
        ...datiReali,
        formazione: datiReali.formazione || [],
        pec: datiReali.pec || "",
        sitoWeb: datiReali.sitoWeb || "",
        biografia: datiReali.biografia || "Nessuna biografia inserita.",
        immagineProfilo: datiReali.immagineProfilo || "",
        immagineCopertina: datiReali.immagineCopertina || ""
    }));

    const postsSalvati = localStorage.getItem('post_utente');
    if (postsSalvati) {
        setMieiPost(JSON.parse(postsSalvati));
    }
  }, [router]);

  // --- HANDLERS ---
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUtente(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: any, tipo: 'profilo' | 'copertina') => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (tipo === 'profilo') setUtente(prev => ({ ...prev, immagineProfilo: reader.result as string }));
        else setUtente(prev => ({ ...prev, immagineCopertina: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormazioneChange = (index: number, field: string, value: string) => {
    const nuovaFormazione = [...utente.formazione];
    nuovaFormazione[index] = { ...nuovaFormazione[index], [field as keyof Studio]: value };
    setUtente(prev => ({ ...prev, formazione: nuovaFormazione }));
  };

  const aggiungiStudio = () => {
    setUtente(prev => ({
      ...prev,
      formazione: [...prev.formazione, { anno: "", istituto: "", titolo: "" }]
    }));
  };

  const rimuoviStudio = (index: number) => {
    const nuovaFormazione = utente.formazione.filter((_, i) => i !== index);
    setUtente(prev => ({ ...prev, formazione: nuovaFormazione }));
  };

  const pubblicaPost = () => {
    if (!nuovoPost.trim()) return;
    const post: Post = {
        id: Date.now(),
        data: new Date().toLocaleDateString('it-IT'),
        contenuto: nuovoPost,
        likes: 0
    };
    const aggiornati = [post, ...mieiPost];
    setMieiPost(aggiornati);
    setNuovoPost("");
    localStorage.setItem('post_utente', JSON.stringify(aggiornati));
  };

  const handleLogout = () => {
    if(confirm("Vuoi davvero disconnetterti?")) {
        localStorage.removeItem('utente_nexum');
        router.push('/registrazione');
    }
  };

  const salvaModifiche = () => {
    localStorage.setItem('utente_nexum', JSON.stringify(utente));
    setIsEditing(false);
    alert("Profilo aggiornato con successo!");
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-[#7c3aed] selection:text-white flex">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {/* --- SIDEBAR (SOLO DESKTOP) --- */}
      <aside className="w-64 bg-black border-r border-slate-900 flex flex-col shrink-0 hidden md:flex sticky top-0 h-screen">
        <div className="p-6">
           <img src="/logo.png" alt="NEXUM" className="h-10 w-auto object-contain" />
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <a href="/" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-[#1c1f27] rounded-lg transition-colors group">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-[#7c3aed]">arrow_back</span>
            <span className="text-sm font-medium">Torna alla Dashboard</span>
          </a>
        </nav>
        <div className="p-4 border-t border-slate-900">
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                <span className="material-symbols-outlined">logout</span>
                <span className="text-sm font-bold">Disconnetti</span>
             </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
            
            {/* HEADER PROFILO (Copertina + Avatar + Dati Base) */}
            <div className="relative rounded-3xl bg-[#1c1f27] border border-slate-800 overflow-hidden shadow-2xl">
                
                {/* Copertina */}
                <div className="h-48 md:h-64 bg-slate-800 relative group">
                    {utente.immagineCopertina ? (
                        <img src={utente.immagineCopertina} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-[#2e1065] to-[#7c3aed]"></div>
                    )}
                    {isEditing && (
                        <div onClick={() => fileInputCopertina.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/60 px-4 py-2 rounded-full flex items-center gap-2">
                                <span className="material-symbols-outlined text-white">add_a_photo</span>
                                <span className="text-xs font-bold text-white">Cambia Copertina</span>
                            </div>
                            <input type="file" ref={fileInputCopertina} onChange={(e) => handleImageUpload(e, 'copertina')} className="hidden" accept="image/*" />
                        </div>
                    )}
                    
                    {/* TASTO LOGOUT MOBILE (Visibile solo qui su mobile) */}
                    <button onClick={handleLogout} className="md:hidden absolute top-4 right-4 bg-black/50 p-2 rounded-full text-red-400 hover:bg-red-500 hover:text-white backdrop-blur-md">
                        <span className="material-symbols-outlined text-lg">logout</span>
                    </button>
                </div>

                {/* Info Bar Responsive */}
                <div className="px-4 md:px-8 pb-8 relative flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                    
                    {/* Avatar (Centrato su mobile, sx su desktop) */}
                    <div className="relative -mt-16 md:-mt-20 z-10 w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-black border-4 border-black overflow-hidden group shadow-xl shrink-0">
                         {utente.immagineProfilo ? (
                            <img src={utente.immagineProfilo} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl font-bold text-[#7c3aed] capitalize">{utente.nome.charAt(0)}</div>
                        )}
                        {isEditing && (
                            <div onClick={() => fileInputProfilo.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                                <input type="file" ref={fileInputProfilo} onChange={(e) => handleImageUpload(e, 'profilo')} className="hidden" accept="image/*" />
                            </div>
                        )}
                    </div>

                    {/* Dati Base Editabili */}
                    <div className="flex-1 w-full text-center md:text-left">
                        {isEditing ? (
                            <div className="space-y-3 p-4 bg-black/40 border border-slate-700 rounded-xl mt-4 md:mt-0">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest text-left">Dati Principali</p>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <input name="nome" value={utente.nome} onChange={handleChange} className="bg-[#111] border border-slate-600 rounded p-2 text-white font-bold w-full" placeholder="Nome" />
                                    <input name="cognome" value={utente.cognome} onChange={handleChange} className="bg-[#111] border border-slate-600 rounded p-2 text-white font-bold w-full" placeholder="Cognome" />
                                </div>
                                <input name="titolo" value={utente.titolo} onChange={handleChange} className="bg-[#111] border border-slate-600 rounded p-2 text-[#c4b5fd] text-sm w-full" placeholder="Titolo Professionale" />
                                <input name="studio" value={utente.studio} onChange={handleChange} className="bg-[#111] border border-slate-600 rounded p-2 text-slate-300 text-sm w-full" placeholder="Nome Studio" />
                            </div>
                        ) : (
                            <div className="mt-2 md:mt-0 md:pb-2">
                                 <h1 className="text-2xl md:text-4xl font-extrabold text-white capitalize">{utente.nome} {utente.cognome}</h1>
                                 <p className="text-[#c4b5fd] font-bold text-base md:text-lg">{utente.titolo}</p>
                                 <p className="text-slate-400 text-sm mt-1">{utente.studio}</p>
                            </div>
                        )}
                    </div>

                    {/* Tasto Edit/Save */}
                    <div className="mt-4 md:mt-0 md:mb-2 w-full md:w-auto flex justify-center">
                         {isEditing ? (
                             <button onClick={salvaModifiche} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg w-full md:w-auto justify-center">
                                <span className="material-symbols-outlined text-sm">save</span> Salva
                             </button>
                          ) : (
                             <button onClick={() => setIsEditing(true)} className="bg-[#2a2d36] border border-slate-700 text-slate-300 hover:text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all w-full md:w-auto justify-center">
                                <span className="material-symbols-outlined text-sm">edit</span> Modifica
                             </button>
                          )}
                    </div>
                </div>
            </div>

            {/* --- DATI PROFESSIONALI & FISCALI (Editabili) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Albo */}
                <div className="bg-[#1c1f27] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Iscrizione Ordine</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Ordine di Appartenenza</p>
                            {isEditing ? (
                                <input name="ordine" value={utente.ordine} onChange={handleChange} className="w-full bg-black border border-slate-700 rounded p-2 text-white text-sm" />
                            ) : (
                                <p className="text-lg font-bold text-white">{utente.ordine || "Non indicato"}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Numero Iscrizione</p>
                            {isEditing ? (
                                <input name="numeroIscrizione" value={utente.numeroIscrizione} onChange={handleChange} className="w-full bg-black border border-slate-700 rounded p-2 text-white text-sm" />
                            ) : (
                                <p className="text-base font-mono text-[#c4b5fd] bg-[#7c3aed]/10 inline-block px-2 py-1 rounded">{utente.numeroIscrizione || "N.D."}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card Fiscale */}
                <div className="bg-[#1c1f27] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Dati Fiscali & Web</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Partita IVA</p>
                            {isEditing ? (
                                <input name="partitaIva" value={utente.partitaIva} onChange={handleChange} className="w-full bg-black border border-slate-700 rounded p-2 text-white text-sm" />
                            ) : (
                                <p className="text-sm font-bold text-white font-mono break-all">{utente.partitaIva || "N.D."}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">PEC</p>
                            {isEditing ? (
                                <input name="pec" value={utente.pec} onChange={handleChange} className="w-full bg-black border border-slate-700 rounded p-2 text-white text-sm" />
                            ) : (
                                <p className="text-sm font-bold text-white truncate" title={utente.pec}>{utente.pec || "N.D."}</p>
                            )}
                        </div>
                        <div className="sm:col-span-2">
                             <p className="text-xs text-slate-500 mb-1">Sito Web / LinkedIn</p>
                            {isEditing ? (
                                <input name="sitoWeb" value={utente.sitoWeb} onChange={handleChange} className="w-full bg-black border border-slate-700 rounded p-2 text-white text-sm" placeholder="https://..." />
                            ) : (
                                <a href={utente.sitoWeb} target="_blank" className="text-sm font-bold text-[#7c3aed] hover:underline flex items-center gap-1 break-all">
                                    {utente.sitoWeb || "Non inserito"} <span className="material-symbols-outlined text-xs">open_in_new</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DETTAGLI, CV E SOCIAL --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLONNA SX: Contatti e Lingue */}
                <div className="space-y-6">
                    <div className="bg-[#1c1f27] border border-slate-800 rounded-3xl p-6">
                        <h3 className="font-bold text-white mb-4">Recapiti</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-500">mail</span>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] text-slate-500 uppercase">Email</p>
                                    {isEditing ? <input name="email" value={utente.email} onChange={handleChange} className="bg-black border border-slate-700 rounded p-1 w-full text-sm text-white"/> : <p className="text-sm text-white truncate">{utente.email}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-500">call</span>
                                <div className="flex-1">
                                    <p className="text-[10px] text-slate-500 uppercase">Telefono</p>
                                    {isEditing ? <input name="telefono" value={utente.telefono} onChange={handleChange} className="bg-black border border-slate-700 rounded p-1 w-full text-sm text-white"/> : <p className="text-sm text-white">{utente.telefono || "-"}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-500">location_on</span>
                                <div className="flex-1">
                                    <p className="text-[10px] text-slate-500 uppercase">Sede</p>
                                    {isEditing ? <input name="indirizzo" value={utente.indirizzo} onChange={handleChange} className="bg-black border border-slate-700 rounded p-1 w-full text-sm text-white"/> : <p className="text-sm text-white">{utente.indirizzo || "-"}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1c1f27] border border-slate-800 rounded-3xl p-6">
                        <h3 className="font-bold text-white mb-2">Lingue</h3>
                        {isEditing ? (
                            <input name="lingue" value={utente.lingue} onChange={handleChange} className="w-full bg-black border border-slate-700 rounded p-2 text-white text-sm" placeholder="Es. Italiano, Inglese" />
                        ) : (
                             <div className="flex flex-wrap gap-2">
                                {utente.lingue.split(',').map((lang, idx) => (
                                    lang.trim() && <span key={idx} className="px-3 py-1 bg-black border border-slate-700 rounded-lg text-xs font-bold text-slate-300">{lang.trim()}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* COLONNA CENTRALE: BIO, CV E POST */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Biografia */}
                    <div className="bg-[#1c1f27] border border-slate-800 rounded-3xl p-6 md:p-8">
                        <h3 className="text-xl font-bold text-white mb-4">Biografia</h3>
                        {isEditing ? (
                            <textarea name="biografia" rows={5} value={utente.biografia} onChange={handleChange} className="w-full bg-black border border-slate-700 rounded-xl p-4 text-slate-300 text-base md:text-lg focus:border-[#7c3aed] outline-none"></textarea>
                        ) : (
                            <p className="text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">{utente.biografia}</p>
                        )}
                    </div>

                    {/* Curriculum */}
                    <div className="bg-[#1c1f27] border border-slate-800 rounded-3xl p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#7c3aed]">school</span> Formazione
                            </h3>
                            {isEditing && (
                                <button onClick={aggiungiStudio} className="text-xs bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-3 py-1.5 rounded-lg font-bold">+ Aggiungi</button>
                            )}
                        </div>

                        <div className="space-y-6 relative border-l border-slate-800 ml-3 pl-8">
                            {utente.formazione.map((studio, index) => (
                                <div key={index} className="relative group">
                                    <span className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-[#1c1f27] bg-[#7c3aed]"></span>
                                    {isEditing ? (
                                        <div className="bg-black border border-slate-700 p-4 rounded-xl space-y-3 relative">
                                            <button onClick={() => rimuoviStudio(index)} className="absolute top-2 right-2 text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <input value={studio.anno} onChange={(e) => handleFormazioneChange(index, 'anno', e.target.value)} className="bg-[#111] border border-slate-800 rounded p-2 text-white text-sm" placeholder="Anno" />
                                                <input value={studio.istituto} onChange={(e) => handleFormazioneChange(index, 'istituto', e.target.value)} className="bg-[#111] border border-slate-800 rounded p-2 text-white text-sm sm:col-span-2" placeholder="Istituto" />
                                            </div>
                                            <input value={studio.titolo} onChange={(e) => handleFormazioneChange(index, 'titolo', e.target.value)} className="bg-[#111] border border-slate-800 rounded p-2 text-[#c4b5fd] font-bold text-sm w-full" placeholder="Titolo" />
                                        </div>
                                    ) : (
                                        <div>
                                            <span className="text-xs font-bold text-[#7c3aed] uppercase tracking-widest mb-1 block">{studio.anno}</span>
                                            <h4 className="text-lg font-bold text-white">{studio.titolo}</h4>
                                            <p className="text-slate-400 text-sm">{studio.istituto}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {utente.formazione.length === 0 && !isEditing && <p className="text-slate-500 italic text-sm">Nessun titolo inserito.</p>}
                        </div>
                    </div>

                    {/* SOCIAL: Pubblica Post */}
                    <div className="bg-[#1c1f27] border border-slate-800 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Pubblica aggiornamento</h3>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-black overflow-hidden flex-shrink-0 hidden sm:block">
                                {utente.immagineProfilo ? <img src={utente.immagineProfilo} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-[#7c3aed] font-bold">{utente.nome.charAt(0)}</div>}
                            </div>
                            <div className="flex-1">
                                <textarea 
                                    value={nuovoPost}
                                    onChange={(e) => setNuovoPost(e.target.value)}
                                    placeholder="A cosa stai lavorando? Condividi una notizia..."
                                    className="w-full bg-black border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-[#7c3aed] outline-none resize-none"
                                    rows={3}
                                ></textarea>
                                <div className="flex justify-end mt-2">
                                    <button onClick={pubblicaPost} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg font-bold text-sm">Pubblica</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LISTA POST */}
                    <div className="space-y-4">
                        {mieiPost.map((post) => (
                            <div key={post.id} className="bg-[#1c1f27] border border-slate-800 rounded-3xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-black overflow-hidden">
                                         {utente.immagineProfilo ? <img src={utente.immagineProfilo} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-[#7c3aed] font-bold">{utente.nome.charAt(0)}</div>}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{utente.nome} {utente.cognome}</h4>
                                        <p className="text-xs text-slate-500">{post.data}</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">{post.contenuto}</p>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex gap-4">
                                    <button className="text-slate-500 hover:text-[#7c3aed] text-xs font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">thumb_up</span> Mi piace
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
      </main>
    </div>
  );
}