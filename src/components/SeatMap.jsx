import { getCoachBadge, getCoachTypeFromFlags, getSeatPrice } from '../utils/helpers.js';
import { formatMoney } from '../utils/format.js';

function getColumns(coachType) {
  if (coachType === 'first') return 2;
  if (coachType === 'second') return 4;
  if (coachType === 'third') return 4;
  return 4;
}

export default function SeatMap({ coach, selectedSeats, onToggle }) {
  if (!coach) {
    return <div className="empty-card">Выберите тип вагона, чтобы увидеть схему мест.</div>;
  }

  const selectedSet = new Set(selectedSeats.map((item) => item.seatNumber));
  const coachType = getCoachTypeFromFlags(coach);

  return (
    <section className="seat-card">
      <div className="seat-card__header">
        <div>
          <h3>{getCoachBadge(coach)}</h3>
          <p>Выберите свободные места и дополнительные услуги.</p>
        </div>
        <div className="seat-card__coach-number">{coach.name || '07'}</div>
      </div>

      <div className="seat-card__prices">
        <span>Свободно: {coach.available_seats}</span>
        <span>Цена от {formatMoney(Math.min(...[coach.price, coach.top_price, coach.bottom_price, coach.side_price].filter(Boolean)))} ₽</span>
      </div>

      <div className="seat-map" style={{ gridTemplateColumns: `repeat(${getColumns(coachType)}, minmax(0, 1fr))` }}>
        {(coach.seats || []).map((seat) => {
          const selected = selectedSet.has(seat.index);
          const price = getSeatPrice(coach, seat.index);

          return (
            <button
              key={seat.index}
              type="button"
              disabled={!seat.available}
              className={`seat-map__seat ${selected ? 'seat-map__seat--selected' : ''}`}
              onClick={() => onToggle(seat, price)}
            >
              <strong>{seat.index}</strong>
              <small>{formatMoney(price)} ₽</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
