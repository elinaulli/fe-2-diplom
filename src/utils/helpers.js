import { getCoachTypeLabel } from './format.js';

export function buildSearchParams(search, filters = {}, page = 1, limit = 5) {
  const params = {
    from_city_id: search.fromCity?._id,
    to_city_id: search.toCity?._id,
    date_start: search.dateStart || undefined,
    date_end: search.dateEnd || undefined,
    have_first_class: filters.have_first_class ? true : undefined,
    have_second_class: filters.have_second_class ? true : undefined,
    have_third_class: filters.have_third_class ? true : undefined,
    have_fourth_class: filters.have_fourth_class ? true : undefined,
    have_wifi: filters.have_wifi ? true : undefined,
    have_air_conditioning: filters.have_air_conditioning ? true : undefined,
    have_express: filters.have_express ? true : undefined,
    price_from: filters.price_from || undefined,
    price_to: filters.price_to || undefined,
    sort: filters.sort === 'date' ? 'date' : undefined,
    limit,
    offset: (page - 1) * limit,
  };

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== null)
  );
}

export function toQueryString(params) {
  return new URLSearchParams(params).toString();
}

export function getCoachTypeFromFlags(coach) {
  if (coach.class_type) return coach.class_type;
  if (coach.have_first_class) return 'first';
  if (coach.have_second_class) return 'second';
  if (coach.have_third_class) return 'third';
  if (coach.have_fourth_class) return 'fourth';
  return 'second';
}

export function getAvailableCoachTypes(coaches) {
  return Array.from(
    new Set(
      coaches
        .map((coach) => getCoachTypeFromFlags(coach))
        .filter(Boolean),
    ),
  );
}

export function getSeatPrice(coach, seatNumber) {
  const type = getCoachTypeFromFlags(coach);

  if (type === 'first') {
    return Number(coach.price || coach.bottom_price || coach.top_price || 0);
  }

  if (type === 'second') {
    return seatNumber % 2 === 0 ? Number(coach.top_price || 0) : Number(coach.bottom_price || 0);
  }

  if (type === 'third') {
    if (seatNumber > 32) {
      return Number(coach.side_price || coach.top_price || 0);
    }

    return seatNumber % 2 === 0 ? Number(coach.top_price || 0) : Number(coach.bottom_price || 0);
  }

  return Number(coach.bottom_price || coach.top_price || coach.price || 0);
}

export function getCoachBadge(coach) {
  return `${getCoachTypeLabel(getCoachTypeFromFlags(coach))} • ${coach.name || `вагон ${coach._id?.slice(-2) || ''}`}`;
}

export function getSeatKey(direction, coachId, seatNumber) {
  return `${direction}:${coachId}:${seatNumber}`;
}

export function createPassengerFromSeat(seat, index) {
  return {
    seatKey: seat.key,
    ticketType: index === 0 ? 'adult' : 'adult',
    first_name: '',
    last_name: '',
    patronymic: '',
    gender: 'male',
    birthday: '',
    document_type: 'passport',
    document_data: '',
    limited_mobility: false,
    include_children_seat: false,
  };
}

export function isPassengerComplete(passenger) {
  if (!passenger) return false;

  const required = ['first_name', 'last_name', 'birthday', 'document_data'];
  return required.every((field) => String(passenger[field] || '').trim().length > 0);
}

export function getSeatTotal(seat) {
  const linens = seat.extras?.linens && !seat.linensIncluded ? seat.linensPrice : 0;
  const wifi = seat.extras?.wifi ? seat.wifiPrice : 0;
  return Number(seat.price || 0) + Number(linens || 0) + Number(wifi || 0);
}

export function flattenSelectedSeats(seatState) {
  return [...seatState.departure.selectedSeats, ...seatState.arrival.selectedSeats];
}

export function getOrderPayload(state) {
  const buildDirection = (direction) => {
    const bucket = state.seats[direction];

    if (!bucket.routeDirectionId || bucket.selectedSeats.length === 0) {
      return undefined;
    }

    return {
      route_direction_id: bucket.routeDirectionId,
      seats: bucket.selectedSeats.map((seat) => {
        const passenger = state.passengers[seat.key] || {};
        const isAdult = passenger.ticketType !== 'child';

        return {
          coach_id: seat.coachId,
          seat_number: seat.seatNumber,
          is_child: !isAdult,
          include_children_seat: Boolean(passenger.include_children_seat),
          person_info: {
            is_adult: isAdult,
            first_name: passenger.first_name || 'Пассажир',
            last_name: passenger.last_name || 'Без фамилии',
            patronymic: passenger.patronymic || '',
            gender: passenger.gender !== 'female',
            birthday: passenger.birthday || '1990-01-01',
            document_type: passenger.document_type === 'birth' ? 'свидетельство о рождении' : 'паспорт',
            document_data: passenger.document_data || '0000 000000',
          },
        };
      }),
    };
  };

  return {
    user: {
      first_name: state.customer.first_name,
      last_name: state.customer.last_name,
      patronymic: state.customer.patronymic,
      phone: state.customer.phone,
      email: state.customer.email,
      payment_method: state.customer.payment_method,
    },
    departure: buildDirection('departure'),
    arrival: buildDirection('arrival'),
  };
}
