import React, {useContext} from 'react';
import Modal from 'react-native-modal';
import {View} from 'react-native';
import {PURPLE} from '../../../assets/Colors';
import {MaterialIndicator} from 'react-native-indicators';
import {GlobalContext} from '../../../utils/context/GlobalContext';
import {styles} from './styles';

const LoadingModal = () => {
  const [stateGlobal] = useContext(GlobalContext);

  return (
    <Modal
      isVisible={stateGlobal.loadingModalVisible}
      style={styles.componentModal}>
      <View style={styles.container}>
        <MaterialIndicator
          animationDuration={2000}
          color={PURPLE}
          size={100}
          trackWidth={6}
        />
      </View>
    </Modal>
  );
};

export default LoadingModal;
