import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {
  WHITE,
  PURPLE,
  GRAY_300,
  ROTA_SHIFT,
  GRAY_400,
  ERR_COLOR_800,
  ROTA_AVAILABLE,
  STRONG_LIME,
  GRAY_200,
  GRAY_100,
  ERR_COLOR,
} from '../../assets/Colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  notes: {
    marginTop: 20,
  }
});

export const styleConstructor = (currentData, isClockOnHold) => {
  let style = {
    clockIn: {
      flexDirection: 'row',
      backgroundColor: STRONG_LIME,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      width: '48%',
      height: '75%',
      opacity:
        (currentData && currentData.actual_visit_start_time) ||
        isClockOnHold.clockIn
          ? 0.4
          : 1,
    },
    clockOut: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: ERR_COLOR,
      width: '48%',
      height: '75%',
      opacity: 1,
    },
  };

  return StyleSheet.create(style);
};
