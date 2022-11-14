import {StyleSheet, Platform} from 'react-native';
import {GRAY_400} from '../../../assets/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLogo: {
    height: '20%',
    paddingLeft: 35,
    paddingRight: 35,
  },
  viewLogo: {
    alignItems: 'center',
  },
  imageStyle: {
    width: 244,
    height: '100%',
  },
  containerForm: {
    height: '60%',
    paddingLeft: 24,
    paddingRight: 24,
  },
  viewTitle: {
    alignItems: 'flex-start',
  },
  labelLogo: {
    fontSize: 28,
    fontFamily: 'Eina02-SemiBold',
    color: 'black',
    fontWeight: 'bold',
  },
  viewForm: {
    height: '50%',
  },
  labelSubTitle: {
    fontSize: 16,
    fontFamily: 'Eina02-Regular',
    color: '#323036',
    opacity: 0.58,
    textAlign: 'left',
  },
  labelInput: {
    fontSize: 22,
    fontFamily: 'Eina02-Bold',
    color: 'black',
    fontWeight: 'bold',
  },
  eyeIcon: {
    fontSize: 23,
    color: GRAY_400,
    marginRight: 5,
  },
  errorText: {
    fontFamily: 'Eina02-SemiBold',
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
  },
  labelForgot: {
    fontSize: 16,
    fontFamily: 'Eina02-SemiBold',
    color: '#323036',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  labelSignUp: {
    fontFamily: 'Eina02-Regular',
    fontSize: 16,
    color: '#323036',
    paddingLeft: 14,
    marginBottom: 10,
  },
  containerButtonsFooter: {
    height: '20%',
    justifyContent: 'flex-end',
    paddingBottom: 25,
  },
  styleTop: {
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  SignUpButton: {
    fontSize: 16,
    color: '#323036',
    fontWeight: 'bold',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderColor: '#4C11F0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '40%',
  },
  SignUpButtonText: {
    fontSize: 16,
    fontFamily: 'Eina02-SemiBold',
    color: '#323036',
    fontWeight: 'bold',
  },
  SignInButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: '#4C11F0',
    padding: 15,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    width: '40%',
    textAlign: 'left',

    ...Platform.select({
      ios: {
        shadowColor: '#00000029',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  SignInButtonText: {
    fontSize: 16,
    fontFamily: 'Eina02-Bold',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
