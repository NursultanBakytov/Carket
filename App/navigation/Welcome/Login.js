import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Toast from 'react-native-toast-message';
import TextInputMask from 'react-native-text-input-mask';

import styles from '../../styles';
import {ToastShow} from '../../Components/ToastShow';
import CustomInput from '../../Components/CustomInput';
import ShadowButton from '../../Components/ShadowButton';
import {useDispatch} from 'react-redux';
import {login} from '../../api';

const Login = ({navigation, route}) => {
  const dispatch = useDispatch();
  // -------------------------------------------------------------
  const [Phone, setPhone] = useState({
    formatted: '+996 (709) 683 738',
    extracted: '709683738',
  });
  const [Password, setPassword] = useState('albina2112');

  const [PhoneFocused, setPhoneFocused] = useState(false);
  const [PasswordFocused, setPasswordFocused] = useState(false);
  // -------------------------------------------------------------
  const [isLoading, setLoading] = useState(false);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);
  // -------------------------------------------------------------
  const loginHandler = () => {
    if (Phone === '') {
      ToastShow('Введите номер телефона!', 2000);
    } else if (Password === '') {
      ToastShow('Введите пароль!', 2000);
    } else {
      setLoading(true);
      dispatch(
        login({phone: '0' + Phone.extracted, password: Password}, () => {
          setLoading(false);
          if (Boolean(goBack)) {
            navigation.goBack();
          }
        }),
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
        <View style={[styles.LoginInputBlock, {width: '90%'}]}>
          {Boolean(PhoneFocused) && (
            <Text style={{color: '#9C9C9C', fontSize: 10}}>Телефон</Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextInputMask
              value={Phone.formatted}
              onChangeText={(formatted, extracted) => {
                setPhone({formatted, extracted}); // +1 (123) 456-78-90
              }}
              keyboardType="number-pad"
              mask={'+996 ([000]) [000] [000]'}
              onFocus={() => {
                setPhoneFocused(!PhoneFocused);
              }}
              onBlur={() => {
                setPhoneFocused(!PhoneFocused);
              }}
              placeholder="706 669 951"
              placeholderTextColor="#9C9C9C"
              style={{
                marginBottom: PhoneFocused ? 20 : 0,
                color: 'black',
                paddingLeft: -5,
                width: '95%',
                paddingVertical: 0,
                // backgroundColor: 'red',
              }}
            />
          </View>
        </View>

        <CustomInput
          value={Password}
          Title="Пароль"
          Placeholder="Введите пароль"
          setValueFocused={setPasswordFocused}
          ValueFocused={PasswordFocused}
          onChange={setPassword}
          security={true}
        />
        {/* --- End Inputs --- */}
        {/* --- Send Button --- */}
        <View style={{marginVertical: 15}} />
        <ShadowButton text="ВОЙТИ" Press={loginHandler} isLoading={isLoading} />
        {/* ------------------- */}
        <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
          <Text style={styles.LoginRecover}>Не могу войти</Text>
        </TouchableOpacity>
        {/* ------------------- */}
        <Text style={{alignSelf: 'center', marginTop: 35, color: '#8A8A8A'}}>
          У вас нету профиля?
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={{marginBottom: 40}}>
          <Text style={styles.LoginRegistrText}>Регистрация</Text>
        </TouchableOpacity>
        {/* ------------------- */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
