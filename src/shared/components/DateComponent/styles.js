import {StyleSheet} from 'react-native';
import {PURPLE} from '../../../assets/Colors';

export const styles = StyleSheet.create({
  dateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevronIcon: {
    fontSize: 30,
    color: PURPLE,
  },
  month: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});
