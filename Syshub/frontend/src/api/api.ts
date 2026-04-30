const API_URL = 'http://localhost:3000/api/v1';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export function getHeaders(auth = false) {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = localStorage.getItem('token');
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export default API_URL;