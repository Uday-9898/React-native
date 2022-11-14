import {StyleSheet} from 'react-native';
import {WHITE, PURPLE} from '../../../assets/Colors';

export const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  viewButtonDone: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  buttonDone: {
    flexDirection: 'row',
    backgroundColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0,
    padding: 8,
    width: '50%',
  },
  textStyleDone: {
    fontSize: 16,
    color: WHITE,
    marginTop: 8,
    marginBottom: 8,
  },
  checkIcon: {
    position: 'absolute',
    fontSize: 26,
    color: WHITE,
    left: '10%',
  },
});
