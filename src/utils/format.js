export function formatMoney(value = 0) {
  return new Intl.NumberFormat('ru-RU').format(Math.round(Number(value) || 0));
}

export function capitalize(value = '') {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatCity(value = '') {
  return capitalize(value);
}

export function formatDate(value) {
  if (!value) return '—';
  const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatTime(value) {
  if (!value) return '—';
  const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDuration(seconds = 0) {
  const total = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  return `${hours} ч ${minutes.toString().padStart(2, '0')} мин`;
}

export function getDirectionLabel(direction) {
  return direction === 'arrival' ? 'Обратно' : 'Туда';
}

export function getCoachTypeLabel(type) {
  const map = {
    first: 'Люкс',
    second: 'Купе',
    third: 'Плацкарт',
    fourth: 'Сидячий',
  };

  return map[type] || 'Вагон';
}
