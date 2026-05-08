const API_BASE = 'http://localhost:4000/api';

export const api = {
  // Auth endpoints
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
      },
    });
    return res.json();
  },

  // Movie endpoints
  getMovies: async (page = 1, limit = 50) => {
    const res = await fetch(`${API_BASE}/movies?page=${page}&limit=${limit}`);
    return res.json();
  },

  getMovie: async (id) => {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    return res.json();
  },

  searchMovies: async (query) => {
    const params = new URLSearchParams(query);
    const res = await fetch(`${API_BASE}/movies/search?${params}`);
    return res.json();
  },

  createMovie: async (formData) => {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
      },
      body: formData,
    });
    return res.json();
  },

  updateMovie: async (id, formData) => {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
      },
      body: formData,
    });
    return res.json();
  },

  deleteMovie: async (id) => {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
      },
    });
    return res.json();
  },
};
