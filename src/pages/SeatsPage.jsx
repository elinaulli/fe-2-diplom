import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API и утилиты
import { getLastRoutes, getSeats } from '../api/client.js';
import { useBooking } from '../context/useBooking.js';
import {
  formatCity,
  formatDuration,
  formatMoney,
  formatTime,
} from '../utils/format.js';

// Компоненты
import BookingSidebar from '../components/BookingSidebar.jsx';
import InnerHero from '../components/InnerHero.jsx';

// Иконки
import ClockIcon from '../components/icons_component/ClockIcon.jsx';
import CupIcon from '../components/icons_component/CupIcon.jsx';
import DeluxeIcon from '../components/icons_component/DeluxeIcon.jsx';
import PlatzkartIcon from '../components/icons_component/PlatzkartIcon.jsx';
import RocketIcon from '../components/icons_component/RocketIcon.jsx';
import SeatedCarIcon from '../components/icons_component/SeatedCarIcon.jsx';
import SleeperIcon from '../components/icons_component/SleeperIcon.jsx';
import TrainSmallIcon from '../components/icons_component/TrainSmallIcon.jsx';
import TripArrowIcon from '../components/icons_component/TripArrowIcon.jsx';
import WifiIcon from '../components/icons_component/WifiIcon.jsx';

import './SeatsPage.css';

// ============================================================================
// Компонент: LastTickets - отображает последние купленные билеты
// ============================================================================
function LastTickets({ routes }) {
  return (
    <section className="last-tickets">
      <h3>Последние билеты</h3>

      <div className="last-tickets__list">
        {routes.slice(0, 3).map((route) => {
          const departure = route.departure || {};
          const fromCity = formatCity(departure.from?.city?.name);
          const fromStation = departure.from?.railway_station_name || '';
          const toCity = formatCity(departure.to?.city?.name);
          const toStation = departure.to?.railway_station_name || '';
          const price = formatMoney(route.min_price || departure.min_price);

          const hasWifi = Boolean(route.have_wifi || departure.have_wifi);
          const isExpress = Boolean(route.is_express || departure.is_express);
          const hasComfort = Boolean(
            route.have_air_conditioning ||
              departure.have_air_conditioning ||
              route.have_first_class ||
              departure.have_first_class
          );

          return (
            <article
              key={departure._id || route._id}
              className="last-ticket-card"
            >
              <div className="last-ticket-card__top">
                <div className="last-ticket-card__route last-ticket-card__route--from">
                  <strong className="last-ticket-card__city">{fromCity}</strong>
                  <span className="last-ticket-card__station">{fromStation}</span>
                </div>

                <div className="last-ticket-card__route last-ticket-card__route--to">
                  <strong className="last-ticket-card__city">{toCity}</strong>
                  <span className="last-ticket-card__station">{toStation}</span>
                </div>
              </div>

              <div className="last-ticket-card__bottom">
                <div className="last-ticket-card__icons" aria-hidden="true">
                  {hasWifi ? (
                    <WifiIcon className="last-ticket-card__icon" />
                  ) : null}
                  {isExpress ? (
                    <RocketIcon className="last-ticket-card__icon" />
                  ) : null}
                  {hasComfort ? (
                    <CupIcon className="last-ticket-card__icon" />
                  ) : null}
                </div>

                <div className="last-ticket-card__price">
                  <span className="last-ticket-card__price-prefix">от</span>
                  <strong className="last-ticket-card__price-value">
                    {price}
                  </strong>
                  <span className="last-ticket-card__price-currency">₽</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================================
// Компонент: DirectionCard - отображает информацию о выбранном направлении
// ============================================================================
function DirectionCard({ direction, onBack }) {
  if (!direction) return null;

  return (
    <section className="seats-direction-card">
      <div className="seats-direction-card__top">
        <button
          type="button"
          className="seats-direction-card__back"
          onClick={onBack}
        >
          ←
        </button>

        <button
          type="button"
          className="seats-direction-card__change"
          onClick={onBack}
        >
          Выбрать другой поезд
        </button>
      </div>

      <div className="seats-direction-card__info">
        <div className="seats-direction-card__train">
          <TrainSmallIcon />
          <strong>{direction.train?.name || 'Поезд'}</strong>
          <span>
            {formatCity(direction.from?.city?.name)} →{' '}
            {formatCity(direction.to?.city?.name)}
          </span>
        </div>

        <div className="seats-direction-card__time">
          <div>
            <strong>{formatTime(direction.from?.datetime)}</strong>
            <span>{formatCity(direction.from?.city?.name)}</span>
            <small>{direction.from?.railway_station_name}</small>
          </div>

          <TripArrowIcon className="seats-direction-card__arrow-icon" />

          <div>
            <strong>{formatTime(direction.to?.datetime)}</strong>
            <span>{formatCity(direction.to?.city?.name)}</span>
            <small>{direction.to?.railway_station_name}</small>
          </div>

          <div className="seats-direction-card__duration">
            <ClockIcon className="seats-direction-card__clock-icon" />
            <small>{formatDuration(direction.duration)}</small>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Вспомогательные функции для работы с типами вагонов
// ============================================================================

// Возвращает метаданные типа вагона по его коду
function getCoachTypeMeta(type) {
  const map = {
    fourth: {
      key: 'fourth',
      label: 'Сидячий',
      icon: SeatedCarIcon,
    },
    third: {
      key: 'third',
      label: 'Плацкарт',
      icon: PlatzkartIcon,
    },
    second: {
      key: 'second',
      label: 'Купе',
      icon: SleeperIcon,
    },
    first: {
      key: 'first',
      label: 'Люкс',
      icon: DeluxeIcon,
    },
  };

  return map[type] || null;
}

// Получает уникальные типы вагонов из списка
function getAvailableCoachTypes(coaches) {
  const uniqueTypes = Array.from(
    new Set(coaches.map((item) => item?.coach?.class_type).filter(Boolean))
  );

  return uniqueTypes.map((type) => getCoachTypeMeta(type)).filter(Boolean);
}

// ============================================================================
// Основной компонент: SeatsPage - страница выбора мест
// ============================================================================
export default function SeatsPage() {
  const navigate = useNavigate();
  const { state, actions } = useBooking();
  const route = state.selectedRoute;

  // Состояния компонента
  const [lastRoutes, setLastRoutes] = useState([]);        // Последние маршруты для сайдбара
  const [departureCoaches, setDepartureCoaches] = useState([]); // Список вагонов
  const [isLoading, setIsLoading] = useState(true);       // Флаг загрузки
  const [error, setError] = useState('');                 // Сообщение об ошибке
  const [selectedCoachType, setSelectedCoachType] = useState(''); // Выбранный тип вагона
  const [selectedCoachId, setSelectedCoachId] = useState('');     // Выбранный ID вагона

  // Мемоизированные вычисления
  const coachTypes = useMemo(() => {
    return getAvailableCoachTypes(departureCoaches);
  }, [departureCoaches]);

  const filteredCoaches = useMemo(() => {
    return departureCoaches.filter(
      (item) => item?.coach?.class_type === selectedCoachType
    );
  }, [departureCoaches, selectedCoachType]);

  const selectedCoach = useMemo(() => {
    return (
      filteredCoaches.find((item) => item?.coach?._id === selectedCoachId) ||
      null
    );
  }, [filteredCoaches, selectedCoachId]);

  const selectedSeatItems = state.seats.departure.selectedSeats || [];
  const selectedSeatNumbers = selectedSeatItems
    .filter((seat) => seat.coachId === selectedCoachId)
    .map((seat) => seat.seatNumber);

  // Загрузка последних маршрутов при монтировании
  useEffect(() => {
    getLastRoutes()
      .then((data) => setLastRoutes(data || []))
      .catch(() => setLastRoutes([]));
  }, []);

  // Загрузка схемы вагонов при изменении маршрута
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!route?.departure?._id) return;

    let active = true;

    async function loadSeats() {
      try {
        setIsLoading(true);
        setError('');

        const departureData = await getSeats(route.departure._id);

        if (!active) return;

        setDepartureCoaches(departureData || []);
        actions.setCoaches('departure', departureData || []);

        const firstType = departureData?.[0]?.coach?.class_type || '';
        setSelectedCoachType(firstType);

        const firstCoach =
          departureData.find((item) => item?.coach?.class_type === firstType) || null;

        setSelectedCoachId(firstCoach?.coach?._id || '');
      } catch (loadError) {
        if (!active) return;
        console.error(loadError);
        setError('Не удалось загрузить информацию о местах.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadSeats();

    return () => {
      active = false;
    };
  }, [route?.departure?._id]);

  // Обработчики событий
  function handleBackToResults() {
    navigate('/search-results');
  }

  function handleSeatToggle(seat) {
    if (!selectedCoach?.coach) {
      return;
    }

    const coach = selectedCoach.coach;
    const coachType = coach.class_type;

    let price = Number(coach.price || 0);

    if (coachType === 'second') {
      price =
        seat.index % 2 === 0
          ? Number(coach.top_price || 0)
          : Number(coach.bottom_price || 0);
    }

    if (coachType === 'third') {
      if (seat.index > 32) {
        price = Number(coach.side_price || 0);
      } else {
        price =
          seat.index % 2 === 0
            ? Number(coach.top_price || 0)
            : Number(coach.bottom_price || 0);
      }
    }

    if (coachType === 'fourth') {
      price = Number(coach.top_price || coach.price || 0);
    }

    if (coachType === 'first') {
      price = Number(coach.price || 0);
    }

    actions.toggleSeat({
      direction: 'departure',
      coach,
      seat,
      price,
    });
  }

  function handleContinue() {
    navigate('/passengers');
  }

  // Ранний возврат: если маршрут не выбран
  if (!route?.departure) {
    return (
      <>
        <InnerHero step={1} />
        <section className="booking-section">
          <div className="container booking-layout">
            <div className="booking-layout__sidebar">
              <BookingSidebar
                search={state.search}
                filters={{}}
                onFilterChange={() => {}}
              />
              <LastTickets routes={lastRoutes} />
            </div>

            <div className="booking-layout__main">
              <div className="empty-card">
                Сначала выберите поезд на странице результатов.
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Основной рендер
  return (
    <>
      <InnerHero step={1} />

      <section className="booking-section">
        <div className="container booking-layout">
          {/* Левая колонка: фильтры и последние билеты */}
          <div className="booking-layout__sidebar">
            <BookingSidebar
              search={state.search}
              filters={{}}
              onFilterChange={() => {}}
            />

            <LastTickets routes={lastRoutes} />
          </div>

          {/* Правая колонка: выбор мест */}
          <div className="booking-layout__main seats-page">
            <h1 className="seats-page__title">Выбор мест</h1>

            {/* Сообщение об ошибке */}
            {error ? (
              <div className="empty-card empty-card--error">{error}</div>
            ) : null}

            {/* Индикатор загрузки */}
            {isLoading ? <div className="empty-card">Загрузка вагонов…</div> : null}

            {/* Основной контент после загрузки */}
            {!isLoading ? (
              <>
                {/* Карточка направления */}
                <DirectionCard
                  direction={route.departure}
                  onBack={handleBackToResults}
                />

                {/* Блок: Количество билетов */}
                <section className="seats-block">
                  <h2 className="seats-block__title">Количество билетов</h2>

                  <div className="ticket-counts">
                    <div className="ticket-counts__card">
                      <div className="ticket-counts__control">
                        <div className="ticket-counts__value">Взрослых — 2</div>
                      </div>

                      <p className="ticket-counts__hint">
                        Можно добавить еще 3 пассажиров
                      </p>
                    </div>

                    <div className="ticket-counts__card ticket-counts__card--accent">
                      <div className="ticket-counts__control">
                        <div className="ticket-counts__value">Детских — 1</div>
                      </div>

                      <p className="ticket-counts__hint">
                        Можно добавить еще 3 детей до 10 лет. Свое место в вагоне,
                        как у взрослых, но дешевле в среднем на 50-65%
                      </p>
                    </div>

                    <div className="ticket-counts__card">
                      <div className="ticket-counts__control">
                        <div className="ticket-counts__value">
                          Детских «без места» — 0
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Блок: Тип вагона */}
                <section className="seats-block">
                  <h2 className="seats-block__title">Тип вагона</h2>

                  <div className="coach-types">
                    {coachTypes.map((type) => {
                      const IconComponent = type.icon;
                      const isActive = selectedCoachType === type.key;

                      return (
                        <button
                          key={type.key}
                          type="button"
                          className={`coach-types__item ${isActive ? 'is-active' : ''}`}
                          onClick={() => {
                            setSelectedCoachType(type.key);

                            const firstCoachOfType =
                              departureCoaches.find(
                                (item) => item?.coach?.class_type === type.key
                              ) || null;

                            setSelectedCoachId(firstCoachOfType?.coach?._id || '');
                          }}
                        >
                          <IconComponent
                            className="coach-types__icon"
                            isActive={isActive}
                          />
                          <span className="coach-types__label">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Блок: Выбор вагона по номеру */}
                <section className="seats-block">
                  <h2 className="seats-block__title">Вагоны</h2>

                  <div className="coach-numbers">
                    {filteredCoaches.map((item) => {
                      const coach = item.coach;
                      const isActive = coach._id === selectedCoachId;

                      return (
                        <button
                          key={coach._id}
                          type="button"
                          className={`coach-numbers__item ${isActive ? 'is-active' : ''}`}
                          onClick={() => setSelectedCoachId(coach._id)}
                        >
                          {coach.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Краткая информация о выбранном вагоне */}
                  {selectedCoach ? (
                    <div className="coach-summary">
                      <div className="coach-summary__row">
                        <span className="coach-summary__label">Вагон</span>
                        <strong className="coach-summary__value">
                          {selectedCoach.coach?.name}
                        </strong>
                      </div>

                      <div className="coach-summary__row">
                        <span className="coach-summary__label">Тип</span>
                        <strong className="coach-summary__value">
                          {getCoachTypeMeta(selectedCoach.coach?.class_type)?.label ||
                            '—'}
                        </strong>
                      </div>

                      <div className="coach-summary__row">
                        <span className="coach-summary__label">Свободных мест</span>
                        <strong className="coach-summary__value">
                          {selectedCoach.coach?.available_seats ??
                            selectedCoach.coach?.avaliable_seats ??
                            selectedCoach.seats?.filter((seat) => seat.available)
                              .length ??
                            0}
                        </strong>
                      </div>
                    </div>
                  ) : null}
                </section>

                {/* Блок: Схема мест в вагоне */}
                <section className="seats-block">
                  <h2 className="seats-block__title">Места</h2>

                  {selectedCoach ? (
                    <>
                      {/* Легенда статусов мест */}
                      <div className="seat-legend">
                        <div className="seat-legend__item">
                          <span className="seat-legend__mark seat-legend__mark--available" />
                          <span>Свободные</span>
                        </div>

                        <div className="seat-legend__item">
                          <span className="seat-legend__mark seat-legend__mark--selected" />
                          <span>Выбранные</span>
                        </div>

                        <div className="seat-legend__item">
                          <span className="seat-legend__mark seat-legend__mark--unavailable" />
                          <span>Занятые</span>
                        </div>
                      </div>

                      {/* Сетка мест */}
                      <div className="seat-grid">
                        {selectedCoach.seats.map((seat) => {
                          const isSelected = selectedSeatNumbers.includes(
                            seat.index
                          );
                          const isAvailable = Boolean(seat.available);

                          return (
                            <button
                              key={seat.index}
                              type="button"
                              className={`seat-grid__item ${
                                isAvailable ? 'is-available' : 'is-unavailable'
                              } ${isSelected ? 'is-selected' : ''}`}
                              disabled={!isAvailable}
                              onClick={() => handleSeatToggle(seat)}
                            >
                              {seat.index}
                            </button>
                          );
                        })}
                      </div>

                      {/* Сводка по выбранным местам */}
                      <div className="seat-summary">
                        <span className="seat-summary__label">Выбрано мест:</span>
                        <strong className="seat-summary__value">
                          {selectedSeatNumbers.length > 0
                            ? selectedSeatNumbers.join(', ')
                            : '—'}
                        </strong>
                      </div>
                    </>
                  ) : (
                    <div className="seats-block__placeholder">
                      Сначала выберите вагон.
                    </div>
                  )}
                </section>

                {/* Кнопка перехода к пассажирам */}
                <div className="seats-page__actions">
                  <button
                    type="button"
                    className="seats-page__next-button"
                    onClick={handleContinue}
                    disabled={state.seats.departure.selectedSeats.length === 0}
                  >
                    Далее
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}