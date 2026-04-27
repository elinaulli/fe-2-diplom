import './ProgressSteps.css';

const steps = [
  { key: 'tickets', label: 'Билеты' },
  { key: 'passengers', label: 'Пассажиры' },
  { key: 'payment', label: 'Оплата' },
  { key: 'check', label: 'Проверка' },
];

export default function ProgressSteps({ currentStep = 1 }) {
  return (
    <div className="progress-steps" aria-label="Этапы оформления">
      {steps.map((step, index) => {
        let status = 'pending';

        if (index + 1 < currentStep) {
          status = 'done';
        } else if (index + 1 === currentStep) {
          status = 'active';
        }

        return (
          <div
            key={step.key}
            className={`progress-steps__item progress-steps__item--${status}`}
          >
            <span className="progress-steps__number">{index + 1}</span>
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}