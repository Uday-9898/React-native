import {API_URL} from './Env';
import {get, post, deleteFetch} from './Api';
import {methods} from '../../utils/constants/api';
import {CALENDAR_WEEKLY} from '../constants/queryParams';
import {FILTER_NONE_ID} from '../constants/rotaShift';
import queryString from 'query-string';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiURL} from './Env';
import {
  TENANT,
} from '../../utils/constants/storageKeys';

const {POST, PATCH} = methods;

const getBaseUrl = async() => {
  const tenant = await AsyncStorage.getItem(TENANT);
  return `${apiURL}/${tenant}/api/v1`;
};

export const getRotaShifts = async(values) => {

  let stringified = '';
  let toParse = {};
  const baseUrl = await getBaseUrl();
  if (values.carer) {
    toParse['employee.id'] = values.carer;
  }
  if (values.shift) {
    toParse['pattern'] = values.shift;
  }
  if (values.availability !== '') {
    if (values.availability === FILTER_NONE_ID) {
      toParse['availability'] = values.availability;
    } else {
      toParse.is_available = values.availability;
    }
  }
  if (values.offset) {
    toParse.offset = values.offset;
  }
  const new_start_date = new Date(values.start_date);
  const new_end_date = new Date(values.end_date);

  let datesRange = '';
  // start_date to utc and backend required format
  datesRange =
    'start_date=' + encodeURIComponent(new_start_date.getUTCString());

  // end_date to utc and backend required format and concat to start_date
  datesRange =
    datesRange + '&end_date=' + encodeURIComponent(new_end_date.getUTCString());

  // datesRange = encodeURIComponent(datesRange)

  // if stringified has value then concat with &

  stringified = queryString.stringify(toParse) || '';
  if (stringified) {
    stringified = stringified + '&' + datesRange;
  } else {
    stringified = datesRange;
  }
  let url = '';
  if (values.shiftType === CALENDAR_WEEKLY) {
    url = `${baseUrl}/scheduler/rota/weekly/?${stringified}`;
  } else {
    url = `${baseUrl}/scheduler/rota/daily/?${stringified}`;
  }
  
  // const data = get(url)
  // console.log(url,data);
  return get(url);
};

export const setAvailability = async values => {
  const baseUrl = await getBaseUrl();
  if (!values.employee) {
    return;
  }
  console.log('values', values)
  const method = values.id ? PATCH : POST;
  const url = values.id
    ? `${baseUrl}/shifts/availabilities/${values.id}/`
    : `${baseUrl}/shifts/availabilities/`;

  const body = {
    ...values,
  };
   
  return post(url, body, method);
};



export const setAvailabilityDetails = async (values, availability_Id) => {
  if (!availability_Id) {
    return;
  }
  const baseUrl = await getBaseUrl();
  const method = values.id ? PATCH : POST;
  const url = values.id
    ? `${baseUrl}/shifts/availabilities/${availability_Id}/details/${
        values.id
      }/`
    : `${baseUrl}/shifts/availabilities/${availability_Id}/details/`;

  const body = {
    ...values,
  };

  return post(url, body, method);
};

export const deleteAvailabilitiesDetails = async (
  shiftAvailabilityId,
  detailId,
) => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/shifts/availabilities/${shiftAvailabilityId}/details/${detailId}/`;
  return deleteFetch(url);
};

export const deleteShiftDetails = async (shiftId, detailId) => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/shifts/shifts/${shiftId}/shift-details/${detailId}/`;
  return deleteFetch(url);
};

export const deleteAvailabilities = async shiftAvailabilityId => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/shifts/availabilities/${shiftAvailabilityId}/`;

  return deleteFetch(url);
};

export const getAvailabilities = async shiftAvailabilityId => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/shifts/availabilities/${shiftAvailabilityId}/`;

  return get(url);
};

export const getShiftById = async shiftId => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/shifts/shifts/${shiftId}/`;

  return get(url);
};

export const setSplitAvailability = async values => {
  if (!values.employee) {
    return;
  }
  console.log('split data', values);
  const baseUrl = await getBaseUrl();
  const method = POST;
  const url = `${baseUrl}/shifts/split-shift-availability/`;

  const body = {
    ...values,
  };

  return post(url, body, method);
};



