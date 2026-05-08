'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import './page.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await api.getMovies(page, 12);
      setMovies(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return fetchMovies();
    try {
      setLoading(true);
      const data = await api.searchMovies({ judul: searchTerm, page: 1, limit: 12 });
      // backend returns 404 when no results found
      setMovies(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setPage(1);
    } catch (error) {
      console.error('Error searching:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="container main">
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">🎬 Koleksi Film Terlengkap</div>
            <h1>Sinema <span>Jayakarta</span></h1>
            <p>Temukan dan nikmati ribuan koleksi film pilihan terbaik kami</p>
            <form className="hero-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Cari judul film, sutradara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">Cari</button>
            </form>
          </div>
        </section>

        {/* MOVIES */}
        <section className="movies-section">
          <div className="section-header">
            <h2>Film-Film Terbaru</h2>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Memuat film...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="no-movies">
              <p>Tidak ada film ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {movies.map((movie) => (
                <Link key={movie.id_film} href={`/movies/${movie.id_film}`}>
                  <div className="movie-card">
                    <div className="movie-cover">
                      {movie.cover ? (
                        <img
                          src={`${API_BASE}${movie.cover}`}
                          alt={movie.judul}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.querySelector('.no-cover-placeholder').style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="no-cover-placeholder"
                        style={{ display: movie.cover ? 'none' : 'flex' }}
                      >
                        🎬
                        <span>No Poster</span>
                      </div>
                    </div>
                    <div className="movie-info">
                      <h3>{movie.judul}</h3>
                      <p className="director">{movie.sutradara}</p>
                      <p className="year">{movie.tahun}</p>
                      {movie.genre && (
                        <span className="genre-badge">{movie.genre}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn btn-secondary btn-small"
              >
                ← Sebelumnya
              </button>
              <span className="page-info">Halaman {page} dari {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary btn-small"
              >
                Berikutnya →
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer container">
        <p>© 2024 Sinema Jayakarta · STMIK Jayakarta</p>
      </footer>
    </>
  );
}
