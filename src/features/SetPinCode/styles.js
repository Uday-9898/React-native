import {StyleSheet, Platform} from 'react-native';
import {GRAY_100, GRAY_400} from '../../assets/Colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      section: {
        alignItems: 'center',
        margin: 16,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
      },
      errorText: {
        fontFamily: 'Eina02-SemiBold',
        fontSize: 16,
        color: 'red',
        marginTop: 10,
      },
});
