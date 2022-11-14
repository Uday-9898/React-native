import React, {useState} from 'react';
import {AVAILABILITY_VIEW, UNAVAILABILITY_VIEW} from '../constants/rotaShift';

const GlobalContext = React.createContext([{}, () => {}]);
const GlobalProvider = props => {
  const [state, setState] = useState({
    isHome: true,
    requestModal: {
      isVisible: false,
      isSuccess: true,
      textModal: '',
    },
    typeAvailabilityView: AVAILABILITY_VIEW,
    loadingModalVisible: true,
  });
  return (
    <GlobalContext.Provider value={[state, setState]}>
      {props.children}
    </GlobalContext.Provider>
  );
};
export {GlobalContext, GlobalProvider};
