export default function TrainIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      ariaHidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="18" y="10" width="28" height="32" rx="8" />
        <rect x="23" y="16" width="7" height="8" rx="1.5" />
        <rect x="34" y="16" width="7" height="8" rx="1.5" />
        <path d="M18 30h28" />
        <path d="M24 42l-6 10" />
        <path d="M40 42l6 10" />
        <path d="M24 52h16" />
        <circle cx="25" cy="35" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="39" cy="35" r="1.5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}