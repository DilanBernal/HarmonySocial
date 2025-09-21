
export function normalizeMediaUrl(u: string) {
  if (!u) return u;

  // Fuerza localhost para aprovechar `adb reverse`
  // Convierte cualquier host/IP local en 127.0.0.1 (mismo puerto)
  return u
    .replace(/http:\/\/localhost:/i, 'http://127.0.0.1:')
    .replace(/http:\/\/10\.0\.2\.2:/i, 'http://127.0.0.1:')
    .replace(/http:\/\/\d+\.\d+\.\d+\.\d+:/i, 'http://127.0.0.1:');
}
