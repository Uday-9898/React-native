import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from './Env';
import {
  methods,
  headers,
  config,
  unauthorized_status_code,
  internal_server_status_code,
} from '../constants/api';

import {post} from './Api';
import {TOKEN, USERNAME, USER_EMAIL, USER_NAME} from '../constants/storageKeys';

const {POST, PUT} = methods;
const {REQUEST_TIMEOUT} = config;
const requestTimeOut = REQUEST_TIMEOUT * 1000;

export const getUser = async (username) => {
  const url = `${API_URL}/users/${username}/`;

  const token = await AsyncStorage.getItem(TOKEN);

  const response = await fetch(url, {
    headers: {
      ...headers,
      Authorization: 'Token ' + token,
    },
  });
  console.log("response",response,url);
  if (response && response.status === unauthorized_status_code ) {
    return false;
  }

  if (response && response.status === internal_server_status_code ) {
    return false;
  }

  
  console.log("response",response);
  const json = await response.json();
  return json;
};

export const setNewPin = async (values) => {
  const url = `${API_URL}/users/mobilePasswordSet/`;

  const token = await AsyncStorage.getItem(TOKEN);

  const body = {
    ...values
  };

  const response = await _fetch(url, {
    method: POST,
    headers: {
      ...headers,
      Authorization: 'Token ' + token,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (response.status !== 200 && response.status !== 201) {
    throw {message: json.message};
  }

  //const json = await response.json();

  return json;
};

export const setResetPin = async (values) => {
  const url = `${API_URL}/users/mobilePasswordReset/`;

  const token = await AsyncStorage.getItem(TOKEN);

  const body = {
    ...values
  };

  const response = await _fetch(url, {
    method: POST,
    headers: {
      ...headers,
      Authorization: 'Token ' + token,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (response.status !== 200 && response.status !== 201) {
    throw {message: json.message};
  }

  //const json = await response.json();

  return json;
};

export const login = async (email, password) => {
  const url = `${API_URL}/users/login/`;
  const body = {
    email,
    password,
  };

  const response = await _fetch(url, {
    method: POST,
    headers: {
      ...headers,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (response.status !== 200 && response.status !== 201) {
    throw (password.length === 4) ? {message: 'Incorrect pin'} : {message: 'Email or password are incorrect.'};
  }

  const json = await response.json();

  return json;
};

export const _fetch = async (url, props = {}, ms = requestTimeOut) => {
  let options = {...props};
  // eslint-disable-next-line no-sparse-arrays
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request Timeout')), ms),
    ),
    ,
  ]);
};

export const logout = async (username, email) => {
  const url = `${API_URL}/users/logout/`;

  const body = {
    username,
    email,
  };

  return post(url, body, POST);
};

export const forgotPassword = async email => {
  const url = `${API_URL}/users/forgot/`;

  const body = {
    email,
  };

  const response = await fetch(url, {
    method: POST,
    headers: {
      ...headers,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  return json;
};

export const forgotPin = async email => {
  const url = `${API_URL}/users/mobilePasswordForgot/`;
  
  const body = {
    email,
  };

  const response = await fetch(url, {
    method: POST,
    headers: {
      ...headers,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  return json;
};

export const resetCredentials = async values => {
  const user_name = await AsyncStorage.getItem(USER_NAME);
  const method = PUT;
  const url = `${API_URL}/users/${user_name}/reset/`;
  const body = {
    email: await AsyncStorage.getItem(USER_EMAIL),
    ...values,
  };

  return post(url, body, method);
};
