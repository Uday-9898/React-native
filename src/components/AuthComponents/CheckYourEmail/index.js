import React from 'react';
import {TouchableOpacity, Text, View, Linking} from 'react-native';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import {LOGIN, FORGOT} from '../../../utils/constants/routes';
import {useNavigation} from '@react-navigation/native';
import { openInbox } from "react-native-email-link";
/* import {openInbox} from 'react-native-email-link';
 */import {styles} from './styles';

const CheckYourEmail = () => {
  const navigation = useNavigation();

  const openEmail = () => {
    openInbox();
    //Linking.openURL('message://');
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyView}>
        <View style={styles.mailContainer}>
          <OcticonsIcon style={styles.mailIcon} name="mail-read" />
        </View>
        <Text style={styles.checkMailText}>Check your mail</Text>

        <Text style={styles.sentRecoverText}>
          We have sent a password recover instructions to your email.
        </Text>

        <TouchableOpacity onPress={openEmail} style={styles.openMailButton}>
          <Text style={styles.openMailButtonText}>Open email app</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(LOGIN);
          }}>
          <Text style={styles.skipText}>skip, i`ll confirm later</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerView}>
        <Text style={styles.checkSpamText}>
          Did not receive the email? Check your spam filter, or
          <Text
            onPress={() => {
              navigation.navigate(FORGOT);
            }}
            style={styles.tryEmailText}>
            {' '}
            try another email address
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default CheckYourEmail;
