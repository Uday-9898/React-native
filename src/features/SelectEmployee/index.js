import React, {useState, useEffect, Fragment, useContext} from 'react';
import {TouchableOpacity, Text, View, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import {GlobalContext} from '../../../utils/context/GlobalContext';
import {HOME} from '../../utils/constants/routes';
import {styles} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { PURPLE } from '../../assets/Colors';
import { getChoices, getChoicesEmployee } from '../../utils/api/CoreApi';
import {
    USER_ID,
  } from '../../utils/constants/storageKeys';
  import {TokenContext} from '../../utils/context/TokenContext';

const SelectEmployeeForAdmin = () => {
  const navigation = useNavigation();
  //const [, setStateGlobal] = useContext(GlobalContext);
  const [values, setValues] = useState('');
  const [employeeArray, setEmployeeArray] = useState([]);
  const [errors, setErrors] = useState({
    password: false,
    confirm_password: false,
    old_password: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [, setState] = useContext(TokenContext);

  const EnterHome= async ()=>{
        //const userID = await AsyncStorage.getItem(USER_ID);
        await AsyncStorage.setItem(
            USER_ID,
            values ? values : '',
          );
        setState(state => ({...state, employeeUserId: values}));
        navigation.navigate(HOME);
  }

  useEffect(()=>{ 
      const loadUser= async()=>{
       const userID = await AsyncStorage.getItem(USER_ID);
            setValues(userID || '')
            loadChoices();
      }
      loadUser();
  },[])

  const loadChoices = async () => {
    try {
      const choices = await getChoicesEmployee();
      if (choices && choices.employee_listing) {
        choices.employee_listing.map(item => {
          item.label = item.full_name;
          item.value = item.id;
        });
        choices.employee_listing.unshift({ value: '', label: 'Default' , id: ''})
        setEmployeeArray(choices.employee_listing);
      }
    } catch (error) { }
  };


  handleChange= async (item)=>{
    setValues(item.id);
    
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.viewTitle}>Select Employee</Text>
      <View style={styles.dropdownContainer, {...(Platform.OS !== 'android' && {
            zIndex: 1000
        })}}>
            <DropDownPicker
              disabled={false}
              items={employeeArray}
              defaultValue={
                employeeArray.length >= 1 ? values : ''
              }
              arrowColor={PURPLE}
              arrowSize={20}
              style={styles.containerColorStyle}
              onChangeItem={item =>
                handleChange(item)
              }
            />
          </View>

          {/* {errorMessage ? (
        <View style={styles.viewError}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        <Fragment />
      )} */}

      <TouchableOpacity style={styles.resetButton} onPress={EnterHome}>
        <Text style={styles.resetButtonText}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectEmployeeForAdmin;
