import React from 'react';
import {View, TextInput} from 'react-native';
import {styleConstructor} from './styles';

const InputLabel = props => {
  const styles = styleConstructor(props.disabled, props.error, props.shadow);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        underlineColorAndroid="transparent"
        {...props}
      />
      {props.icon}
    </View>
  );
};

export default InputLabel;
