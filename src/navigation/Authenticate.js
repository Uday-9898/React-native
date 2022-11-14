import React, { useEffect, useState } from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {
  LOGIN,
  PINCODE,
  FORGOT,
  TITLES,
  SETPINCODE,
  RECOVER_CHECK_EMAIL,
} from '../utils/constants/routes';
import {GRAY_100} from '../assets/Colors';
import Login from '../features/LogIn';
import Forgot from '../components/AuthComponents/ForgotPassword';
import CheckYourEmail from '../components/AuthComponents/CheckYourEmail';
import PinCode from '../features/PinCode';
import SetPinCode from '../features/SetPinCode';

const Stack = createStackNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = GRAY_100;

const Authenticate = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={{PINCODE}}>
      <Stack.Screen
          name={PINCODE}
          component={PinCode}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={LOGIN}
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={SETPINCODE}
          component={SetPinCode}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={FORGOT}
          component={Forgot}
          options={{...baseStyle, title: TITLES[FORGOT]}}
        />
        <Stack.Screen
          name={RECOVER_CHECK_EMAIL}
          component={CheckYourEmail}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const baseStyle = {
  headerStyle: {
    backgroundColor: '#f5f5f5',
  },
  headerTintColor: '#4C11F0',
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontFamily: 'Arial',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
  },
};

export default Authenticate;
