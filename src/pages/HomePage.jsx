import { useState } from 'react';
import SearchForm from '../components/SearchForm.jsx';
import SearchLoadingBar from '../components/SearchLoadingBar.jsx';
import iconMonitor from '../assets/icons/monitor.png';
import iconGlobe from '../assets/icons/globe.png';
import iconOffice from '../assets/icons/office.png';
import womanIcon from '../assets/icons/woman.png';
import manIcon from '../assets/icons/man.png';
import './HomePage.css';

const features = [
  { title: 'Удобный заказ на сайте', icon: iconMonitor },
  { title: 'Нет необходимости ехать в офис', icon: iconOffice },
  { title: 'Огромный выбор направлений', icon: iconGlobe },
];

const reviews = [
  {
    author: 'Екатерина Вальнова',
    text: 'Доброжелательные подсказки и удобная пошаговая форма. На сайте легко выбрать и купить билет онлайн.',
    icon: womanIcon,
  },
  {
    author: 'Евгений Стрекало',
    text: 'Весь заказ оформил за десять минут. Отличный сервис с понятной навигацией и аккуратным интерфейсом.',
    icon: manIcon,
  },
];

export default function HomePage() {
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);

  return (
    <>
      <section
        className={`home-hero ${isSearchLoading ? 'home-hero--loading' : ''}`}
        id="top"
      >
        <div className="container home-hero__inner">
          <div className="home-hero__copy">
            <p className="home-hero__lead">Вся жизнь —</p>
            <h1 className="home-hero__title">путешествие!</h1>
          </div>

          <div className="home-hero__search">
            <SearchForm
              onLoadingChange={setIsSearchLoading}
              onProgressChange={setSearchProgress}
            />
          </div>
        </div>

        <SearchLoadingBar
          isVisible={isSearchLoading}
          progress={searchProgress}
        />
      </section>

      <section className="content-section" id="about">
        <div className="container narrow-content">
          <h2>О нас</h2>

          <div className="quote-box">
            <p>
              Мы рады видеть вас! Мы работаем для вас с 2003 года. За это время
              мы помогли тысячам пассажиров оформить билеты онлайн в несколько
              кликов.
            </p>

            <p>
              Сегодня можно заказать железнодорожные билеты онлайн всего в два
              клика, но стоит ли это делать? Мы расскажем о преимуществах
              заказа через интернет.
            </p>

            <p className="quote-box__strong">
              Покупать ж/д билеты дешевле можно за 90 суток до отправления
              поезда. Благодаря динамическому ценообразованию цена на билеты
              в это время самая низкая.
            </p>
          </div>
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="container">
          <div className="section-title-row">
            <h2>Как это работает</h2>
            <button type="button" className="outline-button">
              Узнать больше
            </button>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-card__icon">
                  <img
                    className="feature-card__icon-image"
                    src={feature.icon}
                    alt=""
                    aria-hidden="true"
                  />
                </div>
                <p className="feature-card__title">{feature.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" id="reviews">
        <div className="container">
          <h2>Отзывы</h2>

          <div className="review-grid">
            {reviews.map((review) => (
              <article key={review.author} className="review-card">
                <div className="review-card__avatar">
                  <img 
                    src={review.icon} 
                    alt={review.author}
                    className="review-card__avatar-image"
                  />
                </div>
                <div className="review-card__content">
                  <h3>{review.author}</h3>
                  <p>«{review.text}»</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}