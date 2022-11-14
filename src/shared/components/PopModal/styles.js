import {StyleSheet} from 'react-native';
import {GRAY_600, GRAY_200, PURPLE, WHITE} from '../../../assets/Colors';

export const styleConstructor = (typeButton, okColor) => {
  let style = {
    componentModal: {
      justifyContent: 'center',
      margin: 0,
      backgroundColor: 'rgba(129, 129, 129, 0.2)',
      paddingLeft: 18,
      paddingRight: 18,
      borderRadius: typeButton ? 10 : 30,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: typeButton ? 10 : 40,
      padding: 15,
      paddingBottom: typeButton ? 10 : 30,
    },
    horizontalLine: {
      borderStyle: 'solid',
      borderColor: GRAY_200,
      borderBottomWidth: typeButton ? 1 : 0,
    },
    eventsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    eventView: {
      marginTop: 10,
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 10,
      paddingBottom: 10,
    },
    eventOneLine: {
      borderStyle: 'solid',
      borderColor: GRAY_200,
      borderRightWidth: typeButton ? 0.5 : 0,
    },
    eventTwoLine: {
      borderStyle: 'solid',
      borderColor: GRAY_200,
      borderLeftWidth: typeButton ? 0.5 : 0,
    },
    cancelButton: {
      width: '100%',
      height: 55,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: GRAY_200,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      marginRight: '6%',
    },
    okButton: {
      width: '100%',
      height: 55,
      backgroundColor: okColor ? okColor : PURPLE,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      marginLeft: '6%',
    },
    okButtonTitle: {
      fontSize: 18,
      color: WHITE,
    },
    cancelButtonTitle: {
      fontSize: 18,
      color: GRAY_600,
    },
    okTextTitle: {
      color: okColor ? okColor : PURPLE,
      fontWeight: 'bold',
      fontSize: 16,
    },
    cancelTextTitle: {
      fontSize: 16,
    },
    displayButton: {
      flexDirection: 'row',
    },
  };

  return StyleSheet.create(style);
};
