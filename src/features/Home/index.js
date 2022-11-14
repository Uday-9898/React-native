import React, { useContext, useState, useEffect, Fragment } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../utils/api/SessionApi';
import { getClient } from '../../utils/api/ClientApi';
import {
  TOKEN,
  USERNAME,
  USER_NAME,
  USER_EMAIL,
  USER_ID,
  TENANT,
  USERDETAILS,
  ISADMIN,
  ISSTAFF
} from '../../utils/constants/storageKeys';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { TokenContext } from '../../utils/context/TokenContext';
import HomeAgendaDay from '../HomeAgendaDay';
import HomeAgendaWeekly from '../HomeAgendaWeekly';
import { styles } from './styles';
import moment from 'moment';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { DAY } from '../../utils/constants/scheduler';
import {
  getVisitEvvslist,
  setSchedulerVisitsClockIn,
  setSchedulerVisitsClockOut,
} from '../../utils/api/SchedulerApi';
import TypeCalendarMenu from './TypeCalendarMenu';
import { ModalComponent, PopModal } from '../../shared/components';
import VisitDetails from '../../components/VisitDetails';
import LinearGradient from 'react-native-linear-gradient';
import {
  PURPLE,
  GRADIENT_GREEN,
  ERR_COLOR,
  STRONG_LIME,
} from '../../assets/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FloatingAction } from 'react-native-floating-action';
import { GlobalContext } from '../../utils/context/GlobalContext';
import { useNavigation } from '@react-navigation/native';
import { AVAILABILITY, CREATE_NEW_PASSWORD, SELECT_EMPLOYEE_FOR_ADMIN } from '../../utils/constants/routes';
import {
  deleteAvailabilitiesDetails,
  deleteAvailabilities,
  getAvailabilities,
  deleteShiftDetails,
} from '../../utils/api/RotaShiftApi';
import {
  AVAILABILITY_VIEW,
  UNAVAILABILITY_VIEW,
} from '../../utils/constants/rotaShift';
import ModalException from '../../components/VisitDetails/VisitDetailsModals';
import { dateToStringDate } from '../../shared/Methods/DateMethods';
import Geolocation from 'react-native-geolocation-service';
import NetInfo from '@react-native-community/netinfo';
import Model from '../../Database/Model/Model';
import { differenceInMinutes } from 'date-fns';
import { getDistanceFromLatLonInMts } from '../../shared/Methods/Location';
import { setSchedulerVisitsRevertClock } from '../../utils/api/SchedulerApi';


let _ = require('lodash');
import available_icon from '../../assets/icons/HomeIcons/availability.png';
import unavailable_icon from '../../assets/icons/HomeIcons/unavailability.png';
import home_icon from '../../assets/icons/HomeIcons/dashboard_in.jpg';
import helpa_logo from '../../assets/icons/HomeIcons/helpa_logo.png';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from "../HomeAgendaDay/redux/actions";
import VisitInfo from '../../components/VisitInfo';

const Home = props => {
  const navigation = useNavigation();
  const [, setState] = useContext(TokenContext);
  const [stateGlobal, setStateGlobal] = useContext(GlobalContext);
  const [monthText, setMonthText] = useState(new Date());
  const [typeOfCalendar, setTypeOfCalendar] = useState(DAY);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [InfoModal, setInfoModal] = useState(false);
  const [notesData, setNotesData] = useState('');
  const [visitDetailData, setVisitDetailData] = useState({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [weekDate, setWeekDate] = useState(
    moment(monthText).format('YYYY-MM-DD'),
  );
  const d = new Date();

  const [toDelete, setToDelete] = useState({});
  const [viewDate, setViewDate] = useState((new Date()).toString());
  const [showModalException, setShowModalException] = useState(false);
  const [typeClock, setTypeClock] = useState(true);
  const [alreadyClock, setAlreadyClock] = useState(false);
  const [linkToPermissionsModal, setLinkToPermissionsModal] = useState(false);
  const [isTimeException, setIsTimeException] = useState(false);
  const [isVisitOnHold, setIsVisitOnHold] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedInDatabase, setSavedInDatabase] = useState(false);
  const [myLocalData, setMyLocalData] = useState([]);
  const [revertClockOut, setRevertClockOut] = useState(false);
  const [homeButton, setHomeButton] = useState(false);
  const { eventsOffline } = useSelector(state => state.Offline);
  const dispatch = useDispatch();
  const action = [
    {
      text: 'Prefer to work',
      icon: available_icon,
      name: AVAILABILITY_VIEW,
      position: 2,
      color: STRONG_LIME,
      size: 60,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      buttonSize: 50,
      textContainerStyle: {
        right: -25,
        paddingRight: 25,
        height: 40,
        justifyContent: 'center',
      },
    },
    {
      text: 'I am unable to work',
      icon: unavailable_icon,
      name: UNAVAILABILITY_VIEW,
      position: 1,
      color: ERR_COLOR,
      size: 60,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      buttonSize: 50,
      textContainerStyle: {
        right: -25,
        paddingRight: 25,
        height: 40,
        justifyContent: 'center',
      },
    },
  ];

  useEffect(() => {
    const loadUser = async () => {
      const userID = await AsyncStorage.getItem(USER_ID);
      const admin = await AsyncStorage.getItem(ISADMIN);
      const staff = await AsyncStorage.getItem(ISSTAFF);
      if (!userID && (admin || staff)) {
        navigation.navigate(SELECT_EMPLOYEE_FOR_ADMIN);
      }
      if (admin || staff) {
        setHomeButton(true)
      }
    }
    loadUser();
    addTypeCalendarMenu()
    const loadLocalDatabase = async () => {
      const myDatabaseData = await Model.loadFromDatabase('ClockInOutOffline');
      setMyLocalData(myDatabaseData);
    };

    loadLocalDatabase();
  }, [savedInDatabase]);

  /**
   * Log out in app
   */
  const logOutAndRedirect = async () => {
    try {
      const username = await AsyncStorage.getItem(USERNAME);
      const email = await AsyncStorage.getItem(USER_EMAIL);
      await logout(username, email);
      AsyncStorage.clear();
      setState(state => ({ ...state, accessToken: null }));
    } catch ({ message, code }) { }
  };

  /**
   * change day or week view
   * @param {String} type
   */
  const changeView = type => {
    console.log('caltype', type);
    setTypeOfCalendar(type);
    setShowCalendar(false);
  };

  /**
   * increment the week
   */
  const addWeek = () => {
    if (typeOfCalendar === DAY) {
      const newDate = moment(monthText);
      newDate.add(1, 'days');
      setViewDate(newDate.format('YYYY-MM-DD'));
    } else {
      const newDate = moment(monthText);
      newDate.add(7, 'days');
      setWeekDate(newDate.format('YYYY-MM-DD'));
    }
  };

  /**
   * decrement the week
   */
  const subtractWeek = () => {
    if (typeOfCalendar === DAY) {
      const newDate = moment(monthText);
      newDate.subtract(1, 'days');
      setViewDate(newDate.format('YYYY-MM-DD'));
    } else {
      const newDate = moment(monthText);
      newDate.subtract(7, 'days');
      setWeekDate(newDate.format('YYYY-MM-DD'));
    }
  };

  /**
   * Close visit detail modal
   */
  const closeModal = () => {
    setIsModalVisible(false);
    setInfoModal(false);
  };

  /**
   * Get visit data
   * @param {Object} item
   */
  const getVisitDetails = async item => {
    let continueSaving = true;
    continueSaving = await NetInfo.fetch().then(async stateConnection => {
      if (stateConnection.type === 'none') {
        getVisitDataOffline(item);
      } else {
        getVisitDataOnline(item);
      }
    });


  };

  const handleInfo=(notes)=>{
    setNotesData(notes);
    setInfoModal(true);
  }

  const getVisitDataOffline = (item) => {
    let clientData = { ...item.clientInfo };

    clientData.currentData = item;
    clientData.client_services = item.client_services;
    clientData.address = item.address;
    clientData.contact = item.contact;

    //set the new clientData
    setVisitDetailData(clientData);
    setIsModalVisible(true);
  }

  const getVisitDataOnline = async item => {
    let visit_evv_detail = {};
    let visit_number = '';
    try {

      const evv_response = await getVisitEvvslist(item.id);
      if (evv_response.results && evv_response.results.length >= 1) {
        evv_response.results.forEach(evv_result => {
          if (evv_result.visit === item.id) {
            visit_evv_detail.actual_visit_start_time =
              evv_result.actual_start_time;
            visit_evv_detail.actual_visit_end_time =
              evv_result.actual_end_time;
            visit_evv_detail.evvs_id = evv_result.id;
            visit_number = evv_result.visit_obj
              ? evv_result.visit_obj.visit_number
              : '';
          }
        });
      }
    } catch (error) {
    }
    try {
      const clientData = await getClient(item.resourceId);
      if (clientData.id) {
        //adjust client_services
        let visitData = [];
        _.forEach(clientData.client_services, function (clientServiceObj) {
          // for each client service review the visits
          _.forEach(clientServiceObj.visits, function (visitObj) {
            // for each visit return only when t#he visit is same to selected item
            if (visitObj.id === item.groupId) {
              const returnData = clientServiceObj;
              returnData.visits = visitObj;
              visitData = returnData;
            }
          });
        });
        //add item in clientData
        clientData.currentData = item;
        //add evvs in currentData
        clientData.currentData = {
          ...clientData.currentData,
          ...visit_evv_detail,
          visit_number,
        };
        //replace client_services data with visitData
        clientData.client_services = visitData;
        //set the new clientData
        setVisitDetailData(clientData);
        //show the visit detail modal
        setIsModalVisible(true);
      }
    } catch (error) {
      //TODO: add message error
      setIsModalVisible(false);
      setTimeout(() => {
        setStateGlobal(state => ({
          ...state,
          requestModal: {
            isVisible: true,
            isSuccess: false,
            textModal: 'Error while trying to get detail',
          },
        }))
      }, 100);
    }
  }

  const changeMenu = value => {
    setStateGlobal(state => ({ ...state, isHome: value }));
  };

  const deleteAvailability = async item => {
    setDeleteModalVisible(true);
    setToDelete(item);
  };

  const okDeleteAvailability = async () => {
    setDeleteModalVisible(false);
    if (toDelete.isShift) {
      try {
        const resData = await deleteShiftDetails(toDelete.groupId, toDelete.id);
        setTimeout(() => {
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: true,
              textModal: 'Deleted successful',
            },
          }))
        }, 100);
      } catch (error) {
        setTimeout(() => {
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: false,
              textModal: 'Error while trying to delete',
            },
          }))
        }, 100);
      }
    } else {
      try {
        const response = await getAvailabilities(toDelete.groupId);
        if (response.id) {
          setTimeout(() => {
            setStateGlobal(state => ({
              ...state,
              requestModal: {
                isVisible: true,
                isSuccess: true,
                textModal: 'Deleted successful',
              },
            }))
          }, 100);

          await deleteAvailabilitiesDetails(toDelete.groupId, toDelete.id);
          // if there was 1 detail left, then also delete the parent
          if (response.details && response.details.length === 1) {
            try {
              await deleteAvailabilities(toDelete.groupId);
            } catch (error) { }
          }
        }

      } catch (error) {
        setTimeout(() => {
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: false,
              textModal: 'Error while trying to delete',
            },
          }))
        }, 100);
      }
    }
  };

  const goToAvailability = typeView => {
    setStateGlobal(state => ({ ...state, typeAvailabilityView: typeView }));

    navigation.navigate(AVAILABILITY);
  };

  const addTypeCalendarMenu = () => {
    return (
      <TypeCalendarMenu
        changeView={changeView}
        typeOfCalendar={typeOfCalendar}
      />
    );
  };

  const goToday = () => {
    if (typeOfCalendar === DAY) {
      setViewDate((new Date()).toString());
    } else {
      const week_date = dateToStringDate(new Date());
      setWeekDate(week_date);
    }
  }

  /**
   * Check the localPermission status and return
   * true if the user accept permission for location
   */
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const checkLocationPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (checkLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          return false;
        }
      }
    } else {
      const checkLocationPermission = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);


      if (checkLocationPermission === RESULTS.GRANTED) {
        return true;
      } else {
        try {
          const granted = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
          if (granted === RESULTS.GRANTED) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          return false;
        }
      }
    }
  };

  /**
   * Get the user location and return position or empty object
   */
  const getLocation = async () => {
    try {
      const checkPermission = await requestLocationPermission();

      if (checkPermission) {
        return new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            position => {
              resolve(position);
            },
            () => {
              reject({});
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        });
      } else {
        return {};
      }
    }
    catch ({ message }) {
      console.log(message)
    }
  };

  /**
   * Get the user position with myPosition
   * if myPosition exist turn clock or and clock out based in turn_in argument
   * if myPosition is empty open a modal and send to user to settings
   * for change location permissions
   * @param {boolean} turn_in
   * @param {boolean} force
   */
  const schedulerVisitClock = async (turn_in, force, clock_in_force, rvrtClockOut) => {
    setTypeClock(turn_in);
    let continueSaving = true;
    const _visit_id = visitDetailData.currentData.id;
    const _client = visitDetailData.currentData.resourceId;
    const _myDate = new Date();
    const myPosition = await getLocation();

    if (Object.keys(myPosition).length >= 1) {
      let forceUpdate = {};
      let clock_in_forceUpdate = {};

      if (force) {
        forceUpdate = { force: true };
      }
      if (clock_in_force) {
        clock_in_forceUpdate = { clock_in_force: true };
      }
      const values = turn_in ? {
        visit: _visit_id,
        client: _client,
        employee: await AsyncStorage.getItem(USER_ID),
        latitude: myPosition.coords.latitude,
        longitude: myPosition.coords.longitude,
        actual_start_time: moment().format('YYYY-MM-DD HH:mm'),
        ...forceUpdate,
        ...clock_in_forceUpdate
      } :
        {
          visit: _visit_id,
          //client: _client,
          employee: await AsyncStorage.getItem(USER_ID),
          latitude: myPosition.coords.latitude,
          longitude: myPosition.coords.longitude,
          actual_end_time: moment().format('YYYY-MM-DD HH:mm:ss'),
          ...forceUpdate,
        };


      //check if clock in is on hold to send even
      //if there is a connection clock out to on hold
      if (isVisitOnHold) {
        saveClockInDatabase(values, forceUpdate, _myDate, turn_in, force, clock_in_force);
        continueSaving = false;
        return;
      }

      //check if have connection
      continueSaving = await NetInfo.fetch().then(async stateConnection => {
        if (stateConnection.type === 'none') {
          saveClockInDatabase(values, forceUpdate, _myDate, turn_in, force, clock_in_force);
          return false;
        } else {
          return true;
        }
      });

      if (!continueSaving) {
        return;
      }

      setIsModalVisible();
      try {
        let response = '';
        if (turn_in) {
          response = await setSchedulerVisitsClockIn(_visit_id, values, rvrtClockOut);
        } else {
          response = await setSchedulerVisitsClockOut(_visit_id, values);
        }
        if (response.id) {
          setTimeout(() => {
            setStateGlobal(state => ({
              ...state,
              requestModal: {
                isVisible: true,
                isSuccess: true,
                textModal: `Clock ${turn_in ? 'in' : 'out'} Successful`,
              },
            }))
          }, 100);
          setShowModalException(false);
          setIsModalVisible(false);
        } else if (response.status === 'FAIL') {
          throw new Error(response.message.message);
        } else if (response.message === "Successful clock out reverted") {
          setShowModalException(false);
          setTimeout(() => {
            setStateGlobal(state => ({
              ...state,
              requestModal: {
                isVisible: true,
                isSuccess: true,
                textModal: "Successful Clock out Reverted",
              },
            }))
          }, 500);

        } else if (response.message === "Only Employee Allowed to clock in") {
          setShowModalException(false);
          setTimeout(() => {
            setStateGlobal(state => ({
              ...state,
              requestModal: {
                isVisible: true,
                isSuccess: false,
                textModal: "Only Employee Allowed to clock in",
              },
            }))
          }, 500);

        } else {
          setErrorMessage(response.message.message)
          if (response.message && response.message.message && (response.message.message.includes('visit now') || response.message.message.includes('previous visit'))) {
            setAlreadyClock(true);
          }
          setTimeout(() => {
            setShowModalException(true);
          }, 100);
        }
      } catch ({ message }) {
        setIsModalVisible();
        setTimeout(() =>
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: false,
              textModal: `${message}`,
            },
          })), 100);

      }
    } else {
      setLinkToPermissionsModal(true);
    }
  };

  /**
   * Return false if exist exception of time or distance in the visit
   * return true if the visit is correct in time and distance
   * @param {Date} myDate
   * @param {String} myLatitude
   * @param {String} myLongitude
   * @param {Boolean} turn_in
   */
  const visitValidations = (myDate, myLatitude, myLongitude, turn_in) => {
    //close visit detail
    setIsModalVisible();

    const visit_start_time = new Date(visitDetailData.currentData.start);
    const visit_end_time = new Date(visitDetailData.currentData.end);
    const visit_latitude =
      visitDetailData.client_services.service_address.latitude;
    const visit_longitude =
      visitDetailData.client_services.service_address.longitude;
    const calculateDistance = getDistanceFromLatLonInMts(
      myLatitude,
      myLongitude,
      visit_latitude,
      visit_longitude,
    );

    // if (differenceInMinutes(visit_start_time, myDate) > 15 && turn_in) {
    //   setIsTimeException(true);
    //   setTimeout(() => {
    //     setShowModalException(true);
    //   }, 100);
    //   return false;
    //  }

    // if (differenceInMinutes(visit_end_time, myDate) > 15 && !turn_in) {
    //   setIsTimeException(true);
    //   setTimeout(() => {
    //     setShowModalException(true);
    //   }, 100);
    //   return false;
    // }

    //validate distance range
    // if (calculateDistance > 500) {
    //   setIsTimeException(false);
    //   setTimeout(() => {
    //     setShowModalException(true);
    //   }, 100);
    //   return false;
    // }

    return true;
  };

  const visitCheck = (myDate, turn_in, data, clock_in_force) => {
    let val = true
    if (!clock_in_force) {
      if (turn_in) {
        eventsOffline.map((item) => {
          if (item.actual_visit_start_time && !item.actual_visit_end_time) {
            val = false
          }
        })
      }
    }

    return val;
  }

  /**
   * Insert in table the clock in or clock out
   * @param {Object} values
   * @param {Boolean} forceUpdate
   * @param {Date} _myDate
   * @param {Boolean} turn_in
   */
  const insertInDatabase = async (values, forceUpdate, _myDate, turn_in) => {
    Model.insertIntoDatabase(
      [
        {
          visitId: values.visit,
          clientId: values.client ? values.client : '',
          employeeId: values.employee,
          latitude: values.latitude,
          longitude: values.longitude,
          forceUpdate: forceUpdate.force ? 1 : 0,
          date: _myDate.toISOString(),
          typeClock: turn_in ? 1 : 0,
        },
      ],
      'ClockInOutOffline',
    );
    setSavedInDatabase(!savedInDatabase);
  };


  /**
   * check with force if saving is being forced to save directly to local
   * database, if (force) is false first check if the clock for the visit
   * is valid to ask the user before saving
   * @param {Object} values
   * @param {Boolean} forceUpdate
   * @param {Date} _myDate
   * @param {Boolean} turn_in
   * @param {Boolean} force
   */
  const saveClockInDatabase = (
    values,
    forceUpdate,
    _myDate,
    turn_in,
    force,
    clock_in_force
  ) => {
    // if (force) {
    //   insertInDatabase(values, forceUpdate, _myDate, turn_in);
    //   setShowModalException(false);
    //   setTimeout(() => {
    //     setStateGlobal(state => ({
    //       ...state,
    //       requestModal: {
    //         isVisible: true,
    //         isSuccess: true,
    //         textModal: `Clock ${turn_in ? 'in' : 'out'} Successful`,
    //       },
    //     }))
    //   }, 100);

    //   return;
    // } else {
    // const validate_visit = visitValidations(
    //   _myDate,
    //   values.latitude,
    //   values.longitude,
    //   turn_in,
    // );
    const check_visit = visitCheck(
      _myDate,
      turn_in,
      values,
      clock_in_force
    );
    if (check_visit) {
      if (!clock_in_force) {
        insertInDatabase(values, forceUpdate, _myDate, turn_in);
        const arr = [];
        if (turn_in) {
          eventsOffline.map((item) => {
            if (values.visit === item.id) {
              arr.push({
                ...item,
                actual_visit_start_time: _myDate.toISOString(),
                backgroundColor: "orange",
                borderColor: "orange",
                visit_status_name: "In Progress",
              })
            } else {
              arr.push({ ...item })
            }
          })
        } else {
          eventsOffline.map((item) => {
            if (values.visit === item.id) {
              arr.push({
                ...item,
                actual_visit_end_time: _myDate.toISOString(),
                backgroundColor: "green",
                borderColor: "green",
                visit_status_name: "Completed",
              })
            } else {
              arr.push({ ...item })
            }
          })
        }

        dispatch(actions.OfflineData(arr));
        setTimeout(() => {
          setShowModalException(false);
        }, 100);
        setTimeout(() => {
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: true,
              textModal: `Clock ${turn_in ? 'in' : 'out'} Successful`,
            },
          }))
        }, 200);
      } else {
        const arroff = [];
        eventsOffline.map((item) => {
          if (item.actual_visit_start_time && !item.actual_visit_end_time) {
            arroff.push({
              ...item,
              actual_visit_end_time: _myDate.toISOString(),
              backgroundColor: "green",
              borderColor: "green",
              visit_status_name: "Completed",
            })
            Model.insertIntoDatabase(
              [
                {
                  visitId: item.id,
                  clientId: '',
                  employeeId: values.employee,
                  latitude: values.latitude,
                  longitude: values.longitude,
                  forceUpdate: 0,
                  date: _myDate.toISOString(),
                  typeClock: 0,
                },
              ],
              'ClockInOutOffline',
            );
            setSavedInDatabase(!savedInDatabase);
            
          } else {
            arroff.push({ ...item })
          }
        })
        saveClockInAfterOut(
          values,
          arroff,
          forceUpdate,
          _myDate,
          true,
          force,
          false
        );
      }
    } else {
      setErrorMessage("Warning – if you accept to clock-in to this visit you will be automatically clocked out of the previous visit")
      setAlreadyClock(true);
      setTimeout(() => {
        setShowModalException(true);
      }, 100);
    }
    // }
  };

  const saveClockInAfterOut=async(
    values,
    arroff,
    forceUpdate,
    _myDate,
    turn_in,
    force,
    clock_in_force
  )=>{
    insertInDatabase(values, forceUpdate, _myDate, turn_in);
    let clockInArr = [];
    arroff.map((item) => {
      if (values.visit === item.id) {
        clockInArr.push({
          ...item,
          actual_visit_start_time: _myDate.toISOString(),
          backgroundColor: "orange",
          borderColor: "orange",
          visit_status_name: "In Progress",
        })
      } else {
        clockInArr.push({ ...item })
      }
    })
    dispatch(actions.OfflineData(clockInArr));
    setTimeout(() => {
      setShowModalException(false);
    }, 100);
        setTimeout(() => {
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: true,
              textModal: `Clock ${turn_in ? 'in' : 'out'} Successful`,
            },
          }))
        }, 200);
  }

  const uploadVisitsOnHold = async (turn_in, force, clock_in_force) => {
    const saveClockInOut = function () {
      return async function (myData) {
        try {
          let response = '';


          let forceUpdate = {};
          let clock_in_forceUpdate = {};

          if (true) {
            forceUpdate = { force: true };
          }
          if (true) {
            clock_in_forceUpdate = { clock_in_force: true };
          }
          setTypeClock((myData.typeClock === 1) ? true : false);

          const values = (myData.typeClock === 1) ? {
            visit: myData.visitId,
            client: myData.clientId,
            employee: await AsyncStorage.getItem(USER_ID),
            latitude: myData.latitude,
            longitude: myData.longitude,
            actual_start_time: moment(myData.date).format('YYYY-MM-DD HH:mm'),
            ...forceUpdate,
            ...clock_in_forceUpdate
          } :
            {
              visit: myData.visitId,
              //client: _client,
              employee: await AsyncStorage.getItem(USER_ID),
              latitude: myData.latitude,
              longitude: myData.longitude,
              actual_end_time: moment(myData.date).format('YYYY-MM-DD HH:mm:ss'),
              ...forceUpdate,
            };


          if (myData.typeClock === 1) {
            response = await setSchedulerVisitsClockIn(myData.visitId, values);
          } else {
            response = await setSchedulerVisitsClockOut(myData.visitId, values);
          }

          if (response.id) {
            Model.deleteRow(
              'ClockInOutOffline',
              `visitId='${myData.visitId}' AND typeClock=${myData.typeClock}`,
            );
            setTimeout(() => {
              setStateGlobal(state => ({
                ...state,
                requestModal: {
                  isVisible: true,
                  isSuccess: true,
                  textModal: `Clock ${(myData.typeClock === 1) ? 'in' : 'out'} Successful`,
                },
              }))
            }, 100);
            setShowModalException(false);
            setIsModalVisible(false);
          } else if (response.status === 'FAIL') {
            throw new Error(response.message.message);
          } else if (response.message === "Successful clock out reverted") {
            setShowModalException(false);
            setTimeout(() => {
              setStateGlobal(state => ({
                ...state,
                requestModal: {
                  isVisible: true,
                  isSuccess: true,
                  textModal: "Successful Clock out Reverted",
                },
              }))
            }, 500);

          } else {
            setErrorMessage(response.message.message)
            if (response.message && response.message.message && (response.message.message.includes('visit now') || response.message.message.includes('previous visit'))) {
              setAlreadyClock(true);
            }
            setTimeout(() => {
              setShowModalException(true);
            }, 100);
          }
          setSavedInDatabase(!savedInDatabase);
        } catch ({ message }) {
          setIsModalVisible();
          setTimeout(() =>
            setStateGlobal(state => ({
              ...state,
              requestModal: {
                isVisible: true,
                isSuccess: false,
                textModal: `${message}`,
              },
            })), 100);

        }
      };
    };

    await Promise.all(myLocalData.map(saveClockInOut()));
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        {/*View principal header date text, change week in weekly view, and show
          menu for change day or weekly view */}
        <View style={styles.headerDate}>
          <View style={styles.boxHeader}>
            <View style={styles.monthText}>
              <Image source={helpa_logo} style={styles.logo} />
              <Text style={styles.textHeaderDate}>
                {moment(monthText).format('MMMM')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCalendar(!showCalendar);
                }}>
                <AntDesignIcon
                  style={[
                    styles.caretright,
                    {
                      transform: [
                        { rotate: `${showCalendar ? '90deg' : '0deg'}` },
                      ],
                    },
                  ]}
                  name="caretright"
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {homeButton && <TouchableOpacity
                style={styles.logOutText}
                onPress={() => {
                  navigation.navigate(SELECT_EMPLOYEE_FOR_ADMIN);
                }}>
                <Image source={home_icon} style={styles.imgHome} />
              </TouchableOpacity>}
              <TouchableOpacity
                style={styles.logOutText}
                onPress={uploadVisitsOnHold}>
                <MaterialCommunityIcons
                  style={[
                    styles.cloudIcon,
                    { color: myLocalData.length >= 1 ? 'red' : PURPLE },
                  ]}
                  name="cloud-sync-outline"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logOutText}
                onPress={() => {
                  navigation.navigate(CREATE_NEW_PASSWORD);
                }}>
                <FeatherIcon style={[styles.userIcon]} name="user" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logOutText}
                onPress={logOutAndRedirect}>
                <MaterialIconsIcon style={styles.logOutIcon} name="logout" />
              </TouchableOpacity>
            </View>
          </View>

          {typeOfCalendar !== DAY ? (
            <View style={styles.dayButtons}>
              <View style={styles.textWeekData}>
                <TouchableOpacity
                  style={styles.touchWeekArrow}
                  onPress={subtractWeek}>
                  <MaterialIconsIcon
                    style={[styles.weekArrow]}
                    name="keyboard-arrow-left"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.currentButton}
                  onPress={goToday}>
                  <Text style={styles.weekText}>Current</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.touchWeekArrow}
                  onPress={addWeek}>
                  <MaterialIconsIcon
                    style={[styles.weekArrow]}
                    name="keyboard-arrow-right"
                  />
                </TouchableOpacity>
              </View>

              {addTypeCalendarMenu()}
            </View>
          ) : (
            <View style={styles.containerTodayButton}>
              <View style={styles.textWeekData}>
                <TouchableOpacity
                  style={styles.touchWeekArrow}
                  onPress={subtractWeek}>
                  <MaterialIconsIcon
                    style={[styles.weekArrow]}
                    name="keyboard-arrow-left"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.currentButton}
                  appearance="outline"
                  onPress={goToday}>
                  <Text style={styles.todayText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.touchWeekArrow}
                  onPress={addWeek}>
                  <MaterialIconsIcon
                    style={[styles.weekArrow]}
                    name="keyboard-arrow-right"
                  />
                </TouchableOpacity>
              </View>
              {addTypeCalendarMenu()}
            </View>
          )}
         
        </View>
        

        {/*View principal body calendar day or weekly */}
        <View style={styles.boxBody}>
          {typeOfCalendar === DAY ? (
            <HomeAgendaDay
              setMonthText={setMonthText}
              getVisitDetails={getVisitDetails}
              deleteAvailability={deleteAvailability}
              viewDate={viewDate}
              setViewDate={setViewDate}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              handleInfo={handleInfo}
            />
          ) : (
            <HomeAgendaWeekly
              shftType={typeOfCalendar}
              setWeekDate={setWeekDate}
              setMonthText={setMonthText}
              weekDate={weekDate}
              getVisitDetails={getVisitDetails}
              deleteAvailability={deleteAvailability}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
            />
          )}

          <FloatingAction
            actions={action}
            onPressItem={typeView => {
              goToAvailability(typeView);
            }}
            color={PURPLE}
            distanceToEdge={20}
            buttonSize={70}
            iconHeight={23}
            iconWidth={23}
          />
        </View>

        {/*TODO: For first implementation at the moment it is not required  */}
        {/*View principal footer */}
        {/*<View style={[styles.box, styles.boxFooter]}>
          <TouchableOpacity
            onPress={() => {
              changeMenu(true);
            }}
            style={styles.textFooter}>
            {stateGlobal.isHome ? (
              <Fragment>
                <Text style={styles.textFooterHome}>HOME</Text>
                <AntDesignIcon name="caretup" style={styles.upIcon} />
              </Fragment>
            ) : (
              <View>
                <Image source={home_icon} style={styles.imgHome} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              changeMenu(false);
            }}
            style={styles.pictureFooter}>
            {stateGlobal.isHome ? (
              <LinearGradient
                colors={[PURPLE, GRADIENT_GREEN]}
                style={styles.gradientStyle}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}>
                {/* //Todo: add the user picture
              <Image
                source={{
                  uri: '',
                }}
                style={styles.photo}
              />
                <View style={styles.pictureIconView}>
                  <MaterialCommunityIcons
                    style={styles.pictureIcon}
                    name="image-off-outline"
                  />
                </View>
              </LinearGradient>
            ) : (
              <Fragment>
                <Text style={styles.textFooterHome}>ME</Text>
                <AntDesignIcon name="caretup" style={styles.upIcon} />
              </Fragment>
            )}
          </TouchableOpacity>/*}
        </View>*/}

        <ModalComponent
          title={'Visit details'}
          isModalVisible={isModalVisible}
          setIsModalVisible={closeModal}
          maxHeight={'90%'}>
          <VisitDetails
            visitDetail={visitDetailData}
            setIsModalVisible={setIsModalVisible}
            schedulerVisitClock={schedulerVisitClock}
            setIsVisitOnHold={setIsVisitOnHold}
            setShowModalException={setShowModalException}
            setErrorMessage={setErrorMessage}
            setRevertClockOut={setRevertClockOut}
          />
        </ModalComponent>
        <ModalComponent
          title={'Instructions'}
          isModalVisible={InfoModal}
          setIsModalVisible={closeModal}
          maxHeight={'90%'}>
          <VisitInfo
          notes={notesData}
          />
        </ModalComponent>

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
              <Text>{`Are you sure you want to delete this ${toDelete.title
                }?`}</Text>
            </View>
          </View>
        </PopModal>

        <PopModal
          isModalVisible={linkToPermissionsModal}
          cancelTitle={'CANCEL'}
          onCancel={() => {
            setLinkToPermissionsModal(false);
          }}
          okTitle={'ACCEPT'}
          okColor={PURPLE}
          onOk={() => {
            Linking.openSettings();
            setLinkToPermissionsModal(false);
          }}>
          <View style={styles.viewModalPermission}>
            <View style={styles.viewTitle}>
              <Text style={styles.titleModal}>Warning</Text>
            </View>
            <View style={styles.textModal}>
              <Text style={styles.positionText}>
                Location permission needs to be enabled on the app.
              </Text>
            </View>
          </View>
        </PopModal>

        <ModalException
          showModalException={showModalException}
          onCancel={() => {
            setShowModalException(false);
          }}
          onOk={() => {
            revertClockOut ? schedulerVisitClock(true, false, true, true) : schedulerVisitClock(typeClock, true, alreadyClock)
          }}
          okTitle={revertClockOut ? 'REVERT CLOCKOUT' : (typeClock ? 'CLOCK IN' : 'CLOCK OUT')}>
          <Text style={styles.textModalException}>
            {/* {isTimeException
              ? 'It is still earlier than the scheduled time.'
              : 'You are not in close proximity to the client address.'} */}
            {errorMessage}
            <Text style={styles.textModalColor}>
              {`. Would you like to ${revertClockOut ? 'revert' : ''} clock ${typeClock ? 'in' : 'out'} anyway?`}
            </Text>
          </Text>
        </ModalException>
      </View>
    </SafeAreaView>
  );
};

export default Home;
