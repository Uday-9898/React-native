import React from 'react';
import {DAY, WEEKLY} from '../../utils/constants/scheduler';
import {Text, View, TouchableOpacity} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {styles} from './styles';

const TypeCalendarMenu = ({changeView, typeOfCalendar}) => {
  return (
    <View style={styles.typeOfCalendar}>
      <TouchableOpacity
        onPress={() => {
          changeView(typeOfCalendar === DAY ? WEEKLY : DAY);
        }}
        style={styles.typeOfCalendarBox}>
        <AntDesignIcon
          style={styles.typeOfCalendarIcon}
          name={`${typeOfCalendar === DAY ? 'calendar' : 'clockcircleo'}`}
          size={20}
        />
        <Text style={styles.calendarText}>
          {typeOfCalendar === DAY ? 'Weekly' : 'Daily'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TypeCalendarMenu;
