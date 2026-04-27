import './Footer.css';
import { useRef, useState } from 'react';
import { subscribeToNews } from '../api/client.js';

// Импорт иконок
import youtubeIcon from '../assets/icons/youtube.png';
import linkedinIcon from '../assets/icons/linkedin.png';
import googleIcon from '../assets/icons/googlePlus.png';
import facebookIcon from '../assets/icons/facebook.png';
import twitterIcon from '../assets/icons/twitter.png';

const socialItems = [
  { name: 'YouTube', icon: youtubeIcon },
  { name: 'LinkedIn', icon: linkedinIcon },
  { name: 'Google+', icon: googleIcon },
  { name: 'Facebook', icon: facebookIcon },
  { name: 'Twitter', icon: twitterIcon },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus({
        type: 'error',
        message: 'Введите e-mail для подписки.',
      });
      inputRef.current?.focus();
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setStatus({
        type: 'error',
        message: 'Введите корректный e-mail адрес.',
      });
      inputRef.current?.focus();
      return;
    }

    setIsSending(true);
    setStatus({ type: '', message: '' });

    try {
      await subscribeToNews(trimmedEmail);

      setStatus({
        type: 'success',
        message: 'Спасибо! Вы подписаны на новости.',
      });

      setEmail('');
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error?.message === 'Подписка недоступна: 404'
            ? 'Сервис подписки временно недоступен.'
            : error?.message || 'Не удалось отправить форму. Попробуйте позже.',
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <footer className="site-footer" id="contacts">
      <div className="container site-footer__grid">
        <section>
          <h3>Свяжитесь с нами</h3>

          <ul className="footer-list">
            <li>8 (800) 000 00 00</li>
            <li>inbox@mail.ru</li>
            <li>tu.train.tickets</li>
            <li>г. Москва, ул. Московская 27-35, 555 555</li>
          </ul>
        </section>

        <section>
          <h3>Подписка</h3>
          <p className="footer-muted">Будьте в курсе событий</p>

          <form className="footer-subscribe" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="email"
              className="footer-subscribe__input"
              placeholder="e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSending}
              aria-invalid={status.type === 'error'}
              aria-describedby={status.message ? 'subscribe-status' : undefined}
            />

            <button
              type="submit"
              className="footer-subscribe__button"
              disabled={isSending}
            >
              {isSending ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ'}
            </button>
          </form>

          {status.message ? (
            <p
              id="subscribe-status"
              className={`footer-status footer-status--${status.type}`}
              role={status.type === 'error' ? 'alert' : 'status'}
            >
              {status.message}
            </p>
          ) : null}

          <h3 className="site-footer__social-title">Подписывайтесь на нас</h3>

          <div className="footer-social">
            {socialItems.map((item) => (
              <a 
                key={item.name} 
                href="#" 
                className="footer-social__link"
                aria-label={item.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img 
                  src={item.icon} 
                  alt={item.name}
                  className="footer-social__icon"
                />
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="site-footer__bottom container">
        <span className="site-logo">Лого</span>

        <a href="#top" className="site-footer__up" aria-label="Наверх">
          ↑
        </a>

        <span>2018 WEB</span>
      </div>
    </footer>
  );
}