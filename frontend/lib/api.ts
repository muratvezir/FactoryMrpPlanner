const API_BASE_URL = 'http://localhost:5260/api';

export async function fetchMaterials() {
    const res = await fetch(`${API_BASE_URL}/materials`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch materials');
    return res.json();
}
