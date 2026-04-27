export default function WifiIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      ariaHidden="true"
    >
      <path
        d="M2 9.5C7.5 4.8 16.5 4.8 22 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5.5 13C9 10.1 15 10.1 18.5 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 16.5C10.8 15.2 13.2 15.2 15 16.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}