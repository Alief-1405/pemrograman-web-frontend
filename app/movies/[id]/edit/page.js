'use client';

import withAuth from '@/lib/withAuth';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import './page.css';

function EditMovie() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    judul: '',
    sutradara: '',
    tahun: new Date().getFullYear(),
    genre: '',
    deskripsi: '',
    durasi: '',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await api.getMovie(id);
        const movie = data.data || data;
        setFormData({
          judul: movie.judul || '',
          sutradara: movie.sutradara || '',
          tahun: movie.tahun || new Date().getFullYear(),
          genre: movie.genre || '',
          deskripsi: movie.deskripsi || '',
          durasi: movie.durasi || '',
        });
      } catch (err) {
        setError('Gagal memuat data film');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (coverFile) data.append('coverFile', coverFile);

      const response = await api.updateMovie(id, data);
      if (response.status === 200) {
        router.push('/dashboard');
      } else {
        setError(response.message || 'Gagal memperbarui film');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="container main">
        <div className="loading">
          <div className="spinner"></div>
          <p>Memuat data film...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container main">
      <div className="form-page-header">
        <Link href="/dashboard" className="back-link">← Kembali ke Dashboard</Link>
        <h1>Edit Film</h1>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Judul Film *</label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sutradara *</label>
            <input
              type="text"
              name="sutradara"
              value={formData.sutradara}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tahun Rilis</label>
              <input
                type="number"
                name="tahun"
                value={formData.tahun}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="form-group">
              <label>Durasi (menit)</label>
              <input
                type="number"
                name="durasi"
                value={formData.durasi}
                onChange={handleInputChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Sinopsis</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Ganti Cover / Poster</label>
            <div className="file-input-wrapper">
              <label className="file-input-label">
                📁 {coverFile ? coverFile.name : 'Pilih file gambar baru...'}
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>
              {coverFile && (
                <div className="file-selected">✓ {coverFile.name}</div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
            <Link href="/dashboard" className="btn btn-secondary">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default withAuth(EditMovie);
