import React, {
  useEffect,
  useState,
  createRef,
  Fragment,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Agenda} from 'react-native-calendars';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {
  TYPE_AVAILABLE,
  TYPE_UNAVAILABLE,
  TYPE_ABSENCE,
  AVAILABILITY_VIEW,
  UNAVAILABILITY_VIEW,
  ABSENCE_VIEW
} from '../../utils/constants/rotaShift';
import {getScheduler} from '../../utils/api/SchedulerApi';
import {getRotaShifts} from '../../utils/api/RotaShiftApi';
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
  GRAY_150,
  GRAY_700,
} from '../../assets/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {styles} from './styles';
import moment from 'moment';
import {GlobalContext} from '../../utils/context/GlobalContext';
import {AVAILABILITY} from '../../utils/constants/routes';
import {CALENDAR_WEEKLY} from '../../utils/constants/queryParams';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import {
  timeTextFormat,
  dateToStringDate,
} from '../../shared/Methods/DateMethods';
import {USER_ID, ISADMIN, ISSTAFF} from '../../utils/constants/storageKeys';
import PropTypes from 'prop-types';

let _ = require('lodash');
import myUserImage from '../../assets/icons/HomeIcons/user.jpg';

const HomeAgendaWeekly = ({
  shftType,
  setMonthText,
  setWeekDate,
  weekDate,
  getVisitDetails,
  deleteAvailability,
  showCalendar,
  setShowCalendar,
}) => {
  const navigation = useNavigation();
  const [stateGlobal, setStateGlobal] = useContext(GlobalContext);
  //const [viewDate, setViewDate] = useState(dateToStringDate(new Date()));
  const [markedDays, setMarkedDays] = useState({});
  const [items, setItems] = useState({});
  const [itemsCounts, setItemsCounts] = useState([]);
  const [visitCounts, setVisitCounts] = useState(0);
  const [visitHours, setVisitHours] = useState(0);
  const [clockedHours, setClockedHours] = useState(0);
  const [actualHours, setActualHours] = useState(0);
  const [deleteButton, setDeleteButton] = useState(false);
  const agenda = createRef();

  useEffect(() => {
    searchScheduler();
    addMarkedDays();
    setMonthText(weekDate);
    let start_date = moment(moment(weekDate).format('YYYY-MM-DD'), 'YYYY-MM-DD')
      .isoWeekday(1)
      .format('YYYY-MM-DD');

      setWeekDate(start_date);

    agenda.current.chooseDay(moment(start_date).format('YYYY-MM-DD'));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekDate]);

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

  /**
   * refresh the calendar
   */
  useEffect(() => {
    if (stateGlobal.requestModal.isVisible) {
      searchScheduler();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateGlobal.requestModal]);

  // useEffect(() => {
  //   setViewDate(weekDate);
  //    debugger
  // }, [weekDate]);

  // useEffect(()=>{
  //   console.log(viewDate);
  //   debugger
  // },[viewDate])

  const eventClicked = item => {
    if (item.isVisit) {
      getVisitDetails(item);
    } else {
      goToView(item);
    }
  };

  const addMarkedDays = () => {
    let start_date = moment(moment(weekDate).format('YYYY-MM-DD'), 'YYYY-MM-DD')
      .isoWeekday(1)
      .format();

    let daysToMarked = {};

    for (let i = 0; i < 7; i++) {
      const dayOfWeek = moment(start_date).day();

      if (dayOfWeek === 1) {
        daysToMarked[moment(start_date).format('YYYY-MM-DD')] = {
          startingDay: true,
          color: PURPLE,
          textColor: WHITE,
        };
      } else if (dayOfWeek === 0) {
        daysToMarked[moment(start_date).format('YYYY-MM-DD')] = {
          endingDay: true,
          color: PURPLE,
          textColor: WHITE,
        };
      } else {
        daysToMarked[moment(start_date).format('YYYY-MM-DD')] = {
          color: PURPLE,
          textColor: WHITE,
        };
      }

      start_date = moment(start_date);
      start_date.add(1, 'days');
    }

    setMarkedDays(daysToMarked);
  };

  useEffect(()=>{
    if(itemsCounts && itemsCounts.length > 0){
      const hrs = itemsCounts
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

      const clkhrs = itemsCounts
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

      const actualhrs = itemsCounts
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
  },[itemsCounts])

  const searchRotaShifts = async (start_date, end_date, employees) => {
    return getRotaShifts({start_date, end_date, carer: employees});
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

  

  const searchScheduler = async () => {
    const start_date = moment(
      moment(weekDate).format('YYYY-MM-DD'),
      'YYYY-MM-DD',
    )
      .isoWeekday(1)
      .format();
    const end_date = moment(moment(weekDate).format('YYYY-MM-DD'), 'YYYY-MM-DD')
      .isoWeekday(8)
      .format();
    const employees = await AsyncStorage.getItem(USER_ID);
    const shiftType = CALENDAR_WEEKLY;
    let data = [];
    getScheduler({start_date, end_date, employees, shiftType}, 800)
      .then(response => {
        response.forEach(scheduler => {
          scheduler.visits.forEach(detail => {
            data.push({
              id: detail.id,
              resourceId: scheduler.id,
              groupId: detail.client_service_visit_id,
              typeEvent: detail.employee_id ? TYPE_AVAILABLE : TYPE_UNAVAILABLE,
              title: detail.employee_id
                ? detail.employee_fullname
                : 'Unassigned ',
              // backgroundColor: detail.employee_id
              //   ? SCHEDULER_ASSIGNED
              //   : SCHEDULER_UNASSIGNED,
              // borderColor: detail.employee_id
              //   ? SCHEDULER_ASSIGNED
              //   : SCHEDULER_UNASSIGNED,
              backgroundColor: detail.employee_id ? (detail.visit_status_name ? backColor(detail.visit_status_name) : SCHEDULER_ASSIGNED) : SCHEDULER_UNASSIGNED,
              borderColor : detail.employee_id ? (detail.visit_status_name ? backColor(detail.visit_status_name) : SCHEDULER_ASSIGNED) : SCHEDULER_UNASSIGNED,
              textColor: detail.employee_id ? GRAY_820 : WHITE,
              start: detail.start_date,
              end: detail.end_date,
              header_name: scheduler.full_name,
              visit_status_name: detail.visit_status_name,
              visit_type_name: detail.visit_type_name,
              journey_end_zipcode: detail.journey_end_zipcode,
              actual_visit_start_time: detail.actual_visit_start_time,
              actual_visit_end_time: detail.actual_visit_end_time,
              actual_visit_duration: detail.actual_visit_duration,
              actual_start_time: detail.actual_start_time,
              actual_end_time: detail.actual_end_time,
              line_1: detail.line_1,
              isVisit: true,
            });
          });
        });
      })
      .finally(async () => {
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
                : (detail.is_absent ? TYPE_ABSENCE : TYPE_UNAVAILABLE) ,
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

              textColor: detail.is_available ? GRAY_820 : WHITE,
              // start: moment(detail.detail_start_date).format('YYYY-MM-DD HH:mm:ss'),
              //  end: moment(detail.detail_end_date).format('YYYY-MM-DD HH:mm:ss'),
             start: detail.detail_start_date,
             end: detail.detail_end_date,
             // header_name: detail.is_available ? 'Available' : 'Unavailable',
             header_name: detail.regular_shift_name ? detail.regular_shift_name :  '',
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
              title: detail.is_available ? 'Available' : 'Unavailable',
              backgroundColor: '#FFBC42',
              borderColor: '#FFBC42' ,
              textColor: detail.is_available ? GRAY_820 : WHITE,
              // start: moment(detail.detail_start_date).format('YYYY-MM-DD HH:mm:ss'),
              //  end: moment(detail.detail_end_date).format('YYYY-MM-DD HH:mm:ss'),
             start: detail.detail_start_date,
             end: detail.detail_end_date,
              header_name: detail.regular_shift_name ? detail.regular_shift_name :  detail.shift_pattern_name,
              isVisit: false,
              isShift: true,
            });
          });
        });
        // console.log('items', data)
        // console.log('order_items', orderSchedulerItems(data))
                setItems(orderSchedulerItems(data));
                setItemsCounts(data);
                setVisitCounts(data.filter((item)=>item.isVisit === true).length);
        setTimeout(() => {
          setStateGlobal(state => ({...state, loadingModalVisible: false}));
        }, 1000);
      });
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
      isShift : !(item.header_name === '') ? true : false
    });
  };

  /**
   * return monday for the date week selected
   * @param {Date} date
   */
  const getMonday = date => {
    var day = date.getDay() || 7;
    if (day !== 1) {
      date.setHours(-24 * (day - 1));
    }
    return date;
  };

  const orderSchedulerItems = detail => {
    
    const currentDate = new Date(
      parseInt(weekDate.split('-')[0]),
      parseInt(weekDate.split('-')[1]) - 1,
      parseInt(weekDate.split('-')[2]),
    );

    const new_date = getMonday(currentDate);

    //order the data detail
    if (detail.length < 1) {
      const add_dates = {};

      for (let days = 1; days < 8; days++) {
        add_dates[dateToStringDate(new_date)] = [];
        new_date.setDate(new_date.getDate() + 1);
      }

      return add_dates;
    }

    const eventsSort = _.sortBy(detail, function(dateObj) {
      return dateObj.start;
    });

    //return the detail by date

    const items_to_return = _.groupBy(eventsSort, function(dateObj) {
      return dateObj.start.split('T')[0];
    });

    for (let days = 1; days < 8; days++) {
      if (!items_to_return[dateToStringDate(new_date)]) {
        items_to_return[dateToStringDate(new_date)] = [];
      }
      new_date.setDate(new_date.getDate() + 1);
    }
    return items_to_return;
  };

  const renderItem = item => {
    return (
      <TouchableOpacity
        style={[styles.item, {borderColor: item.borderColor}]}
        onPress={() => eventClicked(item)}>
        <View
          style={[styles.headerItem, {backgroundColor: item.backgroundColor}]}>
           {item.isVisit ? <Text>{item && item.header_name ? item.header_name : ''}</Text> :  <Fragment /> }
           {item.isVisit ? <Text>{item && item.visit_status_name ? item.visit_status_name : ''}</Text> :  <Fragment /> }
           {(!(item.header_name === '') && !item.isVisit) ? <Text>{item && item.header_name ? item.header_name : ''}</Text> :  <Fragment /> }
          {item.isVisit ? (
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
          {/* <AntDesignIcon style={styles.icon} name="clockcircleo" /> */}
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
        {/* <AntDesignIcon style={styles.icon} name="clockcircleo" /> */}
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

        {(!item.isVisit && deleteButton) ? (
          <View style={styles.eventIconView}>
            {/* <TouchableOpacity
              style={[styles.eventIcon, styles.editIcon]}
              onPress={() => goToView(item)}>
              <MaterialIcons style={styles.styleIcon} name={'edit'} />
            </TouchableOpacity> */}
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
    <>
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
      items={items}
      selected={weekDate}
      renderItem={item => {
        return renderItem(item);
      }}
      onDayPress={dayData => {
        setWeekDate(dayData.dateString);
      }}
      renderEmptyData={() => {
        return null;
      }}
      futureScrollRange={24}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={(r1, r2) => {
        return r1 !== r2;
      }}
      theme={{
        backgroundColor: GRAY_150,
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
        'stylesheet.agenda.list': {
          container: {
            flexDirection: 'row',
            flex: 1,
            backgroundColor: GRAY_150,
          },
          dayNum: {
            fontSize: 16,
            fontWeight: 'bold',
            color: GRAY_700,
          },
          dayText: {
            fontSize: 14,
            color: GRAY_700,
            fontWeight: 'bold',
            marginTop: 0,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: GRAY_700,
            borderBottomWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
          },
          day: {
            width: 63,
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 3,
          },
          today: {
            color: PURPLE,
          },
          items: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: GRAY_700,
            borderBottomWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
          },
        },
        'stylesheet.calendar.header': {
          week: {
            marginTop: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
        },
      }}
      markedDates={markedDays}
      markingType={'period'}
      firstDay={1}
      openCalendar={showCalendar}
      onCalendarToggled={enable => {
        setShowCalendar(enable);
      }}
    />
        </>
  );
};

HomeAgendaWeekly.propTypes = {
  setMonthText: PropTypes.func.isRequired,
  weekDate: PropTypes.string.isRequired,
  getVisitDetails: PropTypes.func.isRequired,
  deleteAvailability: PropTypes.func.isRequired,
  showCalendar: PropTypes.bool.isRequired,
  setShowCalendar: PropTypes.func.isRequired,
};

export default HomeAgendaWeekly;
