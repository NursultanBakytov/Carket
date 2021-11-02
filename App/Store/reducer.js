import {SET_DATA, UPDATE_DATA} from './action';

const initialState = {
  token: '',
  country: 'kg',
  brandForFilter: '',
  modelForFilter: '',
  regionForFilter: '',
  townForFilter: '',
  serviceForFilter: '',
  region: '',
  userCars: '',
  models: {},
  towns: {},
  favorites: {
    cars: [],
    parts: [],
    services: [],
  },
  newCars: [],
  cars: {},
  carsFiltered: {},
  searchResult: [],
  spareParts: {},
  sparePartsFiltered: [],
  services: {},
  tariffPlans: {},
  totalCounts: {},
  salons: {},
  salonsFiltered: [],
  salonCars: {},
  salonSpareParts: {},
  salonServices: {},
  comments: {},
  modification: {},
  generation: {year: ''},
  alert: {
    message: '',
  },
  adsPageHistory: [],
  isNoData: false,
  updateComments: true,
  bottomNavStateIsSparePart: false,
};

export function appReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    // ------------------
    case SET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    // ------------------
    case UPDATE_DATA: {
      const {key, value} = payload;

      return Array.isArray(value)
        ? {
            ...state,
            [key]: [...state[key], ...value],
          }
        : {
            ...state,
            [key]: {
              ...state[key],
              ...value,
            },
          };
    }
    // ------------------
    default: {
      return state;
    }
  }
}
