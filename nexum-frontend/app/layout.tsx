import type { Metadata } from "next";
import "./globals.css";
// IMPORTANTE: Nota il ./ che cerca nella cartella corrente 'components'
import AIChatPopup from "./components/AIChatPopup"; 

export const metadata: Metadata = {
  title: "Nexum Platform",
  description: "Piattaforma per professionisti legali e fiscali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>
        {children}
        <AIChatPopup /> {/* Il bottone apparirà ovunque */}
      </body>
    </html>
  );
}