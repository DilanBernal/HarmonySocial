export async function adminLogin(creds: { userOrEmail: string; password: string }): Promise<{ token?: string } | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4666/api";
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  });

  if (!res.ok) return null;
  const json = await res.json();
  console.log(json)
  return { token: json.data.token };
}
