
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inicio de sesión - Norma",
  description: "Clon de plataforma norma",
  keywords: ["Educativa S.A.S", "Sistema de gestión educativa", "Colegios", "Educación","Norma", "Norma Clon", "Gestión educativa", "Norma Clone"],
  icons: {
    icon: "https://conpros3fili01.s3.amazonaws.com/images/favicon-norma.png",
  },
};
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default async function RootLayout({ children }: { children: React.ReactNode })
  
{

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}