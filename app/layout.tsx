import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "YOLO MVP",
  description: "Deteksi objek dengan YOLO",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">🎯 YOLO MVP</Link>
          <nav>
            <Link href="/">Deteksi</Link>
            <Link href="/history">Riwayat</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
