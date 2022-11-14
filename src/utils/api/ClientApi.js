import {API_URL} from './Env';
import {get} from './Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiURL} from './Env';
import {
  TENANT,
} from '../../utils/constants/storageKeys';

export const getFileData = async(id) => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/clients/file-upload/client/?client_id=${id}`;
  return get(url);
};

const getBaseUrl = async() => {
  const tenant = await AsyncStorage.getItem(TENANT);
  return `${apiURL}/${tenant}/api/v1`;
};

export const getClient = async(id) => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/clients/${id}/`;
  return get(url);
};


export const getEmployees = (values, limitPerPage) => {

  const baseUrl = getBaseUrl();
  let stringified = '';
  let toParse = {};
  if (values.employment_type) {
    toParse.job_detail__employment_type_id = values.employment_type;
  }
  if (values.employee_category) {
    toParse.job_detail__employee_category_id = values.employee_category;
  }
  if (values.job_title) {
    toParse.job_detail__job_title_id = values.job_title;
  }
  if (values.search) {
    toParse.search = values.search;
  }
  if (values.ordering) {
    toParse.ordering = values.ordering;
  }
  if (values.offset) {
    toParse.offset = values.offset;
  }
  if (limitPerPage) {
    toParse.limit = limitPerPage;
  }
  stringified = queryString.stringify(toParse) || '';

  const url = stringified
    ? `${baseUrl}/employees/?${stringified}`
    : `${baseUrl}/employees/`;

  return get(url);
};