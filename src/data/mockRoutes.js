export const mockRoutes = [
  {
    _id: 'mock-route-1',
    min_price: 1920,
    total_avaliable_seats: 120,
    departure: {
      _id: 'mock-departure-1',
      have_first_class: true,
      have_second_class: true,
      have_third_class: true,
      have_fourth_class: false,
      have_wifi: true,
      have_air_conditioning: true,
      is_express: false,
      min_price: 1920,
      duration: 34920,
      train: {
        _id: 'train-1',
        name: '116С',
      },
      from: {
        datetime: 1713741000,
        railway_station_name: 'Казанский вокзал',
        city: {
          _id: 'city-moscow',
          name: 'Москва',
        },
      },
      to: {
        datetime: 1713775920,
        railway_station_name: 'Московский вокзал',
        city: {
          _id: 'city-spb',
          name: 'Санкт-Петербург',
        },
      },
      price_info: {
        first: {
          price: 5200,
        },
        second: {
          top_price: 3100,
          bottom_price: 3600,
        },
        third: {
          top_price: 2200,
          bottom_price: 2600,
          side_price: 1900,
        },
      },
      seats_info: {
        first: 8,
        second: 16,
        third: 42,
        fourth: 88,
      },
      seat_breakdown: {
        second: {
          top: 19,
          bottom: 5,
        },
        third: {
          top: 28,
          bottom: 14,
          side: 10,
        },
      },
    },
    arrival: null,
  },
  {
    _id: 'mock-route-2',
    min_price: 2450,
    total_avaliable_seats: 84,
    departure: {
      _id: 'mock-departure-2',
      have_first_class: false,
      have_second_class: true,
      have_third_class: true,
      have_fourth_class: true,
      have_wifi: true,
      have_air_conditioning: true,
      is_express: true,
      min_price: 2450,
      duration: 18300,
      train: {
        _id: 'train-2',
        name: '020У',
      },
      from: {
        datetime: 1713762900,
        railway_station_name: 'Ленинградский вокзал',
        city: {
          _id: 'city-moscow',
          name: 'Москва',
        },
      },
      to: {
        datetime: 1713781200,
        railway_station_name: 'Ладожский вокзал',
        city: {
          _id: 'city-spb',
          name: 'Санкт-Петербург',
        },
      },
      price_info: {
        second: {
          top_price: 3400,
          bottom_price: 3900,
        },
        third: {
          top_price: 2800,
          bottom_price: 3100,
          side_price: 2450,
        },
        fourth: {
          price: 2600,
        },
      },
      seats_info: {
        second: 12,
        third: 34,
        fourth: 18,
      },
      seat_breakdown: {
    second: {
      top: 19,
      bottom: 5,
    },
    third: {
      top: 28,
      bottom: 14,
      side: 10,
    },
  },
    },
    arrival: {
      _id: 'mock-arrival-1',
      from: {
        datetime: 1714070280,
        railway_station_name: 'Ладожский вокзал',
        city: { name: 'Санкт-Петербург' },
      },
      to: {
        datetime: 1714083660,
        railway_station_name: 'Киевский вокзал',
        city: { name: 'Москва' },
      },
      duration: 13380,
    },
  },
  {
    _id: 'mock-route-3',
    min_price: 2780,
    total_avaliable_seats: 56,
    departure: {
      _id: 'mock-departure-3',
      have_first_class: true,
      have_second_class: true,
      have_third_class: false,
      have_fourth_class: false,
      have_wifi: false,
      have_air_conditioning: true,
      is_express: false,
      min_price: 2780,
      duration: 23100,
      train: {
        _id: 'train-3',
        name: '055Г',
      },
      from: {
        datetime: 1713789600,
        railway_station_name: 'Курский вокзал',
        city: {
          _id: 'city-moscow',
          name: 'Москва',
        },
      },
      to: {
        datetime: 1713812700,
        railway_station_name: 'Московский вокзал',
        city: {
          _id: 'city-spb',
          name: 'Санкт-Петербург',
        },
      },
      price_info: {
        first: {
          price: 6100,
        },
        second: {
          top_price: 3500,
          bottom_price: 4100,
        },
      },
      seats_info: {
        first: 6,
        second: 24,
      },
    },
    arrival: null,
  },
];