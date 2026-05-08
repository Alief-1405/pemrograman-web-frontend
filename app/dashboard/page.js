'use client';

import withAuth from '@/lib/withAuth';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import './page.css';

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await api.getMovies(page, 10);
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
    try {
      setLoading(true);
      const data = await api.searchMovies({ judul: searchTerm, page: 1, limit: 10 });
      setMovies(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setPage(1);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus film ini?')) return;
    try {
      const data = await api.deleteMovie(id);
      if (data.status === 200) {
        fetchMovies();
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <main className="container main">
      <div className="dashboard-header">
        <h1>Manajemen Film</h1>
        <Link href="/movies/add" className="btn btn-primary">
          + Tambah Film
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari film berdasarkan judul..."
        />
        <button type="submit">Cari</button>
      </form>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Memuat data...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <p>Tidak ada film ditemukan.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <div className="movies-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Judul</th>
                  <th>Sutradara</th>
                  <th>Tahun</th>
                  <th>Genre</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie, index) => (
                  <tr key={movie.id_film}>
                    <td>{(page - 1) * 10 + index + 1}</td>
                    <td>
                      <Link href={`/movies/${movie.id_film}`} className="movie-title-cell">
                        {movie.judul}
                      </Link>
                    </td>
                    <td>{movie.sutradara}</td>
                    <td>{movie.tahun}</td>
                    <td>
                      {movie.genre && (
                        <span className="genre-pill">{movie.genre}</span>
                      )}
                    </td>
                    <td>
                      <div className="actions">
                        <Link
                          href={`/movies/${movie.id_film}/edit`}
                          className="btn btn-secondary btn-small"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(movie.id_film)}
                          className="btn btn-danger btn-small"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </main>
  );
}

export default withAuth(Dashboard);
