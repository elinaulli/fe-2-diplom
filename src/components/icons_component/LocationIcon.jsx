export default function LocationIcon({className = ''}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      ariaHidden="true"
    >
      <path
        d="M12 22s7-7.33 7-12a7 7 0 1 0-14 0c0 4.67 7 12 7 12Z"
        fill="currentColor"
      />
      <circle cx="12" cy="10" r="2.8" fill="#ffffff" />
    </svg>
  );
}
