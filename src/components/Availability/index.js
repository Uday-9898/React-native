import React, { useEffect, useState, useContext, Fragment } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEmployees } from './../../utils/api/ClientApi';
import {
  View,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { styles } from './styles';
import { validateTime } from './../../shared/Methods/DateMethods/index';
import {
  HeaderAvailabilities,
  Availabilities,
  PopModal,
  SplitPopModal,
} from '../../shared/components';
import {
  getWeekNumber,
  getTime,
  compareTime,
  dateIsoFormat,
  dateTimeFormat,
  compareDate,
  compareTimeDate,
} from '../../shared/Methods/DateMethods';
import {
  setAvailability,
  setAvailabilityDetails,
  getAvailabilities,
  getShiftById,
  deleteAvailabilitiesDetails,
  deleteAvailabilities,
  setSplitAvailability,
  deleteShiftDetails
} from '../../utils/api/RotaShiftApi';
import {
  AVAILABLE_EXISTING_UNAVAILABLE,
  UNAVAILABLE_EXISTING_AVAILABLE,
  AVAILABLE_EXISTING_SHIFT,
  UNAVAILABLE_EXISTING_SHIFT,
  UNAVAILABILITY_VIEW,
} from '../../utils/constants/rotaShift';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../../utils/context/GlobalContext';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AVAILABILITY_VIEW } from '../../utils/constants/rotaShift';
import { getChoices } from '../../utils/api/CoreApi';
import { USER_ID, ISADMIN, ISSTAFF } from '../../utils/constants/storageKeys';
import { format } from 'date-fns';
import ValidationMessages from './ValidationMessages';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { ERR_COLOR } from '../../assets/Colors';
import PropTypes from 'prop-types';
import moment from "moment";

const Availability = ({ route }) => {
  const navigation = useNavigation();
  const [stateGlobal, setStateGlobal] = useContext(GlobalContext);
  const [travelMethod, setTravelMethod] = useState([]);
  const [shiftOverlapData, setOverlapData] = useState([])
  const [overlapMessage, setOverlapMessage] = useState('')
  const [choices, setChoices] = useState([]);
  const [isEdition, setRouteStatus] = useState(false);
  const [deleteButton, setDeleteButton] = useState(false);
  const [values, setValues] = useState({
    start_date: '',
    end_date: '',
    start: '',
    end: '',
    employee: '',
    travel_method: '',
    is_overnight: false,
    is_absent: false,
    absence_informed_method: '',
    absence_paid: '',
    absence_planned: '',
    absence_reason: '',
    absence_type: '',
    absence_notes: '',
    sickness_reason: '',
  });
  const [errors, setErrors] = useState({});
  const [splitIndex, setSplitIndex] = useState(0);
  const [shiftData, setShiftData] = useState({
    shift_pattern_name: '',
    start_date: '',
    end_date: '',
    travel_mode: '',
  });
  const [timeMessage, setTimeMessage] = useState('Is required');
  const [validateMessage, setValidateMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [splitModalVisible, setSplitModalVisible] = useState(false);
  const [daysArray, setDaysArray] = useState([]);
  const [resources, setResources] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const addEmployeeId = async () => {
      setValues({
        ...values,
        employee: await AsyncStorage.getItem(USER_ID),
      });
    };

    addEmployeeId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.employee]);

  useEffect(() => {
    const timeValid = validateTime(
      true,
      values.start_day,
      values.end_day,
      values.start,
      values.end
    );
    if (timeValid || (!values.start && !values.end)) {
      setTimeMessage('Is required');
    } else {
      setTimeMessage(InvalidRange);
    }
  }, [
    values.start,
    values.end,
    values.start_day,
    values.end_day,
  ])


  useEffect(() => {
    
    if(!isEdition){
      if (
        values.start_date &&
        values.end_date &&
        values.start_date <= values.end_date
      ) {
        setErrors({ ...errors, start_date: false, end_date: false });
      }
  
      if (values.start && values.end && values.start_date && values.end_date) {
        if (compareTimeDate(values.start, values.end, '<')) {
          setErrors({
            ...errors,
            start: false,
            end: false,
          });
        }
      }
  
      setValidateMessage('');
  
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (route && route.params && route.params.availabilityId) {
      if (route && route.params && route.params.isShift) {
        getShiftDetail(route.params.availabilityId);
      } else {
        getAvailabilityDetail(route.params.availabilityId);
      }
      setRouteStatus(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, choices]);

  useEffect(() => {
    loadChoices();
    //  loadEmployees()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEmployees = () => {
    getEmployees({}, 500).then(response => {
      if (!mountedRef.current) return null;

      // const data = [...employee]
      // const employeeId = response.map(id => data.id);


      let employees = [];
      let employeesResources = [];
      if (response.results) {
        employees = response.results.map(employee => {
          return {
            id: employee.id, name: employee.full_name

          };
        });

        employeesResources = response.results.map(employee => {
          return {
            id: employee.id,
            title: employee.full_name,
          };
        });
        setResources(employeesResources);
      }

      setEmployees(employees || []);
    });
  };


  const loadChoices = async () => {
    try {
      const choices = await getChoices();

      if (choices && choices.travel_type) {
        choices.travel_type.map(item => {
          item.label = item.name;
          item.value = item.id;
        });
        if (choices) {
          setChoices(choices || []);
        }
        setTravelMethod(choices.travel_type);
      }
    } catch (error) { }
  };

  const getAvailabilityDetail = async availabilityId => {
    try {
      const response = await getAvailabilities(availabilityId);
      const new_values = {};

      response.details.forEach(item => {
        if (item.id === route.params.detailId) {
          new_values.start_date = new Date(item.start_date);
          new_values.end_date = new Date(item.end_date);
          new_values.start = moment(item.start_date).format('YYYY-MM-DD HH:mm:ss');
          new_values.end = moment(item.end_date).format('YYYY-MM-DD HH:mm:ss');
          new_values.is_overnight = item.is_overnight;
          new_values.is_absent = item.is_absent ? item.is_absent : false;
          new_values.absence_informed_method = item.absence_informed_method ? item.absence_informed_method : '';
          new_values.absence_paid = item.absence_paid ? item.absence_paid : '';
          new_values.absence_planned = item.absence_planned ? item.absence_planned : '';
          new_values.absence_reason = item.absence_reason ? item.absence_reason : '';
          new_values.absence_type = item.absence_type ? item.absence_type : '';
          new_values.absence_notes = item.absence_notes ? item.absence_notes : '';
          new_values.sickness_reason = item.sickness_reason ? item.sickness_reason : '';

        }
      });
      console.log('values', new_values);
      if (choices.length != 0) {
        setValues({
          ...values,
          ...new_values,
          travel_method: response.travel_method,
        });
      }
    } catch (error) { }
  };

  const getShiftDetail = async availabilityId => {
    try {
      const response = await getShiftById(availabilityId);
      let travel_name = choices && choices.travel_type.find(val => val.id === response.travel_mode);
      const new_value = {};
      new_value.shift_pattern_name = response.shift_pattern_name;
      new_value.start_date = moment(response.start_date && response.start_date).format("YYYY-MM-DD");
      new_value.end_date = moment(response.end_date && response.end_date).format("YYYY-MM-DD");
      new_value.travel_mode = travel_name && travel_name.name;
      setShiftData(new_value);
    } catch (error) { }
  };

  const assignMessageAvailableUnavailable = (available, result, employee_id, indexSplit) => {
    if (result && !result.message) {
      if (available) {
        // setValidateMessage(AVAILABLE_EXISTING_SHIFT);
        setTimeout(() => {
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: true,
              textModal: 'Saved Successful',
            },
          }))
        }, 100)
        navigation.goBack()

      } else {
        // setValidateMessage(UNAVAILABLE_EXISTING_SHIFT);
        setTimeout(() => {
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: true,
              textModal: 'Saved Successful',
            },
          }))
        }, 100)
        navigation.goBack()
      }
      if (!employee_id) {
        navigation.goBack()
      } else {
        if (shiftOverlapData && shiftOverlapData.length > 1) {
          shiftOverlapData.splice(indexSplit, 1);
          setOverlapData(shiftOverlapData);
          setTimeout(() => {
            setStateGlobal(state => ({
              ...state,
              requestModal: {
                isVisible: true,
                isSuccess: true,
                textModal: 'Saved Successful',
              },
            }))
          }, 100)

        }
      }
    } else if (result && result.shift_availabilities_dates) {
      let find_availability = null;
      if (result && result.shift_availabilities_dates) {
        find_availability = result.shift_availabilities_dates.find(
          availability_result => availability_result.is_available === 'True',
        );
      }
      // if (find_availability) {
      setSplitModalVisible(true);
      setOverlapMessage(result.message)
      setOverlapData(result.shift_availabilities_dates)
      // setTimeout(()=> {
       // setStateGlobal(state => ({
      //   ...state,
      //   requestModal: {
      //     isVisible: true,
      //     isSuccess: false,
      //     textModal: 'Overlapped',
      //   },
      // }));
      //} , 100)
      // setValidateMessage(UNAVAILABLE_EXISTING_AVAILABLE);
      // } else {
      // setSplitModalVisible(true);
      // setOverlapMessage(result[0].message)
      // setOverlapData(result.shift_availabilities_dates)
      // setTimeout(()=> {
       // setStateGlobal(state => ({
      //   ...state,
      //   requestModal: {
      //     isVisible: true,
      //     isSuccess: false,
      //     textModal: 'Overlapped',
      //   },
      // }));
      //} , 100)
      // setValidateMessage(AVAILABLE_EXISTING_UNAVAILABLE);
      //}
    } else if(result.status === "Warning"){
      setTimeout(()=> {
        setStateGlobal(state => ({
        ...state,
        requestModal: {
          isVisible: true,
          isSuccess: false,
          textModal: result.message,
        },
      }))
      } , 100)
    }
  };

  const addTimeDate = (date_v, time_v) => {
    let date = moment(date_v).format('YYYY-MM-DD');
    let time = moment(time_v).format('HH:mm:ss');

    return moment(date + ' ' + time).format('YYYY-MM-DD HH:mm:ss');
  }

  const onPressApply = async (statusAvailability, force_submit, employee_id, indexSplit, start_date, end_date) => {
    if (stateGlobal.typeAvailabilityView === AVAILABILITY_VIEW) {
      statusAvailability = true;
    } else {
      statusAvailability = false;
    }

    if (validateMessage && !force_submit) {
      return;
    }

    const initialHour = values.start.getHours();
    const initialMinute = values.start.getMinutes();
    const compareInitialDate = new Date(values.start_date);
    compareInitialDate.setHours(initialHour);
    compareInitialDate.setMinutes(initialMinute);
    compareInitialDate.setSeconds(0);

    const myDate = new Date();
    myDate.setSeconds(0);

    setIsAvailable(statusAvailability);
    const availabilityValues = [];
    let requestDetailState = false;

    if (
      !values.start_date ||
      !values.end_date ||
      !values.start ||
      !values.end ||
      !values.regular_shift_type
    ) {
      Alert.alert('Warning', 'Missing fields to fill');
      setErrors({
        ...errors,
        start_date: !values.start_date,
        end_date: !values.end_date,
        start: !values.start,
        end: !values.end,
      });

      return;
    }

    if (
      values.start_date > values.end_date &&
      !compareDate(values.start_date, values.end_date)
    ) {
      Alert.alert('Warning', 'Start date is greater than End date');
      setErrors({
        ...errors,
        start_date: true,
        end_date: true,
        start: false,
        end: false,
      });

      return;
    }

    if (values.is_overnight) {
      if (compareTimeDate(values.start, values.end, '<')) {
        Alert.alert('Warning', 'End time should greater than Start time');
        setErrors({
          ...errors,
          start: true,
          end: true,
        });

        return;
      }
    } else {
      if (compareTimeDate(values.start, values.end, '>')) {
        Alert.alert('Warning', 'Start time is greater than End time');
        setErrors({
          ...errors,
          start: true,
          end: true,
        });

        return;
      }
    }

    if (compareTimeDate(values.start, values.end)) {
      Alert.alert('Warning', 'please add a period of time');
      setErrors({
        ...errors,
        start: true,
        end: true,
      });

      return;
    }

    if (compareInitialDate <= myDate) {
      Alert.alert('Warning', 'Please add a start date in the future ');
      setErrors({
        ...errors,
        start: true,
        end: true,
      });

      return;
    }

    //TODO: add loading
    // setLoadingSave(true);

    let firstDayValue = employee_id ? start_date : values.start_date;
    let weeks = [];
    let day_information = [];
    let forceUpdate = { force: false };

    if (force_submit) {
      forceUpdate = { force: true };
    }

    let travel = {
        travel_method: null,
        travel_time: null
    }

    if(!(values.regular_shift_type_label === 'On Call')){
      travel = {
        travel_method: values.travel_method,
        travel_time: moment(values.travel_time).format('HH:mm')
      }
    }

    let no_of_week = moment(firstDayValue).isoWeek();
    weeks.push(no_of_week);
    let endDayValue = employee_id ? end_date : values.end_date
    while (employee_id ? moment(firstDayValue).isSameOrBefore(end_date) : compareDate(firstDayValue, endDayValue, '<=')) {
      const searchWeek = weeks.indexOf(moment(firstDayValue).isoWeek());

      if (searchWeek <= -1) {
        weeks.push(moment(firstDayValue).isoWeek());
      }

      const beginningTime = getTime(values.start);
      const endTime = getTime(values.end);
      const crossDays =
        values.start_date !== values.end_date &&
        compareTime(beginningTime, endTime);

      const addOneDay = new Date(firstDayValue);
      addOneDay.setDate(addOneDay.getDate() + 1);

      const addDetailId = () => {
        if (route && route.params && route.params.detailId) {
          return { id: route.params.detailId };
        } else {
          return null;
        }
      };
      

      day_information.push({
        week_no: moment(firstDayValue).isoWeek(),
        details: {
          is_available: statusAvailability,
          start_date: employee_id ? addTimeDate(firstDayValue, values.start) : dateIsoFormat(firstDayValue, values.start),
          end_date: crossDays
            ? (employee_id ? addTimeDate(addOneDay, values.end) : dateIsoFormat(addOneDay, values.end))
            : (employee_id ? addTimeDate(firstDayValue, values.end) : dateIsoFormat(firstDayValue, values.end)),
          ...addDetailId(),
        },
      });

      
      if(employee_id){
        firstDayValue = moment(firstDayValue).add(1, 'days').format('YYYY-MM-DD');
      }else{
        firstDayValue = new Date(firstDayValue);
      firstDayValue.setDate(firstDayValue.getDate() + 1);
      }
    }

    console.log('details', day_information);

    const addAvailabilityId = () => {
      if (route && route.params && route.params.availabilityId) {
        return { id: route.params.availabilityId };
      } else {
        return null;
      }
    };

    weeks.forEach(week => {
      const my_days = [];
      day_information.forEach(day_info => {
        if (day_info.week_no === week) {
          delete day_info.week_no;
          my_days.push({ ...day_info.details });
        }
      });
      //console.log('value_start', dateTimeFormat(start_date, values.start));
      
      statusAvailability ?
        availabilityValues.push({
          ...forceUpdate,
          /* ...addAvailabilityId(), */
          employee: [values.employee],
          start_date: employee_id ? addTimeDate(start_date, values.start) : dateIsoFormat(values.start_date, values.start),
          end_date: employee_id ? addTimeDate(end_date, values.end) : dateIsoFormat(values.end_date, values.end),
          shift_type: values.regular_shift_type,
          ...travel,
          details: [...my_days],
          week_of_day: daysArray.join(),
          is_overnight: values.is_overnight
        })
        :
        availabilityValues.push({
          ...forceUpdate,
          /* ...addAvailabilityId(), */
          employee: [values.employee],
          start_date: employee_id ? addTimeDate(start_date, values.start) : dateIsoFormat(values.start_date, values.start),
          end_date: employee_id ? addTimeDate(end_date, values.end) : dateIsoFormat(values.end_date, values.end),
          travel_method: values.travel_method,
          is_available: statusAvailability,
          is_absent: values.is_absent ? values.is_absent : false,
          absence_informed_method: values.absence_informed_method ? values.absence_informed_method : null,
          absence_paid: values.absence_paid ? values.absence_paid : null,
          absence_planned: values.absence_planned ? values.absence_planned : null,
          absence_reason: values.absence_reason ? values.absence_reason : null,
          absence_type: values.absence_type ? values.absence_type : null,
          absence_notes: values.absence_notes ? values.absence_notes : null,
          sickness_reason: values.sickness_reason ? values.sickness_reason : null,
          details: [...my_days],
          week_of_day: daysArray.join(),
          is_overnight: values.is_overnight
        })
    });

    const saveAvailability = function () {
      return async function (availabilities, index) {
        try {
          const response = await setAvailability(availabilities);
          debugger
          if (!response.id) {
            assignMessageAvailableUnavailable(statusAvailability, response, employee_id, indexSplit);
            return;

          }

          await Promise.all(
            availabilityValues[index].details.map(
              saveAvailabilitiesDetails(response.id),
            ),
          );

          return response;
        } catch (error) {
          console.log( 'error', error.message);
          setTimeout(()=> {
            setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: false,
              textModal: 'Error while trying to save',
            },
          }))
          } , 100)
        }
      };
    };

    const saveAvailabilitiesDetails = function (availability_Id) {
      return async function (details) {
        try {
          const result = await setAvailabilityDetails(details, availability_Id);

          if (result) {
            requestDetailState = true;
          }

          return result;
        } catch (error) {
          setTimeout(()=> {
            setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: false,
              textModal: 'Error while trying to save',
            },
          }))
          } , 100)
        }
      };
    };

    const resultAvailabilities = await Promise.all(
      availabilityValues.map(saveAvailability()),
    );

    if (resultAvailabilities.length >= 1 && requestDetailState) {
      setTimeout(()=> {
        setStateGlobal(state => ({
        ...state,
        requestModal: {
          isVisible: true,
          isSuccess: true,
          textModal: 'Saved successful',
        },
      }))
      } , 100)
      navigation.goBack();
    }

    //TODO: add loading
    // setLoadingSave(false);
  };

  const addHeaderTitle = () => {
    if (route && route.params && route.params.isShift) {
      return 'Shift Details'
    }
    else {
      if (stateGlobal.typeAvailabilityView === AVAILABILITY_VIEW) {
        if (isEdition) {
          return 'Availability Details';
        } else {
          return 'Availability';
        }
      } else if (stateGlobal.typeAvailabilityView === UNAVAILABILITY_VIEW) {
        if (isEdition) {
          return 'Unavailability Details';
        } else {
          return 'Unable to work';
        }
      } else {
        if (isEdition) {
          return 'Absence Details';
        }
      }
    }
  };

  const deleteAvailability = async () => {
    setDeleteModalVisible(true);
  };

  const okDeleteAvailability = async () => {
    setDeleteModalVisible(false);
    if (route.params.isShift) {
      try {
        const resData = await deleteShiftDetails(route.params.availabilityId, route.params.detailId,);
        setTimeout(()=> {
          setStateGlobal(state => ({
          ...state,
          requestModal: {
            isVisible: true,
            isSuccess: true,
            textModal: 'Deleted successful',
          },
        }))
        } , 100)
        navigation.goBack();
      } catch (error) {
        setTimeout(()=> {
          setStateGlobal(state => ({
          ...state,
          requestModal: {
            isVisible: true,
            isSuccess: false,
            textModal: 'Error while trying to delete',
          },
        }))
        } , 100)
      }
    } else {

      try {
        const response = await getAvailabilities(route.params.availabilityId);

        if (response.id) {
          setTimeout(()=> {
            setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: true,
              textModal: 'Deleted successful',
            },
          }))
          } , 100)

          await deleteAvailabilitiesDetails(
            route.params.availabilityId,
            route.params.detailId,
          );

          // if there was 1 detail left, then also delete the parent
          if (response.details && response.details.length === 1) {
            try {
              await deleteAvailabilities(route.params.availabilityId);
            } catch (error) { }
          }

          navigation.goBack();
        }
      } catch (error) {
        setTimeout(()=> {
          setStateGlobal(state => ({
          ...state,
          requestModal: {
            isVisible: true,
            isSuccess: false,
            textModal: 'Error while trying to delete',
          },
        }))
        } , 100)
      }
    }
  };

  useEffect(()=>{
    const loadUser = async () => {
      const admin = await AsyncStorage.getItem(ISADMIN);
      const staff = await AsyncStorage.getItem(ISSTAFF);
      if (admin || staff) {
        setDeleteButton(true)
      }
    }
    loadUser();
  },[])

  const splitAvailability = async (available, force_submit, employee_id, start_date, end_date, index) => {
    const availabilityValues = [];
    let forceUpdate = { force: false };

    if (force_submit) {
      forceUpdate = { force: true };
    }

    let travel = {
      travel_method: null,
      travel_time: null
  }

  if(!(values.regular_shift_type_label === 'On Call')){
    travel = {
      travel_method: values.travel_method,
      travel_time: moment(values.travel_time).format('HH:mm')
    }
  }

    let firstDayValue = start_date.split(" ")[0];
    let weeks = [];
    let day_information = [];

    let no_of_week = moment(firstDayValue).isoWeek();
    weeks.push(no_of_week);

    while (moment(firstDayValue).isSameOrBefore(end_date.split(" ")[0])) {
      const searchWeek = weeks.indexOf(moment(firstDayValue).isoWeek());

      if (searchWeek <= -1) {
        weeks.push(moment(firstDayValue).isoWeek());
      }

      const beginningTime = moment(values.start, 'h:mma');
      const endTime = moment(values.end, 'h:mma');
      // const crossDays =
      // start_date.split(" ")[0]!== end_date.split(" ")[0] &&
      //   endTime.isSameOrBefore(beginningTime);

      // const start_date_format = createDateWithTime(
      //   firstDayValue,
      //   values.start + ':00'
      // );
      const start_date_format = dateIsoFormat(firstDayValue, values.start)
      const end_date_format = dateIsoFormat(firstDayValue, values.end)

      available ? 
      day_information.push({
        week_no: moment(firstDayValue).isoWeek(),
        details: {
          is_available: available,
          start_date: start_date_format,
          end_date: end_date_format,
        },
      })
      :
      day_information.push({
        week_no: moment(firstDayValue).isoWeek(),
        details: {
          is_available: available,
          start_date: start_date_format,
          end_date: end_date_format,
          is_absent: values.is_absent ? values.is_absent : false,
          absence_informed_method: values.absence_informed_method ? values.absence_informed_method : null,
          absence_paid: values.absence_paid ? values.absence_paid : null,
          absence_planned: values.absence_planned ? values.absence_planned : null,
          absence_reason: values.absence_reason ? values.absence_reason : null,
          absence_type: values.absence_type ? values.absence_type : null,
          absence_notes: values.absence_notes ? values.absence_notes : null,
          sickness_reason: values.sickness_reason ? values.sickness_reason : null,
        },
      });

      firstDayValue = moment(firstDayValue).add(1, 'days').format('YYYY-MM-DD');
    }

    weeks.forEach(week => {
      const my_days = [];

      day_information.forEach(day_info => {
        if (day_info.week_no === week) {
          delete day_info.week_no;
          my_days.push({ ...day_info.details });
        }
      });
      // const weeks = [...daysOfWeek]
      // const weekDays = weeks.filter(weeks => weeks.selected === true);
      //  const weekArray =[] ;
      //  weekDays.forEach(w=>{
      // weekArray.push(w.day);
      //  });
      //  const week_of_day = weekArray.join();
      availabilityValues.push({
        // id: values.employee.map(employee=>employee.value),
        employee: employee_id,
        force: true,
        start_date: dateIsoFormat(start_date.split(" ")[0], values.start),
        end_date: dateIsoFormat(end_date.split(" ")[0], values.end),
        shift_type: values.regular_shift_type,
        ...travel,
        is_overnight: values.is_overnight,
        details: [...my_days],
        // week_of_day:week_of_day
      });
    });

    const saveAvailability = () => {
      return async function (availabilities) {
        return await setSplitAvailability(availabilities);
      };
    };

    const saveAvailabilitiesDetails = function (availability_Id) {
      return async function (details) {
        const val =  await setAvailabilityDetails(details, availability_Id);
      };
    };

    let savedAvailabilities = [];
    const resultAvailabilities = await Promise.all(
      availabilityValues.map(saveAvailability())
    )
      .then(result => {
        if (result[0].message) {
          //setIsDateAssigned(true);
          // assignMessageAvailableUnavailable(available, result);
           throw new Error();
        } else {
          setTimeout(()=> {
            setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: true,
              textModal: 'Split Successful',
            },
          }))
          } , 100)
          setSplitModalVisible(false);
          navigation.goBack();
          // setButtonIcon('');
          // setButtonIcon(CHECK);
          // setTextStatus(SAVED);
          // let loadingArr = loadingOverlap.filter(ele => ele !== index + 1)
          // setLoadingOverlap([...loadingArr]);
          // setDisableButton([...disableButton, index + 1])
         return result;
        }
      })
      .catch(error => {
        console.log(error.message)
      });

    if (!resultAvailabilities) {
      return;
    }

    savedAvailabilities.push(...resultAvailabilities);
    savedAvailabilities.forEach((availability, index_availability) => {
      Promise.all(
        availabilityValues[index_availability].details.map(
          saveAvailabilitiesDetails(availability.id)
        )
      );
    });

    // setLoadingSave(false);
    // searchRotaShift();
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <HeaderAvailabilities
          title={addHeaderTitle()}
          onPressButton={onPressApply}
          isEdition={isEdition}
          values={values}
          travelMethod={travelMethod}
          isShift={route && route.params && route.params.isShift}
        />

        <ScrollView>
          {ValidationMessages(
            validateMessage,
            setValidateMessage,
            format(values.start_date || new Date(), 'd MMM yyyy'),
            format(values.end_date || new Date(), 'd MMM yyyy'),
            onPressApply,
            isAvailable,
          )}
          <View style={styles.elementContainer}>
            <Availabilities
              shiftData={shiftData}
              isShift={route && route.params && route.params.isShift}
              setChoices={setChoices}
              choices={choices}
              isEdition={isEdition}
              timeMessage={timeMessage}
              setDaysArray={setDaysArray}
              values={values}
              setValues={setValues}
              lockInputsDate={isEdition}
              travelMethod={travelMethod}
              errors={errors}
              setErrors={setErrors}
            />
          </View>
        </ScrollView>

        {isEdition && deleteButton? (
          <View style={styles.buttonsView}>
            <TouchableOpacity
              onPress={() => {
                deleteAvailability();
              }}
              style={styles.buttonUnavailable}>
              <IoniconsIcon style={styles.deleteIcon} name={'trash-outline'} />
              <Text style={styles.textButton}>DELETE</Text>
            </TouchableOpacity>
            {/*  <TouchableOpacity
              onPress={() => {
                onPressApply(true);
              }}
              style={styles.buttonAvailable}>
              <FeatherIcon style={styles.checkIcon} name="check" />
              <Text style={styles.textButton}>SAVE</Text>
            </TouchableOpacity> */}
          </View>
        ) : (
          <Fragment />
        )}
      </View>
      {shiftOverlapData && shiftOverlapData.map((item, index) => {
        return (
          <PopModal
            isModalVisible={splitModalVisible}
            cancelTitle={'Split'}
            onCancel={() => {
              splitAvailability(isAvailable, true, item.employee_id, item.start_date, item.end_date, index)
            }}
            okTitle={'Procced'}
            okColor={ERR_COLOR}
            splitPop={true}
            onOk={() => onPressApply(isAvailable, true)}>
            <View style={styles.viewModalDelete}>
              <TouchableOpacity
                onPress={() => setSplitModalVisible(false)}
              >
                <EntypoIcon
                style={styles.crossIcon}
                  name={'cross'}
                />
              </TouchableOpacity>

              <View style={styles.viewTitle}>
                <Text style={styles.titleModal}>Overlap Availablities</Text>
              </View>
              <View style={styles.textModal}>
                <Text>{`The user has availability assigned`}</Text>
                {shiftOverlapData && shiftOverlapData.map((item, index) => {
                  return (
                    <ScrollView>
                      <Text style={styles.splitTime}>{index + 1}. {item.start_date} - {item.end_date}</Text>
                      <View style={styles.horizontalLine} />
                      <View style={styles.eventsContainer}>
                        <View style={[styles.eventView, styles.eventOneLine]}>
                          <TouchableOpacity style={styles.displayButton} onPress={() => {
                            splitAvailability(isAvailable, true, item.employee_id, item.start_date, item.end_date, index);
                          }}>
                            <Text style={styles.cancelTextTitle}>Split</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.eventView, styles.eventTwoLine]}>
                          <TouchableOpacity style={styles.displayButton} onPress={() => onPressApply(isAvailable, true, item.employee_id, index, item.start_date, item.end_date)}>
                            <Text style={styles.okTextTitle}>Procced</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.horizontalLine} />
                    </ScrollView>
                  )
                })}
              </View>
            </View>
          </PopModal>
        )
      })}

      <PopModal
        isModalVisible={deleteModalVisible}
        cancelTitle={'CANCEL'}
        onCancel={() => {
          setDeleteModalVisible(false);
        }}
        okTitle={'DELETE'}
        okColor={ERR_COLOR}
        onOk={okDeleteAvailability}>
        <View style={styles.viewModalDelete}>
          <View style={styles.viewTitle}>
            <Text style={styles.titleModal}>Warning</Text>
          </View>
          <View style={styles.textModal}>
            <Text>{`Are you sure you want to delete this ${stateGlobal.typeAvailabilityView === AVAILABILITY_VIEW
              ? 'Availability'
              : 'Unavailability'
              }?`}</Text>
          </View>
        </View>
      </PopModal>
    </SafeAreaView>
  );
};

Availability.propTypes = {
  route: PropTypes.object,
};

Availability.propTypes = {
  route: {},
};

export default Availability;
