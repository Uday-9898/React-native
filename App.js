import React from 'react';
import MainNavigation from './src/navigation/MainNavigation';
import {TokenProvider} from './src/utils/context/TokenContext';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {mapping} from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from 'react-native-ui-kitten';
import {crowdboticsTheme} from './src/config/crowdboticsTheme';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { PersistGate } from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
// Modify to add persistor
import { store, persistor } from './src/redux/store';

AntDesignIcon.loadFont();
OcticonsIcon.loadFont();
IoniconsIcon.loadFont();
FeatherIcon.loadFont();
MaterialIconsIcon.loadFont();
FoundationIcon.loadFont();
EntypoIcon.loadFont();
FontistoIcon.loadFont();

export default class App extends React.Component {
  renderApp = () => (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TokenProvider>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider mapping={mapping} theme={crowdboticsTheme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <MainNavigation />
            </PersistGate>
          </Provider>
        </ApplicationProvider>
      </TokenProvider>
    </KeyboardAvoidingView>
  );
  render = () => this.renderApp();
}
