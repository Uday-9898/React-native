import React, { useState, useContext, Fragment, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import ModalException from '../../components/VisitDetails/VisitDetailsModals';
import {
  LOGIN
} from '../../utils/constants/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
      USER_EMAIL,
      TOKEN,
      PIN,
      USERNAME,
      USER_NAME,
      USER_ID,
      TENANT,
      USERDETAILS,
      ISADMIN,
      ISSTAFF
   } from '../../utils/constants/storageKeys';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { TokenContext } from '../../utils/context/TokenContext';
import { forgotPin, login } from '../../utils/api/SessionApi';
import { styles } from './styles'
import { GRAY_400, GRAY_600, PURPLE } from '../../assets/Colors';
import { GlobalContext } from '../../utils/context/GlobalContext';
import NetInfo from '@react-native-community/netinfo';

const PinCode = () => {

  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModalException, setShowModalException] = useState(false);
  const [, setState] = useContext(TokenContext);
  const [stateGlobal, setStateGlobal] = useContext(GlobalContext);
  const pinInput = useRef();

  useEffect(() => {
    const checkUser = async () => {
      const user_email = await AsyncStorage.getItem(USER_EMAIL);
      if (!user_email) {
        navigation.navigate(LOGIN);
      }else{
        setEmail(user_email);
      }
    }
    checkUser();
  }, [])

  useEffect(() => {
      setErrorMessage('');
  }, [code])

  const handlePincode = (code) => {
    setCode(code)
    if (code.length === 4) {
      checkNetwork(code);
      
    }
  }

  const checkNetwork=async(code)=>{
    let continueSaving = true;
      continueSaving = await NetInfo.fetch().then(async stateConnection => {
        if (stateConnection.type === 'none') {
          loginOffline(code)
        } else {
          loginWithPin(code)
        }
      }); 
  }

  const loginOffline = async(code)=>{
    const getPin = await AsyncStorage.getItem(PIN);
    if(getPin === code){
      const getToken = await AsyncStorage.getItem(TOKEN);
      setState(state => ({ ...state, accessToken: getToken }));
    }else {
      setCode('')
      setErrorMessage('Entered pin is wrong');
    }
  }

  const loginWithPin = async (code) => {
    const email = await AsyncStorage.getItem(USER_EMAIL);
    try {
      const response = await login(email, code);
      await AsyncStorage.setItem(TOKEN, response.access_token);
      await AsyncStorage.setItem(PIN, code);
      setState(state => ({ ...state, accessToken: response.access_token }));
    } catch ({ message, code }) {
      setCode('')
      setErrorMessage(message);
    }
  }

  const handleForgot=async()=>{
    const email = await AsyncStorage.getItem(USER_EMAIL);
    try{
      const response = await forgotPin(email);
      if (!response.message) {
        throw new Error('Unknown user email.');
      }
      setShowModalException(false);
      setTimeout(() => {
        setStateGlobal(state => ({
          ...state,
          requestModal: {
            isVisible: true,
            isSuccess: true,
            textModal: `Email sent`,
          },
        }))
      }, 200);
      navigation.navigate(LOGIN);
    } catch ({message, code}) {
      setErrorMessage(message);
    }
  }

  const handleBackLogin=async()=>{
      AsyncStorage.clear();
      setState(state => ({ ...state, accessToken: null }));
    navigation.navigate(LOGIN)
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerFlex}>
      <View style={styles.viewExitIcon}>
        <TouchableOpacity
          style={styles.containerIcon}
          onPress={() => handleBackLogin()}>
          <IoniconsIcon
            style={styles.exitIcon}
            name={`${'md-chevron-back-sharp'
              }`}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.viewTitle}>
          <Text style={[styles.titleBack]}>Login with another account</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.titleEmail]}>{email}</Text>
        <Text style={styles.title}>Enter Pin</Text>
        <SmoothPinCodeInput
          autoFocus={true}
          ref={pinInput}
          value={code}
          onTextChange={code => handlePincode(code)}
          mask={<View style={{
            width: 10,
            height: 10,
            borderRadius: 25,
            backgroundColor: GRAY_600
          }}></View>}
          maskDelay={0}
          password={true}
          cellStyleFocused={{
            borderColor: PURPLE
          }}
        />
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <Fragment />
      )}
      <TouchableOpacity
        style={[styles.forgotContainer, styles.styleTop]}
        onPress={()=>{setShowModalException(true)}}>
        <Text style={styles.labelForgot}>Forgot pin?</Text>
      </TouchableOpacity>
      <ModalException
        showModalException={showModalException}
        onCancel={() => {
          setShowModalException(false);
        }}
        onOk={() => {
          handleForgot()
        }}
        okTitle={'Recover'}>
        <Text style={styles.textModalException}>
          Click on Recover button, we will send an email with instructions to reset your Pin.
        </Text>
      </ModalException>
    </View>
  );
};

export default PinCode;
