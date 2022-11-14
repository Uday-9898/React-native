import React, {useState, useContext, Fragment} from 'react';
import validator from 'validator';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {InputLabel} from '../../shared/components';
import {getRoles} from '../../utils/api/CoreApi';
import {getUser} from '../../utils/api/SessionApi';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  TOKEN,
  USERNAME,
  USER_NAME,
  USER_EMAIL,
  USER_ID,
  TENANT,
  USERDETAILS,
  ISADMIN,
  ISSTAFF
} from '../../utils/constants/storageKeys';
import {login} from '../../utils/api/SessionApi';
import {EMPTY_CREDENTIALS, INVALID_EMAIL} from '../../utils/constants/auth';
import Logo from '../../assets/images/MyHelpa_Secondary_Logo_RGB.png';
import {styles} from './styles';
import {FORGOT, PINCODE, SETPINCODE} from '../../utils/constants/routes';

import {TokenContext} from '../../utils/context/TokenContext';

const Login = props => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(true);

  const [, setState] = useContext(TokenContext);

  const handleLogin = async () => {
    try {
      setEmailError(false);
      setPasswordError(false);

      if (validator.isEmpty(email) || validator.isEmpty(password)) {
        if (validator.isEmpty(email)) {
          setEmailError(true);
        }
        if (validator.isEmpty(password)) {
          setPasswordError(true);
        }
        throw new Error(EMPTY_CREDENTIALS);
      }
      if (!validator.isEmail(email)) {
        setEmailError(true);
        throw new Error(INVALID_EMAIL);
      }
      setErrorMessage('');
      const response = await login(email, password);
      await AsyncStorage.setItem(TOKEN, response.access_token);
      await AsyncStorage.setItem(USERNAME, response.user.username);
      await AsyncStorage.setItem(USER_NAME, response.user.id);
      await AsyncStorage.setItem(TENANT, response.user.default_login_organization.endpoint);
       
      const roleResponse = await getRoles();
      //TODO: add the correct employee id
      if(response.is_admin || response.is_staff){
        await AsyncStorage.setItem(ISADMIN, `${response.is_admin}`);
        await AsyncStorage.setItem(ISSTAFF, `${response.is_staff}`);
      }else{
        await AsyncStorage.setItem(
          USER_ID,
          roleResponse.employee_id ? roleResponse.employee_id : (roleResponse.client_id ? roleResponse.client_id : ''),
        );
      }
      const user = await getUser(response.user.id, response.access_token);
      await AsyncStorage.setItem(USERDETAILS, user ? JSON.stringify(true) : null);
      if(response.user.is_pin_password){
        await AsyncStorage.setItem(USER_EMAIL, response.user.email);
        navigation.navigate(PINCODE);
      }else {
        navigation.navigate(SETPINCODE);
      }

      // save token in auth context
      //setState(state => ({...state, accessToken: response.access_token}));
    } catch ({message, code}) {
      console.log("inside handle login err",message,code);
      setErrorMessage(message);
    }
  };

  const handleForgot = () => {
    navigation.navigate(FORGOT);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.containerLogo}>
        <View style={styles.viewLogo}>
          <Image style={styles.imageStyle} source={Logo} resizeMode="cover" />
        </View>
      </View>
      <View style={styles.containerForm}>
        <View style={styles.viewTitle}>
          <Text style={styles.labelLogo}>Log in</Text>
          {/* <Text style={styles.labelSubTitle}>
            Lorem Ipsum is simply dummy text.
          </Text> */}
        </View>
        <View style={styles.viewForm}>
          <Text style={styles.labelInput}>Email</Text>
          <InputLabel
            error={emailError}
            editable={true}
            shadow={true}
            autoCapitalize="none"
            value={email}
            onChangeText={value => setEmail(value)}
            maxLength={60}
          />

          <Text style={[styles.labelInput, styles.styleTop]}>Password</Text>
          <InputLabel
            error={passwordError}
            editable={true}
            shadow={true}
            autoCapitalize="none"
            value={password}
            onChangeText={value => setPassword(value)}
            secureTextEntry={showPassword}
            maxLength={60}
            icon={
              <TouchableOpacity
                onPress={() => {
                  setShowPassword(!showPassword);
                }}>
                <IoniconsIcon
                  style={styles.eyeIcon}
                  name={`${showPassword ? 'md-eye-off' : 'md-eye'}`}
                />
              </TouchableOpacity>
            }
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <Fragment />
          )}
          <TouchableOpacity
            style={[styles.forgotContainer, styles.styleTop]}
            onPress={handleForgot}>
            <Text style={styles.labelForgot}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.SignInButton} onPress={handleLogin}>
            <Text style={styles.SignInButtonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.containerButtonsFooter}>
        {/* <Text style={styles.labelSignUp}>Don't have and account?</Text> */}

        <View style={styles.buttonsContainer}>
           <TouchableOpacity /* style={styles.SignUpButton}  onPress={() => {}} */>
            {/* <Text style={styles.SignUpButtonText}>Sign up</Text> */}
          </TouchableOpacity> 

        </View>
      </View>
    </ScrollView>
  );
};

export default Login;
