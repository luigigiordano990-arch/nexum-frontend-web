"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import AIChatPopup from './components/AIChatPopup'; // Assicurati che questo file esista

// --- CONFIGURAZIONE SUPABASE ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- DATI STATICI (LINK ISTITUZIONALI) ---
const linkLegali = [
  { nome: "PST Giustizia", url: "https://pst.giustizia.it", icon: "balance", desc: "Fascicolo Telematico" },
  { nome: "Cassazione", url: "http://www.italgiure.giustizia.it", icon: "gavel", desc: "Sentenze e Legittimità" },
  { nome: "Gazzetta Uff.", url: "https://www.gazzettaufficiale.it", icon: "menu_book", desc: "Normativa" },
  { nome: "Cassa Forense", url: "https://www.cassaforense.it", icon: "account_balance", desc: "Previdenza" },
];

export default function Homepage() {
  // --- STATI PER LA LOGICA SOCIAL (Quelli che avevamo perso) ---
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- RECUPERO POST DA SUPABASE ---
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Errore fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CREAZIONE NUOVO POST ---
  const handleCreaPost = async () => {
    if (!newPost.trim()) return;

    try {
      // Nota: Qui dovremmo usare l'ID dell'utente loggato. Per ora usiamo un placeholder.
      const { error } = await supabase
        .from('posts')
        .insert([{ 
            autore: "Avvocato Utente", // In futuro: user.nome
            contenuto: newPost, 
            likes: 0,
            commenti: 0
        }]);

      if (error) throw error;
      
      setNewPost("");
      fetchPosts(); // Ricarica il feed
    } catch (error) {
      alert("Errore nella creazione del post");
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* IMPORT ICONE (Corregge il problema visuale) */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

      {/* --- COLONNA SINISTRA: NAVIGAZIONE (Fissa) --- */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col p-4 hidden md:flex">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-8 h-8 bg-[#7c3aed] rounded-lg flex items-center justify-center font-bold text-white">N</div>
          <span className="text-xl font-bold tracking-tighter italic">NEXUM <span className="text-[#7c3aed]">LEGAL</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          <a href="/profilo" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm font-medium">Il mio Profilo</span>
          </a>
          <a href="/messaggi" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">mail</span>
            <span className="text-sm font-medium">Messaggi</span>
          </a>
          <a href="/notifiche" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">notifications</span>
            <span className="text-sm font-medium">Notifiche</span>
          </a>
          
          <div className="pt-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-3">Strumenti Rapidi</p>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all text-left">
              <span className="material-symbols-outlined">calculate</span>
              <span className="text-sm">Calcolo Termini</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all text-left">
              <span className="material-symbols-outlined">gavel</span>
              <span className="text-sm">Codici Commentati</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* --- COLONNA CENTRALE: WORKSPACE E FEED (Scorrevole) --- */}
      <main className="flex-1 overflow-y-auto bg-[#050505] relative">
        {/* Header Mobile/Desktop */}
        <header className="sticky top-0 z-20 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
            <h1 className="text-lg font-bold">Workspace</h1>
            <div className="flex gap-4">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-white/10 rounded-full">
                    <span className="material-symbols-outlined text-slate-300">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>

        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            
            {/* 1. SEZIONE LINK ISTITUZIONALI (La Dashboard) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {linkLegali.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" className="p-4 bg-[#0f0f0f] border border-white/5 rounded-2xl hover:border-[#7c3aed]/50 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center text-[#7c3aed] mb-2 group-hover:bg-[#7c3aed] group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">{link.icon}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-200">{link.nome}</h3>
                        <p className="text-[10px] text-slate-500 truncate">{link.desc}</p>
                    </a>
                ))}
            </div>

            {/* 2. CREA NUOVO POST (La logica social) */}
            <div className="mb-8 bg-[#0f0f0f] border border-white/5 rounded-2xl p-4">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7c3aed] to-blue-600 shrink-0"></div>
                    <textarea 
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Condividi un aggiornamento professionale, una sentenza o un dubbio..."
                        className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none resize-none h-20 pt-2"
                    />
                </div>
                <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-3">
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400"><span className="material-symbols-outlined text-lg">attach_file</span></button>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400"><span className="material-symbols-outlined text-lg">image</span></button>
                    </div>
                    <button 
                        onClick={handleCreaPost}
                        className="px-6 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-bold rounded-xl transition-all"
                    >
                        Pubblica
                    </button>
                </div>
            </div>

            {/* 3. FEED DEI POST (Recuperati da Supabase) */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Aggiornamenti dal Network</h3>
                
                {loading ? (
                    <div className="text-center py-10 text-slate-500">Caricamento feed...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 bg-[#0f0f0f] rounded-2xl">
                        <span className="material-symbols-outlined text-4xl mb-2">post_add</span>
                        <p>Nessun post ancora. Sii il primo a scrivere!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                                        {post.autore?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{post.autore}</h4>
                                        <p className="text-xs text-slate-500">{post.titolo_professionale || "Avvocato"} • {new Date(post.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
                            </div>
                            
                            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap mb-4">
                                {post.contenuto}
                            </p>

                            <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                                <button className="flex items-center gap-2 text-slate-500 hover:text-[#7c3aed] text-xs transition-colors group">
                                    <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">favorite</span>
                                    <span>{post.likes || 0} Utile</span>
                                </button>
                                <button className="flex items-center gap-2 text-slate-500 hover:text-white text-xs transition-colors">
                                    <span className="material-symbols-outlined text-lg">chat_bubble</span>
                                    <span>{post.commenti || 0} Commenti</span>
                                </button>
                                <button className="flex items-center gap-2 text-slate-500 hover:text-white text-xs transition-colors ml-auto">
                                    <span className="material-symbols-outlined text-lg">share</span>
                                    <span>Condividi</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </main>

      {/* --- COLONNA DESTRA: NOTIZIE & WIDGET (Fissa) --- */}
      <aside className="w-80 border-l border-white/5 bg-[#0a0a0a] p-6 hidden xl:block overflow-y-auto">
        <h3 className="text-xs font-bold text-[#7c3aed] uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">newspaper</span>
            News Giuridiche
        </h3>
        <div className="space-y-6 mb-10">
            <div className="group cursor-pointer">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Cassazione Civile</span>
                <h4 className="text-sm font-bold mt-1 group-hover:text-[#7c3aed] transition-colors">Sentenza n. 1234/26: Responsabilità medica e onere probatorio.</h4>
            </div>
            <div className="group cursor-pointer">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Fisco & Tasse</span>
                <h4 className="text-sm font-bold mt-1 group-hover:text-[#7c3aed] transition-colors">Nuovi minimi Cassa Forense: ecco le tabelle 2026.</h4>
            </div>
        </div>

        {/* PROMO AI */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#111] to-black border border-white/10 text-center">
            <span className="material-symbols-outlined text-[#7c3aed] text-3xl mb-2">smart_toy</span>
            <h4 className="font-bold text-white text-sm mb-1">Nexum AI Assistant</h4>
            <p className="text-xs text-slate-500 mb-3">Hai un dubbio su una procedura? Chiedi all'assistente.</p>
        </div>
      </aside>

      {/* --- CHATBOT POPUP (Componente Esterno) --- */}
      <AIChatPopup />
    </div>
  );
}
