import React, {useContext, useEffect} from 'react';
import {View, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOKEN, USERNAME, USER_NAME, USERDETAILS} from '../../utils/constants/storageKeys';
import {TokenContext} from '../../utils/context/TokenContext';
import {getUser} from '../../utils/api/SessionApi';
import {styles} from './styles';

import myLogoStrapline from '../../assets/images/HomeImages/MyHelpa_Logo_Strapline.png';

const SplashScreen = () => {
  const [, setState] = useContext(TokenContext);
  
console.log("inside splash screen")
//debugger;
  useEffect(() => {
   console.log("inside use effect")
    const checkAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN);
        console.log(token,"token")
        if (token) {
           const user = await AsyncStorage.getItem(USERDETAILS);
          // console.log(username,"username")
          // const user = await getUser(username);
          // console.log(user,"user")
          //setTimeout(() => {
            setState(state => ({...state, accessToken: user ? token : null}));
          //}, 1000);
        } else {
          // save token in auth context
          setTimeout(() => {
            setState(state => ({...state, accessToken: token}));
          }, 1000);
        }
      } catch ({message}) {
        console.log(message,"messsage");
      }
    };
   // checkAccessToken();
  }, [setState]);

  return (
    <View style={styles.container}>
      <Image style={styles.imageLogo} source={myLogoStrapline} />
    </View>
  );
};

export default SplashScreen;
