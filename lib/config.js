// lib/config.js
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAPI = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json();
  return data;
};