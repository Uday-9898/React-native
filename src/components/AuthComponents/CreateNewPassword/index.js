import React, { useState, useEffect, Fragment, useContext , useRef} from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { InputLabel } from '../../../shared/components';
import validator from 'validator';
import { EMPTY_FIELDS } from '../../../utils/constants/auth';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { resetCredentials, setResetPin } from '../../../utils/api/SessionApi';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../../../utils/context/GlobalContext';
import { HOME } from '../../../utils/constants/routes';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_NAME} from '../../../utils/constants/storageKeys';
import { styles } from './styles';

const CreateNewPassword = () => {
  const navigation = useNavigation();
  const [, setStateGlobal] = useContext(GlobalContext);
  const [values, setValues] = useState({
    password: '',
    confirm_password: '',
    old_password: '',
  });
  const [errors, setErrors] = useState({
    password: false,
    confirm_password: false,
    old_password: false,
  });
  const [securityInput, setSecurityInput] = useState(true);
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [pinRoute, setPinRoute] = useState(1);
  const [activePinTab, setactivePinTab] = useState(false);
  const [securityInputConfirm, setSecurityInputConfirm] = useState(true);
  const [oldSecurityInput, setOldSecurityInput] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalCharacters, setTotalCharacters] = useState(false);
  const [matchPasswords, setMatchPasswords] = useState(false);
  const pinInput = useRef();

  useEffect(() => {
    if (
      !validator.isEmpty(values.password) &&
      !validator.isEmpty(values.confirm_password) &&
      !validator.isEmpty(values.old_password)
    ) {
      setErrorMessage(false);
    }

    const new_errors = errors;

    if (validator.isLength(values.old_password, 8)) {
      new_errors.old_password = false;
    }

    if (validator.isLength(values.password, 8) && !matchPasswords) {
      setTotalCharacters(false);
      new_errors.password = false;
    }

    if (validator.isLength(values.confirm_password, 8) && !matchPasswords) {
      new_errors.confirm_password = false;
    }

    if (
      !validator.isEmpty(values.password) &&
      !validator.isEmpty(values.confirm_password) &&
      validator.equals(values.password, values.confirm_password)
    ) {
      setMatchPasswords(false);
      new_errors.password = false;
      new_errors.confirm_password = false;
    }

    setErrors({ ...errors, ...new_errors });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.password, values.confirm_password, values.old_password]);

  const resetPassword = async () => {
    try {
      if (
        validator.isEmpty(values.password) ||
        validator.isEmpty(values.confirm_password) ||
        validator.isEmpty(values.old_password)
      ) {
        const new_errors = errors;

        if (validator.isEmpty(values.old_password)) {
          new_errors.old_password = true;
        }

        if (validator.isEmpty(values.password)) {
          new_errors.password = true;
        }

        if (validator.isEmpty(values.confirm_password)) {
          new_errors.confirm_password = true;
        }
        setErrors({ ...errors, ...new_errors });

        throw new Error(EMPTY_FIELDS);
      }

      let have_error = false;
      const new_errors = errors;

      if (validator.isLength(values.old_password, 1, 7)) {
        new_errors.old_password = true;
        have_error = true;
      }

      if (validator.isLength(values.password, 1, 7)) {
        setTotalCharacters(true);
        new_errors.password = true;
        have_error = true;
      }

      if (!validator.equals(values.password, values.confirm_password)) {
        setMatchPasswords(true);
        new_errors.password = true;
        new_errors.confirm_password = true;
        have_error = true;
      }

      if (have_error) {
        setErrors({ ...errors, ...new_errors });
        return;
      }

      const response = await resetCredentials({
        password: values.password,
        old_password: values.old_password,
      });
      if (response.non_field_errors) {
        setErrorMessage(response.non_field_errors[0]);
        return;
      }

      if (response.message && response.message === 'reset done') {
        setTimeout(() => {
          setStateGlobal(state => ({
            ...state,
            requestModal: {
              isVisible: true,
              isSuccess: true,
              textModal: 'Create password successful',
            },
          }))
        }, 100);
        navigation.navigate(HOME);
      }
    } catch ({ message, error }) {
      setErrorMessage(message);
    }
  };

  const tabClick = (tab) => {
    if (tab === 1) {
      setactivePinTab(false);
    } else {
      setactivePinTab(true);
    }
    setPinRoute(1);
    setValues({
      password: '',
      confirm_password: '',
      old_password: '',
    });
    setErrorMessage('');
  }

  const handleOldPincode = (code) => {
    setOldCode(code)
    if (code.length === 4) {
      setPinRoute(2)
      setErrorMessage('');
    }
  }

  const handleNewPincode = (code) => {
    setNewCode(code)
    if (code.length === 4) {
      setPinRoute(3)
    }
  }

  const handleConfirmPincode = (code) => {
    setConfirmCode(code)
    if (code.length === 4) {
      ChangePin(code);
    }
  }

  const ChangePin= async (code)=>{
    const user_id = await AsyncStorage.getItem(USER_NAME)
    const body = {
      password_confirmation: code,
      old_password: oldCode,
      password: newCode,
      user_id: user_id
    }
    setResetPin(body)
    .then((res)=>{
       if(res === "successfully mobile pin updated"){
        setPinRoute(1);
        setOldCode('');
        setNewCode('');
        setConfirmCode('')
        setErrorMessage('');
        setTimeout(() =>
        setStateGlobal(state => ({
          ...state,
          requestModal: {
            isVisible: true,
            isSuccess: true,
            textModal: 'Mobile pin changed successfully',
          },
        })), 100);
        navigation.navigate(HOME);
       }
    })
    .catch((err)=>{
        setPinRoute(1);
        setOldCode('');
        setNewCode('');
        setConfirmCode('')
        setErrorMessage(err.message);
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Text style={[styles.tabButtons, activePinTab ? styles.tabBorderDefault : styles.tabBorderActive]} onPress={() => tabClick(1)}>Password</Text>
        <Text style={[styles.tabButtons, activePinTab ? styles.tabBorderActive : styles.tabBorderDefault]} onPress={() => tabClick(2)}>Pin</Text>
      </View>
      {!activePinTab ?
        <View>
          <Text style={styles.viewTitle}>Create new password</Text>
          <Text style={[styles.textStyle, styles.textInformation]}>
            Your new password must be different from previous used passwords.
          </Text>

          <Text style={styles.textStyle}>Old password</Text>
          <InputLabel
            error={errors.old_password}
            editable={true}
            shadow={true}
            autoCapitalize="none"
            value={values.old_password}
            onChangeText={value => {
              setValues({ ...values, old_password: value });
            }}
            secureTextEntry={oldSecurityInput}
            maxLength={60}
            icon={
              <TouchableOpacity
                onPress={() => {
                  setOldSecurityInput(!oldSecurityInput);
                }}>
                <IoniconsIcon
                  style={styles.eyeIcon}
                  name={`${oldSecurityInput ? 'md-eye-off' : 'md-eye'}`}
                />
              </TouchableOpacity>
            }
          />

          <Text style={[styles.textStyle, styles.topText]}>New password</Text>
          <InputLabel
            error={errors.password}
            editable={true}
            shadow={true}
            autoCapitalize="none"
            value={values.password}
            onChangeText={value => {
              setValues({ ...values, password: value });
            }}
            secureTextEntry={securityInput}
            maxLength={60}
            icon={
              <TouchableOpacity
                onPress={() => {
                  setSecurityInput(!securityInput);
                }}>
                <IoniconsIcon
                  style={styles.eyeIcon}
                  name={`${securityInput ? 'md-eye-off' : 'md-eye'}`}
                />
              </TouchableOpacity>
            }
          />
          {totalCharacters ? (
            <Text>Must be at least 8 characters</Text>
          ) : (
            <Fragment />
          )}

          <Text style={[styles.textStyle, styles.topText]}>
            Confirm new password
          </Text>
          <InputLabel
            error={errors.confirm_password}
            editable={true}
            autoCapitalize="none"
            shadow={true}
            value={values.confirm_password}
            secureTextEntry={securityInputConfirm}
            maxLength={60}
            onChangeText={value => {
              setValues({ ...values, confirm_password: value });
            }}
            icon={
              <TouchableOpacity
                onPress={() => {
                  setSecurityInputConfirm(!securityInputConfirm);
                }}>
                <IoniconsIcon
                  style={styles.eyeIcon}
                  name={`${securityInputConfirm ? 'md-eye-off' : 'md-eye'}`}
                />
              </TouchableOpacity>
            }
          />
          {matchPasswords ? <Text>Both passwords must match</Text> : <Fragment />}

          {errorMessage ? (
            <View style={styles.viewError}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : (
            <Fragment />
          )}

          <TouchableOpacity style={styles.resetButton} onPress={resetPassword}>
            <Text style={styles.resetButtonText}>Reset password</Text>
          </TouchableOpacity>
        </View>

        :

        <View>
          <Text style={styles.viewTitle}>Create new Pin</Text>
          <Text style={[styles.textStyle, styles.textInformation]}>
            Your new pin must be different from previous used pin.
          </Text>
          {(pinRoute === 1) && <View style={styles.section}>
            <Text style={styles.title}>Enter Old Pin</Text>
            <SmoothPinCodeInput
              autoFocus={true}
              ref={pinInput}
              value={oldCode}
              onTextChange={code => handleOldPincode(code)}
            />
          </View>}
          {(pinRoute === 2) && <View style={styles.section}>
            <Text style={styles.title}>Enter New Pin</Text>
            <SmoothPinCodeInput
              autoFocus={true}
              ref={pinInput}
              value={newCode}
              onTextChange={code => handleNewPincode(code)}
            />
          </View>}
          {(pinRoute === 3) && <View style={styles.section}>
            <Text style={styles.title}>Confirm Pin</Text>
            <SmoothPinCodeInput
              autoFocus={true}
              ref={pinInput}
              value={confirmCode}
              onTextChange={code => handleConfirmPincode(code)}
            />
          </View>}

          {errorMessage ? (
            <View style={styles.viewError}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : (
            <Fragment />
          )}
        </View>

      }
    </View>
  );
};

export default CreateNewPassword;
