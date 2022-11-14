import React, {
  useState,
  useEffect,
  Fragment,
  createRef,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Agenda} from 'react-native-calendars';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CALENDAR_DAILY} from '../../utils/constants/queryParams';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NetInfo from '@react-native-community/netinfo';
import {
  TYPE_AVAILABLE,
  TYPE_UNAVAILABLE,
  TYPE_ABSENCE,
  AVAILABILITY_VIEW,
  UNAVAILABILITY_VIEW,
  ABSENCE_VIEW
} from '../../utils/constants/rotaShift';
import {
  SCHEDULER_ASSIGNED,
  SCHEDULER_UNASSIGNED,
  ROTA_UNAVAILABLE,
  ROTA_AVAILABLE,
  WHITE,
  GRAY_820,
  PURPLE,
  GRAY_800,
  GRAY_400,
  GRAY_300,
  ERR_COLOR_800,
} from '../../assets/Colors';
import { TokenContext } from '../../utils/context/TokenContext';
import {AVAILABILITY} from '../../utils/constants/routes';
import EventCalendar from 'react-native-events-calendar';
import {getScheduler} from '../../utils/api/SchedulerApi';
import {getRotaShifts} from '../../utils/api/RotaShiftApi';
import {GlobalContext} from '../../utils/context/GlobalContext';
import {timeTextFormat} from '../../shared/Methods/DateMethods';
import {styles, eventCalendar} from './styles';
import {USER_ID} from '../../utils/constants/storageKeys';
import moment from 'moment';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import {differenceInMinutes} from 'date-fns';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from "../HomeAgendaDay/redux/actions";

//get the size of device
let {width} = Dimensions.get('window');
import myUserImage from '../../assets/icons/HomeIcons/user.jpg';
const HomeAgendaDay = ({
  setMonthText,
  getVisitDetails,
  deleteAvailability,
  viewDate, 
  setViewDate,
  showCalendar,
  setShowCalendar,
  handleInfo
}) => {
  const navigation = useNavigation();
  const [stateGlobal, setStateGlobal] = useContext(GlobalContext);
  const [stateValue] = useContext(TokenContext);
  const { employeeUserId = '' } = stateValue;
  const [events, setEvents] = useState([]);
  const [visitCounts, setVisitCounts] = useState(0);
  const [visitHours, setVisitHours] = useState(0);
  const [clockedHours, setClockedHours] = useState(0);
  const [actualHours, setActualHours] = useState(0);
  const agenda = createRef();
  const  {eventsOffline}  = useSelector(state => state.Offline);
  // console.log('getoffline', eventsOffline);
  const dispatch = useDispatch();
  const checkNetwork = async()=>{
    let continueSaving = true;
    continueSaving = await NetInfo.fetch().then(async stateConnection => {
      if (stateConnection.type === 'none') {
        console.log('con',eventsOffline);
        setTimeout(() => {
          setStateGlobal(state => ({...state, loadingModalVisible: false}));
        }, 1000);
        setEvents(eventsOffline);
      } else {
          searchScheduler();
      }
    }); 
  }

  const checkNetwork1 = async(isVisible)=>{
    let continueSaving = true;
    continueSaving = await NetInfo.fetch().then(async stateConnection => {
      if (stateConnection.type === 'none') {
        console.log('con',eventsOffline);
        setTimeout(() => {
          setStateGlobal(state => ({...state, loadingModalVisible: false}));
        }, 1000);
        setEvents(eventsOffline);
      } else {
        if(isVisible){
          searchScheduler();
        }
      }
    }); 
  }

  useEffect(() => {
    //send the date to display it in text in header
    setMonthText(viewDate);
    checkNetwork()
    //assign the today date in calendar
    agenda.current.chooseDay(viewDate);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewDate, employeeUserId]);

  /**
   * refresh the calendar
   */
  useEffect(() => {
    checkNetwork1(stateGlobal.requestModal.isVisible);
  }, [stateGlobal.requestModal]);

  useEffect(()=>{
    if(events){
      const hrs = events
      .filter((i)=> i.isVisit === true)
      .map((d)=>(new Date(d.end) - new Date(d.start)) / 3600000)

      if (hrs && hrs.length > 0) {
        let aHours = hrs.reduce((total, visit) => total + visit);
        aHours % 0.1 === 0
          ? setVisitHours(aHours)
          : setVisitHours(Math.round(aHours * 100) / 100);
      } else {
        setVisitHours(0);
      }

      const clkhrs = events
      .filter((i)=> i.isVisit === true)
      .map((d)=>d.actual_visit_start_time && d.actual_visit_end_time && (new Date(d.actual_visit_end_time) - new Date(d.actual_visit_start_time)) / 3600000)

      if (clkhrs && clkhrs.length > 0) {
        let aHours = clkhrs.reduce((total, visit) => total + visit);
        aHours % 0.1 === 0
          ? setClockedHours(aHours)
          : setClockedHours(Math.round(aHours * 100) / 100);
      } else {
        setClockedHours(0);
      }

      const actualhrs = events
      .filter((i)=> i.isVisit === true)
      .map((d)=>d.actual_start_time && d.actual_end_time && (new Date(d.actual_end_time) - new Date(d.actual_start_time)) / 3600000)

      if (actualhrs && actualhrs.length > 0) {
        let aHours = actualhrs.reduce((total, visit) => total + visit);
        aHours % 0.1 === 0
          ? setActualHours(aHours)
          : setActualHours(Math.round(aHours * 100) / 100);
      } else {
        setActualHours(0);
      }
    }
  },[events])

  const eventClicked = item => {
    if(item.isShift){
      goToView(item);
    }
    else if (item.isVisit) {
      getVisitDetails(item);
    } else {
      goToView(item);
    }
  };

  const searchRotaShifts = async (start_date, end_date, employees) => {
    return await getRotaShifts({start_date, end_date, carer: employees});
  };

  const backColor=(status)=>{
    if(status === 'Completed'){
      return 'green'
    }
    else if(status === 'In Progress'){
      return 'orange'
    }
    else if(status === 'Missed'){
      return 'red'
    }
    else if(status === 'Not Started'){
      return 'yellow'
    }
  }

  /**
   * Get the scheduler events and set in events state
   */
  const searchScheduler = async () => {
    const start_date = viewDate;
    let end_date = moment(start_date);
    end_date.add(1, 'days');
    end_date = moment(end_date).format('YYYY-MM-DD');
    const employees = await AsyncStorage.getItem(USER_ID);
    let data = [];
    const shiftType = CALENDAR_DAILY;
    getScheduler({start_date, end_date, employees, shiftType }, 800)
      .then(response => {
        let address = {};
        let client_services = {};
        let contact = {};
        let clientInfo = {};
        response.forEach(scheduler => {
          scheduler.visits.forEach(detail => {
            clientInfo = {
              first_name: scheduler.first_name,
              last_name: scheduler.last_name,
              full_name: scheduler.full_name,
              date_of_birth: scheduler.date_of_birth
            }

            address = { 
              line_1: detail.line_1,
              line_2: detail.line_2,
              state: scheduler.state,
              city: scheduler.city,
              country: scheduler.country,
              latitude: scheduler.service_latitude,
              longitude: scheduler.service_longitude,
            };
            contact = {
              email_personal: scheduler.email_personal,
              email_work: scheduler.email_work,
              telephone: scheduler.telephone,
              mobile: scheduler.mobile,
            };
            client_services = {
              service_address : {...address}
            };

            data.push({
              id: detail.id,
              resourceId: scheduler.id,
              groupId: detail.client_service_visit_id,
              typeEvent: detail.employee_id ? TYPE_AVAILABLE : TYPE_UNAVAILABLE,
              title: detail.employee_id
                ? detail.employee_fullname
                : 'Unassigned ',
                backgroundColor: detail.employee_id ? (detail.visit_status_name ? backColor(detail.visit_status_name) : SCHEDULER_ASSIGNED) : SCHEDULER_UNASSIGNED,
                borderColor : detail.employee_id ? (detail.visit_status_name ? backColor(detail.visit_status_name) : SCHEDULER_ASSIGNED) : SCHEDULER_UNASSIGNED,
              textColor: detail.employee_id ? GRAY_820 : WHITE,
              start: detail.start_date,
              end: detail.end_date,
              header_name: scheduler.full_name,
              visit_status_name: detail.visit_status_name,
              visit_type_name: detail.visit_type_name,
              journey_end_zipcode: detail.journey_end_zipcode,
              visit_number: detail.visit_number,
              actual_visit_start_time: detail.actual_visit_start_time,
              actual_visit_end_time: detail.actual_visit_end_time,
              actual_visit_duration: detail.actual_visit_duration,
              actual_start_time: detail.actual_start_time,
              actual_end_time: detail.actual_end_time,
              line_1: detail.line_1,
              address: address,
              contact: contact,
              client_services: client_services,
              clientInfo: clientInfo,
              notes: detail.notes,
              isVisit: true,
            });
          });
        });
      })
      .finally(async () => {
        try {
          const rotaShifts = await searchRotaShifts(
            start_date,
            end_date,
            employees,
          );
          rotaShifts.map(rotaShift => {
            rotaShift.availabilities.map(detail => {
              data.push({
                id: detail.id,
                resourceId: rotaShift.id,
                groupId: detail.availability_id,
                typeEvent: detail.is_available
                  ? TYPE_AVAILABLE
                  : (detail.is_absent ? TYPE_ABSENCE : TYPE_UNAVAILABLE),
                //title: detail.is_available ? 'Available' : 'Unavailable',
                title: detail.regular_shift_name == null ? (detail.is_available ? detail.shift_type_name :detail.is_absent? 'Absence':'Unavailable') : detail.regular_shift_name,

                backgroundColor: detail.is_available
                ? detail.shift_type_name=='Availability'
                ?ROTA_AVAILABLE
                :detail.shift_type_name=='On Call'
                ?'#FF8C00':
                detail.shift_type_name=='Bank-Flexible'?
                '#de5285':'#e7c153'
                :detail.is_absent? '#343434'
              :ROTA_UNAVAILABLE,

              borderColor: detail.is_available
              ? detail.shift_type_name=='Availability'
              ?ROTA_AVAILABLE
              :detail.shift_type_name=='On Call'
              ?'#FF8C00':
              detail.shift_type_name=='Bank-Flexible'?
              '#de5285':'#e7c153'
                :detail.is_absent? '#343434'
              :ROTA_UNAVAILABLE,


              //   backgroundColor: detail.is_available
              //   ? ROTA_AVAILABLE
              //   : (detail.is_absent ? '#343434' : ROTA_UNAVAILABLE),
              // borderColor: detail.is_available
              //   ? ROTA_AVAILABLE
              //   : (detail.is_absent ? '#343434' : ROTA_UNAVAILABLE),
                textColor: detail.is_available ? GRAY_820 : WHITE,
                start: detail.detail_start_date,
                end: detail.detail_end_date,
                header_name: detail.is_available ? 'Available' : (detail.is_absent ? 'Absence' : 'Unavailable'),
                isVisit: false,
              });
            });
          });
          rotaShifts.map(rotaShift => {
            rotaShift.shifts.map(detail => {
              data.push({
                id: detail.id,
                resourceId: rotaShift.id,
                groupId: detail.shift_id,
                typeEvent: detail.is_available
                  ? TYPE_AVAILABLE
                  : TYPE_UNAVAILABLE,
                title: detail.regular_shift_name ? detail.regular_shift_name :  detail.shift_pattern_name,
                backgroundColor: '#FFBC42',
                borderColor: '#FFBC42' ,
                textColor: detail.is_available ? GRAY_820 : WHITE,
                // start: moment(detail.detail_start_date).format('YYYY-MM-DD HH:mm:ss'),
                //  end: moment(detail.detail_end_date).format('YYYY-MM-DD HH:mm:ss'),
               start: detail.detail_start_date,
               end: detail.detail_end_date,
                header_name: detail.regular_shift_name ? detail.regular_shift_name :  detail.shift_pattern_name,
                isVisit: false,
                isShift: true
              });
            });
          });
          setVisitCounts(data.filter((item)=>item.isVisit === true).length);
          setEvents(data);
          dispatch(actions.OfflineData(data));
        } catch {}
        setTimeout(() => {
          setStateGlobal(state => ({...state, loadingModalVisible: false}));
        }, 1000);
      });
  };
  

  /**
   * Return the view for each item in state events array
   * @param {object} item
   */
  const renderItem = item => {
    let buttonsInHeader =
      differenceInMinutes(new Date(item.end), new Date(item.start)) <= 90;
    const changeText =
      differenceInMinutes(new Date(item.end), new Date(item.start)) < 22;
    const showText =
      differenceInMinutes(new Date(item.end), new Date(item.start)) >= 13;

    if (!item.isVisit) {
      return (
        <TouchableOpacity
          onPress={() => goToView(item)}
          style={[
            styles.availabilitiesClass,
            {
              // backgroundColor: item.isShift ? '#FFBC42' :
              //   (item.typeEvent === TYPE_AVAILABLE
              //     ? ROTA_AVAILABLE
              //     : ERR_COLOR_800)
              backgroundColor: item.backgroundColor
            },
          ]}>
          <EntypoIcon
            style={styles.availabilitiesIcon}
            name={item.typeEvent === TYPE_AVAILABLE ? 'check' : 'cross'}
          />
          {showText ? (
            <Text style={styles.availabilitiesText}>
              {item.typeEvent === TYPE_AVAILABLE
                ? changeText
                  ? 'Ava..'
                  : `${item && item.header_name ? item.header_name : ''}`
                : changeText
                ? 'Una..'
                : `${item && item.header_name ? item.header_name : ''}`
                }
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.item, {borderColor: item.borderColor}]}
        onPress={() => eventClicked(item)}>
        <View
          style={[styles.headerItem, {backgroundColor: item.backgroundColor}]}>
          <Text>{item && item.header_name ? item.header_name : ''}</Text>
          {item.isVisit ? <Text>{item && item.visit_status_name ? item.visit_status_name : ''}</Text> :  <Fragment /> }
          {!item.isVisit && buttonsInHeader ? (
            <View style={styles.eventHeaderIconView}>
              <TouchableOpacity
                style={[styles.eventHeaderIcon, styles.editHeaderIcon]}
                onPress={() => goToView(item)}>
                <MaterialIcons style={styles.styleHeaderIcon} name={'edit'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.eventHeaderIcon, styles.deleteHeaderIcon]}
                onPress={() => {
                  deleteAvailability(item);
                }}>
                <IoniconsIcon
                  style={styles.styleHeaderIcon}
                  name={'trash-outline'}
                />
              </TouchableOpacity>
            </View>
          ) : item.isVisit ? (
            <View style={styles.eventUserIconView}>
              <View style={[styles.eventUserIcon]}>
                <Image
                  style={styles.styleUserIcon}
                  source={item.url ? item.url : myUserImage}
                />
              </View>
            </View>
          ) : (
            <Fragment />
          )}
        </View>
        <View style={styles.timeItem}>
          <IoniconsIcon
            style={styles.iconForward}
            name="md-return-up-forward"
          />
          <Text>{item.start ? moment(item.start).format('h:mm a') : ''}</Text>
          <IoniconsIcon
            style={styles.iconBack}
            name="md-return-up-back-outline"
          />
          <Text>{item.end ? moment(item.end).format('h:mm a') : ''}</Text>
          <Text style={styles.textDuration}>
            {calculateTime(item.start, item.end)}
          </Text>
          {item.notes ? 
          <IoniconsIcon
          onPress={()=>handleInfo(item.notes)}
          style={styles.iconInfo}
          name="information-circle-outline"
        />
        :
        <Fragment />
      } 
        </View>
        <View style={styles.durationItem}>
        <View style={styles.timeItem}>
        <Text>{item.visit_type_name ? item.visit_type_name : ''}</Text>
        <Text style={styles.textZip}>{item.journey_end_zipcode ? item.journey_end_zipcode : ''}</Text>
        </View>
        </View>
        <View style={styles.durationItem}>
        <Text>{item.line_1 ? item.line_1 : ''}</Text>
        </View>

        {item.isVisit ? 
        <View style={styles.timeItem}>
        {item.actual_visit_start_time &&
          <IoniconsIcon
          style={styles.iconForward}
          name="md-return-up-forward"
        />
        }
        <Text>{item.actual_visit_start_time ? moment(item.actual_visit_start_time).format('h:mm a') : ''}</Text>
        {item.actual_visit_end_time &&
          <IoniconsIcon
          style={styles.iconBack}
          name="md-return-up-back-outline"
        />
        }
        <Text>{item.actual_visit_end_time ? moment(item.actual_visit_end_time).format('h:mm a') : ''}</Text>
        {item.actual_visit_start_time && item.actual_visit_end_time && 
        <Text style={styles.textDuration}>
            {calculateTimeD(item.actual_visit_duration)}
          </Text>}
          {(item.actual_visit_start_time && !item.actual_visit_end_time) ? 
              <View style={styles.countdown}>
                <CountdownCircleTimer
                  isPlaying
                  duration={calculateTimeDuration(item.start, item.end)}
                  initialRemainingTime={calculateTimeDuration(item.start, item.end) - countdownTime(item.actual_visit_start_time)}
                  size={50}
                  strokeWidth={3}
                  colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                  colorsTime={[7, 5, 2, 0]}
                >
                  {({ remainingTime }) => {
                     const minutes = Math.floor(remainingTime / 60)
                     const seconds = remainingTime % 60
                     return <Text>{minutes}:{seconds}</Text>
                    }
                  }
                </CountdownCircleTimer>
              </View>
        :
        <Fragment />
          }
      </View>
      :
      <Fragment />
        }

        {!item.isVisit && !buttonsInHeader ? (
          <View style={styles.eventIconView}>
            <TouchableOpacity
              style={[styles.eventIcon, styles.editIcon]}
              onPress={() => goToView(item)}>
              <MaterialIcons style={styles.styleIcon} name={'edit'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.eventIcon, styles.deleteIcon]}
              onPress={() => {
                deleteAvailability(item);
              }}>
              <IoniconsIcon style={styles.styleIcon} name={'trash-outline'} />
            </TouchableOpacity>
          </View>
        ) : (
          <Fragment />
        )}
      </TouchableOpacity>
    );
  };

  const goToView = item => {
    let _view = AVAILABILITY_VIEW;

    if (TYPE_UNAVAILABLE === item.typeEvent) {
      _view = UNAVAILABILITY_VIEW;
    } else if(TYPE_ABSENCE === item.typeEvent){
      _view = ABSENCE_VIEW;
    }

    setStateGlobal(state => ({...state, typeAvailabilityView: _view}));

    /* 1. Navigate to the Details route with params */
    navigation.navigate(AVAILABILITY, {
      availabilityId: item.groupId,
      detailId: item.id,
      isShift : item.isShift
    });
  };

  /**
   * Add the view with calendar time and events
   */
  const renderEventCalendar = () => {
    return (
      <Fragment>
        <EventCalendar
          events={events}
          // Passing the Array of event
          width={width}
          //differenceInMinutes={30}
          // Container width
          size={60}
          // number of date will render before and after initDate
          // (default is 30 will render 30 day before initDate
          // and 29 day after initDate)
          initDate={viewDate}
          // Show initial date (default is today)
          scrollToFirst
          // Scroll to first event of the day (default true)
          renderEvent={event => renderItem(event)}
          styles={eventCalendar}
          virtualizedListProps={{
            scrollEnabled: false,
          }}
        />
      </Fragment>
    );
  };

  /**
   * Calculate de difference in stat time an end time for ech the item in
   * events state.
   * @param {Date} initialTime
   * @param {Date} finalTime
   */


   const calculateTime = (initialTime, finalTime) => {
    const calculateDiff = moment(finalTime, 'YYYY-MM-DD HH:mm:ss').diff(
      moment(initialTime, 'YYYY-MM-DD HH:mm:ss'),
    );

    const duration = moment.duration(calculateDiff);

    return `${duration.hours()}h ${duration.minutes()}m`;
  };
  const calculateTimeDuration = (initialTime, finalTime) => {
    const calculateDiff = moment(finalTime, 'YYYY-MM-DD HH:mm:ss').diff(
      moment(initialTime, 'YYYY-MM-DD HH:mm:ss'),
    );
    const duration = moment.duration(calculateDiff).asSeconds();
    return duration;
  };

  const countdownTime = (startTime ) => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const calculateDiff = moment(currentTime, 'YYYY-MM-DD HH:mm:ss').diff(
      moment(startTime, 'YYYY-MM-DD HH:mm:ss'),
    );
    const duration = moment.duration(calculateDiff).asSeconds();
    return duration;
  };
  

  const calculateTimeD = (time) => {
    const duration = moment.duration(time , "minutes");
    return `${duration.hours()}h ${duration.minutes()}m`;
  };

  const renderEmptyDate = () => {
    return <View style={styles.emptyDate} />;
  };


  return (
    <View style={styles.container}>
      <View style={[styles.dayButtons, styles.visitCountContain]}>
          <View style={styles.singleCount}>
            <Text style={[styles.titleText]}>Visits : </Text>
            <Text style={styles.subtitleText}>{visitCounts}</Text>
          </View>
          <View style={styles.singleCount}>
            <Text style={[styles.titleText]}>Hrs :</Text>
            <Text style={styles.subtitleText}>{visitHours}</Text>
          </View>
          <View style={styles.singleCount}>
            <Text style={[styles.titleText]}>Clocked Hr :</Text>
            <Text style={styles.subtitleText}>{clockedHours}</Text>
          </View>
          <View style={styles.singleCount}>
            <Text style={[styles.titleText]}>Actual Hr :</Text>
            <Text style={styles.subtitleText}>{actualHours}</Text>
          </View>
        </View>
      <Agenda
        ref={agenda}
        //add empty items for show only calendar
        items={{}}
        renderEmptyData={renderEventCalendar}
        selected={viewDate}
        onDayPress={dayData => {
          setViewDate(dayData.dateString);
        }}
        rowHasChanged={(r1, r2) => {
          return r1.text !== r2.text;
        }}
        theme={{
          backgroundColor: GRAY_300,
          calendarBackground: WHITE,
          monthTextColor: PURPLE,
          dayTextColor: GRAY_400,
          todayTextColor: PURPLE,
          textDisabledColor: GRAY_400,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textSectionTitleColor: GRAY_800,
          selectedDayBackgroundColor: PURPLE,
          selectedDayTextColor: WHITE,
          selectedDayTextSize: 20,
          textDayFontSize: 14,
          textMonthFontSize: 15,
          textDayHeaderFontSize: 14,
          agendaKnobColor: PURPLE,
          'stylesheet.calendar.header': {
            week: {
              marginTop: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          },
        }}
        firstDay={1}
        openCalendar={showCalendar}
        onCalendarToggled={enable => {
          setShowCalendar(enable);
        }}
      />
    </View>
  );
};

HomeAgendaDay.propTypes = {
  setMonthText: PropTypes.func.isRequired,
  getVisitDetails: PropTypes.func.isRequired,
  deleteAvailability: PropTypes.func.isRequired,
  viewDate: PropTypes.string.isRequired,
  setViewDate: PropTypes.func.isRequired,
  showCalendar: PropTypes.bool.isRequired,
  setShowCalendar: PropTypes.func.isRequired,
};

export default HomeAgendaDay;
