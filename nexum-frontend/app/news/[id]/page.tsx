'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PaginaDettaglioNews() {
  const params = useParams();
  const router = useRouter();
  const [articolo, setArticolo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // FETCH DATI VERI DAL BACKEND
  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    // Chiamata al server Python
    fetch(`https://nexum-backend.onrender.com/news/${id}`)
        .then((res) => {
            if (!res.ok) throw new Error("Notizia non trovata");
            return res.json();
        })
        .then((data) => {
            setArticolo(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
        });
  }, [params]);

  const condividi = (piattaforma: string) => {
    if (!articolo) return;
    const url = window.location.href;
    const testo = `Leggi: ${articolo.titolo}`;
    let link = "";
    switch(piattaforma) {
        case 'whatsapp': link = `https://wa.me/?text=${encodeURIComponent(testo + " " + url)}`; break;
        case 'linkedin': link = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
        case 'twitter': link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(testo)}&url=${encodeURIComponent(url)}`; break;
        case 'copy': 
            navigator.clipboard.writeText(url);
            alert("Link copiato!");
            return;
    }
    if(link) window.open(link, '_blank');
  };

  // SCHERMATA DI CARICAMENTO
  if (loading) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-[#7c3aed] text-4xl animate-spin">progress_activity</span>
        <p className="text-slate-400 text-sm">Caricamento articolo...</p>
    </div>
  );

  // ERRORE 404
  if (!articolo) return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
          <p>Impossibile trovare la notizia.</p>
          <button onClick={() => router.back()} className="text-[#7c3aed] underline">Torna indietro</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-[#7c3aed] selection:text-white pb-40">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        /* Stili per il contenuto HTML che arriva da Python */
        .prose h3 { color: white; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; letter-spacing: -0.02em; }
        .prose p { color: #cbd5e1; line-height: 1.8; margin-bottom: 1.5rem; font-size: 1.125rem; }
      `}</style>

      {/* HEADER NAVIGAZIONE */}
      <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
             <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-[#1c1f27] hover:bg-[#2d313a] rounded-full transition-colors text-white group border border-slate-800">
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform text-lg">arrow_back</span>
             </button>
        </div>
        <div className="px-4 py-1.5 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full text-xs text-[#7c3aed] font-extrabold uppercase tracking-widest">
            {articolo.categoria}
        </div>
      </nav>

      <main className="pt-28 px-6 max-w-3xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="mb-12 text-center animate-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-8">
                {articolo.titolo}
            </h1>
            
            {/* INFO BAR CON FONTE */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-slate-400 border-y border-slate-900 py-6 bg-black/50">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7c3aed]">calendar_month</span>
                    {articolo.data}
                </div>
                
                <div className="flex items-center gap-2 text-white bg-[#1c1f27] px-3 py-1 rounded-lg border border-slate-800">
                    <span className="material-symbols-outlined text-[#7c3aed] text-lg">public</span>
                    <span className="font-bold">Fonte: {articolo.fonte || "Nexum"}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7c3aed]">schedule</span>
                    3 min lettura
                </div>
            </div>
        </div>

        {/* IMMAGINE */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 border border-slate-800 relative shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
            <img src={articolo.immagine} className="w-full h-full object-cover" alt="Cover" />
        </div>

        {/* CONTENUTO */}
        <article 
            className="prose prose-invert prose-lg max-w-none animate-in slide-in-from-bottom-8 duration-700 delay-200"
            dangerouslySetInnerHTML={{ __html: articolo.contenuto }}
        >
        </article>

      </main>

      {/* --- ACTION BAR --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6 animate-in slide-in-from-bottom-10 delay-500 duration-500">
        <div className="bg-[#1c1f27]/95 backdrop-blur-xl border border-slate-700 p-3 rounded-2xl shadow-2xl shadow-black/80 flex items-center justify-between gap-2 md:gap-4">
            
            <button onClick={() => condividi('linkedin')} className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-3 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5] text-[#0077b5] hover:text-white transition-all group">
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">business_center</span>
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-wide">LinkedIn</span>
            </button>

            <button onClick={() => condividi('whatsapp')} className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-all group">
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">chat</span>
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-wide">WhatsApp</span>
            </button>

            <button onClick={() => condividi('twitter')} className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-3 rounded-xl bg-white/5 hover:bg-white text-slate-300 hover:text-black transition-all group">
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">flutter_dash</span>
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-wide">X / Twitter</span>
            </button>

             <button onClick={() => condividi('copy')} className="flex flex-col md:flex-row items-center justify-center gap-2 p-3 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white transition-all" title="Copia Link">
                <span className="material-symbols-outlined text-xl">link</span>
            </button>

        </div>
      </div>

    </div>
  );
}