import {StyleSheet, Platform} from 'react-native';
import {GRAY_100, GRAY_300, GRAY_400, GRAY_600, GRAY_800, PURPLE, PURPLE_800} from '../../assets/Colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
      },
      section: {
        alignItems: 'center',
        margin: 16,
        marginTop: 100,
        justifyContent: 'center',
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: GRAY_800
      },
      errorText: {
        fontFamily: 'Eina02-SemiBold',
        fontSize: 16,
        color: 'red',
        marginTop: 10,
      },
      viewExitIcon: {
        width: '10%',
        height: '100%',
        marginLeft: 15,
       
      },
      containerIcon: {
        width: '100%',
        justifyContent: 'center',
        height: '100%',
      },
      exitIcon: {
        fontSize: 25,
        position: 'absolute',
        left: -2,
        padding: 0,
        margin: 0,
        color: PURPLE
      },
      containerFlex: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomColor: GRAY_400,
        marginTop: 30
      },
      viewTitle: {
        width: '70%',
      },
      titleBack: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      titleEmail: {
        fontWeight: 'bold',
        fontSize: 18,
        color: PURPLE
      },
      forgotContainer: {
        alignItems: 'center' ,
        alignSelf: 'stretch',
      },
      labelForgot: {
        fontSize: 14,
        fontFamily: 'Eina02-SemiBold',
        color: GRAY_600,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
      },
      styleTop: {
        marginTop: 10,
      },
      textModalException: {
        fontSize: 18,
        marginTop: 25,
        marginBottom: 25,
        textAlign: 'center',
      },
});
