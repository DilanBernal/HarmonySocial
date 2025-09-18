function authHeader(): Record<string, string> {
  const t = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('Authorization')) : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function getPendingArtists(): Promise<Array<Record<string, unknown>>> {
  const res = await fetch('/api/artists/pending', { headers: authHeader() });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function acceptArtist(id: number): Promise<void> {
  const res = await fetch(`/api/artists/${id}/accept`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() } });
  if (!res.ok) throw new Error('accept failed');
}

export async function rejectArtist(id: number): Promise<void> {
  const res = await fetch(`/api/artists/${id}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() } });
  if (!res.ok) throw new Error('reject failed');
}

export async function createArtistAsAdmin(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch('/api/artists/admin', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('create failed');
  return res.json();
}
