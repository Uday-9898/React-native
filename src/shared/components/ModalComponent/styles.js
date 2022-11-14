import {StyleSheet} from 'react-native';
import {STRONG_LIME} from '../../../assets/Colors';

export const styleConstructor = (paddingLeft, paddingRight, maxHeight) => {
  let addBodyHeight = {
    paddingTop: 20,
    paddingBottom: 15,
  };
  let addHeaderHeight = {
    marginBottom: 30,
  };
  let childrenViewHeight = {};

  if (maxHeight) {
    addBodyHeight = {
      maxHeight: '90%',
    };
    addHeaderHeight = {
      height: '8%',
    };
    childrenViewHeight = {
      height: '92%',
    };
  }

  return StyleSheet.create({
    componentModal: {
      justifyContent: 'flex-end',
      margin: 0,
      backgroundColor: 'rgba(129, 129, 129, 0.2)',
    },
    modalContent: {
      backgroundColor: 'white',
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingLeft: paddingLeft ? paddingLeft : 15,
      paddingRight: paddingRight ? paddingRight : 15,
      ...addBodyHeight,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...addHeaderHeight,
    },
    viewTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    exitIcon: {
      fontSize: 30,
      marginRight: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    rightButton: {
      borderRadius: 50,
      borderColor: STRONG_LIME,
      borderWidth: 1,
      borderStyle: 'solid',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 22,
      paddingRight: 22,
    },
    rightButtonText: {
      fontSize: 15,
      color: STRONG_LIME,
      fontWeight: 'bold',
    },
    childrenView: {
      ...childrenViewHeight,
    },
  });
};
