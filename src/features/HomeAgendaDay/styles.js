import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {
  WHITE,
  PURPLE,
  ERR_COLOR,
  GRAY_150,
  GRAY_300,
  ROTA_SHIFT,
  GRAY_400,
  GRAY_700,
  GRAY_800,
  ERR_COLOR_800,
  ROTA_AVAILABLE,
  GRADIENT_GREEN,
} from '../../assets/Colors';
let {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  dayButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  singleCount:{
    flexDirection:'row'
  },
  visitCountContain: {
    width: '100%',
    backgroundColor: WHITE,
    paddingTop: 4,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: GRAY_700,
    flexDirection: 'row',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitleText: {
    color: GRAY_800,
    fontSize: 12,
    paddingTop: 3,
    paddingLeft: 3,
  },
  textZip: {
    paddingLeft: 15,
    fontSize: 15,
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 10,
    backgroundColor: WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
    width: width - 105,
  },
  headerItem: {
    padding: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 20,
    color: ROTA_SHIFT,
  },
  timeItem: {
    flexDirection: 'row',
    paddingTop: 8,
    //paddingLeft: 10,
  },
  iconInfo: {
    fontSize: 25,
    marginLeft: 20,
  },
  iconForward: {
    fontSize: 20,
    color: ROTA_AVAILABLE,
    marginLeft: 10,
  },
  iconBack: {
    fontSize: 20,
    color: ERR_COLOR_800,
    marginLeft: 15,
  },
  countdown: {
    position:'absolute',
    right: 5,
    bottom: 3
  },
  durationItem: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  textDuration: {
    paddingLeft: 15,
    fontSize: 15,
    color: GRAY_400,
  },
  iconMapMarker: {
    fontSize: 20,
    marginRight: 10,
    color: PURPLE,
  },
  containerTodayButton: {
    flexDirection: 'row',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: WHITE,
    justifyContent: 'space-between',
  },
  todayButton: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderStyle: 'solid',
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: WHITE,
  },
  todayText: {
    color: PURPLE,
  },
  eventIcon: {
    width: 45,
    height: 45,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  eventIconView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
    paddingBottom: 5,
  },
  editIcon: {
    backgroundColor: GRADIENT_GREEN,
  },
  deleteIcon: {
    backgroundColor: ERR_COLOR_800,
  },
  styleIcon: {
    color: WHITE,
    fontSize: 24,
  },
  eventHeaderIcon: {
    top: 2,
    width: 45,
    height: 45,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: WHITE,
    position: 'absolute',
  },
  eventHeaderIconView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editHeaderIcon: {
    backgroundColor: GRADIENT_GREEN,
    right: 55,
  },
  deleteHeaderIcon: {
    backgroundColor: ERR_COLOR_800,
  },
  styleHeaderIcon: {
    color: WHITE,
    fontSize: 24,
  },
  styleUserIcon: {
    width: 15,
    height: 15,
  },
  eventUserIconView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  eventUserIcon: {
    top: 2,
    width: 35,
    height: 35,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: WHITE,
    position: 'absolute',
    backgroundColor: WHITE,
  },
  availabilitiesClass: {
    backgroundColor: WHITE,
    //if you change width, you will probably need to modify the width, some
    //library css, react-native-events-calendar, src / Packer.js, in the pack method
    width: 20,
    borderRadius: 6,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  availabilitiesText: {
    transform: [{rotate: '-90deg'}],
    position: 'absolute',
    bottom: 55,
    width: 120,
    color: WHITE,
  },
  availabilitiesIcon: {
    top: 1,
    fontSize: 18,
    color: WHITE,
  },
});

export const eventCalendar = StyleSheet.create({
  header: {
    display: 'none',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    width: width,
    backgroundColor: GRAY_300,
  },
  event: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  timeLabel: {
    color: PURPLE,
  },
  contentStyle: {
    backgroundColor: GRAY_150,
  },
  line: {
    backgroundColor: GRAY_300,
  },
  lineNow: {
    backgroundColor: ERR_COLOR,
  },
});
