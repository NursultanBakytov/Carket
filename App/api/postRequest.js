import {
  appAxios,
  carKeys,
  getArrFromObj,
  getFormData,
  getPassedDate,
  getSalonsFiltered,
  makeRequest,
} from './index';
import {setData, updateData} from '../Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCarsFiltered,
  getComments,
  getFavorites,
  getServicesFiltered,
  getSparePartsFiltered,
  getUserData,
} from './getRequest';

export const login =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest('/user/login', getFormData(data), dispatch).then(json => {
      if (json) {
        AsyncStorage.setItem('carketToken', `Basic ${json.data.token}`);
        appAxios.defaults.headers['X-API-KEY'] = `Basic ${json.data.token}`;
        dispatch(getUserData());
        dispatch(getFavorites());
        dispatch(getUserCars({page: '0'}));
        dispatch(getUserSpareParts({page: '0'}));
        dispatch(getUserServices({page: '0'}));
        dispatch(setData({token: json.data.token}));
        dispatch(
          setData({alert: {message: json.message, severity: 'success'}}),
        );
      }
      callback();
    });
  };

export const logout = () => dispatch => {
  makeRequest('/user/logout', {}, dispatch).then(json => {
    if (json) {
      AsyncStorage.removeItem('carketToken');
      dispatch(setData({token: ''}));
      dispatch(setData({alert: {message: json.message, severity: 'success'}}));
    }
  });
};

export const singUp =
  (data, callback, successCallback = () => {}) =>
  dispatch => {
    makeRequest('/user/registration', getFormData(data), dispatch).then(
      json => {
        if (json) {
          // Токен регистрации
          appAxios.defaults.headers['X-API-KEY'] = `Basic ${json.data.token}`;
          successCallback();
          dispatch(sendActivationCode());
        }
        callback();
      },
    );
  };

export const restoreUserPassword = (data, callback) => dispatch => {
  makeRequest('/user/restore', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(setData({alert: {message: json.message, severity: 'success'}}));
    }
    callback();
  });
};

export const changeUserPassword = (data, callback) => dispatch => {
  makeRequest('/user', getFormData(data), dispatch).then(json => {
    if (json) {
      callback(json);
    }
    callback();
  });
};

export const getBrandModels = data => dispatch => {
  makeRequest('/car/models', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(
        updateData({
          key: 'models',
          value: {[data.brand]: {brandAlias: data.brand, data: json.data}},
        }),
      );
      dispatch(setData({isNoData: false}));
    } else {
      dispatch(setData({isNoData: true}));
    }
  });
};

export const getModel = data => dispatch => {
  makeRequest('/car/model', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(updateData({key: 'models', value: {[data.model]: json.data}}));
    }
  });
};

export const getGeneration = data => dispatch => {
  makeRequest('/car/generation', getFormData(data), dispatch).then(json => {
    dispatch(
      setData({
        generation: json
          ? {year: data.year, data: json ? json.data : []}
          : false,
      }),
    );
  });
};

export const getModification = data => dispatch => {
  makeRequest('/car/modification', getFormData(data), dispatch).then(json => {
    dispatch(
      updateData({
        key: 'modification',
        value: {
          [data.generation]: {
            generationAlias: data.generation,
            data: json ? json.data : [],
          },
        },
      }),
    );
  });
};

export const getRegionsTowns = data => dispatch => {
  makeRequest('/car/towns', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(
        updateData({
          key: 'towns',
          value: {
            [data.region_id]: {
              regionAlias: data.region_id,
              data: getArrFromObj(json.data),
            },
          },
        }),
      );
    }
  });
};

export const addCar =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest('/car/add', getFormData(data), dispatch).then(json => {
      if (json) {
        dispatch(getUserCars({page: '0', per_page: 12}));
        callback(
          {isOwnCar: true, alias: json.data.alias, justCreated: true},
          json,
        );
      } else {
        callback();
      }
    });
  };

export const addSparePart =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest('/car/part/add', getFormData(data), dispatch).then(json => {
      if (json) {
        dispatch(getUserSpareParts({page: '0', per_page: 12}));
        callback(
          {
            sparePart: true,
            service: false,
            alias: json.data.alias,
            justCreated: true,
          },
          json,
        );
      } else {
        callback();
      }
    });
  };

export const addService =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest('/car/service/add', getFormData(data), dispatch).then(json => {
      if (json) {
        dispatch(getUserServices({page: '0', per_page: 12}));
        callback(
          {
            service: true,
            sparePart: false,
            alias: json.data.alias,
            justCreated: true,
          },
          json,
        );
      } else {
        callback();
      }
    });
  };

export const getUserCars =
  (data, state = [], callback = () => {}) =>
  dispatch => {
    makeRequest('/user/cars', getFormData(data), dispatch).then(async json => {
      let KGS = await AsyncStorage.getItem('kgs_rate');
      dispatch(
        updateData({
          key: 'totalCounts',
          value: {
            all_user_cars: json
              ? parseInt(json.data.cars_data.all_user_cars) - 1
              : 0,
          },
        }),
      );
      dispatch(
        setData({
          userCars: json
            ? [
                ...state,
                ...json.data.cars_data.user_cars.map(car =>
                  getPassedDate(car, carKeys[0], carKeys[1], KGS),
                ),
              ]
            : [],
        }),
      );
      callback();
    });
  };

export const getUserSpareParts =
  (data, state = [], callback = () => {}) =>
  dispatch => {
    makeRequest('/user/parts', getFormData(data), dispatch).then(json => {
      dispatch(
        updateData({
          key: 'totalCounts',
          value: {
            all_user_parts: json ? json.data.parts_data.all_user_parts : 0,
          },
        }),
      );
      dispatch(
        setData({
          userSpareParts: json
            ? [
                ...state,
                ...json.data.parts_data.user_parts.map(sparePart =>
                  getPassedDate(sparePart, ['date_creation'], ['date_text']),
                ),
              ]
            : [],
        }),
      );
      callback();
    });
  };

export const getUserServices =
  (data, state = [], callback = () => {}) =>
  dispatch => {
    makeRequest('/user/services', getFormData(data), dispatch).then(json => {
      dispatch(
        updateData({
          key: 'totalCounts',
          value: {
            all_user_services: json
              ? json.data.services_data.all_user_services
              : 0,
          },
        }),
      );
      dispatch(
        setData({
          userServices: json
            ? [
                ...state,
                ...json.data.services_data.user_services.map(service =>
                  getPassedDate(service, ['date_creation'], ['date_text']),
                ),
              ]
            : [],
        }),
      );
      callback();
    });
  };

export const getTariffs = data => dispatch => {
  makeRequest(
    '/site/tariffs',
    Boolean(data) ? getFormData(data) : {},
    dispatch,
  ).then(json => {
    if (json) {
      dispatch(setData({tariffs: json.data}));
    }
  });
};

export const addHighlight = (data, callback) => dispatch => {
  makeRequest('/car/highlight/add', getFormData(data), dispatch).then(json => {
    callback(json);
  });
};

export const addAutoUp = (data, callback) => dispatch => {
  makeRequest('/car/autoup/add', getFormData(data), dispatch).then(json => {
    callback(json);
  });
};

export const addVip = (data, callback) => dispatch => {
  makeRequest('/car/vip/add', getFormData(data), dispatch).then(json => {
    callback(json);
  });
};

export const deleteCar = (data, callback) => dispatch => {
  makeRequest('/car/delete', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(getUserCars({alias: data.alias}, [], callback));
      dispatch(getCarsFiltered({page: '0'}));
      dispatch(setData({alert: {message: json.message, severity: 'success'}}));
    }
  });
};

export const deleteSparePart = (data, callback) => dispatch => {
  makeRequest('/car/part/delete', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(getUserSpareParts({alias: data.alias}, [], callback));
      dispatch(getSparePartsFiltered({page: '0'}));
      dispatch(setData({alert: {message: json.message, severity: 'success'}}));
    }
  });
};

export const deleteService = (data, callback) => dispatch => {
  makeRequest('/car/service/delete', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(getUserServices({alias: data.alias}, [], callback));
      dispatch(getServicesFiltered({page: '0'}));
      dispatch(setData({alert: {message: json.message, severity: 'success'}}));
    }
  });
};

// data with alias
export const updateCar = (data, callback) => dispatch => {
  makeRequest('/car/add', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(getUserCars());
      callback(json.message);
    } else {
      callback();
    }
  });
};

export const updateSparePart = (data, callback) => dispatch => {
  makeRequest('/car/part/add', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(getUserSpareParts());
      callback(json.message);
    } else {
      callback();
    }
  });
};

export const updateService = (data, callback) => dispatch => {
  makeRequest('/car/service/add', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(getUserServices());
      callback(json.message);
    } else {
      callback();
    }
  });
};

export const deleteImage = data => dispatch => {
  makeRequest('/image/delete', getFormData(data), dispatch);
};

export const addTariffPlan =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest('/user/plan/add', getFormData(data), dispatch).then(json => {
      if (json) {
        dispatch(getUserData());
        dispatch(getSalonsFiltered({page: '0'}, () => {}, false));
        dispatch(
          setData({
            salonsFiltered: [],
          }),
        );
        callback(true);
      } else {
        callback();
      }
    });
  };

export const updateTariffPlan =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest('/user/plan/update', getFormData(data), dispatch).then(json => {
      if (json) {
        dispatch(getUserData());
        dispatch(getSalonsFiltered({page: '0'}, () => {}, false));
        dispatch(setData({salonsFiltered: []}));
        callback(true);
      } else {
        callback();
      }
    });
  };

export const deleteTariffPlan = (data, callback) => dispatch => {
  makeRequest('/user/plan/delete', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(getUserData());
      dispatch(getSalonsFiltered({page: '0'}, () => {}, false));
      callback(json);
    }
  });
};

export const addComments =
  (data, callback = () => {}) =>
  dispatch => {
    makeRequest('/comment/add', getFormData(data), dispatch).then(json => {
      if (json) {
        dispatch(getComments({alias: data.alias, category: data.category}));
        dispatch(setData({alert: {message: json.message, severity: 'error'}}));
        callback();
      }
    });
  };

export const sendActivationCode = () => dispatch => {
  makeRequest('/user/send_activation_code', {}, dispatch).then(json => {
    if (json) {
      dispatch(setData({alert: {message: json.message, severity: 'success'}}));
    }
  });
};

export const resendActivationCode = callback => dispatch => {
  makeRequest('/user/resend_activation_code', {}, dispatch).then(json => {
    if (json) {
      dispatch(setData({alert: {message: json.message, severity: 'success'}}));
      callback();
    }
  });
};

export const activateUser = (data, callback) => dispatch => {
  makeRequest('/user/activate', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(setData({alert: {message: json.message, severity: 'success'}}));
      callback();
    }
    appAxios.defaults.headers['X-API-KEY'] = '';
  });
};

export const addToFavorites = (data, favorites, callback) => dispatch => {
  makeRequest('user/favorites/add', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(
        setData({
          favorites,
        }),
      );
      callback();
    }
  });
};

export const deleteFromFavorites = (data, favorites, callback) => dispatch => {
  makeRequest('user/favorites/delete', getFormData(data), dispatch).then(
    json => {
      if (json) {
        dispatch(
          setData({
            alert: {message: 'Успешно удалено', severity: 'success'},
          }),
        );
        dispatch(
          setData({
            favorites,
          }),
        );
        callback();
      }
    },
  );
};

export const balanceReplenishment = (data, callback) => dispatch => {
  makeRequest('/user/refill', getFormData(data), dispatch).then(json => {
    if (json) {
      dispatch(setData({webViewData: json.data}));
      callback(true);
    }
    callback();
  });
};
