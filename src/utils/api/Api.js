// import {getToken, clearToken} from '../localStorage/token';
import {headers, methods, unauthorized_status_code} from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOKEN} from '../constants/storageKeys';

const {DELETE} = methods;

export const get = async url => {
  const token = await AsyncStorage.getItem(TOKEN);
  const response = await fetch(url, {
    headers: {
      ...headers,
      Authorization: 'Token ' + token,
    },
  });

  if (response && response.status === unauthorized_status_code) {
    await AsyncStorage.setItem(TOKEN, '');
    window.location.reload();
  }
  const json = await response.json();
  
  // Todo: import clearTocken from '../localStorage/token';
  // if (response.status !== 200) {
  //   if (response.status === 401) clearToken();
  //   throw json;
  // }

  return json;
};

export const post = async (url, body, method) => {
  const token = await AsyncStorage.getItem(TOKEN);
  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      Authorization: 'Token ' + token,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response && response.status === unauthorized_status_code) {
    await AsyncStorage.setItem(TOKEN, '');
    window.location.reload();
  }

  const json = await response.json();

  // Todo: import clearTocken from '../localStorage/token';
  // if (response.status !== 200) {
  //   if (response.status === 401) clearToken();
  //   throw json;
  // }

  return json;
};

export const deleteFetch = async url => {
  const token = await AsyncStorage.getItem(TOKEN);

  const response = await fetch(url, {
    method: DELETE,
    headers: {
      ...headers,
      Authorization: 'Token ' + token,
    },
  });

  if (response && response.status === unauthorized_status_code) {
    await AsyncStorage.setItem(TOKEN, '');
    window.location.reload();
  }

  let json = '';
  if (response.status === 200) {
    json = await response.json();
  }

  // Todo: import clearTocken from '../localStorage/token';
  // if (response.status !== 200) {
  //   if (response.status === 401) clearToken();
  //   throw json;
  // }

  return json;
};

// const getToken = () => {
//   const user = auth().currentUser;
//   if (!user) {
//     return null;
//   }
//   return user.getIdToken();
// };

// export const _fetch = async (
//   url,
//   props = {},
//   withToken = true,
//   ms = requestTimeOut,
// ) => {
//   let options = {...props};
//   if (withToken) {
//     const token = await getToken();
//     const headers = options.headers || {};
//     headers.authorization = token ? 'Bearer ' + token : '';
//     options.headers = headers;
//   }
//   // eslint-disable-next-line no-sparse-arrays
//   return Promise.race([
//     fetch(url, options),
//     new Promise((_, reject) =>
//       setTimeout(() => reject(new Error('Request Timeout')), ms),
//     ),
//     ,
//   ]);
// };
