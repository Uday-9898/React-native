import React, { Fragment, useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  Platform,
  Alert,
  Image,
  FlatList,
} from 'react-native';
//import DocumentPicker from 'react-native-document-picker';
//import FileViewer from 'react-native-file-viewer';
import moment from 'moment';
//import markerIcon from '../../assets/images/maps-and-flags.png';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient'
import { GlobalContext } from '../../utils/context/GlobalContext';
import { TokenContext } from '../../utils/context/TokenContext';
import { setSchedulerVisitsRevertClock, setSchedulerVisitsRevertBoth } from '../../utils/api/SchedulerApi';
import { days, shortMonths } from '../../utils/Array';
import { PURPLE, GRADIENT_GREEN, GRAY_150 } from '../../assets/Colors';
//import {timeTextFormat} from '../../shared/Methods/DateMethods';
import { styles, styleConstructor } from './styles';
import Model from '../../Database/Model/Model';
//import PropTypes from 'prop-types';
//import ModalException from '../../components/VisitDetails/VisitDetailsModals';
import NetInfo from '@react-native-community/netinfo';
//import Hr from "react-native-hr-component";

import myUserImage from '../../assets/icons/HomeIcons/user.jpg';
import { SafeAreaView } from 'react-native-safe-area-context';
//import { ScrollView } from 'react-native-gesture-handler';
import { getFileData } from '../../utils/api/ClientApi';
import { CANCEL } from 'redux-saga';
import { id } from 'date-fns/locale';
import { getEmployees } from './../../utils/api/ClientApi';
import { setDayOfYear } from 'date-fns';
import { getChoicesEmployee } from '../../utils/api/CoreApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_ID } from '../../utils/constants/storageKeys';


const VisitDetails = ({ visitDetail, setIsModalVisible, schedulerVisitClock, setIsVisitOnHold, setRevertClockOut, setShowModalException, setErrorMessage }) => {
  const [stateGlobal, setStateGlobal] = useContext(GlobalContext);

  const [state, setState] = useContext(TokenContext);
  const [isClockOnHold, setIsClockOnHold] = useState({
    clockIn: false,
    clockOut: false,
  });
  const [typeClock, setTypeClock] = useState(true);

  const [summaryText, setSummaryText] = useState(true);
  const [alertText, setAlertText] = useState(false);
  const [fileText, setFileText] = useState(false);
  const [taskText, setTaskText] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [fullName, setFullName] = useState('');
  // const [singleFile, setSingleFile] = useState(null);
  // const [filename, setFilename] = useState('');
  // const [res, setUri] = useState([]);


  let time_start = moment(visitDetail.currentData.start).format('HH:mm');
  let time_end = moment(visitDetail.currentData.end).format('HH:mm');

  const calculateTime = (initialTime, finalTime) => {
    const calculateDiff = moment(finalTime, 'YYYY-MM-DD HH:mm:ss').diff(
      moment(initialTime, 'YYYY-MM-DD HH:mm:ss'),
    );

    const duration = moment.duration(calculateDiff);

    return `${duration.hours()} : ${duration.minutes()}`;
  };

  const loadEmployees = () => {
    getChoicesEmployee()
      .then(async (resp) => {
        const userID = await AsyncStorage.getItem(USER_ID);

        const name = resp.employee_listing.filter((emp) => emp.id == userID)

        name.length && setFullName(name[0].full_name)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  };


  const textsummary = () => {
    setSummaryText(true)
    setAlertText(false)
    setFileText(false)
    setTaskText(false)
  }

  const textalerts = () => {
    setSummaryText(false)
    setAlertText(true)
    setFileText(false)
    setTaskText(false)
  }

  const textfiles = () => {
    getFileData(visitDetail.id).then((resp) => {
      const file = resp.results.map((res) => {

        return (
          { name: res.name, url: res.file_name }
        )
      })
      setFileData(file);
    })
      .catch((err) => {
        console.log(err, 'error')
      })

    setSummaryText(false)
    setAlertText(false)
    setFileText(true)
    setTaskText(false)
  }

  const texttask = () => {
    setSummaryText(false)
    setAlertText(false)
    setFileText(false)
    setTaskText(true)
  }

  const openFile = (fileurl) => {
  const ext = fileurl.substr(fileurl.length-4)
  if(ext.includes('pdf') || ext.includes('doc')){
    Linking.openURL(fileurl)
  }
  }

  // const selectFile = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     console.log('res : ' + JSON.stringify(res));
  //     setSingleFile(res);
  //   } catch (err) {
  //     setSingleFile(null);
  //     if (DocumentPicker.isCancel(err)) {
  //       alert('Canceled');
  //     } else {
  //       alert('Unknown Error: ' + JSON.stringify(err));
  //       throw err;
  //     }
  //   }
  // };

  // const selectOneFile = async () => {

  //   const res = await DocumentPicker.pick({
  //     type: [DocumentPicker.types.allFiles],
  //   });

  //   setFilename(res[0].name)
  //   setUri(res)
  // };

  // const viewfile = async () => {
  //   await FileViewer.open(res[0].uri)
  //     .then(() => {
  //       //alert('success')
  //     })
  //     .catch((err) => {
  //       //alert('Failure', err)
  //     })

  const event_styles = styleConstructor(visitDetail.currentData, isClockOnHold);

  const revertClock = async (both, ClockOut, clock_in_force) => {
    let continueSaving = true;
    continueSaving = await NetInfo.fetch().then(async stateConnection => {
      if (stateConnection.type === 'none') {
        setTimeout(() => {
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: false,
              textModal: 'You can not revert clockIn/ClockOut in offline mode',
            },
          }))
        }, 500);
      } else {
        const _visit_id = visitDetail.currentData.id
        try {
          if (!both) {
            const res = await setSchedulerVisitsRevertClock(_visit_id, ClockOut, clock_in_force);
            if (res.status === "FAIL") {
              setIsModalVisible(false);
              setTimeout(() => {
                setStateGlobal(state => ({
                  ...state,
                  requestModal: {
                    isVisible: true,
                    isSuccess: false,
                    textModal: res.message.message,
                  },
                }))
              }, 500);
            } else if (res.status === "Confirm yes or no") {
              setIsModalVisible(false);
              if (ClockOut) {
                setRevertClockOut(true);
                setErrorMessage(res.message.message)
                setTimeout(() => {
                  setShowModalException(true);
                }, 300);
                setTypeClock(false);
              } else {
                setErrorMessage(res.message.message)
                setTimeout(() => {
                  setShowModalException(true);
                }, 300);
                setTypeClock(false);
              }

            } else {
              setShowModalException(false);
              setIsModalVisible(false);
              setTimeout(() => {
                setStateGlobal(state => ({
                  ...state,
                  requestModal: {
                    isVisible: true,
                    isSuccess: true,
                    textModal: res.message,
                  },
                }));

              }, 500);

            }
          } else {
            const res = await setSchedulerVisitsRevertBoth(_visit_id);
            if (res.status === "FAIL") {
              setTimeout(() => {
                setStateGlobal(state => ({
                  ...state,
                  requestModal: {
                    isVisible: true,
                    isSuccess: false,
                    textModal: res.message.message,
                  },
                }))
              }, 500);
            } else {
              setTimeout(() => {
                setStateGlobal(state => ({
                  ...state,
                  requestModal: {
                    isVisible: true,
                    isSuccess: true,
                    textModal: res.message,
                  },
                }))
              }, 500);
            }
            setIsModalVisible(false);
          }
        } catch ({ message }) {
          setTimeout(() => {
            setStateGlobal(state => ({
              ...state,
              requestModal: {
                isVisible: true,
                isSuccess: false,
                textModal: `${message}`,
              },
            }))
          }, 100);
        }
      }
    });
  }

  useEffect(() => {
    loadEmployees()
    const loadLocalDatabase = async () => {
      const myDatabaseData = await Model.loadFromDatabase('ClockInOutOffline');

      const filterMyDatabaseByVisitId = myDatabaseData.filter(
        myData => myData.visitId === visitDetail.currentData.id,
      );

      const clock_on_hold = isClockOnHold;

      filterMyDatabaseByVisitId.map(myData => {
        if (myData.typeClock === 1) {
          clock_on_hold.clockIn = true;
        } else {
          clock_on_hold.clockOut = true;
        }
      });

      if (filterMyDatabaseByVisitId.length >= 1) {
        setIsVisitOnHold(true);
      } else {
        setIsVisitOnHold(false);
      }

      setIsClockOnHold({ ...clock_on_hold });
    };

    loadLocalDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBirthDayText = birthDay => {
    if (!birthDay) {
      return 'unspecified';
    }

    const splitDate = birthDay.split('-');
    const dateBirth = new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
    const ageDifMs = Date.now() - dateBirth;
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    const newYears = Math.abs(ageDate.getUTCFullYear() - 1970);

    let returnText = '';

    if (dateBirth.getMonth() + 1 < 10) {
      returnText = '0' + (dateBirth.getMonth() + 1);
    } else {
      returnText = dateBirth.getMonth() + 1;
    }

    if (dateBirth.getDate() < 10) {
      returnText = returnText + '-0' + dateBirth.getDate();
    } else {
      returnText = returnText + '-' + dateBirth.getDate();
    }

    returnText = returnText + '-' + dateBirth.getFullYear();

    return `${returnText} (${newYears})`;
  };

  const addDateVisitText = visitDay => {
    const dateVisit = new Date(visitDay.replace(' ', 'T'));
    return `${days[dateVisit.getDay()]}, ${shortMonths[dateVisit.getMonth()]
      } ${dateVisit.getDate()}`;
  };

  const addTimeVisitText = (start, end) => {
    return `${moment(start).format('h:mm a')} - ${moment(end).format('h:mm a')}`;
  };

  const callNumber = () => {

    let phoneNumber = '';

    const phone = visitDetail.contact.telephone;

    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.openURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(error => { });
  };

  const openMaps = () => {
    let lat = visitDetail.client_services.service_address.latitude || 0;
    let lng = visitDetail.client_services.service_address.longitude || 0;
    let addressName = visitDetail.client_services.service_address.name || '';
    let addressCity = visitDetail.client_services.service_address.city || '';
    let addressCountry =
      visitDetail.client_services.service_address.country || '';

    if (
      visitDetail &&
      visitDetail.client_services &&
      visitDetail.client_services.service_address &&
      visitDetail.client_services.service_address.same_as_client
    ) {
      lat = visitDetail.address.latitude || 0;
      lng = visitDetail.address.longitude || 0;
      addressName = visitDetail.address.name || '';
      addressCity = visitDetail.address.city || '';
      addressCountry = visitDetail.address.country || '';
    }

    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = addressName + ',' + addressCity + ',' + addressCountry;

    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);

  };

  return (
    <SafeAreaView>
      <View>
        <View style={styles.popupHeader}>

          <View style={styles.textattendedview}>
            <Text style={{ color: '#ccc', fontWeight: 'bold' }}>Attend By</Text>
            <Text style={{ color: '#ccc', fontWeight: 'bold' }}>{addDateVisitText(visitDetail.currentData.start)}({calculateTime(visitDetail.currentData.start, visitDetail.currentData.end)})</Text>
          </View>
          <View style={styles.textemployee}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a237e' }}>{fullName}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a237e' }}>{time_start} - {time_end}</Text>
          </View>
          <View style={{ width: '100%', height: 1, color: '#ccc', backgroundColor: '#ccc', flexDirection: 'row', marginTop: 12 }}></View>

          <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
            <View style={{ width: '18.6%' }}>
              <LinearGradient
                colors={[PURPLE, GRADIENT_GREEN]}
                style={styles.gradientStyle}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}>
                {visitDetail.photo ? (
                  <Image
                    source={{
                      uri: `${visitDetail.photo}`,
                    }}
                    style={styles.photo}
                  />
                ) : (
                  <View style={styles.viewImageLogo}>
                    <Image style={styles.myLogo} source={myUserImage} />
                  </View>
                )}
              </LinearGradient>
            </View>
            <View style={styles.nameStyle}>
              <Text style={styles.textName}>{visitDetail.full_name}</Text>
              <Text style={styles.dobStyle}>
                {`D.O.B. ${addBirthDayText(visitDetail.date_of_birth)}`}
              </Text>
            </View>
            <View style={{ width: '23.3%' }}>
              <Text style={styles.buttonInfo}>INFO</Text>
              <Text style={styles.buttonNote}>Notes</Text>
            </View>
          </View>
        </View>

        <View style={styles.textTouchable}>

          <View><TouchableOpacity onPress={() => textsummary()} style={[styles.textSummary, summaryText ? styles.task : '']}><Text style={styles.textsize}>Summary</Text></TouchableOpacity></View>
          <View><TouchableOpacity onPress={() => textalerts()} style={[styles.textAction, alertText ? styles.task : '']}><Text style={styles.textsize}>Alerts</Text></TouchableOpacity></View>
          <View><TouchableOpacity onPress={() => textfiles()} style={[styles.textNote, fileText ? styles.task : '']}><Text style={styles.textsize}>Files</Text></TouchableOpacity></View>
          <View><TouchableOpacity onPress={() => texttask()} style={[styles.textTask, taskText ? styles.task : '']}><Text style={styles.textsize}>Task</Text></TouchableOpacity></View>
        </View>

        {alertText && <View style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}><Text>welcome to Alert Tab</Text></View>}

        {fileText ? <>
          
          <FlatList style={{ marginTop: 40 }} data={fileData}
            renderItem={({ item }) => <Text key={item.name} onPress={() => openFile(item.url)}>{item.name}</Text>} />
          </> : null}

        {taskText && <View style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}><Text>welcome to Task Tab</Text></View>}


        {summaryText && <View>
          <View style={styles.viewDetails}>
            <View style={styles.visitNumber}>
              <Text>{`${visitDetail.currentData.visit_number}`}</Text>
            </View>
          </View>
          <View style={styles.viewCallAndContact}>
            <TouchableOpacity style={styles.buttonContacts} onPress={() => { }}>
              <MaterialIconsIcon style={styles.iconContacts} name="contacts" />
              <Text style={[styles.weightStyle, styles.textStyle]}>{`CONTACTS`}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonCall}
              onPress={() => callNumber()}>
              <FoundationIcon style={styles.iconTelephone} name="telephone" />
              <Text style={[styles.weightStyle, styles.textStyle]}>{`CALL`}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewInstructions}>
            <View style={styles.viewTextInstructions}>
              <Text style={styles.weightStyle}>{`Instructions`}</Text>
            </View>
            <View style={styles.instructionsComponent}>
              <View style={styles.viewIcon}>
                <IoniconsIcon style={styles.iconBook} name="book-outline" />
              </View>
              <View style={styles.instructions}>
                <Text>
                  {visitDetail && visitDetail.client_services && visitDetail.client_services.visits && visitDetail.client_services.visits.notes && visitDetail.client_services.visits.notes}

                </Text>
              </View>
            </View>
          </View>
          <View style={styles.viewAddress}>
            <View style={styles.viewTextAddress}>
              <Text style={styles.weightStyle}>{`Address`}</Text>
              <Text style={{ backgroundColor: 'white', fontWeight: '600', textAlign: 'center' }}>{
                visitDetail.client_services &&
                  visitDetail.client_services.service_address &&
                  visitDetail.client_services.service_address
                    .same_as_client
                  ? `${visitDetail && visitDetail.address && visitDetail.address.line_1 && visitDetail.address.line_1}, ${visitDetail && visitDetail.address && visitDetail.address.city && visitDetail.address.city}, ${visitDetail && visitDetail.address && visitDetail.address.zip_code && visitDetail.address.zip_code}`
                  : `${visitDetail && visitDetail.client_services && visitDetail.client_services.service_address && visitDetail.client_services.service_address.line_1 && visitDetail.client_services.service_address.line_1}, ${visitDetail && visitDetail.client_services && visitDetail.client_services.service_address && visitDetail.client_services.service_address.city && visitDetail.client_services.service_address.city}, ${visitDetail && visitDetail.client_services && visitDetail.client_services.service_address && visitDetail.client_services.service_address.zip_code && visitDetail.client_services.service_address.zip_code}`
              }</Text>
            </View>
            <View style={styles.instructionsComponent}>
              <View style={styles.viewIcon}>
                <FontistoIcon style={styles.iconMarker} name="map-marker-alt" />
              </View>
              <TouchableHighlight
                style={styles.instructions}
                onPress={() => openMaps()}
                underlayColor={GRAY_150}>
                <Fragment>
                  <MapView
                    style={styles.map}
                    region={{
                      latitude:
                        parseFloat(
                          visitDetail.client_services &&
                            visitDetail.client_services.service_address &&
                            visitDetail.client_services.service_address
                              .same_as_client
                            ? visitDetail && visitDetail.address && visitDetail.address.latitude
                            : visitDetail && visitDetail.client_services && visitDetail.client_services.service_address && visitDetail.client_services.service_address.latitude,
                        ) || 0,
                      longitude:
                        parseFloat(
                          visitDetail.client_services &&
                            visitDetail.client_services.service_address &&
                            visitDetail.client_services.service_address
                              .same_as_client
                            ? visitDetail && visitDetail.address && visitDetail.address.longitude
                            : visitDetail && visitDetail.client_services && visitDetail.client_services.service_address && visitDetail.client_services.service_address.longitude,
                        ) || 0,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,

                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude:
                          parseFloat(
                            visitDetail && visitDetail.client_services && visitDetail.client_services.service_address && visitDetail.client_services.service_address.latitude,
                          ) || 0,
                        longitude:
                          parseFloat(
                            visitDetail && visitDetail.client_services && visitDetail.client_services.service_address && visitDetail.client_services.service_address.longitude,
                          ) || 0,
                      }}
                      description={
                        visitDetail.client_services &&
                          visitDetail.client_services.service_address &&
                          visitDetail.client_services.service_address
                            .same_as_client
                          ? `${visitDetail && visitDetail.address && visitDetail.address.line_1 && visitDetail.address.line_1}, ${visitDetail && visitDetail.address && visitDetail.address.city && visitDetail.address.city}, ${visitDetail && visitDetail.address && visitDetail.address.country && visitDetail.address.country}`
                          : (visitDetail && visitDetail.client_services && visitDetail.client_services.service_address && `${visitDetail.client_services.service_address.line_1 && visitDetail.client_services.service_address.line_1}, ${visitDetail.client_services.service_address.city && visitDetail.client_services.service_address.city}, ${visitDetail.client_services.service_address.country}`)
                      }
                    >

                    </Marker>
                  </MapView>

                  <View style={styles.addressContainer}>

                  </View>
                </Fragment>
              </TouchableHighlight>
            </View>
          </View>
          <View style={styles.buttonsView}>

            {(visitDetail.currentData &&
              visitDetail.currentData.actual_visit_start_time) ||
              isClockOnHold.clockIn
              ?
              <TouchableOpacity></TouchableOpacity>
              :
              <TouchableOpacity
                disabled={
                  (visitDetail.currentData &&
                    visitDetail.currentData.actual_visit_start_time) ||
                  isClockOnHold.clockIn
                }
                onPress={
                  (visitDetail.currentData &&
                    !visitDetail.currentData.actual_visit_start_time) ||
                    !isClockOnHold.clockIn
                    ? () => schedulerVisitClock(true)
                    : ''
                }
                style={event_styles.clockIn}>

                <Text
                  style={[
                    styles.weightStyle,
                    styles.textStyleReturn,
                    styles.textClockIn,
                  ]}>
                  CLOCK IN
                </Text>
              </TouchableOpacity>
            }
            {
              (visitDetail.currentData &&
                visitDetail.currentData.actual_visit_end_time)
                ?
                <TouchableOpacity></TouchableOpacity>
                :
                <TouchableOpacity
                  disabled={
                    (visitDetail.currentData &&
                      visitDetail.currentData.actual_visit_end_time &&
                      !isClockOnHold.clockIn) ||
                    (visitDetail.currentData &&
                      !visitDetail.currentData.actual_visit_start_time &&
                      !isClockOnHold.clockIn) ||
                    isClockOnHold.clockOut
                  }
                  onPress={
                    (visitDetail.currentData &&
                      !visitDetail.currentData.actual_visit_end_time &&
                      (visitDetail.currentData &&
                        visitDetail.currentData.actual_visit_start_time)) ||
                      !isClockOnHold.clockOut
                      ? () => schedulerVisitClock(false)
                      : ''
                  }
                  style={event_styles.clockOut}>

                  <Text
                    style={[
                      styles.weightStyle,
                      styles.textStyleReturn,
                      styles.textClockOut,
                    ]}>
                    CLOCK OUT
                  </Text>
                </TouchableOpacity>
            }
            {(visitDetail.currentData &&
              visitDetail.currentData.actual_visit_start_time) ||
              isClockOnHold.clockIn
              ?
              <TouchableOpacity
                onPress={() => revertClock(false, (visitDetail.currentData && visitDetail.currentData.actual_visit_end_time) ? true : false)}
                style={event_styles.clockOut}>

                <Text
                  style={[
                    styles.weightStyle,
                    styles.textStyleReturn,
                    styles.textClockOut,
                  ]}>
                  Revert {(visitDetail.currentData &&
                    visitDetail.currentData.actual_visit_end_time) ? 'ClockOut' : 'ClockIn'}
                </Text>
              </TouchableOpacity>
              :
              <TouchableOpacity></TouchableOpacity>
            }
            {
              (visitDetail.currentData &&
                visitDetail.currentData.actual_visit_end_time
              ) &&
                (visitDetail.currentData &&
                  visitDetail.currentData.actual_visit_start_time
                )
                ?
                <TouchableOpacity
                  onPress={() => revertClock(true)}
                  style={event_styles.clockOut}>

                  <Text
                    style={[
                      styles.weightStyle,
                      styles.textStyleReturn,
                      styles.textClockOut,
                    ]}>
                    Revert both
                  </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity></TouchableOpacity>
            }
          </View>
          </View>
        }
     </View> 
    </SafeAreaView>
  );
};


export default VisitDetails;
