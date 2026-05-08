import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Sinema Jayakarta - Movie Management',
  description: 'Aplikasi manajemen film untuk Sinema Jayakarta',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
