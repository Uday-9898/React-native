import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {PURPLE} from '../../../assets/Colors';
// import DatePicker from 'react-native-date-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {ModalComponent} from '../../../shared/components';
import {styles} from './styles';
import PropTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimeComponent = ({
  value,
  setIsModalVisible,
  isModalVisible,
  onSelectTime,
  name,
  errors,
  setErrors,
}) => {
  const [date, setDate] = useState(value || new Date());

  useEffect(() => {
    setDate(value || new Date());
  }, [value]);

  const onChange = (event, selectedDate) => {
    setDate(selectedDate);
    onSelectTime(name, selectedDate);
    setErrors({...errors, [name]: false});

  };


  const onPressDone = () => {
    onSelectTime(name, date);
    setErrors({...errors, [name]: false});
    setIsModalVisible(false);
  };

  return (
    <ModalComponent
      title={'Time'}
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}>
      <View style={styles.timeContainer}>
      <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'time'}
          is24Hour={false}
          display="default"
          onChange={onChange}
        />
       {/*  <DatePicker
          mode={'time'}
          date={date}
          onDateChange={setDate}
          textColor={PURPLE}
        />
 */}
       {/* <View style={styles.viewButtonDone}>
          <TouchableOpacity style={styles.buttonDone} onPress={onPressDone}>
            <FeatherIcon style={styles.checkIcon} name="check" />
            <Text style={styles.textStyleDone}>DONE</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ModalComponent>
  );
};

TimeComponent.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.date]),
  setIsModalVisible: PropTypes.func,
  isModalVisible: PropTypes.bool,
  onSelectDate: PropTypes.func,
  name: PropTypes.string,
};

TimeComponent.defaultProps = {
  value: '',
  setIsModalVisible: () => {},
  isModalVisible: false,
  onSelectTime: () => {},
  name: 'date',
};

export default TimeComponent;
