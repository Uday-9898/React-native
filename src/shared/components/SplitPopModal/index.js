import React, {Fragment} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {styleConstructor} from './styles';
import PropTypes from 'prop-types';

const SplitPopModal = ({
  isModalVisible,
  children,
  buttonText,
  onOk,
  okColor,
  okTitle,
  onCancel,
  cancelTitle,
  onlyOneSelection,
  cancelIcon,
  okIcon,
}) => {
  const styles = styleConstructor(buttonText, okColor);

  return (
    <Modal
      isVisible={isModalVisible}
      style={styles.componentModal}
      animationInTiming={1}
      animationOutTiming={1}>
      <View style={styles.modalContent}>
        {children}
        <View style={styles.horizontalLine} />
        <View style={styles.eventsContainer}>
          <View style={[styles.eventView, styles.eventOneLine]}>
            {buttonText ? (
              <TouchableOpacity style={styles.displayButton} onPress={onCancel}>
                {cancelIcon}
                <Text style={styles.cancelTextTitle}>{cancelTitle}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.cancelButton, styles.displayButton]}
                onPress={onCancel}>
                {cancelIcon}
                <Text style={styles.cancelButtonTitle}>{cancelTitle}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.eventView, styles.eventTwoLine]}>
            {buttonText ? (
              <TouchableOpacity style={styles.displayButton} onPress={onOk}>
                {okIcon}
                <Text style={styles.okTextTitle}>{okTitle}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.okButton, styles.displayButton]}
                onPress={onOk}>
                {okIcon}
                <Text style={styles.okButtonTitle}>{okTitle}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

SplitPopModal.propTypes = {
  isModalVisible: PropTypes.bool,
  buttonText: PropTypes.bool,
  onOk: PropTypes.func,
  okTitle: PropTypes.string,
  onCancel: PropTypes.func,
  cancelTitle: PropTypes.string,
  onlyOneSelection: PropTypes.bool,
  cancelIcon: PropTypes.element,
  okIcon: PropTypes.element,
};

SplitPopModal.defaultProps = {
  isModalVisible: false,
  buttonText: true,
  onOk: () => {},
  okTitle: 'ACCEPT',
  onCancel: () => {},
  cancelTitle: 'CANCEL',
  onlyOneSelection: false,
  cancelIcon: <Text />,
  okIcon: <Text />,
};

export default SplitPopModal;
