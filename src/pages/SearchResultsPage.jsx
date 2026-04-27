import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastRoutes, searchRoutes } from '../api/client.js';
import BookingSidebar from '../components/BookingSidebar.jsx';
import InnerHero from '../components/InnerHero.jsx';
import RouteCard from '../components/RouteCard.jsx';
import { useBooking } from '../context/useBooking.js';
import { buildSearchParams } from '../utils/helpers.js';
import { formatCity, formatMoney } from '../utils/format.js';
import { mockRoutes } from '../data/mockRoutes.js';
import RocketIcon from '../components/icons_component/RocketIcon.jsx';
import WifiIcon from '../components/icons_component/WifiIcon.jsx';
import CupIcon from '../components/icons_component/CupIcon.jsx';

import './SearchResultsPage.css';

const defaultFilters = {
  have_first_class: false,
  have_second_class: false,
  have_third_class: false,
  have_fourth_class: false,
  have_wifi: false,
  have_air_conditioning: false,
  have_express: false,
  price_from: '',
  price_to: '',
  start_departure_hour_from: 0,
  start_departure_hour_to: 11,
  start_arrival_hour_from: 5,
  start_arrival_hour_to: 11,
  end_departure_hour_from: 0,
  end_departure_hour_to: 11,
  end_arrival_hour_from: 5,
  end_arrival_hour_to: 11,
  sort: 'date',
};



function LastTickets({ routes }) {
  return (
    <section className="last-tickets">
      <h3>Последние билеты</h3>

      <div className="last-tickets__list">
        {routes.slice(0, 3).map((route) => {
          const departure = route.departure || {};
          const fromCity = formatCity(departure.from?.city?.name);
          const fromStation = departure.from?.railway_station_name || '';
          const toCity = formatCity(departure.to?.city?.name);
          const toStation = departure.to?.railway_station_name || '';
          const price = formatMoney(route.min_price || departure.min_price);

          const hasWifi = Boolean(route.have_wifi || departure.have_wifi);
          const isExpress = Boolean(route.is_express || departure.is_express);
          const hasComfort = Boolean(
            route.have_air_conditioning ||
              departure.have_air_conditioning ||
              route.have_first_class ||
              departure.have_first_class
          );

          return (
            <article
              key={departure._id || route._id}
              className="last-ticket-card"
            >
              <div className="last-ticket-card__top">
                <div className="last-ticket-card__route last-ticket-card__route--from">
                  <strong className="last-ticket-card__city">{fromCity}</strong>
                  <span className="last-ticket-card__station">{fromStation}</span>
                </div>

                <div className="last-ticket-card__route last-ticket-card__route--to">
                  <strong className="last-ticket-card__city">{toCity}</strong>
                  <span className="last-ticket-card__station">{toStation}</span>
                </div>
              </div>

              <div className="last-ticket-card__bottom">
                <div className="last-ticket-card__icons" aria-hidden="true">
                  {hasWifi ? <WifiIcon className="last-ticket-card__icon"/> : null}
                  {isExpress ? <RocketIcon className="last-ticket-card__icon" /> : null}
                  {hasComfort ? <CupIcon className="last-ticket-card__icon" /> : null}
                </div>

                <div className="last-ticket-card__price">
                  <span className="last-ticket-card__price-prefix">от</span>
                  <strong className="last-ticket-card__price-value">{price}</strong>
                  <span className="last-ticket-card__price-currency">₽</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const { state, actions } = useBooking();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [lastRoutes, setLastRoutes] = useState([]);
  const [requestState, setRequestState] = useState({
    status: 'idle',
    error: '',
    isFallback: false,
    data: {
      total_count: 0,
      items: [],
    },
  });

  const canSearch = Boolean(
    state.search.fromCity?._id && state.search.toCity?._id
  );

  useEffect(() => {
    getLastRoutes()
      .then((data) => setLastRoutes(data || []))
      .catch(() => setLastRoutes([]));
  }, []);

  useEffect(() => {
    if (!canSearch) {
      return;
    }

    let active = true;

    searchRoutes(buildSearchParams(state.search, filters, page, limit))
      .then((data) => {
        console.log('SEARCH RESPONSE', data);
        if (!active) return;

        setRequestState({
          status: 'success',
          error: '',
          isFallback: false,
          data: {
            total_count: data?.total_count || 0,
            items: data?.items || [],
          },
        });
      })
      .catch((requestError) => {
        if (!active) return;

        console.error('API routes error:', requestError);

        const start = (page - 1) * limit;
        const end = start + limit;
        const pagedMockRoutes = mockRoutes.slice(start, end);

        setRequestState({
          status: 'success',
          error:
            'Публичный API временно недоступен. Показаны демонстрационные маршруты.',
          isFallback: true,
          data: {
            total_count: mockRoutes.length,
            items: pagedMockRoutes,
          },
        });
      });

    return () => {
      active = false;
    };
  }, [canSearch, filters, page, limit, state.search]);

  const routesData = canSearch
    ? requestState.data
    : { total_count: 0, items: [] };
    const isLoading = canSearch && requestState.status === 'loading';
    const error = canSearch ? requestState.error : '';
    const isFallback = requestState.isFallback;

const sortedItems = useMemo(() => {
  const items = [...routesData.items];

  if (filters.sort === 'price') {
    return items.sort((a, b) => {
      const aPrice = Number(a.min_price || a.departure?.min_price || 0);
      const bPrice = Number(b.min_price || b.departure?.min_price || 0);
      return aPrice - bPrice;
    });
  }

  if (filters.sort === 'duration') {
    return items.sort((a, b) => {
      const aDuration = Number(a.departure?.duration || 0);
      const bDuration = Number(b.departure?.duration || 0);
      return aDuration - bDuration;
    });
  }

  return items;
}, [routesData.items, filters.sort]);
 

  const pages = useMemo(() => {
    return Math.max(1, Math.ceil(routesData.total_count / limit));
  }, [routesData.total_count, limit]);

  function startLoadingState() {
    setRequestState((prev) => ({
      ...prev,
      status: 'loading',
      error: '',
      isFallback: false,
    }));
  }

  function handleSelectRoute(route) {
    actions.setRoute(route);
    navigate('/seats');
  }
function handleLimitChange(value) {
  startLoadingState();
  setIsSortOpen(false);
  setPage(1);
  setLimit(value);
}

function handlePageChange(nextPage) {
  startLoadingState();
  setIsSortOpen(false);
  setPage(nextPage);
}
  function handleSidebarChange(key, value, scope = 'filters') {
    startLoadingState();
    setPage(1);

    if (scope === 'search') {
      actions.setSearch({
        [key]: value,
      });
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

function handleSortChange(value) {
  setPage(1);
  setIsSortOpen(false);
  setFilters((prev) => ({
    ...prev,
    sort: value,
  }));
}
  return (
    <>
      <InnerHero step={1} />
      <section className="booking-section">
        <div className="container booking-layout">
          <div className="booking-layout__sidebar">
            <BookingSidebar
              search={state.search}
              filters={filters}
              onFilterChange={handleSidebarChange}
            />

            <LastTickets routes={lastRoutes} />
          </div>

          <div className="booking-layout__main">
            <div className="results-head">
              <div className="results-head__found">
                <span>найдено {routesData.total_count}</span>
              </div>

<div className="results-head__sort">
  <span className="results-head__label">сортировать по:</span>

  <div className="results-head__sort-dropdown">
    <button
      type="button"
      className="results-head__sort-current"
      onClick={() => setIsSortOpen((prev) => !prev)}
    >
      {filters.sort === 'date' && 'времени'}
      {filters.sort === 'price' && 'стоимости'}
      {filters.sort === 'duration' && 'длительности'}
    </button>

    {isSortOpen ? (
      <div className="results-head__sort-menu">
        {filters.sort !== 'date' ? (
          <button
            type="button"
            className="results-head__sort-option"
            onClick={() => handleSortChange('date')}
          >
            времени
          </button>
        ) : null}

        {filters.sort !== 'price' ? (
          <button
            type="button"
            className="results-head__sort-option"
            onClick={() => handleSortChange('price')}
          >
            стоимости
          </button>
        ) : null}

        {filters.sort !== 'duration' ? (
          <button
            type="button"
            className="results-head__sort-option"
            onClick={() => handleSortChange('duration')}
          >
            длительности
          </button>
        ) : null}
      </div>
    ) : null}
  </div>
</div>

              <div className="results-head__limit">
                <span className="results-head__label">показывать по:</span>

                {[5, 10, 20].map((limitValue) => (
                  <button
                    key={limitValue}
                    type="button"
                    className={`results-head__limit-button ${
                      limitValue === limit ? 'is-active' : ''
                    }`}
                    onClick={() => handleLimitChange(limitValue)}
                  >
                    {limitValue}
                  </button>
                ))}
              </div>
            </div>

            {isFallback ? (
              <div className="empty-card">
                Публичный API временно недоступен. Показаны демонстрационные маршруты.
              </div>
            ) : null}

            {!canSearch ? (
              <div className="empty-card">
                Выберите города в форме поиска на главной странице.
              </div>
            ) : null}

            {error && !isFallback ? (
              <div className="empty-card empty-card--error">{error}</div>
            ) : null}

            {isLoading ? (
              <div className="empty-card">Загрузка маршрутов…</div>
            ) : null}

{!isLoading && canSearch && !error && sortedItems.length === 0 ? (
  <div className="empty-card">
    По этому направлению ничего не найдено.
  </div>
) : null}

   <div className="route-list">
  {sortedItems.map((route) => (
    <RouteCard
      key={route.departure?._id || route._id}
      route={route}
      onSelect={() => handleSelectRoute(route)}
    />
  ))}
</div>

            <div className="pagination">
              <button
                type="button"
                className="pagination__button"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                ←
              </button>

              {Array.from({ length: pages }, (_, index) => index + 1)
                .slice(0, 5)
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`pagination__button ${
                      item === page ? 'is-active' : ''
                    }`}
                    onClick={() => handlePageChange(item)}
                  >
                    {item}
                  </button>
                ))}

              <button
                type="button"
                className="pagination__button"
                disabled={page === pages}
                onClick={() => handlePageChange(page + 1)}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}