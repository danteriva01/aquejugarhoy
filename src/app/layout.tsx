import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '¿A qué jugar hoy? — Descubrí tu próximo juego favorito',
    template: '%s | ¿A qué jugar hoy?',
  },
  description:
    '¿No sabés qué jugar? Encontrá el juego perfecto según tu mood, cantidad de jugadores, género y más. Recomendaciones personalizadas para cada momento.',
  keywords: [
    'videojuegos',
    'recomendaciones',
    'qué jugar',
    'juegos gratis',
    'juegos coop',
    'descubrir juegos',
    'gaming',
  ],
  openGraph: {
    title: '¿A qué jugar hoy?',
    description: 'Encontrá algo divertido para jugar en menos de un minuto.',
    type: 'website',
    locale: 'es_AR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-body min-h-screen flex flex-col">
        <NextTopLoader color="#6366f1" showSpinner={false} shadow="0 0 10px #6366f1,0 0 5px #6366f1" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
