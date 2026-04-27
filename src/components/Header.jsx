import { Link } from 'react-router-dom';
import './Header.css';

const navItems = [
  { href: '#about', label: 'О нас' },
  { href: '#how', label: 'Как это работает' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contacts', label: 'Контакты' },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__top">
        <div className="container">
          <Link className="site-header__logo" to="/" aria-label="На главную">
            Лого
          </Link>
        </div>
      </div>

      <div className="site-header__nav-row">
        <div className="container">
          <nav className="site-header__nav" aria-label="Основное меню">
            {navItems.map((item) => (
              <a key={item.href} className="site-header__link" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}