import React, {Fragment, useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {styleConstructor} from './styles';
import PropTypes from 'prop-types';

const ModalComponent = ({
  isModalVisible,
  setIsModalVisible,
  title,
  children,
  rightButtonEvent,
  showRightButton,
  onlyComponent,
  paddingLeft,
  paddingRight,
  maxHeight,
}) => {
  const styles = styleConstructor(paddingLeft, paddingRight, maxHeight);

  

  return (
    <Modal isVisible={isModalVisible} style={styles.componentModal}>
      <View style={styles.modalContent}>
        {!onlyComponent ? (
          <View style={styles.header}>
            <View style={styles.viewTitle}>
              <TouchableOpacity onPress={setIsModalVisible}>
                <IoniconsIcon
                  style={styles.exitIcon}
                  name={'md-chevron-back-sharp'}
                />
              </TouchableOpacity>

              <Text style={styles.title}>{title}</Text> 
            </View>
            {showRightButton ? (
              <View>
                <TouchableOpacity
                  style={styles.rightButton}
                  onPress={rightButtonEvent}>
                  <Text style={styles.rightButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Fragment />
            )}
          </View>
        ) : (
          <Fragment />
        )}
        <View style={styles.childrenView}>{children}</View>
      </View>
    </Modal>
  );
};

ModalComponent.propTypes = {
  isModalVisible: PropTypes.bool,
  setIsModalVisible: PropTypes.func,
  title: PropTypes.string,
  rightButtonEvent: PropTypes.func,
  showRightButton: PropTypes.bool,
  onlyComponent: PropTypes.bool,
};

ModalComponent.defaultProps = {
  isModalVisible: false,
  setIsModalVisible: () => {},
  title: 'title',
  rightButtonEvent: () => {},
  showRightButton: false,
  onlyComponent: false,
};

export default ModalComponent;
