"use client";

import React, { useState } from 'react';
import AIChatPopup from './components/AIChatPopup'; // Assicurati che il percorso sia corretto

const linkLegali = [
  { nome: "PST Giustizia", url: "https://pst.giustizia.it", icon: "balance", desc: "Accesso al fascicolo telematico" },
  { nome: "Cassazione", url: "http://www.italgiure.giustizia.it", icon: "gavel", desc: "Ricerca sentenze e massime" },
  { nome: "Gazzetta Ufficiale", url: "https://www.gazzettaufficiale.it", icon: "menu_book", desc: "Consultazione leggi vigenti" },
  { nome: "Cassa Forense", url: "https://www.cassaforense.it", icon: "account_balance", desc: "Gestione contributi e welfare" },
  { nome: "Movimento Fascicoli", url: "#", icon: "folder_shared", desc: "Stato invii e depositi" },
  { nome: "Notifiche PEC", url: "#", icon: "outgoing_mail", desc: "Ricerca indirizzi INI-PEC" },
];

export default function HomeAvvocato() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* IMPORT ICONE MATERIAL - FONDAMENTALE PER IL CSS */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400 dream,0,0" />

      {/* --- SIDEBAR SINISTRA: NAVIGAZIONE E STRUMENTI --- */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col p-4">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-[#7c3aed] rounded-lg flex items-center justify-center font-bold">N</div>
          <span className="text-xl font-bold tracking-tighter italic text-white">NEXUM <span className="text-[#7c3aed]">LEGAL</span></span>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-3 tracking-widest">Menu Principale</p>
          <a href="/profilo" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="text-sm font-medium">Il mio Profilo</span>
          </a>
          <a href="/messaggi" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">mail</span>
            <span className="text-sm font-medium">Messaggi</span>
          </a>
          
          <div className="pt-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-3 tracking-widest">Utility Studio</p>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all">
              <span className="material-symbols-outlined">event_note</span>
              <span className="text-sm font-medium">Calcolo Termini 183</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all">
              <span className="material-symbols-outlined">history_edu</span>
              <span className="text-sm font-medium">Redattore Citazioni</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* --- DASHBOARD CENTRALE --- */}
      <main className="flex-1 overflow-y-auto bg-[#050505] p-10">
        <header className="mb-12 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 text-[#7c3aed] mb-2">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Workspace Avvocato Attivo</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Postazione Legale <span className="text-slate-500 font-light italic">Nexum</span></h1>
            </div>

            {/* NOTIFICHE E AZIONI RAPIDE */}
            <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all relative"
                >
                    <span className="material-symbols-outlined text-slate-400">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#7c3aed] rounded-full border-2 border-[#050505]"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 bg-[#111] border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-4">Notifiche Recenti</p>
                    <div className="text-sm text-slate-400">Nessun nuovo aggiornamento di sistema.</div>
                  </div>
                )}
            </div>
        </header>

        {/* GRIGLIA PORTALI MINISTERIALI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {linkLegali.map((link, idx) => (
            <a key={idx} href={link.url} target="_blank" className="group p-6 bg-[#0f0f0f] border border-white/5 rounded-3xl hover:border-[#7c3aed]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/5 flex items-center justify-center text-[#7c3aed] mb-4 group-hover:bg-[#7c3aed] group-hover:text-white transition-all">
                <span className="material-symbols-outlined">{link.icon}</span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-[#7c3aed] transition-colors">{link.nome}</h3>
              <p className="text-sm text-slate-500 mt-1">{link.desc}</p>
            </a>
          ))}
        </div>

        {/* AGENDA UDIENZE */}
        <section className="mt-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7c3aed]">calendar_today</span>
                Prossime Udienze
            </h2>
            <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border-l-4 border-[#7c3aed]">
                    <div className="flex items-center gap-4">
                        <div className="text-center bg-black/40 p-2 rounded-lg min-w-[60px]">
                            <p className="text-[10px] text-[#7c3aed] font-bold">FEB</p>
                            <p className="text-xl font-black">12</p>
                        </div>
                        <div>
                            <p className="font-bold text-slate-200 uppercase text-xs tracking-tight">Tribunale di Roma - RG 4432/25</p>
                            <p className="text-xs text-slate-500">Ore 09:30 - Prima Udienza Comparizione</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#7c3aed]/20 text-[#7c3aed] px-3 py-1 rounded-full">DETTAGLI</span>
                </div>
            </div>
        </section>
      </main>

      {/* --- COLONNA DESTRA: NOTIZIARIO --- */}
      <aside className="w-80 border-l border-white/5 bg-[#0a0a0a] p-6 hidden xl:block">
        <h3 className="text-xs font-bold text-[#7c3aed] uppercase tracking-widest mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">newspaper</span>
            Notiziario Giuridico
        </h3>
        <div className="space-y-8">
            <div className="cursor-pointer group">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Diritto Civile</span>
                <h4 className="text-sm font-bold mt-1 group-hover:text-[#7c3aed] transition-colors leading-tight">Nuova Cassazione su responsabilità medica: cosa cambia.</h4>
            </div>
            <div className="cursor-pointer group">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Previdenza</span>
                <h4 className="text-sm font-bold mt-1 group-hover:text-[#7c3aed] transition-colors leading-tight">Guida al calcolo dei minimi contributivi 2026.</h4>
            </div>
        </div>

        {/* PROMPT RAPIDO AI SOTTO LE NEWS */}
        <div className="mt-20 p-6 rounded-3xl bg-gradient-to-br from-[#111] to-black border border-white/5">
            <p className="text-xs text-slate-400 leading-relaxed italic">"Nexum AI può analizzare i tuoi atti in tempo reale per trovare incongruenze legali."</p>
        </div>
      </aside>

      {/* CHATBOT POPUP (Sempre visibile in basso a destra) */}
      <AIChatPopup />
    </div>
  );
}
