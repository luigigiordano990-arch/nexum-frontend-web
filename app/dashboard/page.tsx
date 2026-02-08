"use client";

import React from 'react';

const linksUtili = [
  { nome: "PST Giustizia", url: "https://pst.giustizia.it", icon: "balance" },
  { nome: "Cassazione", url: "http://www.italgiure.giustizia.it", icon: "gavel" },
  { nome: "Gazzetta Ufficiale", url: "https://www.gazzettaufficiale.it", icon: "description" },
  { nome: "PEC Mail", url: "#", icon: "mail" },
  { nome: "Processo Telematico", url: "#", icon: "computer" },
  { nome: "Agenzia Entrate", url: "https://www.agenziaentrate.gov.it", icon: "payments" },
];

export default function ProfessionalDashboard() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* 1. SIDEBAR SINISTRA - STRUMENTI */}
      <aside className="w-20 lg:w-64 border-r border-slate-800 bg-[#111] flex flex-col p-4 gap-6">
        <div className="text-[#7c3aed] font-bold text-xl mb-4 hidden lg:block">NEXUM TOOLS</div>
        <nav className="flex flex-col gap-4">
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all">
            <span className="material-symbols-outlined">calculate</span>
            <span className="hidden lg:block text-sm">Calcolo Termini</span>
          </button>
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all">
            <span className="material-symbols-outlined">edit_note</span>
            <span className="hidden lg:block text-sm">Redattore Atti</span>
          </button>
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#7c3aed]/10 text-slate-400 hover:text-[#7c3aed] transition-all">
            <span className="material-symbols-outlined">folder_shared</span>
            <span className="hidden lg:block text-sm">Fascicoli</span>
          </button>
        </nav>
      </aside>

      {/* 2. AREA CENTRALE - DASHBOARD DI COLLEGAMENTO */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Bentornato, Avvocato</h1>
          <p className="text-slate-500 mt-2">Accesso rapido ai portali e strumenti di gestione.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {linksUtili.map((link, idx) => (
            <a 
              key={idx} 
              href={link.url} 
              target="_blank" 
              className="p-6 bg-[#161b22] border border-slate-800 rounded-2xl hover:border-[#7c3aed] transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center mb-4 group-hover:bg-[#7c3aed] transition-colors">
                <span className="material-symbols-outlined text-[#7c3aed] group-hover:text-white">{link.icon}</span>
              </div>
              <h3 className="font-semibold text-lg">{link.nome}</h3>
              <p className="text-xs text-slate-500 mt-2">Clicca per aprire il portale ufficiale</p>
            </a>
          ))}
        </div>
      </main>

      {/* 3. SIDEBAR DESTRA - NEWS & INFO */}
      <aside className="w-80 border-l border-slate-800 bg-[#0d1117] hidden xl:flex flex-col p-6 gap-8">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Ultime News</h3>
          <div className="space-y-4">
            <div className="p-4 bg-black/20 rounded-xl border border-slate-800">
              <span className="text-[10px] text-[#7c3aed] font-bold">RIFORMA CARTABIA</span>
              <p className="text-xs mt-1 leading-relaxed">Nuove specifiche per il deposito telematico in vigore da domani.</p>
            </div>
            <div className="p-4 bg-black/20 rounded-xl border border-slate-800">
              <span className="text-[10px] text-green-500 font-bold">CASSA FORENSE</span>
              <p className="text-xs mt-1 leading-relaxed">Pubblicati i nuovi bandi per l'assistenza 2026.</p>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 bg-[#7c3aed]/5 border border-[#7c3aed]/20 rounded-2xl text-center">
            <p className="text-xs text-slate-400 mb-3">Hai bisogno di aiuto con una pratica?</p>
            <button className="w-full py-2 bg-[#7c3aed] text-white rounded-lg text-xs font-bold">Chiedi a Nexum AI</button>
        </div>
      </aside>

    </div>
  );
}