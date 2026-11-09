import { useEffect, useState } from 'react';

// "#/"      → null (home page)
// "#/farm"  → "farm"
const read = () => (location.hash.match(/^#\/([\w-]+)/) || [])[1] || null;

export default function useHashRoute() {
  const [id, setId] = useState(read);
  useEffect(() => {
    const on = () => setId(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return id;
}
export const goHome = () => { location.hash = '#/'; };
