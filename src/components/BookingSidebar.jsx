import { useState } from 'react';
import './BookingSidebar.css';
import CalendarIcon from './icons_component/CalendarIcon.jsx';
import PlusIcon from './icons_component/PlusIcon.jsx';
import MinusIcon from './icons_component/MinusIcon.jsx';
import DoubleRange from './DoubleRange.jsx';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`booking-sidebar__toggle ${checked ? 'is-active' : ''}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span className="booking-sidebar__toggle-thumb" />
    </button>
  );
}

function SectionHeader({ title, isOpen, onToggle, direction }) {
  return (
    <button
      type="button"
      className="booking-sidebar__section-header"
      onClick={onToggle}
    >
      <span className="booking-sidebar__section-left">
        <span className="booking-sidebar__direction-badge">
          {direction === 'departure' ? '→' : '←'}
        </span>
        <span>{title}</span>
      </span>

      {isOpen ? (
        <MinusIcon className="booking-sidebar__section-icon" />
      ) : (
        <PlusIcon className="booking-sidebar__section-icon" />
      )}
    </button>
  );
}

const toggleItems = [
  { key: 'have_second_class', label: 'Купе', icon: '▣' },
  { key: 'have_third_class', label: 'Плацкарт', icon: '▤' },
  { key: 'have_fourth_class', label: 'Сидячий', icon: '◰' },
  { key: 'have_first_class', label: 'Люкс', icon: '★' },
  { key: 'have_wifi', label: 'Wi-Fi', icon: '◔' },
  { key: 'have_express', label: 'Экспресс', icon: '✦' },
];

export default function BookingSidebar({
  search,
  filters,
  onFilterChange,
}) {
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [isArrivalOpen, setIsArrivalOpen] = useState(false);

  const dateStart = search?.dateStart || '';
  const dateEnd = search?.dateEnd || '';

  return (
    <aside className="booking-sidebar">
      <section className="booking-sidebar__panel">
        <div className="booking-sidebar__block">
          <h3 className="booking-sidebar__title">Дата поездки</h3>

          <label className="booking-sidebar__field">
            <input
              type="date"
              value={dateStart}
              onChange={(event) =>
                onFilterChange('dateStart', event.target.value, 'search')
              }
            />
            <CalendarIcon className="booking-sidebar__field-icon" />
          </label>
        </div>

        <div className="booking-sidebar__block">
          <h3 className="booking-sidebar__title">Дата возвращения</h3>

          <label className="booking-sidebar__field">
            <input
              type="date"
              value={dateEnd}
              onChange={(event) =>
                onFilterChange('dateEnd', event.target.value, 'search')
              }
            />
            <CalendarIcon className="booking-sidebar__field-icon" />
          </label>
        </div>

        <div className="booking-sidebar__divider" />

        <div className="booking-sidebar__toggles">
          {toggleItems.map((item) => (
            <div key={item.key} className="booking-sidebar__toggle-row">
              <div className="booking-sidebar__toggle-label">
                <span
                  className="booking-sidebar__toggle-icon"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <Toggle
                checked={Boolean(filters[item.key])}
                onChange={(value) => onFilterChange(item.key, value)}
              />
            </div>
          ))}
        </div>

        <div className="booking-sidebar__divider" />

        <div className="booking-sidebar__block">
          <h3 className="booking-sidebar__title">Стоимость</h3>

          <DoubleRange
            min={0}
            max={7000}
            step={10}
            from={Number(filters.price_from || 1920)}
            to={Number(filters.price_to || 4500)}
            onFromChange={(value) => onFilterChange('price_from', value)}
            onToChange={(value) => onFilterChange('price_to', value)}
            leftLabel={String(filters.price_from || 1920)}
            middleLabel={String(filters.price_to || 4500)}
            rightLabel="7000"
          />
        </div>

        <div className="booking-sidebar__divider" />

        <div className="booking-sidebar__section">
          <SectionHeader
            title="Туда"
            direction="departure"
            isOpen={isDepartureOpen}
            onToggle={() => setIsDepartureOpen((prev) => !prev)}
          />

          {isDepartureOpen ? (
            <div className="booking-sidebar__section-content">
              <div className="booking-sidebar__time-group">
                <h4>Время отбытия</h4>
                <DoubleRange
                  min={0}
                  max={24}
                  step={1}
                  from={Number(filters.start_departure_hour_from || 0)}
                  to={Number(filters.start_departure_hour_to || 11)}
                  onFromChange={(value) =>
                    onFilterChange('start_departure_hour_from', value)
                  }
                  onToChange={(value) =>
                    onFilterChange('start_departure_hour_to', value)
                  }
                  leftLabel={`${filters.start_departure_hour_from || 0}:00`}
                  middleLabel={`${filters.start_departure_hour_to || 11}:00`}
                  rightLabel="24:00"
                />
              </div>

              <div className="booking-sidebar__time-group">
                <h4>Время прибытия</h4>
                <DoubleRange
                  min={0}
                  max={24}
                  step={1}
                  from={Number(filters.start_arrival_hour_from || 5)}
                  to={Number(filters.start_arrival_hour_to || 11)}
                  onFromChange={(value) =>
                    onFilterChange('start_arrival_hour_from', value)
                  }
                  onToChange={(value) =>
                    onFilterChange('start_arrival_hour_to', value)
                  }
                  leftLabel={`${filters.start_arrival_hour_from || 5}:00`}
                  middleLabel={`${filters.start_arrival_hour_to || 11}:00`}
                  rightLabel="24:00"
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="booking-sidebar__divider" />

        <div className="booking-sidebar__section">
          <SectionHeader
            title="Обратно"
            direction="arrival"
            isOpen={isArrivalOpen}
            onToggle={() => setIsArrivalOpen((prev) => !prev)}
          />

          {isArrivalOpen ? (
            <div className="booking-sidebar__section-content">
              <div className="booking-sidebar__time-group">
                <h4>Время отбытия</h4>
                <DoubleRange
                  min={0}
                  max={24}
                  step={1}
                  from={Number(filters.end_departure_hour_from || 0)}
                  to={Number(filters.end_departure_hour_to || 11)}
                  onFromChange={(value) =>
                    onFilterChange('end_departure_hour_from', value)
                  }
                  onToChange={(value) =>
                    onFilterChange('end_departure_hour_to', value)
                  }
                  leftLabel={`${filters.end_departure_hour_from || 0}:00`}
                  middleLabel={`${filters.end_departure_hour_to || 11}:00`}
                  rightLabel="24:00"
                />
              </div>

              <div className="booking-sidebar__time-group">
                <h4>Время прибытия</h4>
                <DoubleRange
                  min={0}
                  max={24}
                  step={1}
                  from={Number(filters.end_arrival_hour_from || 5)}
                  to={Number(filters.end_arrival_hour_to || 11)}
                  onFromChange={(value) =>
                    onFilterChange('end_arrival_hour_from', value)
                  }
                  onToChange={(value) =>
                    onFilterChange('end_arrival_hour_to', value)
                  }
                  leftLabel={`${filters.end_arrival_hour_from || 5}:00`}
                  middleLabel={`${filters.end_arrival_hour_to || 11}:00`}
                  rightLabel="24:00"
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </aside>
  );
}