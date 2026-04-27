import './SearchLoadingBar.css';

export default function SearchLoadingBar({ isVisible, progress }) {
  return (
    <div
      className={`hero-search-progress ${
        isVisible ? 'hero-search-progress--visible' : ''
      }`}
      aria-hidden="true"
    >
      <div
        className="hero-search-progress__bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}