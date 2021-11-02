import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import {ToastShow} from '../Components/ToastShow';

import {setData} from '../Store';
export * from './getRequest';
export * from './postRequest';

export const appAxios = axios.create({
  baseURL: 'https://control.carket.kg/api/v1.0',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export const makeRequest = (endpoint, formData, dispatch) => {
  const responseHandler = res => {
    console.log(res.data);
    if (Boolean(res.data.result)) {
      return res.data;
    } else {
      if (res.data.message === 'Доступ запрещен.') {
        appAxios.defaults.headers['X-API-KEY'] = '';
        dispatch(setData({token: ''}));
        dispatch(
          setData({
            alert: {
              message: 'Время действия токена истёк',
              severity: 'error',
            },
          }),
        );
        AsyncStorage.removeItem('carketToken');
        return;
      }
      if (
        res.data.message ===
        'Доступ к авторизации запрещен. Возможно вы уже авторизованы.'
      ) {
        return checkIsItRegistration(dispatch);
      }
      if (res.data.message !== 'Нет информации.') {
        ToastShow(res.data.message, 2000, 'error');
      }
    }
  };
  if (formData) {
    return appAxios
      .post(endpoint, formData)
      .then(res => responseHandler(res))
      .catch(error => {
        console.log(`catched post:${endpoint}`, error);
      });
  } else {
    return appAxios
      .get(endpoint)
      .then(res => responseHandler(res))
      .catch(error => console.log(`catched get:${endpoint}`, error));
  }
};

const checkIsItRegistration = async dispatch => {
  const token = await AsyncStorage.getItem('carketToken');
  if (!Boolean(token)) {
    appAxios.defaults.headers['X-API-KEY'] = '';
    dispatch(
      setData({
        alert: {message: 'Время действия токена истёк', severity: 'error'},
      }),
    );
  }
};

export const getFormData = obj => {
  let data = new FormData();

  for (let key in obj) {
    if (Boolean(obj[key])) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(item => data.append(`${key}[]`, item));
      } else {
        data.append(key, obj[key]);
      }
    }
  }
  return data;
};

export const getUrlString = obj => {
  let url = '';
  let keys = Object.keys(obj).filter(key => Boolean(obj[key]));

  keys.forEach(
    (key, index) =>
      (url +=
        keys.length === index + 1
          ? `${key}=${obj[key]}`
          : `${key}=${obj[key]}&`),
  );
  console.log(url);
  return url;
};

export const getArrFromObj = (obj, withValue = false) => {
  let arr = [];
  for (let key in obj) {
    if (withValue) {
      arr.push({value: key, name: obj[key].name});
    } else {
      arr.push(obj[key]);
    }
  }
  return arr;
};

export const getMeasurement = time => {
  let currentTime = moment();
  switch (true) {
    case currentTime.diff(time, 'years') > 0: {
      let number = currentTime.diff(time, 'years');
      return `${number} год${number === 1 ? '' : 'а'} назад`;
    }
    case currentTime.diff(time, 'months') > 0: {
      let number = currentTime.diff(time, 'months');
      return `${number} месяц${number === 1 ? '' : 'а'} назад`;
    }
    case currentTime.diff(time, 'weeks') > 0: {
      let number = currentTime.diff(time, 'weeks');
      return `${number} недел${number === 1 ? 'ю' : 'и'} назад`;
    }
    case currentTime.diff(time, 'days') > 0: {
      let number = currentTime.diff(time, 'days');
      return `${number} ${
        number === 1 ? 'день' : number > 1 && number < 5 ? 'дня' : 'дней'
      } назад`;
    }
    case currentTime.diff(time, 'hours') > 0: {
      let number = currentTime.diff(time, 'hours');
      return `${number} ${
        number === 1 || number === 21
          ? 'час'
          : (number > 21 && number < 25) || (number > 1 && number < 5)
          ? 'часа'
          : 'часов'
      } назад`;
    }
    default: {
      let number = currentTime.diff(time, 'minutes'),
        numArr = number.toString().split('');
      return `${number} ${
        number === 1 || (number !== 11 && numArr[1] === 1)
          ? 'минуту'
          : (number < 11 && number > 15 && numArr[1] > 1 && numArr[1] < 5) ||
            (number > 1 && number < 5)
          ? 'минуты'
          : 'минут'
      } назад`;
    }
  }
};

export const getPassedDate = (
  obj,
  input_keys_arr,
  output_keys_arr,
  get_rate,
) => {
  let dates = [];
  // Конвертируем unix формат и сохраняем в массив dates
  input_keys_arr.forEach(key => dates.push(moment.unix(obj[key]).utc()));

  output_keys_arr.forEach((key, index) => {
    obj[key] = getMeasurement(dates[index]);
  });

  if (get_rate) {
    obj.secondary_price = Math.floor(obj.price * get_rate);
  }
  return obj;
};

export const carKeys = [
  ['upped_at', 'date'],
  ['upped_at_text', 'date_text'],
];
