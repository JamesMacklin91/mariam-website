import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "Mariam's Market | Beauty, Perfumes & Wellness Tanzania",
  description: "Authentic imported perfumes, natural supplements, and skincare delivered across Tanzania.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <nav className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.jpeg" 
                alt="Mariam's Market Logo" 
                width={40} 
                height={40} 
                className="rounded-md object-contain"
              />
              <span className="font-bold text-xl text-rose-950 tracking-tight">
                Mariam's Market
              </span>
            </Link>
            <div className="space-x-6 text-sm font-medium">
              <Link href="/" className="hover:text-rose-700 transition-colors">Home</Link>
              <Link href="/products" className="hover:text-rose-700 transition-colors">All Products</Link>
            </div>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Mariam's Market. Quality Perfumes & Wellness in Tanzania.
        </footer>
      </body>
    </html>
  );
}