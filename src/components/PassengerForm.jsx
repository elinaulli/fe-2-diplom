export default function PassengerForm({ title, value, onChange }) {
  return (
    <article className="form-card">
      <div className="form-card__header">
        <h3>{title}</h3>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Тип билета</span>
          <select value={value.ticketType} onChange={(event) => onChange({ ticketType: event.target.value })}>
            <option value="adult">Взрослый</option>
            <option value="child">Детский</option>
          </select>
        </label>

        <div className="field field--full field-row-3">
          <label className="field">
            <span>Фамилия</span>
            <input value={value.last_name} onChange={(event) => onChange({ last_name: event.target.value })} />
          </label>
          <label className="field">
            <span>Имя</span>
            <input value={value.first_name} onChange={(event) => onChange({ first_name: event.target.value })} />
          </label>
          <label className="field">
            <span>Отчество</span>
            <input value={value.patronymic} onChange={(event) => onChange({ patronymic: event.target.value })} />
          </label>
        </div>

        <label className="field">
          <span>Пол</span>
          <div className="gender-switch">
            <button
              type="button"
              className={value.gender === 'male' ? 'gender-switch__item is-active' : 'gender-switch__item'}
              onClick={() => onChange({ gender: 'male' })}
            >
              М
            </button>
            <button
              type="button"
              className={value.gender === 'female' ? 'gender-switch__item is-active' : 'gender-switch__item'}
              onClick={() => onChange({ gender: 'female' })}
            >
              Ж
            </button>
          </div>
        </label>

        <label className="field">
          <span>Дата рождения</span>
          <input type="date" value={value.birthday} onChange={(event) => onChange({ birthday: event.target.value })} />
        </label>

        <label className="field field--full check-field">
          <input
            type="checkbox"
            checked={value.limited_mobility}
            onChange={(event) => onChange({ limited_mobility: event.target.checked })}
          />
          <span>ограниченная подвижность</span>
        </label>

        <label className="field">
          <span>Тип документа</span>
          <select value={value.document_type} onChange={(event) => onChange({ document_type: event.target.value })}>
            <option value="passport">Паспорт РФ</option>
            <option value="birth">Свидетельство о рождении</option>
          </select>
        </label>

        <label className="field">
          <span>Номер документа</span>
          <input value={value.document_data} onChange={(event) => onChange({ document_data: event.target.value })} />
        </label>
      </div>
    </article>
  );
}
