import React from 'react';
import {View, Text, Image} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {PopModal} from '../../../shared/components';
import {styles} from './styles';
import PropTypes from 'prop-types';

const time_exception = require('../../../assets/images/ModalsImages/time_exception.png');

const ModalException = ({
  showModalException,
  onCancel,
  onOk,
  children,
  okTitle,
}) => {
  return (
    <PopModal
      isModalVisible={showModalException}
      cancelTitle={'CANCEL'}
      onCancel={onCancel}
      okTitle={okTitle}
      onOk={onOk}
      buttonText={false}
      cancelIcon={
        <IoniconsIcon style={styles.closeIcon} name={'md-close-outline'} />
      }
      okIcon={
        <IoniconsIcon style={styles.iconForward} name="md-return-up-forward" />
      }>
      <View style={styles.childModal}>
        <Text style={styles.titleModal}>{!(okTitle === 'Recover') && `Warning`}</Text>

        <Image style={styles.imageStyle} source={time_exception} />

        {children}
      </View>
    </PopModal>
  );
};

ModalException.propTypes = {
  showModalException: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

ModalException.defaultProps = {
  showModalException: false,
};

export default ModalException;
