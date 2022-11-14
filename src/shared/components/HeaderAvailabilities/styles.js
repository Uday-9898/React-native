import {StyleSheet} from 'react-native';
import {WHITE, PURPLE, VERY_DARK_BLUE} from '../../../assets/Colors';

export const styleConstructor = isEdition => {
  return StyleSheet.create({
    header: {
      backgroundColor: WHITE,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      justifyContent: 'center',
      padding: 10,
      paddingTop: 3,
      paddingBottom: 4,
      flexDirection: 'column',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 25,
    },
    containerFlex: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: isEdition ? 40 : 50,
    },
    checkIcon: {
      fontSize: 25,
      color: WHITE,
    },
    textStyleApply: {
      fontSize: 11,
      color: WHITE,
    },
    buttonApply: {
      flexDirection: 'row',
      backgroundColor: PURPLE,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 0,
      width: '100%',
      paddingTop: 4,
      paddingBottom: 4,
    },
    exitIcon: {
      fontSize: 22,
      position: 'absolute',
      left: -2,
      padding: 0,
      margin: 0,
    },
    containerIcon: {
      width: '100%',
      justifyContent: 'center',
      height: '100%',
    },
    titleContainer: {
      flexDirection: 'row',
    },
    logo: {
      width: 35,
      height: 35,
    },
    logoContainer: {
      justifyContent: 'center',
      padding: 0,
    },
    travelMethodView: {
      paddingLeft: 19,
      flexDirection: 'row',
      alignItems: 'center',
    },
    travelMethodTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: VERY_DARK_BLUE,
    },
    travelMethodImg: {
      position: 'absolute',
      right: 6,
    },
    imageStyle: {
      width: 45,
      height: 45,
    },
    viewExitIcon: {
      width: '5%',
      height: '100%',
    },
    viewLogoImage: {
      width: '15%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewButton: {
      width: '25%',
    },
    viewTitle: {
      width: !isEdition ? '55%' : '80%',
    },
  });
};
