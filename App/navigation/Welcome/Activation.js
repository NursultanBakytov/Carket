import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';

import {activateUser, resendActivationCode} from '../../api';
import styles from '../../styles';
import {ToastShow} from '../../Components/ToastShow';
import CustomInput from '../../Components/CustomInput';
import ShadowButton from '../../Components/ShadowButton';
import {useDispatch} from 'react-redux';

const UserActivation = props => {
  const dispatch = useDispatch();
  // -------------------------------------------------------------
  const [Code, setCode] = useState('');
  const [CodeFocused, setCodeFocused] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [timeleft, setTimeLeft] = useState(120);
  let minutes = Math.floor((timeleft % (60 * 60)) / 60);
  let seconds = Math.floor(timeleft % 60);

  React.useEffect(() => {
    const timer =
      timeleft > 0 && setInterval(() => setTimeLeft(timeleft - 1), 1000);
    return () => clearInterval(timer);
  }, [timeleft]);
  // -------------------------------------------------------------
  const SendData = () => {
    if (Code === '') {
      ToastShow('Введите код!', 2000);
    } else {
      setLoading(true);
      dispatch(
        activateUser({code: Code}, () => {
          setLoading(false);
          props.navigation.navigate('Login');
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
        <Text style={styles.RecoverText}>
          {
            'Для завершения регистрации,\nвведите СМС код отправленный\nна телефоон'
          }
        </Text>
        {/* --- Start Inputs --- */}

        <CustomInput
          value={Code}
          Title="СМС код"
          Placeholder="СМС код"
          setValueFocused={setCodeFocused}
          ValueFocused={CodeFocused}
          onChange={setCode}
        />

        {/* --- End Inputs --- */}
        {/* --- Send Button --- */}
        <View style={{marginVertical: 15}} />
        <ShadowButton
          text="ЗАВЕРШИТЬ РЕГИСТРАЦИЮ"
          Press={SendData}
          isLoading={isLoading}
        />
        {/* ------------------- */}
        <TouchableOpacity
          onPress={() => {
            if (timeleft === 0) {
              dispatch(resendActivationCode(() => setTimeLeft(120)));
            }
          }}>
          <Text style={[styles.LoginRecover, {marginTop: 40}]}>
            {timeleft === 0
              ? 'Повторно отправить СМС с кодом'
              : `${minutes < 10 ? '0' : ''}${minutes}:${
                  seconds < 10 ? '0' : ''
                }${seconds}`}
          </Text>
        </TouchableOpacity>
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

export default UserActivation;
