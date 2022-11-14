import {StyleSheet} from 'react-native';
import {PURPLE, LIGHT_GRAYISH_BLUE, WHITE} from '../../../assets/Colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
  },
  bodyView: {
    backgroundColor: WHITE,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 5,
  },
  mailContainer: {
    padding: 40,
    backgroundColor: LIGHT_GRAYISH_BLUE,
    borderRadius: 20,
  },
  mailIcon: {
    color: PURPLE,
    fontSize: 65,
  },
  checkMailText: {
    fontWeight: 'bold',
    fontSize: 35,
    marginTop: '5%',
  },
  sentRecoverText: {
    marginTop: '5%',
    paddingLeft: '20%',
    paddingRight: '20%',
    textAlign: 'center',
    fontSize: 16,
  },
  openMailButton: {
    marginTop: 10,
    padding: 15,
    paddingLeft: 45,
    paddingRight: 45,
    backgroundColor: PURPLE,
    borderRadius: 10,
  },
  openMailButtonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipText: {
    marginTop: '5%',
    fontSize: 16,
  },
  footerView: {
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    width: '100%',
  },
  checkSpamText: {
    margin: 25,
    textAlign: 'center',
  },
  tryEmailText: {
    color: PURPLE,
    fontWeight: 'bold',
  },
});
