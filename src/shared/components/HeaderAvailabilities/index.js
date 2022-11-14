import React, {Fragment, useEffect, useState, useContext} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {GlobalContext} from '../../../utils/context/GlobalContext';
import {timeTextFormat} from '../../Methods/DateMethods';
import {AVAILABILITY_VIEW} from '../../../utils/constants/rotaShift';
import {styleConstructor} from './styles';
import PropTypes from 'prop-types';

import bus from '../../../assets/icons/HomeIcons/bus.png';
import helpa_logo from '../../../assets/icons/HomeIcons/helpa_logo.png';

const Header = ({title, onPressButton, isEdition, values, travelMethod,isShift}) => {
  const styles = styleConstructor(isEdition);
  const [stateGlobal] = useContext(GlobalContext);
  const navigation = useNavigation();
  const [selectedTravel, setSelectedTravel] = useState('');
  const [isAvailability, setIsAvailability] = useState(true);

  useEffect(() => {
    if (stateGlobal.typeAvailabilityView === AVAILABILITY_VIEW) {
      setIsAvailability(true);
    } else {
      setIsAvailability(false);
    }
  }, [stateGlobal.typeAvailabilityView]);

  useEffect(() => {
    travelMethod.forEach(item => {
      if (item.id === values.travel_method) {
        setSelectedTravel(item.name);
      }
    });
  }, [values, travelMethod]);

  const addTimeText = () => {
    if (values.start_date && values.end_date) {
      return `${timeTextFormat(values.start_date)}  -  ${timeTextFormat(
        values.end_date,
      )}`;
    } else {
      return '';
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.containerFlex}>
        <View style={styles.viewExitIcon}>
          <TouchableOpacity
            style={styles.containerIcon}
            onPress={() => navigation.goBack()}>
            <IoniconsIcon
              style={styles.exitIcon}
              name={`${
                isEdition ? 'md-close-outline' : 'md-chevron-back-sharp'
              }`}
            />
          </TouchableOpacity>
        </View>

        {!isEdition ? (
          <View style={styles.viewLogoImage}>
            <Image source={helpa_logo} style={styles.logo} />
          </View>
        ) : (
          <Fragment />
        )}
        <View style={styles.viewTitle}>
          <Text style={[styles.title]}>{title}</Text>
        </View>

        {!isEdition ? (
          <View style={styles.viewButton}>
            <TouchableOpacity
              style={styles.buttonApply}
              onPress={() => onPressButton(isAvailability)}>
              <FeatherIcon style={[styles.checkIcon]} name="check" />
              <Text style={styles.textStyleApply}>APPLY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Fragment />
        )}
      </View>

      {isEdition ? (
        <View style={styles.travelMethodView}>
          <View>
            {isAvailability ? (
              <Text style={styles.travelMethodTitle}>
                {selectedTravel || isShift ? '' : 'Unspecified travel method'}
              </Text>
            ) : (
              <Fragment />
            )}
            <Text>{addTimeText()}</Text>
          </View>
          {/* {isAvailability ? (
            <View style={styles.travelMethodImg}>
              <Image style={styles.imageStyle} source={bus} />
            </View>
          ) : (
            <Fragment />
          )} */}
        </View>
      ) : (
        <Fragment />
      )}
    </View>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onPressButton: PropTypes.func.isRequired,
  isEdition: PropTypes.bool,
  values: PropTypes.object.isRequired,
  travelMethod: PropTypes.object.isRequired,
};

Header.defaultProps = {
  isEdition: true,
};

export default Header;
