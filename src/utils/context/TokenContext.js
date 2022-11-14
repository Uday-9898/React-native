import React, {useState} from 'react';

const TokenContext = React.createContext([{}, () => {}]);
const TokenProvider = props => {
  const [state, setState] = useState({});
  return (
    <TokenContext.Provider value={[state, setState]}>
      {props.children}
    </TokenContext.Provider>
  );
};
export {TokenContext, TokenProvider};
