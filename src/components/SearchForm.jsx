import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/useBooking.js';
import CityAutocomplete from './CityAutocomplete.jsx';
import './SearchForm.css';
import LocationIcon from './icons_component/LocationIcon.jsx';
import CalendarIcon from './icons_component/CalendarIcon.jsx';
import SwapIcon from './icons_component/SwapIcon.jsx';

const initialForm = {
  fromCity: null,
  toCity: null,
  dateStart: '',
  dateEnd: '',
};

function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function SearchForm({ onLoadingChange, onProgressChange }) {
  const navigate = useNavigate();
  const { actions } = useBooking();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const intervalRef = useRef(null);
  const finishTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const navigateTimeoutRef = useRef(null);

  const today = getTodayLocalDate();

  function clearLoadingTimers() {
    clearInterval(intervalRef.current);
    clearTimeout(finishTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
    clearTimeout(navigateTimeoutRef.current);
  }

  useEffect(() => {
    return () => {
      clearLoadingTimers();
    };
  }, []);

  function setExternalLoading(value) {
    onLoadingChange?.(value);
  }

  function setExternalProgress(value) {
    onProgressChange?.(value);
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.fromCity?.name?.trim()) {
      nextErrors.fromCity = 'Укажите город отправления';
    }

    if (!form.toCity?.name?.trim()) {
      nextErrors.toCity = 'Укажите город прибытия';
    }

    if (
      form.fromCity?.name &&
      form.toCity?.name &&
      form.fromCity.name.trim().toLowerCase() === form.toCity.name.trim().toLowerCase()
    ) {
      nextErrors.toCity = 'Город прибытия должен отличаться от города отправления';
    }

    if (!form.dateStart) {
      nextErrors.dateStart = 'Выберите дату отправления';
    }

    if (form.dateStart && form.dateEnd && form.dateEnd < form.dateStart) {
      nextErrors.dateEnd = 'Дата возвращения не может быть раньше даты отправления';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function startLoading() {
    clearLoadingTimers();
    setIsLoading(true);
    setExternalLoading(true);
    setExternalProgress(0);

    let currentProgress = 0;

    intervalRef.current = setInterval(() => {
      if (currentProgress >= 88) {
        return;
      }

      const increment = Math.floor(Math.random() * 12) + 4;
      currentProgress += increment;

      if (currentProgress > 88) {
        currentProgress = 88;
      }

      setExternalProgress(currentProgress);
    }, 140);

    finishTimeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setExternalProgress(100);

      hideTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setExternalLoading(false);
        setExternalProgress(0);
      }, 350);
    }, 2200);

    navigateTimeoutRef.current = setTimeout(() => {
      navigate('/search-results');
    }, 2400);
  }

  function handleCitySelect(field, city) {
    setForm((prev) => ({
      ...prev,
      [field]: city,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }

    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: '',
      }));
    }
  }

  function handleDateChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: '',
      }));
    }
  }

  function handleSwapDirections() {
    setForm((prev) => ({
      ...prev,
      fromCity: prev.toCity,
      toCity: prev.fromCity,
    }));

    setErrors((prev) => ({
      ...prev,
      fromCity: '',
      toCity: '',
      submit: '',
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      actions.setSearch({
        fromCity: form.fromCity,
        toCity: form.toCity,
        dateStart: form.dateStart,
        dateEnd: form.dateEnd,
      });

      startLoading();
    } catch (error) {
      console.error('Ошибка поиска:', error);
      clearLoadingTimers();
      setIsLoading(false);
      setExternalLoading(false);
      setExternalProgress(0);
      setErrors({
        submit: 'Произошла ошибка при поиске. Попробуйте позже.',
      });
    }
  }

  return (
    <form className="search-form search-form--hero" onSubmit={handleSubmit}>
      <div className="search-form__section">
        <h2 className="search-form__section-title">Направление</h2>

        <div className="search-form__route-row">
          <label className="search-form__field">
            <span className="search-form__sr-only">Откуда</span>
           <CityAutocomplete
  value={form.fromCity}
  onSelect={(city) => handleCitySelect('fromCity', city)}
  placeholder="Откуда"
  disabled={isLoading}
  inputClassName="search-form__input search-form__input--autocomplete"
/>
            <LocationIcon className="search-form__location-icon" />
          </label>

          <button
            type="button"
            className="search-form__swap"
            onClick={handleSwapDirections}
            disabled={isLoading}
            aria-label="Поменять местами города отправления и прибытия"
          >
            <SwapIcon className="search-form__swap-icon" />
          </button>

          <label className="search-form__field">
            <span className="search-form__sr-only">Куда</span>
           <CityAutocomplete
  value={form.toCity}
  onSelect={(city) => handleCitySelect('toCity', city)}
  placeholder="Куда"
  disabled={isLoading}
  inputClassName="search-form__input search-form__input--autocomplete"
/>
            <LocationIcon className="search-form__location-icon" />
          </label>
        </div>

        {errors.fromCity || errors.toCity ? (
          <div className="search-form__errors-row">
            <span className="search-form__error-text">
              {errors.fromCity || ''}
            </span>
            <span className="search-form__error-text">
              {errors.toCity || ''}
            </span>
          </div>
        ) : null}
      </div>

      <div className="search-form__section">
        <h2 className="search-form__section-title">Дата</h2>

        <div className="search-form__date-row">
          <label className="search-form__field">
            <span className="search-form__sr-only">Дата туда</span>
            <input
              name="dateStart"
              type="date"
              className={`search-form__input ${
                errors.dateStart ? 'search-form__input--error' : ''
              }`}
              value={form.dateStart}
              onChange={handleDateChange}
              disabled={isLoading}
              min={today}
            />
            <CalendarIcon className="search-form__calendar-icon" />
          </label>

          <label className="search-form__field">
            <span className="search-form__sr-only">Дата обратно</span>
            <input
              name="dateEnd"
              type="date"
              className={`search-form__input ${
                errors.dateEnd ? 'search-form__input--error' : ''
              }`}
              value={form.dateEnd}
              onChange={handleDateChange}
              disabled={isLoading}
              min={form.dateStart || today}
            />
            <CalendarIcon className="search-form__calendar-icon" />
          </label>
        </div>

        {errors.dateStart || errors.dateEnd ? (
          <div className="search-form__errors-row">
            <span className="search-form__error-text">
              {errors.dateStart || ''}
            </span>
            <span className="search-form__error-text">
              {errors.dateEnd || ''}
            </span>
          </div>
        ) : null}
      </div>

      {errors.submit ? (
        <div className="search-form__error search-form__error--submit">
          {errors.submit}
        </div>
      ) : null}

      <div className="search-form__submit-row">
        <button
          type="submit"
          className="search-form__submit"
          disabled={isLoading}
        >
          {isLoading ? 'ПОИСК...' : 'НАЙТИ БИЛЕТЫ'}
        </button>
      </div>
    </form>
  );
}