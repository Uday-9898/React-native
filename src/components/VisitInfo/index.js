import React, {Fragment,useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  Platform,
  Alert,
  Image,
} from 'react-native';

import {GlobalContext} from '../../utils/context/GlobalContext';
import {PURPLE, GRADIENT_GREEN, GRAY_150} from '../../assets/Colors';
import {styles} from './styles';
import PropTypes from 'prop-types';

const VisitInfo = ({notes}) => {
  const [stateGlobal, setStateGlobal] = useContext(GlobalContext);
 
  return (
    <View style={styles.container}>
        <Text style={styles.notes}>{notes}</Text>
    </View>
  );
};


export default VisitInfo;
