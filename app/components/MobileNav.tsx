'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  // Definizione dei link
  const links = [
    { name: 'Home', href: '/', icon: 'dashboard' },
    { name: 'Clienti', href: '/clienti', icon: 'groups' },
    { name: 'Messaggi', href: '/messaggi', icon: 'mail' }, // Nuova pagina messaggi
    { name: 'Profilo', href: '/profilo', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-t border-slate-900 z-50 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-[#7c3aed]' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl transition-transform ${isActive ? '-translate-y-1' : ''}`}>
                {link.icon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {link.name}
              </span>
              
              {/* Indicatore attivo (pallino) */}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-[#7c3aed] rounded-full"></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}