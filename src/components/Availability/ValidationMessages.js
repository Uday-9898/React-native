import React, {Fragment} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {
  SHIFT_EXISTING_SHIFT,
  AVAILABLE_EXISTING_UNAVAILABLE,
  UNAVAILABLE_EXISTING_AVAILABLE,
  AVAILABLE_EXISTING_SHIFT,
  UNAVAILABLE_EXISTING_SHIFT,
} from '../../utils/constants/rotaShift';
import {styleValidationsConstructor} from './styles';
import PropTypes from 'prop-types';

const ValidationMessages = (
  validateMessage,
  setValidateMessage,
  start_date,
  end_date,
  onPressApply,
  isAvailable,
) => {
  const styles = styleValidationsConstructor();

  const addExclamationIcon = () => {
    return (
      <AntDesignIcon style={styles.exclamationIcon} name="exclamationcircle" />
    );
  };

  const addCloseIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setValidateMessage('');
        }}>
        <IoniconsIcon style={styles.exitIcon} name={'md-close-outline'} />
      </TouchableOpacity>
    );
  };

  const addMessage = () => {
    let content = <Fragment />;
    switch (validateMessage) {
      case SHIFT_EXISTING_SHIFT:
        content = (
          <Fragment>
            <View style={styles.viewValidation}>
              <View style={styles.textView}>
                {addExclamationIcon()}
                <Text style={styles.textAlignment}>
                  The user has a shift assigned from{' '}
                  <Text style={styles.markedText}>{start_date}</Text> to{' '}
                  <Text style={styles.markedText}>{end_date}</Text>
                </Text>
              </View>
              <View style={styles.viewCloseIcon}>{addCloseIcon()}</View>
            </View>
            <View style={styles.questionView}>
              <Text style={styles.textQuestion}>
                Would you like to replace it?
              </Text>
            </View>
          </Fragment>
        );
        break;

      case AVAILABLE_EXISTING_UNAVAILABLE:
        content = (
          <Fragment>
            <View style={styles.viewValidation}>
              <View style={styles.textView}>
                {addExclamationIcon()}
                <Text style={styles.textAlignment}>
                  You have indicated you are unavailable from{' '}
                  <Text style={styles.markedText}>{start_date}</Text> to{' '}
                  <Text style={styles.markedText}>{end_date}</Text>
                </Text>
              </View>
              <View style={styles.viewCloseIcon}>{addCloseIcon()}</View>
            </View>
            <View style={styles.questionView}>
              <Text style={styles.textQuestion}>
                Would you like to replace it?
              </Text>
            </View>
          </Fragment>
        );
        break;

      case UNAVAILABLE_EXISTING_AVAILABLE:
        content = (
          <Fragment>
            <View style={styles.viewValidation}>
              <View style={styles.textView}>
                {addExclamationIcon()}
                <Text style={styles.textAlignment}>
                  You have indicated you are available from{' '}
                  <Text style={styles.markedText}>{start_date}</Text> to{' '}
                  <Text style={styles.markedText}>{end_date}</Text>
                </Text>
              </View>
              <View style={styles.viewCloseIcon}>{addCloseIcon()}</View>
            </View>
            <View style={styles.questionView}>
              <Text style={styles.textQuestion}>
                Would you like to replace it?
              </Text>
            </View>
          </Fragment>
        );
        break;

      case AVAILABLE_EXISTING_SHIFT:
        content = (
          <Fragment>
            <View style={styles.viewValidation}>
              <View style={styles.textView}>
                {addExclamationIcon()}
                <Text style={styles.textAlignment}>
                  You have a shift assigned. Try to make yourself out of the
                  assigned shifts
                </Text>
              </View>
              <View style={styles.viewCloseIcon}>{addCloseIcon()}</View>
            </View>
          </Fragment>
        );
        break;

      case UNAVAILABLE_EXISTING_SHIFT:
        content = (
          <Fragment>
            <View style={styles.viewValidation}>
              <View style={styles.textView}>
                {addExclamationIcon()}
                <Text style={styles.textAlignment}>
                  You have a shift assigned. Would you like to request
                  unavailability?
                </Text>
              </View>
              <View style={styles.viewCloseIcon}>{addCloseIcon()}</View>
            </View>
          </Fragment>
        );
        break;

      default:
        content = <Fragment />;
    }

     if (validateMessage) {
      return (
        <View style={styles.validationMessageView}>
          {content}
          {validateMessage !== AVAILABLE_EXISTING_SHIFT ? (
            <View style={styles.cancelView}>
              <TouchableOpacity
                onPress={() => {
                  setValidateMessage('');
                  /* onPressApply(isAvailable, true); */
                }}
                style={styles.buttonYes}>
                <Text style={styles.buttonYesText}>Yes, proceed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setValidateMessage('');
                }}
                style={styles.buttonCancel}>
                <Text style={styles.buttonCancelText}>No, cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Fragment />
          )}
        </View>
      );
    } else {
      return <Fragment />;
    } 
  };

  return addMessage();
};

ValidationMessages.propTypes = {
  start_date: PropTypes.string,
  end_date: PropTypes.string,
};

ValidationMessages.propTypes = {
  start_date: 'start day',
  end_date: 'end day',
};

export default ValidationMessages;
