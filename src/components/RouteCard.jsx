import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSeats } from '../api/client.js';
import { useBooking } from '../context/useBooking.js';
import {
  formatCity,
  formatDuration,
  formatMoney,
  formatTime,
  getCoachTypeLabel,
} from '../utils/format.js';
import TripArrowIcon from '../components/icons_component/TripArrowIcon.jsx';
import TrainIcon from '../components/icons_component/TrainIcon.jsx';
import WifiIcon from '../components/icons_component/WifiIcon.jsx';
import RocketIcon from '../components/icons_component/RocketIcon.jsx';
import CupIcon from '../components/icons_component/CupIcon.jsx';
import './RouteCard.css';

function getSeatBreakdownFromMock(info, type) {
  return info?.seat_breakdown?.[type] || null;
}

function buildBreakdownFromCoaches(coaches) {
  const result = {
    second: { top: 0, bottom: 0 },
    third: { top: 0, bottom: 0, side: 0 },
    fourth: { seats: 0 },
  };

  coaches.forEach((item) => {
    const coach = item?.coach || {};
    const classType = coach?.class_type || null;
    const seats = Array.isArray(item?.seats) ? item.seats : [];

    if (classType === 'fourth') {
      result.fourth.seats += seats.filter((seat) => seat?.available).length;
      return;
    }

    seats.forEach((seat) => {
      if (!seat?.available) return;

      const seatIndex = Number(seat?.index) || 0;
      if (!seatIndex) return;

      if (classType === 'second') {
        if (seatIndex % 2 === 0) {
          result.second.top += 1;
        } else {
          result.second.bottom += 1;
        }
      }

      if (classType === 'third') {
        if (seatIndex > 32) {
          result.third.side += 1;
        } else if (seatIndex % 2 === 0) {
          result.third.top += 1;
        } else {
          result.third.bottom += 1;
        }
      }
    });
  });

  return result;
}

function BreakdownPopup({ type, breakdown, priceInfo, isLoading }) {
  if (isLoading) {
    return <div className="route-card__popup-empty">Загрузка...</div>;
  }

  if (!breakdown) {
    return <div className="route-card__popup-empty">Нет детализации мест</div>;
  }

  if (type === 'fourth') {
    return (
      <div className="route-card__popup-row">
        <span>места</span>
        <strong>{breakdown.seats || 0}</strong>
        <span className="route-card__popup-price">
          {formatMoney(
            priceInfo?.price ||
              priceInfo?.top_price ||
              priceInfo?.bottom_price ||
              0
          )}{' '}
          ₽
        </span>
      </div>
    );
  }

  if (type === 'second') {
    return (
      <>
        <div className="route-card__popup-row">
          <span>верхние</span>
          <strong>{breakdown.top || 0}</strong>
          <span className="route-card__popup-price">
            {formatMoney(priceInfo?.top_price || 0)} ₽
          </span>
        </div>

        <div className="route-card__popup-row">
          <span>нижние</span>
          <strong>{breakdown.bottom || 0}</strong>
          <span className="route-card__popup-price">
            {formatMoney(priceInfo?.bottom_price || 0)} ₽
          </span>
        </div>
      </>
    );
  }

  if (type === 'third') {
    return (
      <>
        <div className="route-card__popup-row">
          <span>верхние</span>
          <strong>{breakdown.top || 0}</strong>
          <span className="route-card__popup-price">
            {formatMoney(priceInfo?.top_price || 0)} ₽
          </span>
        </div>

        <div className="route-card__popup-row">
          <span>нижние</span>
          <strong>{breakdown.bottom || 0}</strong>
          <span className="route-card__popup-price">
            {formatMoney(priceInfo?.bottom_price || 0)} ₽
          </span>
        </div>

        {!!breakdown.side && (
          <div className="route-card__popup-row">
            <span>боковые</span>
            <strong>{breakdown.side || 0}</strong>
            <span className="route-card__popup-price">
              {formatMoney(priceInfo?.side_price || 0)} ₽
            </span>
          </div>
        )}
      </>
    );
  }

  return <div className="route-card__popup-empty">Нет детализации мест</div>;
}
function PriceList({ info }) {
  const [openedType, setOpenedType] = useState(null);
  const [breakdowns, setBreakdowns] = useState({});
  const [loadingType, setLoadingType] = useState('');

  const items = useMemo(() => {
    const seatsInfo = info?.available_seats_info ?? info?.seats_info ?? {};
    const priceInfo = info?.price_info ?? {};

    return [
      ['fourth', priceInfo.fourth ?? null, seatsInfo.fourth ?? 0],
      ['third', priceInfo.third ?? null, seatsInfo.third ?? 0],
      ['second', priceInfo.second ?? null, seatsInfo.second ?? 0],
      ['first', priceInfo.first ?? null, seatsInfo.first ?? 0],
    ].filter(([type, price, seats]) => {
      const hasCoach =
        Boolean(price) ||
        Number(seats) > 0 ||
        info?.[`have_${type}_class`];

      return hasCoach;
    });
  }, [info]);

  async function handleSeatsClick(type) {
  const canOpenPopup =
  type === 'second' || type === 'third' || type === 'fourth';
const coaches = await getSeats(info._id);
console.log('GET SEATS RESPONSE', coaches);
    if (!canOpenPopup) {
      return;
    }

    if (openedType === type) {
      setOpenedType(null);
      return;
    }

    const mockBreakdown = getSeatBreakdownFromMock(info, type);

    if (mockBreakdown) {
      setBreakdowns((prev) => ({
        ...prev,
        [type]: mockBreakdown,
      }));
      setOpenedType(type);
      return;
    }

    if (breakdowns[type]) {
      setOpenedType(type);
      return;
    }

    if (!info?._id) {
      setOpenedType(type);
      return;
    }

    try {
      setLoadingType(type);

      const coaches = await getSeats(info._id);
      const aggregated = buildBreakdownFromCoaches(coaches);

   setBreakdowns((prev) => ({
  ...prev,
  second: aggregated.second,
  third: aggregated.third,
  fourth: aggregated.fourth,
}));

      setOpenedType(type);
    } catch (error) {
      console.error('Не удалось загрузить детализацию мест:', error);
      setOpenedType(type);
    } finally {
      setLoadingType('');
    }
  }

  return (
    <div className="route-card__prices">
      {items.map(([type, price, seats]) => {
        const values = Object.values(price || {}).filter(Boolean);
        const minPrice = values.length ? Math.min(...values) : 0;
        const isPopupType = type === 'second' || type === 'third';

        return (
          <div key={type} className="route-card__price-item">
            <div className="route-card__price-row">
              <span className="route-card__price-type">
                {getCoachTypeLabel(type)}
              </span>

              <button
                type="button"
                className="route-card__seats-button"
                onClick={() => handleSeatsClick(type)}
                disabled={!isPopupType}
              >
                {seats}
              </button>

              <span className="route-card__from-label">от</span>

              <strong className="route-card__price-value">
                {formatMoney(minPrice)}
              </strong>

              <strong className="route-card__price-value-currency">₽</strong>
            </div>

            {openedType === type ? (
              <div className="route-card__popup">
                <BreakdownPopup
                  type={type}
                  breakdown={breakdowns[type]}
                  priceInfo={price}
                  isLoading={loadingType === type}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DirectionLine({ info, reversed = false }) {
  if (!info) return null;

  return (
    <div className="route-card__line">
      <div>
        <strong>{formatTime(info.from?.datetime)}</strong>
        <span>{formatCity(info.from?.city?.name)}</span>
        <small>{info.from?.railway_station_name}</small>
      </div>

      {/* <div className="route-card__center">
        <span>{formatDuration(info.duration)}</span>
        <div className={`route-card__arrow ${reversed ? 'is-reversed' : ''}`} />
      </div> */}
      <div className="route-card__center">
  <span>{formatDuration(info.duration)}</span>

  <TripArrowIcon
    className={`route-card__arrow-icon ${reversed ? 'is-reversed' : ''}`}
  />
</div>
      <div>
        <strong>{formatTime(info.to?.datetime)}</strong>
        <span>{formatCity(info.to?.city?.name)}</span>
        <small>{info.to?.railway_station_name}</small>
      </div>
    </div>
  );
}

export default function RouteCard({ route, onSelect }) {
  const navigate = useNavigate();
  const { actions } = useBooking();

  function handleSelect() {
    actions.setRoute(route);

    if (onSelect) {
      onSelect(route);
      return;
    }

    navigate('/seats');
  }

  const departure = route?.departure;
  const arrival = route?.arrival;

  const hasWifi = Boolean(route?.have_wifi || departure?.have_wifi);
  const isExpress = Boolean(route?.is_express || departure?.is_express);
  const hasComfort = Boolean(
    route?.have_air_conditioning ||
      departure?.have_air_conditioning ||
      route?.have_first_class ||
      departure?.have_first_class
  );

  return (
    <article className="route-card">
      <div className="route-card__train-block">
        <div className="route-card__train-icon">
          <TrainIcon className="route-card__train-svg" />
        </div>

        <strong>{departure?.train?.name || 'Маршрут'}</strong>

        <span>
          {formatCity(departure?.from?.city?.name)} →{' '}
          {formatCity(departure?.to?.city?.name)}
        </span>
      </div>

      <div className="route-card__main">
        <DirectionLine info={departure} />
        {arrival ? <DirectionLine info={arrival} reversed /> : null}
      </div>

      <div className="route-card__aside">
        <PriceList info={departure} />

        <div className="route-card__services" aria-hidden="true">
          {hasWifi ? <WifiIcon className="route-card__service-icon" /> : null}
          {isExpress ? <RocketIcon className="route-card__service-icon" /> : null}
          {hasComfort ? <CupIcon className="route-card__service-icon" /> : null}
        </div>

        <button
          type="button"
          className="accent-button accent-button--small route-card__button"
          onClick={handleSelect}
        >
          Выбрать места
        </button>
      </div>
    </article>
  );
}