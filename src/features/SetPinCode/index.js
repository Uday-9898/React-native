import React, {useState, useContext, Fragment, useRef,useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
    LOGIN, PINCODE
  } from '../../utils/constants/routes';
import {setNewPin} from '../../utils/api/SessionApi'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_EMAIL, USER_NAME, TOKEN} from '../../utils/constants/storageKeys';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {TokenContext} from '../../utils/context/TokenContext';
import { GlobalContext } from '../../utils/context/GlobalContext';
import {styles} from './styles'

const SetPinCode = () => {

  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [codeConfirm, setCodeConfirm] = useState('');
  const [confirmPin, setConfirmPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [, setState] = useContext(TokenContext);
  const [stateGlobal, setStateGlobal] = useContext(GlobalContext);
  const pinInput = useRef();
  const pinInputConfirm = useRef();

  useEffect(() => {
      setErrorMessage('')
  }, [codeConfirm])

  const handleOnChange=(code)=>{
        setCode(code)
        if(code.length === 4){
            setConfirmPin(true);
        }
  }

  const handleOnChangeConfirm=(code)=>{
    setCodeConfirm(code)
    if(code.length === 4){
        setNewPinCode(code)
    }
}

const setNewPinCode=async(code2)=>{
    const user_id = await AsyncStorage.getItem(USER_NAME)
    const body = {
    password_confirmation: code2,
    password: code,
    user_id : user_id
    }
    setNewPin(body)
    .then((res)=>{
       if(res === "successfully mobile pin created"){
        setTimeout(() =>
        setStateGlobal(state => ({
          ...state,
          requestModal: {
            isVisible: true,
            isSuccess: true,
            textModal: 'Mobile pin created successfully',
          },
        })), 100);
         navigation.navigate(LOGIN);
       }
    })
    .catch((err)=>{
        setErrorMessage(err.message);
    })
}



  return (
      <View style={styles.container}>
          {!confirmPin ? <View style={styles.section}>
              <Text style={styles.title}>Set New Pin</Text>
              <SmoothPinCodeInput
                  autoFocus={true}
                  ref={pinInput}
                  value={code}
                  onTextChange={code => handleOnChange(code)}
              />
          </View>
          :
          <View style={styles.section}>
              <Text style={styles.title}>Confirm New Pin</Text>
              <SmoothPinCodeInput
                  autoFocus={true}
                  ref={pinInputConfirm}
                  value={codeConfirm}
                  onTextChange={code => handleOnChangeConfirm(code)}
              />
          </View>}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <Fragment />
          )}
      </View>
  );
};

export default SetPinCode;
