import {StyleSheet} from 'react-native';
import {
  WHITE,
  GRAY_300,
  ERR_COLOR_800,
  ERR_COLOR,
  STRONG_LIME,
  GRAY_400,
  PURPLE,
  GRAY_200,
} from '../../assets/Colors';

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: GRAY_300,
  },
  elementContainer: {
    backgroundColor: WHITE,
    flexDirection: 'column',
    borderRadius: 10,
    margin: 15,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    position: 'relative',
  },
  dateText: {
    fontWeight: 'bold',
  },
  buttonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: WHITE,
  },
  buttonUnavailable: {
    flexDirection: 'row',
    backgroundColor: ERR_COLOR_800,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    width: '48%',
    paddingTop: 17,
    paddingBottom: 17,
  },
  buttonAvailable: {
    flexDirection: 'row',
    backgroundColor: STRONG_LIME,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    width: '48%',
    paddingTop: 15,
    paddingBottom: 15,
  },
  textButton: {
    color: WHITE,
    fontSize: 16,
  },
  checkIcon: {
    color: WHITE,
    fontSize: 25,
    marginRight: 10,
  },
  deleteIcon: {
    fontSize: 25,
    color: WHITE,
    marginRight: 10,
  },
  viewModalDelete: {
    padding: 20,
  },
  viewTitle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleModal: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  textModal: {
    paddingTop: 20,
    paddingBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRightWidth: 0.5,
  },
  eventTwoLine: {
    borderStyle: 'solid',
    borderColor: GRAY_200,
    borderLeftWidth:  0.5 ,
  },
  okTextTitle: {
    color: ERR_COLOR,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelTextTitle: {
    fontSize: 16,
  },
  displayButton: {
    flexDirection: 'row',
  },
  horizontalLine: {
    borderStyle: 'solid',
    borderColor: GRAY_200,
    borderBottomWidth: 1,
  },
  splitTime: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  crossIcon: {
    fontSize: 22,
  }
});

export const styleValidationsConstructor = () => {
  let style = {
    validationMessageView: {
      backgroundColor: GRAY_400,
      padding: 20,
      paddingTop: 15,
      paddingBottom: 15,
      position: 'absolute',
      zIndex: 1,
    },
    exclamationIcon: {
      fontSize: 25,
      color: PURPLE,
      marginRight: 8,
    },
    exitIcon: {
      fontSize: 25,
      color: PURPLE,
    },
    markedText: {
      color: PURPLE,
    },
    viewValidation: {
      flexDirection: 'row',
    },
    textView: {
      width: '95%',
      flexDirection: 'row',
    },
    textAlignment: {
      flexShrink: 1,
    },
    viewCloseIcon: {
      width: '5%',
      alignItems: 'flex-end',
      padding: 0,
    },
    cancelView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 5,
    },
    buttonCancel: {
      backgroundColor: GRAY_200,
      width: '45%',
      borderRadius: 8,
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1,
      borderColor: PURPLE,
      borderStyle: 'solid',
    },
    buttonYes: {
      backgroundColor: PURPLE,
      width: '45%',
      borderRadius: 8,
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8,
    },
    buttonCancelText: {
      fontSize: 16,
    },
    buttonYesText: {
      fontSize: 16,
      color: WHITE,
    },
    questionView: {
      marginTop: 10,
    },
    textQuestion: {
      textAlign: 'center',
      fontWeight: 'bold',
    },
  };

  return StyleSheet.create(style);
};
