import {StyleSheet} from 'react-native';
import {WHITE, GRAY_700} from '../../../assets/Colors';

export const styles = StyleSheet.create({
  childModal: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  titleModal: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 25,
  },
  textModal: {
    fontSize: 18,
    marginTop: 25,
    marginBottom: 25,
    textAlign: 'center',
  },
  imageStyle: {
    height: 200,
    width: '100%',
  },
  closeIcon: {
    fontSize: 25,
    color: GRAY_700,
    marginRight: 5,
  },
  iconForward: {
    fontSize: 25,
    color: WHITE,
    marginRight: 5,
  },
});
