import {StyleSheet} from 'react-native';
import {
  WHITE,
  PURPLE,
  ROTA_SHIFT,
  GRAY_400,
  ERR_COLOR_800,
  GRAY_700,
  GRAY_800,
  ROTA_AVAILABLE,
  GRADIENT_GREEN,
} from '../../assets/Colors';

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
  item: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 10,
    backgroundColor: WHITE,
    paddingBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    width: '94%',
    marginBottom: 2,
  },
  headerItem: {
    padding: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    paddingTop: 2,
    fontSize: 12,
    color: ROTA_SHIFT,
  },
  timeItem: {
    flexDirection: 'row',
    paddingTop: 8,
    //paddingLeft: 8,
  },
  iconForward: {
    fontSize: 20,
    color: ROTA_AVAILABLE,
    marginLeft: 10,
  },
  iconBack: {
    fontSize: 20,
    color: ERR_COLOR_800,
    marginLeft: 12,
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
  countdown: {
    position:'absolute',
    right: 5,
    bottom: 3
  },
  textZip: {
    paddingLeft: 15,
    fontSize: 15,
  },
  iconMapMarker: {
    fontSize: 20,
    marginRight: 10,
    color: PURPLE,
  },
  containerTodayButton: {
    alignItems: 'flex-start',
    paddingLeft: 30,
    paddingTop: 5,
    backgroundColor: WHITE,
  },
  todayButton: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderStyle: 'solid',
    borderRadius: 12,
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
  emptyDate: {
    height: 130,
  },
  styleUserIcon: {
    width: 15,
    height: 15,
  },
  eventUserIconView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  eventUserIcon: {left: -35,
    top: 0,
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
});
