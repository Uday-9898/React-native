import {StyleSheet} from 'react-native';
import {WHITE, PURPLE, GRAY_400, ERR_COLOR} from '../../../assets/Colors';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  viewTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  tabContainer:{
    flexDirection:'row',
    marginTop: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  section: {
    alignItems: 'center',
    margin: 16,
  },
  tabButtons:{
    width: '50%',
    height: 50,
    paddingTop: 15,
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
    
  },
  tabBorderDefault:{
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: GRAY_400,
    borderStyle: 'solid',
  },
  tabBorderActive:{
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: PURPLE,
    borderStyle: 'solid',
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
    marginTop: 30,
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
});
