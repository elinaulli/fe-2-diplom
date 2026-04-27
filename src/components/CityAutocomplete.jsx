import { useEffect, useRef, useState } from 'react';
import { getCitySuggestions, resolveCityFromStation } from '../api/client.js';

function getInputValue(value) {
  return value?.stationLabel || value?.name || '';
}

export default function CityAutocomplete({
  value,
  onSelect,
  placeholder,
  disabled = false,
  inputClassName = '',
}) {
  const [draftValue, setDraftValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const blurTimeout = useRef(null);

  const inputValue = isEditing ? draftValue : getInputValue(value);
  const isShortQuery = inputValue.trim().length < 2;

  useEffect(() => {
    if (isShortQuery) {
      return undefined;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);

        const result = await getCitySuggestions(
          inputValue,
          controller.signal
        );

        setItems(result.items);
        setMessage(
          result.fallback ? 'Показан локальный справочник вокзалов.' : ''
        );
      } catch (error) {
        if (error.name !== 'AbortError') {
          setItems([]);
          setMessage('Не удалось загрузить подсказки.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [inputValue, isShortQuery]);

  async function handlePick(item) {
    if (item.type === 'city') {
      onSelect({
        _id: item.city._id,
        name: item.city.name,
        stationLabel: item.city.name,
      });

      setDraftValue('');
      setIsEditing(false);
      setIsOpen(false);
      setMessage('');
      return;
    }

    try {
      setIsLoading(true);

      const resolved = await resolveCityFromStation(item.station);

      if (!resolved) {
        throw new Error('Не удалось определить город в API.');
      }

      onSelect({
        _id: resolved._id,
        name: resolved.name,
        stationName: item.station.name,
        stationLabel: item.label,
      });

      setDraftValue('');
      setIsEditing(false);
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      setMessage(error.message || 'Не удалось выбрать город.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const nextValue = event.target.value;

    setDraftValue(nextValue);
    setIsEditing(true);
    setIsOpen(true);

    if (nextValue.trim().length < 2) {
      setItems([]);
      setMessage('');
    }

    onSelect(null);
  }

  function handleFocus() {
    setIsEditing(true);
    setIsOpen(true);
  }

  function handleBlur() {
    blurTimeout.current = window.setTimeout(() => {
      setIsOpen(false);

      if (!value) {
        setDraftValue('');
        setIsEditing(false);
        return;
      }

      setDraftValue('');
      setIsEditing(false);
    }, 120);
  }

  const visibleItems = isShortQuery ? [] : items;
  const visibleMessage = isShortQuery ? '' : message;

  return (
    <div className="autocomplete">
      <input
        className={inputClassName}
        value={inputValue}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        disabled={disabled}
      />

      {isLoading ? (
        <span className="autocomplete__hint">Загрузка…</span>
      ) : null}

      {visibleMessage ? (
        <span className="autocomplete__hint">{visibleMessage}</span>
      ) : null}

      {isOpen && visibleItems.length > 0 ? (
        <div className="autocomplete__dropdown">
          {visibleItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className="autocomplete__option"
              onMouseDown={() => {
                window.clearTimeout(blurTimeout.current);
                handlePick(item);
              }}
            >
              <span>{item.label}</span>
              <small>{item.subtitle}</small>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}