import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {Calendar} from 'react-native-calendars';
import {months, days, shortMonths} from '../../../utils/Array';
import {WHITE, PURPLE, GRAY_800, VERY_DARK_BLUE} from '../../../assets/Colors';
import {ModalComponent} from '../../../shared/components';
import {styles} from './styles';
import PropTypes from 'prop-types';

const buildDate = initDate => {
  const _year = initDate.getFullYear();
  let _month = initDate.getMonth() + 1;
  let _day = initDate.getDate();

  if (_month <= 9) {
    _month = '0' + _month;
  }

  if (_day <= 9) {
    _day = '0' + _day;
  }

  return `${_year}-${_month}-${_day}`;
};

const DateComponent = ({
  value,
  setIsModalVisible,
  isModalVisible,
  onSelectDate,
  name,
  errors,
  setErrors,
}) => {
  const [date, setDate] = useState(value);
  const [markedDate, setMarkedDate] = useState('');

  useEffect(() => {
    setDate(value || new Date());
  }, [value]);

  useEffect(() => {
    const _date = new Date(date);

    setMarkedDate(buildDate(_date));
  }, [date]);

  const dateText = () => {
    const _date = new Date(date);

    return `${days[_date.getDay()]}, ${
      shortMonths[_date.getMonth()]
    } ${_date.getDate()}`;
  };

  const monthText = () => {
    const _date = new Date(date);

    return `${months[_date.getMonth()]}`;
  };

  const onPressDone = () => {
    const _date = new Date(date);
    onSelectDate(name, _date);
    setErrors({...errors, [name]: false});
    setIsModalVisible(false);
  };

  return (
    <ModalComponent
      title={'Date'}
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
      rightButtonEvent={onPressDone}
      showRightButton={true}>
      <View>
        <View style={styles.dateInfo}>
          <Text style={styles.month}>{monthText()}</Text>
          <Text style={styles.date}>{dateText()}</Text>
        </View>
        <Calendar
          minDate={new Date()}
          current={date}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={day => {
            setDate(new Date(day.year, day.month - 1, day.day));
          }}
          renderArrow={direction =>
            direction === 'left' ? (
              <EntypoIcon
                style={styles.chevronIcon}
                name={'chevron-small-left'}
              />
            ) : (
              <EntypoIcon
                style={styles.chevronIcon}
                name={'chevron-small-right'}
              />
            )
          }
          monthFormat={'MMM yyyy'}
          theme={{
            dayTextColor: VERY_DARK_BLUE,
            monthTextColor: PURPLE,
            todayTextColor: PURPLE,
            selectedDayBackgroundColor: PURPLE,
            selectedDayTextColor: WHITE,
            textSectionTitleColor: GRAY_800,
          }}
          markedDates={{
            [markedDate]: {
              selected: true,
              disableTouchEvent: true,
            },
          }}
        />
      </View>
    </ModalComponent>
  );
};

DateComponent.propTypes = {
  value: PropTypes.date,
  setIsModalVisible: PropTypes.func,
  isModalVisible: PropTypes.bool,
  onSelectDate: PropTypes.func,
  name: PropTypes.string,
};

DateComponent.defaultProps = {
  value: new Date(),
  setIsModalVisible: () => {},
  isModalVisible: false,
  onSelectDate: () => {},
  name: 'date',
};

export default DateComponent;
