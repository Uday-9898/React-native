import {StyleSheet} from 'react-native';
import {
  VERY_LIGHT_GRAY,
  LIGHT_GRAY,
  GRAY_100,
  ERR_COLOR,
  GRAY_800,
  GRAY_200,
} from '../../../assets/Colors';

export const styleConstructor = (disabled, _error, shadow, backgroundColor) => {
  const assignBorder = () => {
    if (!_error && disabled) {
      return GRAY_100;
    } else if (!_error && !disabled) {
      return VERY_LIGHT_GRAY;
    } else if (_error && (disabled || !disabled)) {
      return ERR_COLOR;
    }
  };

  let style = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 5,
      borderColor: assignBorder(),
      borderStyle: 'solid',
      borderWidth: 1,
      backgroundColor: backgroundColor ? backgroundColor : LIGHT_GRAY,
      ...addShadow(shadow, _error),
    },
    inputStyle: {
      width: '100%',
      flex: 1,
      height: 45,
      color: GRAY_800,
    },
  };

  return StyleSheet.create(style);
};

function addShadow(shadow, _error) {
  if (shadow && !_error) {
    return {
      shadowColor: GRAY_200,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 5,
    };
  } else {
    return {};
  }
}
