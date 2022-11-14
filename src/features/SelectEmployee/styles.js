import {StyleSheet} from 'react-native';
import {
  WHITE,
  PURPLE,
  GRAY_400,
  GRAY_800,
  GRADIENT_GREEN,
  VERY_LIGHT_GRAY,
  LIGHT_GRAY,
  ERR_COLOR
} from '../../assets/Colors';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30
  },
  viewTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInformation: {
    marginBottom: 20,
  },
  eyeIcon: {
    fontSize: 23,
    color: GRAY_400,
    marginRight: 5,
  },
  errorText: {
    color: ERR_COLOR,
  },
  viewError: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: PURPLE,
    borderRadius: 8,
    marginTop: 70,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  resetButtonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  topText: {
    marginTop: 20,
  },
  dropdownContainer: {
    minHeight: 50,
    height: 50,
    //zIndex: 1000
    // ...(Platform.OS !== 'android' && {
    //   zIndex: 100,
    // }),
  },
  containerColorStyle: {
    borderRadius: 10,
    borderColor: VERY_LIGHT_GRAY,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: LIGHT_GRAY,
    minHeight: 50,
    height: 50,
    
  },
});
