import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/useBooking.js';
import InnerHero from '../components/InnerHero.jsx';
import './PassengersPage.css';

export default function PassengersPage() {
  const navigate = useNavigate();
  const { state } = useBooking();

  const route = state.selectedRoute;
  const departureSeats = state.seats?.departure?.selectedSeats || [];

  // Ранний возврат, если нет маршрута
  if (!route?.departure) {
    return (
      <section className="booking-section">
        <div className="container">
          <div className="empty-card">Сначала выберите поезд и места.</div>
        </div>
      </section>
    );
  }

  // Формирование строки с номерами мест
  const seatsNumbers =
    departureSeats.length > 0
      ? departureSeats.map((seat) => seat.seatNumber).join(', ')
      : '—';

  return (
    <>
      <InnerHero step={2} />

      <section className="booking-section">
        <div className="container passengers-page">
          <h1 className="passengers-page__title">Пассажиры</h1>

          {/* Карточка с выбранными местами */}
          <section className="passengers-page__card">
            <h2 className="passengers-page__subtitle">Выбранные места</h2>

            <div className="passengers-page__row">
              <span>Поезд</span>
              <strong>{route.departure?.train?.name || '—'}</strong>
            </div>

            <div className="passengers-page__row">
              <span>Маршрут</span>
              <strong>
                {route.departure?.from?.city?.name || '—'} →{' '}
                {route.departure?.to?.city?.name || '—'}
              </strong>
            </div>

            <div className="passengers-page__row">
              <span>Места</span>
              <strong>{seatsNumbers}</strong>
            </div>
          </section>

          {/* Карточка с данными пассажира */}
          <section className="passengers-page__card">
            <h2 className="passengers-page__subtitle">Данные пассажира</h2>

            <div className="passengers-page__form">
              <input
                className="passengers-page__input"
                type="text"
                placeholder="Имя"
              />
              <input
                className="passengers-page__input"
                type="text"
                placeholder="Фамилия"
              />
              <input
                className="passengers-page__input"
                type="text"
                placeholder="Документ"
              />
            </div>
          </section>

          {/* Кнопки навигации */}
          <div className="passengers-page__actions">
            <button
              type="button"
              className="passengers-page__back-button"
              onClick={() => navigate('/seats')}
            >
              Назад
            </button>

            <button type="button" className="passengers-page__next-button">
              Продолжить
            </button>
          </div>
        </div>
      </section>
    </>
  );
}