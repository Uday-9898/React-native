import {StyleSheet, Platform} from 'react-native';
import {
  WHITE,
  PURPLE,
  GRAY_400,
  GRAY_800,
  GRADIENT_GREEN,
  VERY_LIGHT_GRAY,
  LIGHT_GRAY,
} from '../../../assets/Colors';

export const styles = StyleSheet.create({
  titleText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  subtitleText: {
    color: GRAY_800,
    fontSize: 13,
  },
  startTime: {
    flexDirection: 'row',
    padding: 15,
    borderStyle: 'solid',
    borderRadius: 1,
    borderColor: GRAY_400,
  },
  flexHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clockIcon: {
    color: GRADIENT_GREEN,
    fontSize: 18,
    marginRight: 12,
  },
  allDayText: {
    color: GRAY_800,
    marginRight: 8,
  },
  absenceText: {
    color: GRAY_800,
    marginLeft: 8,
  },
  flexViewContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  flexToggle: {
    flexDirection: 'row',
  },
  positionT: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    },
  flexToggleAbsence: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  flexFromAndTo: {
    position: 'relative',
    width: '50%',
    flexDirection: 'column',
  },
  fromPadding: {
    paddingRight: 5,
  },
  toPadding: {
    paddingLeft: 5,
  },
  dropdownFromAndTo: {
    position: 'relative',
    width: '100%',
  },

  flexEvery: {
    position: 'relative',
    width: '14.2%',
    flexDirection: 'column',
    padding: 3,
  },
  everyButtons: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'pink',
    paddingTop: 6,
    paddingBottom: 6,
  },
  everyText: {
    color: WHITE,
  },
  messageContainer: {
    /* borderRadius: 10,
    borderColor: VERY_LIGHT_GRAY,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: LIGHT_GRAY,
    padding: 18, */
    minHeight: 160,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  containerColorStyle: {
    borderRadius: 10,
    borderColor: VERY_LIGHT_GRAY,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: LIGHT_GRAY,
    height: 45,
    
  },
  dropdownContainer: {
    minHeight: 45,
    // ...(Platform.OS !== 'android' && {
    //   zIndex: 100,
    // }),
  },
  chevronIcon: {
    fontSize: 23,
    color: PURPLE,
  },
  topMargin: {
    marginTop: 20,
  },
  textStyleTop: {
    marginTop: 12,
  },
});