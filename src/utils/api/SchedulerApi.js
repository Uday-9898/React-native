import queryString from 'query-string';
import {get, post} from './Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {methods} from '../../utils/constants/api';
import {apiURL} from './Env';
import {PAGE_SIZE_RENDER} from '../constants/pagination';
import {CALENDAR_WEEKLY} from '../constants/queryParams';
import {
  TENANT,
} from '../../utils/constants/storageKeys';
const {POST, PATCH} = methods;

const  getBaseUrl = async() => {
  const tenant = await AsyncStorage.getItem(TENANT);
  return `${apiURL}/${tenant}/api/v1`;
};

export const getScheduler = async(values, pageSize) => {
  let stringified = '';
  let toParse = {};
  let filterParse={};
  const baseUrl = await getBaseUrl();

  if (values.employees) {
    filterParse.employees = values.employees;
  }
  if (values.client) {
    let clientFilter=values.client.map(data=>data.id)
    let strClientFilter=clientFilter.join(",")
    filterParse.clients = strClientFilter;
  }
  if (values.visits) {
    toParse.visits = values.visits;
  }
  if (values.availability !== '') {
    toParse.is_available = values.availability;
  }

  toParse.limit = pageSize || PAGE_SIZE_RENDER;

  const new_start_date = new Date(values.start_date);
  const new_end_date = new Date(values.end_date);

  let datesRange = '';
  // start_date to utc and backend required format
  datesRange =
    'start_date=' + encodeURIComponent(new_start_date.getUTCString());

  // end_date to utc and backend required format and concat to start_date
  datesRange =
    datesRange + '&end_date=' + encodeURIComponent(new_end_date.getUTCString());

  // if stringified has value then concat with &
  stringified = queryString.stringify(toParse) || '';
if(filterParse.employees && filterParse.clients){
  stringified='employees='+filterParse.employees+'&'+'clients='+filterParse.clients+'&'+stringified;
}
else if(filterParse.employees){
  stringified='employees='+filterParse.employees+'&'+stringified;
}
else if(filterParse.clients){
  stringified='clients='+filterParse.clients+'&'+stringified;
}
  if (stringified) {
     stringified = stringified + '&' + datesRange;
  } else {
    stringified = datesRange;
  }
  let url = '';
  if (values.shiftType === CALENDAR_WEEKLY) {
    url = `${baseUrl}/scheduler/visits/weekly/?${stringified}&view=Mobile`;
  } else {
    url = `${baseUrl}/scheduler/visits/daily/?${stringified}&view=Mobile`;
  }
  
  return get(url);
};

export const getVisitDetail = async visitId => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/scheduler/visits/${visitId}/`;

  return get(url);
};

export const setSchedulerVisitsClockIn = async (visitId, values, revertClockOut) => {
  const baseUrl = await getBaseUrl();
  const method = revertClockOut ? PATCH : POST;
  const url = revertClockOut ? `${baseUrl}/scheduler/visits/${visitId}/evvs/revert_clock_out/` : `${baseUrl}/scheduler/visits/${visitId}/evvs/clock_in/`;
  const body = {
    ...values,
  };
  return post(url, body, method);
};

export const setSchedulerVisitsClockOut = async(visitId, values) => {
  const baseUrl = await getBaseUrl();
  const method = POST;
  const url = `${baseUrl}/scheduler/visits/${visitId}/evvs/clock_out/`;

  const body = {
    ...values,
  };
  
  
  return post(url, body, method);
};

export const getVisitEvvslist = async visitId => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/scheduler/visits/${visitId}/evvs/`;
  return get(url);
};

export const setSchedulerVisitsRevertClock = async(visitId, value, clock_in_force) => {
  const baseUrl = await getBaseUrl();
  const method = PATCH;
  const url = 
  value 
  ? `${baseUrl}/scheduler/visits/${visitId}/evvs/revert_clock_out/`
  :  `${baseUrl}/scheduler/visits/${visitId}/evvs/revert_clock_in/`;
  const body = { };
  
  return post(url, body, method);
};
export const setSchedulerVisitsRevertBoth = async(visitId, values) => {
  const baseUrl = await getBaseUrl();
  const method = PATCH;
  const url = `${baseUrl}/scheduler/visits/${visitId}/evvs/cancel_clock_in_out/`;
  const body = {  };
  
  return post(url, body, method);
};