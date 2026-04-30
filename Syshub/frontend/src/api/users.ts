import API_URL, { getHeaders } from './api';

export async function getMe() {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: getHeaders(true),
  });

  return res.json();
}