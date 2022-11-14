import {StyleSheet} from 'react-native';
import {
  GRAY_700,
  PURPLE,
  WHITE,
  GRAY_800,
  GRAY_200,
  GRAY_300,
  ERR_COLOR,
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
  box: {
    flex: 1,
  },
  boxHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 10,
  },
  monthText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginLeft: 20,
    width: 35,
    height: 35,
  },
  boxBody: {
    backgroundColor: 'gray',
    flex: 10,
  },
  boxFooter: {
    flex: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: WHITE,
    flexDirection: 'row',
  },
  textHeaderDate: {
    marginLeft: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  textWeekData: {
    paddingLeft: 10,
    flexDirection: 'row',
  },
  touchWeekArrow: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderStyle: 'solid',
    justifyContent: 'center',
    borderRadius: 8,
  },
  weekArrow: {
    fontSize: 25,
    color: PURPLE,
  },
  currentButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: PURPLE,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
  weekText: {
    color: PURPLE,
  },
  caretright: {
    fontSize: 16,
    marginLeft: 10,
    color: PURPLE,
  },
  cloudIcon: {
    marginRight: 15,
    fontSize: 26,
    color: PURPLE,
  },
  userIcon: {
    marginRight: 15,
    fontSize: 22,
    color: PURPLE,
  },
  logOutText: {
    flexDirection: 'row',
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
  textFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pictureFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeOfCalendar: {
    backgroundColor: WHITE,
    width: 83,
  },
  typeOfCalendarBox: {
    flexDirection: 'row',
    borderColor: PURPLE,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 8,
    alignItems: 'center',
    paddingRight: 3,
  },
  addRadius: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  typeOfCalendarIcon: {
    color: PURPLE,
    marginLeft: 5,
    marginRight: 5,
  },
  calendarText: {
    color: PURPLE,
  },
  logOutIcon: {
    marginRight: 8,
    fontSize: 22,
    color: PURPLE,
  },
  headerDate: {
    backgroundColor: WHITE,
    paddingBottom: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: GRAY_700,
    flexDirection: 'column',
  },
  gradientStyle: {
    padding: 3,
    borderRadius: 50,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textFooterHome: {
    color: PURPLE,
  },
  pictureIconView: {
    width: 50,
    height: 50,
    backgroundColor: GRAY_200,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pictureIcon: {
    fontSize: 22,
    color: PURPLE,
  },
  upIcon: {
    fontSize: 18,
    color: PURPLE,
  },
  imgHome: {
    marginRight: 15,
    width: 25,
    height: 25,
  },
  viewModalDelete: {
    padding: 20,
  },
  viewModalPermission: {
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
  positionText: {
    textAlign: 'center',
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
  textModalException: {
    fontSize: 18,
    marginTop: 25,
    marginBottom: 25,
    textAlign: 'center',
  },
  textModalColor: {
    fontSize: 18,
    color: ERR_COLOR,
    fontWeight: 'bold',
  },
});
