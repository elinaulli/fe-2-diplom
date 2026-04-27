import { buildStationLabel, findStations, normalizeText } from '../data/stations.js';
import { toQueryString } from '../utils/helpers.js';
import { mockSeats } from '../data/mockSeats.js';

const API_BASE = 'https://students.netoservices.ru/fe-diplom';

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const raw = await response.text();

  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw || null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        (typeof data === 'string' ? data : '') ||
        `Ошибка ${response.status}`
    );
  }

  return data;
}

export async function searchCitiesApi(query, signal) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery || trimmedQuery.length < 2) {
    return [];
  }

  const params = new URLSearchParams({ name: trimmedQuery });
  return fetchJson(`/routes/cities?${params.toString()}`, { signal });
}

export async function resolveCityFromStation(station, signal) {
  if (!station?.city) {
    return null;
  }

  const cities = await searchCitiesApi(station.city, signal);

  return (
    cities.find(
      (item) => normalizeText(item.name) === normalizeText(station.city)
    ) ||
    cities[0] ||
    null
  );
}

export async function getCitySuggestions(query, signal) {
  const localStations = findStations(query, 6);

  try {
    const apiCities = await searchCitiesApi(query, signal);
    const cityKeys = new Set(apiCities.map((item) => normalizeText(item.name)));

    const merged = [
      ...apiCities.map((item) => ({
        type: 'city',
        key: item._id,
        label: item.name,
        subtitle: 'город',
        city: item,
      })),
      ...localStations.map((station) => ({
        type: 'station',
        key: `${station.city}:${station.name}`,
        label: buildStationLabel(station),
        subtitle: cityKeys.has(normalizeText(station.city))
          ? 'вокзал'
          : 'локальный справочник',
        station,
      })),
    ];

    return {
      items: merged.slice(0, 10),
      fallback: false,
    };
  } catch (error) {
    return {
      items: localStations.map((station) => ({
        type: 'station',
        key: `${station.city}:${station.name}`,
        label: buildStationLabel(station),
        subtitle: 'локальный справочник',
        station,
      })),
      fallback: true,
      error,
    };
  }
}

export async function getLastRoutes() {
  return fetchJson('/routes/last');
}

export async function searchRoutes(params = {}) {
  if (!params.from_city_id || !params.to_city_id) {
    throw new Error('Не выбраны города отправления и прибытия.');
  }

  const query = toQueryString(params);

  return fetchJson(`/routes${query ? `?${query}` : ''}`);
}

export async function getSeats(routeId, params = {}) {
  try {
    const query = toQueryString(params);
    const data = await fetchJson(
      `/routes/${routeId}/seats${query ? `?${query}` : ''}`
    );

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.coaches)) return data.coaches;

    return [];
  } catch (error) {
    console.error('API seats error:', error);
    return mockSeats[routeId] || [];
  }
}

export async function submitOrder(payload) {
  try {
    return await fetchJson('/order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    return fetchJson('/routes/order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export async function subscribeToNews(email) {
  const params = new URLSearchParams({ email: email.trim() });
  return fetchJson(`/subscribe?${params.toString()}`);
}