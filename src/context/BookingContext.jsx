import { useEffect, useState } from 'react';
import { BookingContext } from './booking-context.js';

const STORAGE_KEY = 'railway-react-booking';

const initialState = {
  search: {
    fromCity: null,
    toCity: null,
    dateStart: '',
    dateEnd: '',
  },
  selectedRoute: null,
  seats: {
    departure: {
      routeDirectionId: null,
      info: null,
      coaches: [],
      selectedSeats: [],
    },
    arrival: {
      routeDirectionId: null,
      info: null,
      coaches: [],
      selectedSeats: [],
    },
  },
  passengers: {},
  customer: {
    first_name: '',
    last_name: '',
    patronymic: '',
    phone: '',
    email: '',
    payment_method: 'cash',
  },
  order: null,
};

function getSeatKey(direction, coachId, seatNumber) {
  return `${direction}_${coachId}_${seatNumber}`;
}

function createPassengerFromSeat(seat, index = 0) {
  return {
    key: seat.key,
    is_adult: true,
    first_name: '',
    last_name: '',
    patronymic: '',
    gender: true,
    birthday: '',
    document_type: 'паспорт',
    document_data: '',
    seat_index: index,
  };
}

function flattenSelectedSeats(seats) {
  return [
    ...seats.departure.selectedSeats,
    ...seats.arrival.selectedSeats,
  ];
}

function getSeatTotal(seat) {
  let total = Number(seat.price || 0);

  if (seat.extras?.wifi) {
    total += Number(seat.wifiPrice || 0);
  }

  if (seat.extras?.linens && !seat.linensIncluded) {
    total += Number(seat.linensPrice || 0);
  }

  return total;
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return initialState;
    }

    const saved = JSON.parse(raw);

    return {
      ...initialState,
      ...saved,
      search: {
        ...initialState.search,
        ...(saved.search || {}),
      },
      seats: {
        departure: {
          ...initialState.seats.departure,
          ...(saved.seats?.departure || {}),
        },
        arrival: {
          ...initialState.seats.arrival,
          ...(saved.seats?.arrival || {}),
        },
      },
      passengers: saved.passengers || {},
      customer: {
        ...initialState.customer,
        ...(saved.customer || {}),
      },
      order: saved.order || null,
    };
  } catch {
    return initialState;
  }
}

export default function BookingProvider({ children }) {
  const [state, setState] = useState(restoreState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function setSearch(payload) {
    setState((prev) => ({
      ...prev,
      search: {
        ...prev.search,
        ...payload,
      },
    }));
  }

  function setRoute(route) {
    setState((prev) => ({
      ...prev,
      selectedRoute: route,
      seats: {
        departure: {
          routeDirectionId: route?.departure?._id || null,
          info: route?.departure || null,
          coaches: [],
          selectedSeats: [],
        },
        arrival: {
          routeDirectionId: route?.arrival?._id || null,
          info: route?.arrival || null,
          coaches: [],
          selectedSeats: [],
        },
      },
      passengers: {},
      order: null,
    }));
  }

  function setCoaches(direction, payload) {
    setState((prev) => ({
      ...prev,
      seats: {
        ...prev.seats,
        [direction]: {
          ...prev.seats[direction],
          coaches: payload,
        },
      },
    }));
  }

  function toggleSeat(payload) {
    const { direction, coach, seat, price } = payload;

    setState((prev) => {
      const currentSeats = prev.seats[direction].selectedSeats;
      const key = getSeatKey(direction, coach._id, seat.index);
      const exists = currentSeats.some((item) => item.key === key);

      let nextSelectedSeats = currentSeats;
      const nextPassengers = { ...prev.passengers };

      if (exists) {
        nextSelectedSeats = currentSeats.filter((item) => item.key !== key);
        delete nextPassengers[key];
      } else {
        const newSeat = {
          key,
          coachId: coach._id,
          coachName: coach.name,
          coachType: coach.class_type,
          seatNumber: seat.index,
          routeDirectionId: prev.seats[direction].routeDirectionId,
          price,
          linensPrice: Number(coach.linens_price || 0),
          wifiPrice: Number(coach.wifi_price || 0),
          linensIncluded: Boolean(coach.is_linens_included),
          extras: {
            linens: Boolean(coach.is_linens_included),
            wifi: false,
          },
        };

        nextSelectedSeats = [...currentSeats, newSeat];
        nextPassengers[key] = createPassengerFromSeat(
          newSeat,
          nextSelectedSeats.length - 1
        );
      }

      return {
        ...prev,
        passengers: nextPassengers,
        seats: {
          ...prev.seats,
          [direction]: {
            ...prev.seats[direction],
            selectedSeats: nextSelectedSeats,
          },
        },
      };
    });
  }

  function updateSeatExtras(direction, key, payload) {
    setState((prev) => ({
      ...prev,
      seats: {
        ...prev.seats,
        [direction]: {
          ...prev.seats[direction],
          selectedSeats: prev.seats[direction].selectedSeats.map((seat) =>
            seat.key === key
              ? {
                  ...seat,
                  extras: {
                    ...seat.extras,
                    ...payload,
                  },
                }
              : seat
          ),
        },
      },
    }));
  }

  function setPassenger(key, payload) {
    setState((prev) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [key]: {
          ...(prev.passengers[key] || {}),
          ...payload,
        },
      },
    }));
  }

  function setCustomer(payload) {
    setState((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        ...payload,
      },
    }));
  }

  function setOrder(payload) {
    setState((prev) => ({
      ...prev,
      order: payload,
    }));
  }

  function resetAfterSuccess() {
    setState((prev) => ({
      ...initialState,
      search: prev.search,
    }));
  }

  const totals = {
    departure: state.seats.departure.selectedSeats.reduce(
      (sum, seat) => sum + getSeatTotal(seat),
      0
    ),
    arrival: state.seats.arrival.selectedSeats.reduce(
      (sum, seat) => sum + getSeatTotal(seat),
      0
    ),
  };

  const passengerList = flattenSelectedSeats(state.seats).map((seat) => ({
    seat,
    passenger: state.passengers[seat.key] || null,
  }));

  const value = {
    state,
    actions: {
      setSearch,
      setRoute,
      setCoaches,
      toggleSeat,
      updateSeatExtras,
      setPassenger,
      setCustomer,
      setOrder,
      resetAfterSuccess,
    },
    totals: {
      ...totals,
      total: totals.departure + totals.arrival,
    },
    passengerList,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}