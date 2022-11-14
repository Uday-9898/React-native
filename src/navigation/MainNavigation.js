import React, { useEffect, useState, useContext } from 'react';
import { AuthProvider } from '../utils/context/AuthContext';
import { GlobalProvider } from '../utils/context/GlobalContext';
import SplashScreen from '../features/SplashScreen';
import Authenticate from './Authenticate';
import Signed from './Signed';
import { RequestModal, LoadingModal } from '../shared/components';
import { TokenContext } from '../utils/context/TokenContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// eslint-disable-next-line no-extend-native
Date.prototype.getUTCString = function () {
  let mm = this.getUTCMonth() + 1; // getMonth() is zero-based
  let dd = this.getUTCDate();
  let hh = this.getUTCHours();
  let min = this.getUTCMinutes();
  let ss = this.getUTCSeconds();

  return (
    [
      this.getUTCFullYear(),
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd,
    ].join('/') +
    'T' +
    [
      (hh > 9 ? '' : '0') + hh,
      (min > 9 ? '' : '0') + min,
      (ss > 9 ? '' : '0') + ss,
    ].join(':') +
    '+0000'
  );
};

const MainNavigation = () => {
  const [initializing, setInitializing] = useState(true);
  const [logged, setLogged] = useState(false);
  const [userName] = useState(null);

  const [stateValue] = useContext(TokenContext);
  const { accessToken = '' } = stateValue;
  
  console.log('state value', stateValue);
  useEffect(() => {
    const validateAccess = async () => {
       //const tokensStorage = await AsyncStorage.getItem(TOKEN);
      if (accessToken) {
        setLogged(true);
        setInitializing(false);
      } else {
        setLogged(false);
        setInitializing(false);
      }

      return true;
    };
    validateAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
  console.log(initializing, logged)
  //debugger;
  if (initializing) {
    return <SplashScreen />;
  }

  if (!logged) {
    return <Authenticate />;
  }

  return (
    <GlobalProvider>
      <AuthProvider value={userName}>
        <Signed />
      </AuthProvider>
      <RequestModal />
      <LoadingModal />
    </GlobalProvider>
  );
};

export default MainNavigation;
