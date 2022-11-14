import React, { useState, useEffect, Fragment, useContext, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import DropDownPicker from 'react-native-dropdown-picker';
import ToggleSwitch from 'toggle-switch-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  InputLabel,
  DateComponent,
  TimeComponent,
} from '../../../shared/components';
import { PURPLE, GRADIENT_GREEN, GRAY_200 } from '../../../assets/Colors';
import { GlobalContext } from '../../../utils/context/GlobalContext';
import { shortMonths } from '../../../utils/Array';
import { timeTextFormat } from '../../Methods/DateMethods';
import { AVAILABILITY_VIEW, UNAVAILABILITY_VIEW,ABSENCE_VIEW } from '../../../utils/constants/rotaShift';
import { styles } from './styles';
import PropTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const START = 'start_date';
const END = 'end_date';
const FROM = 'start';
const TO = 'end';
const TravelTime = 'travel_time';

const Availabilities = ({
  shiftData,
  isShift,
  setChoices,
  choices,
  isEdition,
  values,
  employees,
  setValues,
  setDaysArray,
  timeMessage,
  lockInputsDate,
  travelMethod,
  errors,
  setErrors,
}) => {
  const [stateGlobal] = useContext(GlobalContext);
  const [dateFrom, setDateFrom] = useState((new Date()));
  const [dateTo, setDateTo] = useState((new Date()));
  const [dateTravelTime, setDateTravelTime] = useState((new Date()));
  const [showTo, setShowTo] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTravelTime, setShowTravelTime] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [dayValue, setDayValue] = useState([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [absenceReason, setAbsenceReason] = useState([]);
  const [isAbsent, setIsAbsent] = useState(false);
  const [absence, setAbsence] = useState('');
  const [isOverNight, setIsOverNight] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const [shiftType, setShiftType] = useState('On Call');
  const [filterShiftType,setFilterShiftType]=useState([])
  const [daysOfWeek, setDaysOfWeek] = useState([
    { day: 'MON', dayValue: 1, selected: false },
    { day: 'TUE', dayValue: 2, selected: false },
    { day: 'WED', dayValue: 3, selected: false },
    { day: 'THU', dayValue: 4, selected: false },
    { day: 'FRI', dayValue: 5, selected: false },
    { day: 'SAT', dayValue: 6, selected: false },
    { day: 'SUN', dayValue: 7, selected: false },
  ]);
  /* const [repeatState, setRepeatState] = useState({
    sun: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fry: false,
    sat: false,
  }); */

  const selectedDay = (day, indexWeek) => {
    daysOfWeek[indexWeek].selected = !daysOfWeek[indexWeek].selected;
    setDaysOfWeek(daysOfWeek);
    setIsRepeat(!isRepeat);

    let arr = []
    daysOfWeek.map((val) => {
      if (val.selected) {
        return (arr.push(val.day))
      }
    })
    setDaysArray(arr);


  }
  useEffect(()=>{
    tempValues = choices && choices.regular_shift_type && choices.regular_shift_type.filter(shift=>shift.name!='Shift' && shift.name!='Unavailability' && shift.name!='Absence')
    tempValues && setFilterShiftType([...tempValues])
  },[choices.regular_shift_type])

  useEffect(() => {
    if(choices.absence_type && values.absence_type){
      let arr = choices.absence_type.find(val =>  val.id === values.absence_type );
      setAbsence(`${arr.name}`);
    }
  }, [values.absence_type])

  useEffect(() => {
    setValues({
      ...values,
      is_overnight: isOverNight
    })

  }, [isOverNight])

  const choiceDropdown = (data) =>{
    if(data){
      data.map(item => {
        item.label = item.name;
        item.value = item.id;
      }) 
      return data;
    }
  }

  useEffect(()=>{
    if(choices.absence_type && choices.absence_reason && values.absence_type){
      let arr = choices.absence_reason.filter(val =>  val.absence_type === values.absence_type );
      if(arr){
        arr.map(item => {
          item.label = item.name;
          item.value = item.id;
        }) 
        setAbsenceReason(arr);
      }
    }
  },[values.absence_type])

  useEffect(() => {
    let new_start_time = new Date();
    new_start_time.setHours(0, 0, 0, 0);

    let new_end_time = new Date();
    new_end_time.setHours(23, 59, 0, 0);

    if (!isAllDay) {
      new_start_time = '';
      new_end_time = '';
    }

    setValues({
      ...values,
      start: new_start_time,
      end: new_end_time,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllDay]);

  /* useEffect(() => {
   if (isRepeat) {
     setRepeatState({
       sun: true,
       mon: true,
       tue: true,
       wed: true,
       thu: true,
       fry: true,
       sat: true,
     });
   } else {
     setRepeatState({
       sun: false,
       mon: false,
       tue: false,
       wed: false,
       thu: false,
       fry: false,
       sat: false,
     });
   }
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [isRepeat]);

  useEffect(() => {
   let isDisabled = false;
   let i;

   for (i in repeatState) {
     if (repeatState[i] === true) {
       isDisabled = true;
     }
   }

   if (!isDisabled) {

     setIsRepeat(false);
   }

   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [repeatState]);
*/
  const onPressInput = item => {
    if (item === START) {
      setShowStartModal(!showStartModal);
    }

    if (item === END) {
      setShowEndModal(!showEndModal);
    }

    if (item === FROM && !isAllDay) {
      setShowFromModal(!showFromModal);
    }

    if (item === TO && !isAllDay) {
      setShowToModal(!showToModal);
    }
  };

  const onSelectComponent = (name, _date) => {
    setValues({ ...values, [name]: _date });
  };

  /* const onPressTime=(val)=>{
  if(val === 'start'){
    setShowFrom(true);
  }else {
    setShowTo(true);
  }
  } */

  const onChange = (event, selectedDate, type) => {
    
      if (type === 'start') {
        setShowFrom(false);
      } else {
        setShowTo(false);
      }
      if(selectedDate){
      if (type === 'start') {
        setDateFrom(selectedDate);
      } else {
        setDateTo(selectedDate);
      }
      setValues({
        ...values,
        [type]: selectedDate,
      });
    }
    

  };
  const onChangeTravelTime = (event, selectedDate, type) => {
    
    setShowTravelTime(false);
    if(selectedDate){
    setDateTravelTime(selectedDate);
    setValues({
      ...values,
      [type]: selectedDate,
    });
  }
};

  const dateTextFormat = dateValue => {
    if (!dateValue) {
      return '';
    }

    const _date = new Date(dateValue);

    return `${shortMonths[_date.getMonth()]
      } ${_date.getDate()} ${_date.getFullYear()}`;
  };

   const filterOptions = opts => {
    const options = formatOptions(opts);
    return createFilterOptions({options});
  };

  const formatOptions = options => {
    if (options) {
      options = options.map(option => {
        return {value: option.id, label: option.name};
      });
    } else {
      options = [];
    }
    return options;
  };

  const onChangeEmployee=(value)=>{
    dropDownHandleSelect(
      {employee: value ? value : null}
      )
  }

  const handleChange = selectedOption => {
    if (isMulti) {
      onChangeEmployee(selectedOption);
    } else {
      onChangeEmployee(selectedOption ? selectedOption.value : null);
    }
  };

   const getOptionName = (array, id) => {
    let item = {name: ''};
    if (array) {
      item = array.find(x => x.id === id) || {
        name: 'Unspecified',
      };
    }
    return item.name;
  };

  return (
    <View>
      {isShift 
      ?  
      <View>
        <Text style={[styles.titleText, styles.textStyleTop]}>Shift pattern name</Text>
        <Text style={styles.subtitleText}>{shiftData.shift_pattern_name ? shiftData.shift_pattern_name : '----'}</Text>
        <Text style={[styles.titleText, styles.textStyleTop]}>Start Day</Text>
        <Text style={styles.subtitleText}>{shiftData.start_date && shiftData.start_date}</Text>
        <Text style={[styles.titleText, styles.textStyleTop]}>End Day</Text>
        <Text style={styles.subtitleText}>{shiftData.end_date && shiftData.end_date}</Text>
        <Text style={[styles.titleText, styles.textStyleTop]}>Travel method</Text>
        <Text style={styles.subtitleText}>{shiftData.travel_mode && shiftData.travel_mode}</Text>
      </View>
      : 
      <View>
      { stateGlobal.typeAvailabilityView === (isEdition ? ABSENCE_VIEW : UNAVAILABILITY_VIEW) ? (
        <View style={styles.flexToggleAbsence}>
          <Text style={styles.allDayText}>Unavailability</Text>
          <ToggleSwitch
            disabled={isEdition || !choices.absence_type}
            isOn={values.is_absent ? values.is_absent : false}
            onColor={GRADIENT_GREEN}
            offColor={GRAY_200}
            size="small"
            onToggle={isOn => setValues({
              ...values,
              is_absent: isOn,
            })}
          />
           <Text style={styles.absenceText}>Absence</Text>
        </View>
        ) : (
          <Fragment />
        )
        }
      <Text style={styles.titleText}>Date</Text>
      <Text style={[styles.subtitleText, styles.textStyleTop]}>START</Text>
      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => {
          isEdition ? null : onPressInput(START);
        }}>
        <InputLabel
          error={errors.start_date}
          editable={false}
          value={dateTextFormat(values[START]) || 'Start day'}
          icon={
            <EntypoIcon
              style={styles.chevronIcon}
              name={'chevron-small-down'}
            />
          }
        />
      </TouchableOpacity>
      <View style={[styles.flexHeader, styles.topMargin]}>
        <Text style={styles.titleText}>Time</Text>
        <View style={styles.flexToggle}>
          {/*  <AntDesignIcon style={styles.clockIcon} name="clockcircleo" /> */}
          <Text style={styles.allDayText}>Is overnight</Text>
          <ToggleSwitch
          disabled={isEdition}
            isOn={values.is_overnight ? values.is_overnight : false}
            onColor={GRADIENT_GREEN}
            offColor={GRAY_200}
            size="small"
            onToggle={isOn => setValues({
              ...values,
              is_overnight: isOn,
            })}
          />
        </View>
        <View style={styles.flexToggle}>
          <Text style={styles.allDayText}>All day</Text>
          <ToggleSwitch
           disabled={isEdition}
            isOn={isAllDay}
            onColor={GRADIENT_GREEN}
            offColor={GRAY_200}
            size="small"
            onToggle={isOn => setIsAllDay(isOn)}
          />
        </View>
      </View>

      <View style={styles.flexViewContainer}>
        <View
          style={[
            styles.flexFromAndTo,
            styles.fromPadding,
            styles.textStyleTop,
          ]}>
          <Text style={styles.subtitleText}>FROM</Text>
          <TouchableOpacity
            onPress={() => {
              /* onPressInput(FROM); */ isEdition ? null :  setShowFrom(true)
            }} >
            {showFrom &&
              <DateTimePicker
                value={dateFrom}
                testID="dateTimePicker"
                mode={'time'}
                is24Hour={false}
                display= {Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, d) => onChange(e, d, 'start')}
              />}
            {!showFrom &&
            <InputLabel
              error={errors.start}
              editable={false}
              value={values[FROM] ? moment(values[FROM]).format('hh:mm a') : 'From time'}
              icon={
                <EntypoIcon
                  style={styles.chevronIcon}
                  name={'chevron-small-down'}
                />
              }
            />
             }
          </TouchableOpacity>
        </View>
        <View
          style={[styles.flexFromAndTo, styles.toPadding, styles.textStyleTop]}>
          <Text style={styles.subtitleText}>TO</Text>
          <TouchableOpacity
            onPress={() => {
              isEdition ? null : setShowTo(true)
            }}>
              
            {showTo &&
              <DateTimePicker
                value={dateTo}
                testID="dateTimePicker"
                mode={'time'}
                is24Hour={false}
                display= {Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, d) => onChange(e, d, 'end')}
              />
              }

            {!showTo && <InputLabel
              error={errors.end}
              editable={false}
              value={values[TO] ? moment(values[TO]).format('hh:mm a') : 'To time'}
              icon={
                <EntypoIcon
                  style={styles.chevronIcon}
                  name={'chevron-small-down'}
                />
              }
            />}
          </TouchableOpacity>
        </View>
      </View>

      {/*//TODO: conected with back*/}
      <View style={[styles.flexHeader, styles.topMargin]}>
        <Text style={styles.titleText}>Repeat</Text>
        {/* <View>
          <ToggleSwitch
            isOn={isRepeat}
            onColor={GRADIENT_GREEN}
            offColor={GRAY_200}
            size="small"
            onToggle={isOn => setIsRepeat(true)}
          />
        </View> */}
      </View>
      <View style={[styles.flexViewContainer, styles.textStyleTop]}>
        {daysOfWeek.map((itemWeek, indexWeek) => {
          return (
            <View style={styles.flexEvery}>
              <TouchableOpacity
                onPress={() => {
                  isEdition ? null : selectedDay(itemWeek.day, indexWeek);
                }}>
                <LinearGradient
                  colors={[
                    `${itemWeek.selected ? GRADIENT_GREEN : GRAY_200}`,
                    `${itemWeek.selected ? PURPLE : GRAY_200}`,
                  ]}
                  style={styles.everyButtons}>
                  <Text style={styles.everyText}>{itemWeek.day}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>

      <Text style={[styles.subtitleText, styles.topMargin]}>END</Text>
      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => {
          isEdition ? null : onPressInput(END);
        }}>
        <InputLabel
          error={errors.end_date}
          editable={false}
          value={dateTextFormat(values[END]) || 'End day'}
          icon={
            <EntypoIcon
              style={styles.chevronIcon}
              name={'chevron-small-down'}
            />
          }
        />
      </TouchableOpacity>
      {stateGlobal.typeAvailabilityView === AVAILABILITY_VIEW ? (
        <Fragment>
          <Text style={[styles.titleText, styles.topMargin]}>
            Shift Type
          </Text>
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              disabled={isEdition}
              items={(filterShiftType && (filterShiftType.length > 0)) ? choiceDropdown(filterShiftType) : []}
              defaultValue={
                (values && values.regular_shift_type) ? values.regular_shift_type : ''
              }
              arrowColor={PURPLE}
              arrowSize={20}
              style={styles.containerColorStyle}
              onChangeItem={item =>
                {
                  setValues({ ...values, regular_shift_type: item.id , regular_shift_type_label : item.label});
                  setShiftType(item.label)
                }
              }
            />
          </View>
        </Fragment>
      ) : (
        <Fragment />
      )}
      {((stateGlobal.typeAvailabilityView === AVAILABILITY_VIEW) && !(shiftType === 'On Call')) ? (
        <Fragment>
          <Text style={[styles.titleText, styles.topMargin]}>
            Mode of travel
          </Text>
          <Text style={styles.subtitleText}>FOR THIS SPECIFIC TIME</Text>
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              disabled={isEdition}
              items={travelMethod}
              defaultValue={
                travelMethod.length >= 1 ? values.travel_method : ''
              }
              arrowColor={PURPLE}
              arrowSize={20}
              style={styles.containerColorStyle}
              onChangeItem={item =>
                setValues({ ...values, travel_method: item.id })
              }
            />
          </View>
          <View>
          <Text style={[styles.titleText, styles.topMargin]}>
          Extra Travel Time
          </Text>
          <TouchableOpacity
            onPress={() => {
              isEdition ? null :  setShowTravelTime(true)
            }} >
            {showTravelTime &&
              <DateTimePicker
                value={dateTravelTime}
                testID="dateTimePicker"
                mode={'time'}
                is24Hour={true}
                display= {Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, d) => onChangeTravelTime(e, d, 'travel_time')}
              />}
            {!showTravelTime &&
            <InputLabel
              //error={errors.start}
              editable={false}
              value={values[TravelTime] ? moment(values[TravelTime]).format('HH:mm') : 'hh:mm'}
              icon={
                <EntypoIcon
                  style={styles.chevronIcon}
                  name={'chevron-small-down'}
                />
              }
            />
             }
          </TouchableOpacity>
        </View>
        </Fragment>
      ) : (
        <Fragment />
      )}
      {((stateGlobal.typeAvailabilityView === (isEdition ? ABSENCE_VIEW : UNAVAILABILITY_VIEW)) && values.is_absent) ? (
        <Fragment>
          <Fragment>
          <Text style={[styles.titleText, styles.topMargin]}>
          Absence Type
          </Text>
          <View style={styles.dropdownContainer, {...(Platform.OS !== 'android' && {
            zIndex: 60
        })}}>
            <DropDownPicker
              disabled={isEdition}
              items={(choices && choices.absence_type && (choices.absence_type.length > 0)) ? choiceDropdown(choices.absence_type) : '' }
              defaultValue={
                values.absence_type ? values.absence_type : ''
              }
              arrowColor={PURPLE}
              arrowSize={20}
              style={styles.containerColorStyle}
              onChangeItem={item =>
                {
                  setValues({ ...values, absence_type: item.value });
                setAbsence(item.label)
              }
              }
            />
          </View>
        </Fragment>
         <Fragment>
          <Text style={[styles.titleText, styles.topMargin]}>
          Absence Reason
          </Text>
          <View style={styles.dropdownContainer, {...(Platform.OS !== 'android' && {
            zIndex: 50
        })}}>
            <DropDownPicker
              disabled={isEdition}
              items={isEdition ? choiceDropdown(choices && choices.absence_reason) : absenceReason}
              defaultValue={
                values.absence_reason ? values.absence_reason : ''
              }
              arrowColor={PURPLE}
              arrowSize={20}
              style={styles.containerColorStyle}
              onChangeItem={item =>
                setValues({ ...values, absence_reason: item.value })
              }
            />
          </View>
        </Fragment>


         {absence === "Sickness" ? 
        <Fragment>
          <Text style={[styles.titleText, styles.topMargin]}>
          Sickness Reason
          </Text>
          <View style={styles.dropdownContainer, {...(Platform.OS !== 'android' && {
            zIndex: 40
        })}}>
            <DropDownPicker
              disabled={isEdition}
              items={choiceDropdown(choices && choices.sickness_reason)}
              defaultValue={
                values.sickness_reason ? values.sickness_reason : ''
              }
              arrowColor={PURPLE}
              arrowSize={20}
              style={styles.containerColorStyle}
              onChangeItem={item =>
                setValues({ ...values, sickness_reason: item.value })
              }
            />
          </View>
        </Fragment>
        :
        <Fragment />
        } 
        <Fragment>
          <Text style={[styles.titleText, styles.topMargin]}>
          Absence informed method
          </Text>
          <View style={styles.dropdownContainer, {...(Platform.OS !== 'android' && {
            zIndex: 30
        })}}>
            <DropDownPicker
              disabled={isEdition}
              items={choiceDropdown(choices && choices.absence_informed_method)}
              defaultValue={
                values.absence_informed_method ? values.absence_informed_method : ''
              }
              arrowColor={PURPLE}
              arrowSize={20}
              style={styles.containerColorStyle}
              onChangeItem={item =>
                setValues({ ...values, absence_informed_method: item.id })
              }
            />
          </View>
        </Fragment>
        <Fragment>
          <Text style={[styles.titleText, styles.topMargin]}>
          Planned / Unplanned
          </Text>
          <View style={styles.dropdownContainer, {...(Platform.OS !== 'android' && {
            zIndex: 20
        })}}>
            <DropDownPicker
              disabled={isEdition}
              items={choiceDropdown(choices && choices.absence_planned)}
              defaultValue={
                values.absence_planned ? values.absence_planned : ''
              }
              arrowColor={PURPLE}
              arrowSize={20}
              style={styles.containerColorStyle}
              onChangeItem={item =>
                setValues({ ...values, absence_planned: item.id })
              }
            />
          </View>
        </Fragment>
        <Fragment>
          <Text style={[styles.titleText, styles.topMargin]}>
          Paid / Unpaid / Paid at other rate
          </Text>
          <View style={styles.dropdownContainer, {...(Platform.OS !== 'android' && {
            zIndex: 10
        })}}>
            <DropDownPicker
              disabled={isEdition}
              items={choiceDropdown(choices && choices.absence_paid)}
              defaultValue={
                values.absence_paid ? values.absence_paid : ''
              }
              arrowColor={PURPLE}
              arrowSize={20}
              style={styles.containerColorStyle}
              onChangeItem={item =>
                setValues({ ...values, absence_paid: item.id })
              }
            />
          </View>
        </Fragment>
        <View style={[styles.messageContainer, styles.topMargin]}>
        <Text style={styles.titleText}>Notes</Text>
        <TextInput
          style={styles.textArea}
          editable={!isEdition}
          value={values.absence_notes}
          underlineColorAndroid="transparent"
          placeholder="Type message"
          placeholderTextColor="grey"
          numberOfLines={5}
          multiline={true}
          onChangeText={value => {
            setValues({
              ...values,
              absence_notes: value,
            });
          }}
        /> 
      </View> 
        </Fragment>
        ) : (
          <Fragment />
        )
      }
      {/*//TODO: connect with back*/}
      <View style={[styles.messageContainer, styles.topMargin]}>
      </View> 
       
      <DateComponent
        setIsModalVisible={() => {
          setShowStartModal(false);
        }}
        isModalVisible={showStartModal}
        value={values[START] || new Date()}
        onSelectDate={onSelectComponent}
        name={START}
        errors={errors}
        setErrors={setErrors}
      />
      <DateComponent
        setIsModalVisible={() => {
          setShowEndModal(false);
        }}
        isModalVisible={showEndModal}
        value={values[END] || new Date()}
        onSelectDate={onSelectComponent}
        name={END}
        errors={errors}
        setErrors={setErrors}
      />
      <TimeComponent
        setIsModalVisible={() => {
          setShowFromModal(false);
        }}
        isModalVisible={showFromModal}
        value={values[FROM]}
        onSelectTime={onSelectComponent}
        name={FROM}
        errors={errors}
        setErrors={setErrors}
        minimumDate={new Date()}
      />
      <TimeComponent
        setIsModalVisible={() => {
          setShowToModal(false);
        }}
        isModalVisible={showToModal}
        value={values[TO]}
        onSelectTime={onSelectComponent}
        name={TO}
        errors={errors}
        setErrors={setErrors}
        minimumDate={new Date()}
      />
    </View>}
    </View>
  );
};

Availabilities.propTypes = {
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  lockInputsDate: PropTypes.bool.isRequired,
  travelMethod: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
};

export default Availabilities;
