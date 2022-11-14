import {API_URL} from './Env';
import {get} from './Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiURL} from './Env';
import {
  TENANT,
} from '../../utils/constants/storageKeys';

const getBaseUrl = async() => {
  const tenant = await AsyncStorage.getItem(TENANT);
  return `${apiURL}/${tenant}/api/v1`;
};
export const getChoices = async() => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/core/choices/`;
  return get(url);
};
export const getChoicesEmployee = async() => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/core/choices/?key=employee_listing`;
  return get(url);
};
export const getRoles = async() => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/roles_and_permissions/user-roles-and-permissions`;
  return get(url);
};