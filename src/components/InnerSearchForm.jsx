import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/useBooking.js';
import CityAutocomplete from './CityAutocomplete.jsx';
import './InnerSearchForm.css';
import CalendarIcon from './icons_component/CalendarIcon.jsx';
import LocationIcon from './icons_component/LocationIcon.jsx';
import SwapIcon from './icons_component/SwapIcon.jsx';


function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function InnerSearchForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, actions } = useBooking();

  const [fromCity, setFromCity] = useState(state.search.fromCity || null);
  const [toCity, setToCity] = useState(state.search.toCity || null);
  const [dateStart, setDateStart] = useState(state.search.dateStart || '');
  const [dateEnd, setDateEnd] = useState(state.search.dateEnd || '');
  const [error, setError] = useState('');

  const today = getTodayLocalDate();

  function handleSwap() {
    setFromCity(toCity);
    setToCity(fromCity);
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!fromCity?._id) {
      setError('Выберите город отправления из подсказок.');
      return;
    }

    if (!toCity?._id) {
      setError('Выберите город прибытия из подсказок.');
      return;
    }

    if (!dateStart) {
      setError('Выберите дату отправления.');
      return;
    }

    if (dateEnd && dateEnd < dateStart) {
      setError('Дата возвращения не может быть раньше даты отправления.');
      return;
    }

    setError('');

    actions.setSearch({
      fromCity,
      toCity,
      dateStart,
      dateEnd,
    });

    if (location.pathname !== '/search-results') {
      navigate('/search-results');
    }
  }

  return (
    <form className="inner-search-form" onSubmit={handleSubmit}>
      <div className="inner-search-form__grid">
        <div className="inner-search-form__group">
          <h2 className="inner-search-form__title">Направление</h2>

          <div className="inner-search-form__route-row">
            <div className="inner-search-form__autocomplete">
         <CityAutocomplete
    value={fromCity}
    onSelect={(city) => {
      setFromCity(city);
      setError('');
    }}
    placeholder="Откуда"
    inputClassName="inner-search-form__input inner-search-form__input--autocomplete"
  />
              <LocationIcon className='inner-search-form__field-icon'/>
            </div>

            <button
              type="button"
              className="inner-search-form__swap"
              onClick={handleSwap}
              aria-label="Поменять местами города"
            >
              <SwapIcon className='inner-search-form__swap-icon'/>
            </button>

            <div className="inner-search-form__autocomplete">
             <CityAutocomplete
    value={toCity}
    onSelect={(city) => {
      setToCity(city);
      setError('');
    }}
    placeholder="Куда"
    inputClassName="inner-search-form__input inner-search-form__input--autocomplete"
  />
              <LocationIcon className='inner-search-form__field-icon'/>
            </div>
          </div>
        </div>

        <div className="inner-search-form__group">
          <h2 className="inner-search-form__title">Дата</h2>

          <div className="inner-search-form__date-row">
            <label className="inner-search-form__field">
              <span className="inner-search-form__sr-only">Дата туда</span>
              <input
                name="dateStart"
                type="date"
                className="inner-search-form__input"
                value={dateStart}
                onChange={(event) => {
                  setDateStart(event.target.value);
                  setError('');
                }}
                min={today}
              />
              <CalendarIcon className='inner-search-form__field-icon' />
            </label>

            <label className="inner-search-form__field">
              <span className="inner-search-form__sr-only">Дата обратно</span>
              <input
                name="dateEnd"
                type="date"
                className="inner-search-form__input"
                value={dateEnd}
                onChange={(event) => {
                  setDateEnd(event.target.value);
                  setError('');
                }}
                min={dateStart || today}
              />
              <CalendarIcon />
            </label>
          </div>

          <div className="inner-search-form__submit-row">
            <button type="submit" className="inner-search-form__submit">
              НАЙТИ БИЛЕТЫ
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="inner-search-form__error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}