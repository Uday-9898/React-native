import React, {useState, useEffect, Fragment} from 'react';
import validator from 'validator';
import {Image, ScrollView, TouchableOpacity, Text, View} from 'react-native';
import {EMPTY_CREDENTIALS, INVALID_EMAIL} from '../../../utils/constants/auth';
import Logo from '../../../assets/images/MyHelpa_Secondary_Logo_RGB.png';
import {styles} from './styles';
import {InputLabel} from '../../../shared/components';
import {useNavigation} from '@react-navigation/native';
import {forgotPassword} from '../../../utils/api/SessionApi';
import {RECOVER_CHECK_EMAIL} from '../../../utils/constants/routes';

const ForgotPassword = props => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (validator.isEmail(email)) {
      setEmailError(false);
      setErrorMessage(false);
    }
  }, [email]);

  const handleForgot = async () => {
    try {
      setEmailError(false);

      if (validator.isEmpty(email)) {
        if (validator.isEmpty(email)) {
          setEmailError(true);
        }
        throw new Error(EMPTY_CREDENTIALS);
      }
      if (!validator.isEmail(email)) {
        setEmailError(true);
        throw new Error(INVALID_EMAIL);
      }
      setErrorMessage('');
      const response = await forgotPassword(email);
      if (!response.message) {
        setEmailError(true);
        throw new Error('Unknown user email.');
      }
      navigation.navigate(RECOVER_CHECK_EMAIL);
    } catch ({message, code}) {
      setErrorMessage(message);
    }
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
          <Text style={styles.labelLogo}>Recover password</Text>
          <Text style={styles.labelSubTitle}>
            Enter the email associated with your account and we will send an
            email with instructions to reset your password.
          </Text>
        </View>
        <View style={styles.styleTop}>
          <Text style={styles.labelInput}>Email address</Text>

          <InputLabel
            error={emailError}
            shadow={true}
            autoCapitalize="none"
            editable={true}
            value={email}
            secureTextEntry={false}
            onChangeText={value => setEmail(value)}
          />
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <Fragment />
        )}
      </View>

      <View style={styles.containerButtonsFooter}>
        {/* <Text style={styles.labelSignUp}>Don't have and account?</Text> */}

        <View style={styles.buttonsContainer}>
           <TouchableOpacity /* style={styles.SignUpButton} onPress={() => {}} */>
            {/* <Text style={styles.SignUpButtonText}>Sign up</Text> */}
          </TouchableOpacity> 

          <TouchableOpacity style={styles.SignInButton} onPress={handleForgot}>
            <Text style={styles.SignInButtonText}>RECOVER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
