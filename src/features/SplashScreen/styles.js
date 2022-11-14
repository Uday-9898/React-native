import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
const win = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  imageLogo: {
    height: 160,
    width: 160,
  },
});
