import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  HOME,
  AVAILABILITY,
  CREATE_NEW_PASSWORD,
  SELECT_EMPLOYEE_FOR_ADMIN,
} from '../utils/constants/routes';
import {
  ISADMIN,
  ISSTAFF,
  USER_ID
} from '../utils/constants/storageKeys';
import HomeComponent from '../features/Home';
import Availability from '../components/Availability';
import CreateNewPassword from '../components/AuthComponents/CreateNewPassword';
import SelectEmployeeForAdmin from '../features/SelectEmployee';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Stack = createStackNavigator();

const SignedNavigation = () => {
   const [option, setOption] = useState(true);

  useEffect(()=>{
    const load = async () => {
       const userID =  await AsyncStorage.getItem(USER_ID);
       if(userID){
         setOption(false);
       }
    };

    load();
  },[])


  return (
    <NavigationContainer>
      <Stack.Navigator>
       
        <Stack.Screen
          name={HOME}
          component={HomeComponent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={AVAILABILITY}
          component={Availability}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={CREATE_NEW_PASSWORD}
          component={CreateNewPassword}
          options={{title: ''}}
        />
         <Stack.Screen
          name={SELECT_EMPLOYEE_FOR_ADMIN}
          component={SelectEmployeeForAdmin}
          options={option ? {headerShown: false} : {title: ''}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SignedNavigation;
