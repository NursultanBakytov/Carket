import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';

import {restoreUserPassword} from '../../api';
import styles from '../../styles';
import {ToastShow} from '../../Components/ToastShow';
import ShadowButton from '../../Components/ShadowButton';
import {useDispatch} from 'react-redux';
import TextInputMask from 'react-native-text-input-mask';

const Recover = props => {
  const dispatch = useDispatch();
  // -------------------------------------------------------------
  const [Phone, setPhone] = useState({
    formatted: '',
    extracted: '',
  });
  const [PhoneFocused, setPhoneFocused] = useState(false);
  const [isLoading, setLoading] = useState(false);
  // -------------------------------------------------------------
  const SendData = () => {
    if (Phone === '') {
      ToastShow('Введите номер телефона!', 2000);
    } else {
      setLoading(true);
      dispatch(
        restoreUserPassword({phone: '0' + Phone.extracted}, () =>
          setLoading(false),
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
        <Text style={styles.RecoverText}>Восстановить пароль</Text>
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

        {/* --- End Inputs --- */}
        {/* --- Send Button --- */}
        <View style={{marginVertical: 15}} />
        <ShadowButton
          text="Отправить новый пароль"
          Press={SendData}
          isLoading={isLoading}
        />
        {/* ------------------- */}
        <Text style={{alignSelf: 'center', marginTop: 35, color: '#8A8A8A'}}>
          У вас уже есть профиль?
        </Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.LoginRegistrText}>Войти</Text>
        </TouchableOpacity>
        {/* ------------------- */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Recover;
