"use client";

import React, { useState, useEffect } from 'react';

// Link specifici per il settore Legale
const linkLegali = [
  { nome: "PST Giustizia", url: "https://pst.giustizia.it", icon: "balance", desc: "Accesso al fascicolo telematico" },
  { nome: "Cassazione", url: "http://www.italgiure.giustizia.it", icon: "gavel", desc: "Ricerca sentenze e massime" },
  { nome: "Gazzetta Ufficiale", url: "https://www.gazzettaufficiale.it", icon: "menu_book", desc: "Consultazione leggi vigenti" },
  { nome: "Cassa Forense", url: "https://www.cassaforense.it", icon: "account_balance", desc: "Gestione contributi e welfare" },
  { nome: "Movimento Fascicoli", url: "#", icon: "folder_shared", desc: "Stato invii e depositi" },
  { nome: "Notifiche PEC", url: "#", icon: "outgoing_mail", desc: "Ricerca indirizzi INI-PEC" },
];

export default function HomeAvvocato() {
  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* --- SIDEBAR STRUMENTI LEGALI --- */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col p-4">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-[#7c3aed] rounded-lg flex items-center justify-center font-bold">N</div>
          <span className="text-xl font-bold tracking-tighter italic">NEXUM <span className="text-[#7c3aed]">LEGAL</span></span>
        </div>

        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-3 tracking-widest">Utility Studio</p>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all">
            <span className="material-symbols-outlined">event_note</span>
            <span className="text-sm font-medium">Calcolo Termini 183</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all">
            <span className="material-symbols-outlined">history_edu</span>
            <span className="text-sm font-medium">Redattore Citazioni</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all">
            <span className="material-symbols-outlined">euro</span>
            <span className="text-sm font-medium">Parametri Forensi</span>
          </button>
        </nav>
      </aside>

      {/* --- DASHBOARD CENTRALE --- */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0a0a] to-black p-10">
        <header className="mb-12">
            <div className="flex items-center gap-2 text-[#7c3aed] mb-2">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Workspace Avvocato Attivo</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Postazione Legale <span className="text-slate-500 font-light italic">Nexum</span></h1>
        </header>

        {/* GRIGLIA PORTALI MINISTERIALI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {linkLegali.map((link, idx) => (
            <a key={idx} href={link.url} target="_blank" className="group p-6 bg-[#0f0f0f] border border-white/5 rounded-3xl hover:border-[#7c3aed]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/5 flex items-center justify-center text-[#7c3aed] mb-4 group-hover:bg-[#7c3aed] group-hover:text-white transition-all">
                <span className="material-symbols-outlined">{link.icon}</span>
              </div>
              <h3 className="text-lg font-bold">{link.nome}</h3>
              <p className="text-sm text-slate-500 mt-1">{link.desc}</p>
            </a>
          ))}
        </div>

        {/* AGENDA UDIENZE (Esempio UI per riempire lo spazio) */}
        <section className="mt-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                Prossime Udienze
            </h2>
            <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border-l-4 border-[#7c3aed]">
                    <div>
                        <p className="text-xs text-slate-500">12 Febbraio 2026 - Ore 09:30</p>
                        <p className="font-bold">Tribunale di Roma - RG 4432/25</p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#7c3aed]/20 text-[#7c3aed] px-3 py-1 rounded-full uppercase">Prima Udienza</span>
                </div>
            </div>
        </section>
      </main>

      {/* --- COLONNA DESTRA: NEWS LEGALI --- */}
      <aside className="w-80 border-l border-white/5 bg-[#0a0a0a] p-6 hidden xl:block">
        <h3 className="text-xs font-bold text-[#7c3aed] uppercase tracking-widest mb-8">Notiziario Giuridico</h3>
        <div className="space-y-8">
            <div className="cursor-pointer group">
                <span className="text-[9px] text-slate-500">DIRITTO CIVILE</span>
                <h4 className="text-sm font-bold mt-1 group-hover:text-[#7c3aed] transition-colors leading-tight">Nuova Cassazione su responsabilità medica: cosa cambia.</h4>
            </div>
            <div className="cursor-pointer group">
                <span className="text-[9px] text-slate-500">RAPPORTO CASSA</span>
                <h4 className="text-sm font-bold mt-1 group-hover:text-[#7c3aed] transition-colors leading-tight">Guida al calcolo dei minimi contributivi 2026.</h4>
            </div>
        </div>
      </aside>
    </div>
  );
}
