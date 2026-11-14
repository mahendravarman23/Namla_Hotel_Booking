const TOKEN_KEY = 'hotel_app_jwt_token';

function authHeaders(headers = {}) {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
  } catch {
    return headers;
  }
}

async function handle(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function queryString(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) qs.set(key, value);
  });
  const text = qs.toString();
  return text ? `?${text}` : '';
}

export const hotelsApi = {
  list: (filters) => fetch(`/api/hotels${queryString(filters)}`, { headers: authHeaders() }).then(handle),
  get: (id) => fetch(`/api/hotels/${id}`, { headers: authHeaders() }).then(handle),
  create: (formData) => fetch('/api/hotels', { method: 'POST', body: formData, headers: authHeaders() }).then(handle),
  update: (id, formData) => fetch(`/api/hotels/${id}`, { method: 'PUT', body: formData, headers: authHeaders() }).then(handle),
  remove: (id) => fetch(`/api/hotels/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handle),
};

export const authApi = {
  login: (credentials) =>
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handle),

  register: (userData) =>
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(handle),

  me: () => fetch('/api/auth/me', { headers: authHeaders() }).then(handle),
};
