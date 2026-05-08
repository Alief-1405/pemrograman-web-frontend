"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          🎬 Sinema<span className="brand-accent">Jayakarta</span>
        </Link>
        <div className="navbar-menu">
          <Link href="/" className="nav-link">Beranda</Link>
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/movies/add" className="nav-link">+ Tambah Film</Link>
              <button onClick={handleLogout} className="nav-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="nav-btn login-btn">Masuk</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
