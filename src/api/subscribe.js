const API_BASE = 'https://students.netoservices.ru/fe-diplom';

export async function subscribeToNews(email) {
  const response = await fetch(
    `${API_BASE}/subscribe?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error(`Подписка недоступна: ${response.status}`);
  }

  return response.json();
}