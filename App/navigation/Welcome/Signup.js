import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';

import styles from '../../styles';
import {ToastShow} from '../../Components/ToastShow';
import CustomInput from '../../Components/CustomInput';
import ShadowButton from '../../Components/ShadowButton';
import {useDispatch} from 'react-redux';
import {singUp} from '../../api';

const Signup = ({navigation}) => {
  const dispatch = useDispatch();
  // -------------------------------------------------------------
  const [Phone, setPhone] = useState('0501099029');
  const [PhoneFocused, setPhoneFocused] = useState(false);
  // ----------------------------------
  const [Name, setName] = useState('Osmon');
  const [NameFocused, setNameFocused] = useState(false);
  // ----------------------------------
  const [Password, setPassword] = useState('albina2112');
  const [PasswordFocused, setPasswordFocused] = useState(false);
  // ----------------------------------
  const [PasswordTwo, setPasswordTwo] = useState('albina2112');
  const [PasswordTwoFocused, setPasswordTwoFocused] = useState(false);
  // -------------------------------------------------------------
  const [isLoading, setLoading] = useState(false);
  // -------------------------------------------------------------
  const SendData = () => {
    if (Phone === '') {
      ToastShow('Введите номер телефона!', 2000, 'error');
    } else if (Password === '') {
      ToastShow('Введите пароль!', 2000, 'error');
    } else {
      setLoading(true);
      dispatch(
        singUp(
          {
            fullname: Name,
            password: Password,
            password_two: PasswordTwo,
            phone: Phone,
          },
          () => setLoading(false),
          () => navigation.navigate('Activation'),
        ),
      );
    }
  };
  // -------------------------------------------------------------

  return (
    <SafeAreaView style={styles.fl1}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Toast style={{zIndex: 1}} ref={ref => Toast.setRef(ref)} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        {/* <View style={styles.LoginIcon}>{IMAGE.LoginIcon}</View> */}
        <Image
          resizeMode="contain"
          style={styles.LoginIcon}
          source={require('../../assets/LoginIcon.png')}
        />
        {/* --- Start Inputs --- */}

        <CustomInput
          value={Phone}
          Title="Телефон"
          Placeholder="0706669951"
          setValueFocused={setPhoneFocused}
          ValueFocused={PhoneFocused}
          onChange={setPhone}
        />
        {/* ----- Name ----- */}
        <CustomInput
          value={Name}
          Title="ФИО"
          Placeholder="Фамилия Имя"
          setValueFocused={setNameFocused}
          ValueFocused={NameFocused}
          onChange={setName}
        />
        {/* ----- Password  ----- */}
        <CustomInput
          value={Password}
          Title="Пароль"
          Placeholder="Введите пароль"
          setValueFocused={setPasswordFocused}
          ValueFocused={PasswordFocused}
          security={true}
          onChange={setPassword}
        />
        {/* ----- Password Two ----- */}
        <CustomInput
          value={PasswordTwo}
          Title="Повторите пароль"
          Placeholder="Введите пароль повторно"
          setValueFocused={setPasswordTwoFocused}
          ValueFocused={PasswordTwoFocused}
          security={true}
          onChange={setPasswordTwo}
        />
        {/* --- End Inputs --- */}

        {/* --- Send Button --- */}
        <View style={{marginVertical: 15}} />
        <ShadowButton
          text="РЕГИСТРАЦИЯ"
          Press={SendData}
          isLoading={isLoading}
        />
        {/* ------------------- */}
        <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
          <Text style={styles.LoginRecover}>Не могу войти</Text>
        </TouchableOpacity>
        {/* ------------------- */}
        <Text style={{alignSelf: 'center', marginTop: 35, color: '#8A8A8A'}}>
          У вас уже есть профиль?
        </Text>
        <TouchableOpacity
          style={{marginBottom: 50, marginTop: 5}}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.LoginRegistrText}>Войти</Text>
        </TouchableOpacity>
        {/* ------------------- */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
