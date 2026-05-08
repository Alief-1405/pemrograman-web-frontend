'use client';

import withAuth from '@/lib/withAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import './page.css';

function AddMovie() {
  const [formData, setFormData] = useState({
    judul: '',
    sutradara: '',
    tahun: new Date().getFullYear(),
    genre: '',
    deskripsi: '',
    durasi: '',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (coverFile) data.append('coverFile', coverFile);

      const response = await api.createMovie(data);
      if (response.status === 201) {
        router.push('/dashboard');
      } else {
        setError(response.message || 'Gagal menambahkan film');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container main">
      <div className="form-page-header">
        <Link href="/dashboard" className="back-link">← Kembali ke Dashboard</Link>
        <h1>Tambah Film Baru</h1>
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
              placeholder="Masukkan judul film"
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
              placeholder="Nama sutradara"
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
                placeholder="Contoh: 120"
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
              placeholder="Drama, Romantis, Thriller..."
            />
          </div>

          <div className="form-group">
            <label>Sinopsis</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              placeholder="Ceritakan sinopsis film..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Cover / Poster Film</label>
            <div className="file-input-wrapper">
              <label className="file-input-label">
                📁 {coverFile ? coverFile.name : 'Pilih file gambar...'}
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>
              {coverFile && (
                <div className="file-selected">✓ {coverFile.name}</div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Menyimpan...' : '💾 Simpan Film'}
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

export default withAuth(AddMovie);
