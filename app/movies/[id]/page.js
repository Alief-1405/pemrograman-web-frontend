'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import './page.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function MovieDetail({ params }) {
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await api.getMovie(id);
        // Cek status response, jangan pakai fallback || data
        if (data.status === 200) {
          setMovie(data.data);
        } else {
          setError('Film tidak ditemukan.');
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Gagal memuat data film.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Hapus film ini?')) return;
    try {
      const data = await api.deleteMovie(id);
      if (data.status === 200) {
        router.push('/dashboard');
      } else {
        alert('Gagal menghapus film.');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus.');
    }
  };

  if (loading) {
    return (
      <main className="container main">
        <div className="loading">
          <div className="spinner"></div>
          <p>Memuat detail film...</p>
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="container main">
        <Link href="/" className="back-link">← Kembali</Link>
        <div className="alert alert-error">{error || 'Film tidak ditemukan.'}</div>
      </main>
    );
  }

  return (
    <main className="container main">
      <Link href="/" className="back-link">← Kembali</Link>

      <div className="movie-detail-wrapper">
        {/* POSTER */}
        <div className="movie-poster">
          {movie.cover ? (
            <img
              src={`${API_BASE}${movie.cover}`}
              alt={movie.judul}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="poster-placeholder"
            style={{ display: movie.cover ? 'none' : 'flex' }}
          >
            🎬<span>No Poster</span>
          </div>
        </div>

        {/* INFO */}
        <div className="movie-meta">
          {movie.genre && (
            <div className="movie-genre-badge">{movie.genre}</div>
          )}

          <h1 className="movie-title">{movie.judul}</h1>

          <div className="movie-stats">
            <div className="stat-item">
              <span className="stat-label">Sutradara</span>
              <span className="stat-value">{movie.sutradara}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tahun</span>
              <span className="stat-value">{movie.tahun || '—'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Durasi</span>
              <span className="stat-value">{movie.durasi ? `${movie.durasi} menit` : '—'}</span>
            </div>
          </div>

          {movie.deskripsi && (
            <>
              <div className="divider"></div>
              <p className="synopsis-title">Sinopsis</p>
              <p className="synopsis-text">{movie.deskripsi}</p>
            </>
          )}

          {isLoggedIn && (
            <div className="movie-actions">
              <Link href={`/movies/${id}/edit`} className="btn btn-secondary">
                ✏️ Edit Film
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                🗑️ Hapus
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
