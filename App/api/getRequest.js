import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  carKeys,
  getArrFromObj,
  getPassedDate,
  getUrlString,
  makeRequest,
} from '.';
import {setData, updateData} from '../Store';

export const getUserData = () => dispatch => {
  makeRequest('/user', undefined, dispatch).then(json => {
    if (json) {
      dispatch(setData({user: json.data}));
    }
  });
};
export const getBrands = () => dispatch => {
  makeRequest('/car/brands', undefined, dispatch).then(json => {
    dispatch(setData({brands: json.data}));
  });
};
export const getCarcase = () => dispatch => {
  makeRequest('/car/carcase', undefined, dispatch).then(json => {
    dispatch(setData({carcase: json.data}));
  });
};
export const getFuels = () => dispatch => {
  makeRequest('/car/fuels', undefined, dispatch).then(json => {
    dispatch(setData({fuels: json.data}));
  });
};
export const getDrive = () => dispatch => {
  makeRequest('/car/drive', undefined, dispatch).then(json => {
    dispatch(setData({drive: json.data}));
  });
};
export const getTransmission = () => dispatch => {
  makeRequest('/car/transmission', undefined, dispatch).then(json => {
    dispatch(setData({transmission: json.data}));
  });
};
export const getColors = () => dispatch => {
  makeRequest('/car/colors', undefined, dispatch).then(json => {
    dispatch(setData({colors: json.data}));
  });
};
export const getRegions = () => dispatch => {
  makeRequest('/car/regions', undefined, dispatch).then(json => {
    dispatch(setData({regions: json.data}));
  });
};
export const getOwners = () => dispatch => {
  makeRequest('/car/owners', undefined, dispatch).then(json => {
    dispatch(setData({owners: json.data}));
  });
};
export const getOptions = () => dispatch => {
  makeRequest('/car/options', undefined, dispatch).then(json => {
    dispatch(setData({options: json.data}));
  });
};
export const getMedia = () => dispatch => {
  makeRequest('/car/media', undefined, dispatch).then(json => {
    dispatch(setData({media: json.data}));
  });
};
export const getExterior = () => dispatch => {
  makeRequest('/car/exterior', undefined, dispatch).then(json => {
    dispatch(setData({exterior: json.data}));
  });
};
export const getCarStatuses = () => dispatch => {
  makeRequest('/car/statuses', undefined, dispatch).then(json => {
    dispatch(setData({car_statuses: json.data}));
  });
};
export const getSteering = () => dispatch => {
  makeRequest('/car/steering', undefined, dispatch).then(json => {
    dispatch(setData({steering: json.data}));
  });
};
export const getHighlights = () => dispatch => {
  makeRequest('/car/highlights', undefined, dispatch).then(json => {
    dispatch(setData({highlights: json.data}));
  });
};
export const getSiteHighlights = () => dispatch => {
  makeRequest('/site/highlights', undefined, dispatch).then(json => {
    dispatch(setData({siteHighlights: json.data}));
  });
};
export const getSiteRates = callback => dispatch => {
  makeRequest('/site/rates', undefined, dispatch).then(json => {
    if (json) {
      AsyncStorage.setItem(
        'kgs_rate',
        json.data.filter(item => item.alias === 'USD')[0].rate,
      );
      dispatch(getCars({page: '0', per_page: 12}, callback));
      dispatch(setData({siteRates: json.data}));
    }
  });
};
export const getSalon = data => dispatch => {
  makeRequest(`/salon?${getUrlString(data)}`, undefined, dispatch).then(
    json => {
      if (json) {
        dispatch(updateData({key: 'salons', value: {[data.alias]: json.data}}));
      }
    },
  );
};
export const getSalonCars = (data, state, callback) => dispatch => {
  makeRequest(`/salon/cars?${getUrlString(data)}`, undefined, dispatch).then(
    json => {
      dispatch(
        updateData({
          key: 'totalCounts',
          value: {
            all_salon_cars: json ? json.data.all_salon_cars : 0,
          },
        }),
      );
      dispatch(
        updateData({
          key: 'salonCars',
          value: {
            [data.alias]: json
              ? [
                  ...state,
                  ...json.data.salon_cars.map(car =>
                    getPassedDate(car, carKeys[0], carKeys[1]),
                  ),
                ]
              : [],
          },
        }),
      );
      callback();
    },
  );
};
export const getSalonSpareParts = (data, state, callback) => dispatch => {
  makeRequest(`/salon/parts?${getUrlString(data)}`, undefined, dispatch).then(
    json => {
      dispatch(
        updateData({
          key: 'totalCounts',
          value: {
            all_salon_parts: json ? json.data.all_salon_parts : 0,
          },
        }),
      );
      dispatch(
        updateData({
          key: 'salonSpareParts',
          value: {
            [data.alias]: json
              ? [
                  ...state,
                  ...json.data.salon_parts.map(sparePart =>
                    getPassedDate(sparePart, ['date_creation'], ['date_text']),
                  ),
                ]
              : [],
          },
        }),
      );
      callback();
    },
  );
};
export const getSalonServices = (data, state, callback) => dispatch => {
  makeRequest(
    `/salon/services?${getUrlString(data)}`,
    undefined,
    dispatch,
  ).then(json => {
    dispatch(
      updateData({
        key: 'totalCounts',
        value: {
          all_salon_services: json ? json.data.all_salon_services : 0,
        },
      }),
    );
    dispatch(
      updateData({
        key: 'salonServices',
        value: {
          [data.alias]: json
            ? [
                ...state,
                ...json.data.salon_services.map(service =>
                  getPassedDate(service, ['date_creation'], ['date_text']),
                ),
              ]
            : [],
        },
      }),
    );
    callback();
  });
};
export const getTariffPlans = () => dispatch => {
  makeRequest('site/plans', undefined, dispatch).then(json => {
    if (json) {
      dispatch(
        updateData({
          key: 'tariffPlans',
          value: {
            allPlans: json.data,
          },
        }),
      );
    }
  });
};
export const getTariffPlan = data => dispatch => {
  makeRequest(`site/plan?${getUrlString(data)}`, undefined, dispatch).then(
    json => {
      if (json) {
        dispatch(
          updateData({
            key: 'tariffPlans',
            value: {
              [data.plan_id]: json.data,
            },
          }),
        );
      }
    },
  );
};
export const getSparePartsWithCategory = () => dispatch => {
  makeRequest(
    '/car/parts/categories_with_part_count',
    undefined,
    dispatch,
  ).then(json => {
    if (json) {
      dispatch(setData({sparePartsWithCategory: getArrFromObj(json.data)}));
    }
  });
};
export const getServicesWithCategory = () => dispatch => {
  makeRequest(
    '/car/services/categories_with_service_count',
    undefined,
    dispatch,
  ).then(json => {
    if (json) {
      dispatch(setData({servicesWithCategory: getArrFromObj(json.data)}));
    }
  });
};

export const getCar = (alias, get_second_price) => dispatch => {
  makeRequest(`/car?alias=${alias}`, undefined, dispatch).then(async json => {
    if (json) {
      let KGS = await AsyncStorage.getItem('kgs_rate');
      dispatch(
        updateData({
          key: 'cars',
          value: {
            [alias]: getPassedDate(
              json.data,
              carKeys[0],
              carKeys[1],
              Boolean(get_second_price) ? KGS : false,
            ),
          },
        }),
      );
    }
  });
};

export const getCars = (data, callback) => dispatch => {
  makeRequest(`/cars?${getUrlString(data)}`, undefined, dispatch).then(
    async json => {
      let KGS = await AsyncStorage.getItem('kgs_rate');
      dispatch(
        updateData({
          key: 'newCars',
          value: json
            ? json.data.cars.map(car =>
                getPassedDate(car, carKeys[0], carKeys[1], KGS),
              )
            : [],
        }),
      );
      dispatch(
        updateData({
          key: 'totalCounts',
          value: {
            allNewCars: json ? json.data.all_cars : 0,
          },
        }),
      );
      callback();
    },
  );
};

export const getCarsFiltered =
  (data, callback, currentCar = false, state = []) =>
  dispatch => {
    makeRequest(`/cars?${getUrlString(data)}`, undefined, dispatch).then(
      async json => {
        dispatch(
          updateData({
            key: 'totalCounts',
            value: {
              foundCarsCount: json ? json.data.all_cars : 0,
            },
          }),
        );
        if (json) {
          let KGS = await AsyncStorage.getItem('kgs_rate'),
            arr = currentCar
              ? json.data.cars.reduce((counter, item) => {
                  if (
                    (item.alias !== currentCar &&
                      counter.length > 0 &&
                      counter.filter(car => car.alias === item.alias).length ===
                        0) ||
                    (item.alias !== currentCar && counter.length === 0)
                  ) {
                    counter.push(item);
                  }
                  return counter;
                }, [])
              : json.data.cars;
          if (arr.length > 0) {
            dispatch(setData({isNoData: false}));

            if (currentCar) {
              dispatch(
                updateData({
                  key: 'carsFiltered',
                  value: {
                    [currentCar]:
                      state.length > 0
                        ? [
                            ...state,
                            ...arr.map(car =>
                              getPassedDate(
                                car,
                                carKeys[0],
                                carKeys[1],
                                data.country === 'kg' ? KGS : false,
                              ),
                            ),
                          ]
                        : arr.map(car =>
                            getPassedDate(
                              car,
                              carKeys[0],
                              carKeys[1],
                              data.country === 'kg' ? KGS : false,
                            ),
                          ),
                  },
                }),
              );
            } else {
              dispatch(
                data.page === '0'
                  ? setData({
                      searchResult: arr.map(car =>
                        getPassedDate(
                          car,
                          carKeys[0],
                          carKeys[1],
                          data.country === 'kg' ? KGS : false,
                        ),
                      ),
                    })
                  : updateData({
                      key: 'searchResult',
                      value: arr.map(car =>
                        getPassedDate(
                          car,
                          carKeys[0],
                          carKeys[1],
                          data.country === 'kg' ? KGS : false,
                        ),
                      ),
                    }),
              );
            }
          } else {
            dispatch(setData({isNoData: true}));
            dispatch(
              updateData({
                key: 'carsFiltered',
                value: {[currentCar]: []},
              }),
            );
          }
        } else {
          dispatch(
            setData({
              searchResult: [],
              alert: {
                message: 'Машины не найдены',
                severity: 'error',
              },
            }),
          );
        }
        callback(json);
      },
    );
  };

export const getSparePartsFiltered =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest(`/car/parts?${getUrlString(data)}`, undefined, dispatch).then(
      json => {
        dispatch(
          json
            ? data.page === '0'
              ? setData({
                  sparePartsFiltered: json.data.parts.map(part =>
                    getPassedDate(part, ['date_creation'], ['date_text']),
                  ),
                  bottomNavStateIsSparePart: true,
                })
              : updateData({
                  key: 'sparePartsFiltered',
                  value: json.data.parts.map(part =>
                    getPassedDate(part, ['date_creation'], ['date_text']),
                  ),
                })
            : setData({
                sparePartsFiltered: [],
              }),
        );
        dispatch(
          updateData({
            key: 'totalCounts',
            value: {
              foundSparePartsCount: json ? json.data.all_parts : 0,
            },
          }),
        );

        callback();
      },
    );
  };

export const getServicesFiltered =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest(
      `/car/services?${getUrlString(data)}`,
      undefined,
      dispatch,
    ).then(json => {
      dispatch(
        json
          ? data.page === '0'
            ? setData({
                servicesFiltered: json.data.services,
              })
            : updateData({key: 'servicesFiltered', value: json.data.services})
          : setData({
              servicesFiltered: [],
            }),
      );
      dispatch(
        updateData({
          key: 'totalCounts',
          value: {foundServices: json ? json.data.all_services : 0},
        }),
      );

      callback();
    });
  };

export const getSalonsFiltered =
  (data, callback = () => {}, update = false) =>
  dispatch => {
    makeRequest(`/salons?${getUrlString(data)}`, undefined, dispatch).then(
      json => {
        if (json) {
          dispatch(
            update
              ? updateData({key: 'salonsFiltered', value: json.data.salons})
              : setData({salonsFiltered: json.data.salons}),
          );
        }
        dispatch(
          updateData({
            key: 'totalCounts',
            value: {all_salons: json ? json.data.all_salons : 0},
          }),
        );

        callback();
      },
    );
  };

export const getComments =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest(
      `/comments/get?${getUrlString(data)}`,
      undefined,
      dispatch,
    ).then(json => {
      if (json) {
        dispatch(
          updateData({
            key: 'comments',
            value: {
              [data.alias]: json.data.map(comment =>
                getPassedDate(comment, ['date_creation'], ['created_at']),
              ),
            },
          }),
        );
      } else {
        dispatch(
          updateData({
            key: 'comments',
            value: {[data.alias]: 'Нет комментариев'},
          }),
        );
      }
      callback();
    });
  };

export const getSparePart = data => dispatch => {
  makeRequest(`car/part?${getUrlString(data)}`, undefined, dispatch).then(
    json => {
      if (json) {
        dispatch(
          updateData({
            key: 'spareParts',
            value: {
              [data.alias]: getPassedDate(
                json.data,
                ['date_creation'],
                ['date_text'],
              ),
            },
          }),
        );
      }
    },
  );
};

export const getService = data => dispatch => {
  makeRequest(`car/service?${getUrlString(data)}`, undefined, dispatch).then(
    json => {
      if (json) {
        dispatch(
          updateData({
            key: 'services',
            value: {
              [data.alias]: getPassedDate(
                json.data,
                ['date_creation'],
                ['date_text'],
              ),
            },
          }),
        );
      }
    },
  );
};

export const getFavorites =
  (callback = () => {}) =>
  dispatch => {
    makeRequest('user/favorites', undefined, dispatch).then(async json => {
      if (json) {
        const {cars, parts, services} = json.data.favorites;
        let KGS = await AsyncStorage.getItem('kgs_rate');

        dispatch(
          setData({
            favorites: {
              cars: Boolean(cars)
                ? cars.map(car => {
                    let newPhotos =
                      typeof car.photos === 'string'
                        ? car.photos.split(',')
                        : car.photos;
                    car.photos = newPhotos;
                    return getPassedDate(car, carKeys[0], carKeys[1], KGS);
                  })
                : [],
              parts: Boolean(parts)
                ? parts.map(part => {
                    let newPhotos =
                      typeof part.photos === 'string'
                        ? part.photos.split(',')
                        : part.photos;
                    part.photos = newPhotos;
                    return getPassedDate(
                      part,
                      ['date_creation'],
                      ['date_text'],
                    );
                  })
                : [],
              services: Boolean(services)
                ? services.map(service => {
                    let newPhotos =
                      typeof service.photos === 'string'
                        ? service.photos.split(',')
                        : service.photos;
                    service.photos = newPhotos;
                    return getPassedDate(
                      service,
                      ['date_creation'],
                      ['date_text'],
                    );
                  })
                : [],
            },
          }),
        );
      } else {
        dispatch(
          setData({
            favorites: {
              cars: [],
              parts: [],
              services: [],
            },
          }),
        );
      }
      callback();
    });
  };

export const getUserTransactions =
  (data, callback, state = []) =>
  dispatch => {
    makeRequest(
      `/user/transactions?${getUrlString(data)}`,
      undefined,
      dispatch,
    ).then(json => {
      if (json) {
        dispatch(
          updateData({
            key: 'totalCounts',
            value: {
              all_user_transactions:
                json.data.transactions.all_user_transactions,
            },
          }),
        );
        dispatch(
          setData({
            operationHistories: [
              ...state,
              ...json.data.transactions.transactions,
            ],
          }),
        );
      }
      callback();
    });
  };
