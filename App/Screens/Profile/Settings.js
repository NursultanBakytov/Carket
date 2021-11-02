import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {changeUserPassword} from '../../api';

import CustomInput from '../../Components/CustomInput';
import HeaderComponent from '../../Components/HeaderComponent';
import ImagePicker from '../../Components/native/ImagePicker';
import ShadowButton from '../../Components/ShadowButton';
import {ToastShow} from '../../Components/ToastShow';

export const SwitchComp = ({onPress, onTrue}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: 33,
      height: 22,
      borderRadius: 32,
      backgroundColor: '#DBDBDB',
      padding: 2,
    }}>
    <View
      style={{
        backgroundColor: onTrue ? '#EA4F3D' : '#676767',
        borderRadius: 50,
        width: 18,
        alignSelf: onTrue ? 'flex-start' : 'flex-end',
        height: 18,
      }}
    />
  </TouchableOpacity>
);

const Settings = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(store => store.appReducer);
  const [isLoading, setLoading] = useState(false);

  const [Name, setName] = useState('');
  const [NameFocused, setNameFocused] = useState(false);
  // ------------------------------------
  const [Phone, setPhone] = useState('');
  const [PhoneFocused, setPhoneFocused] = useState(false);
  // ------------------------------------
  const [Email, setEmail] = useState('');
  const [EmailFocused, setEmailFocused] = useState(false);
  // ------------------------------------
  const [NewPass, setNewPass] = useState('');
  const [NewPassFocused, setNewPassFocused] = useState(false);
  // ------------------------------------
  const [NewPassTwo, setNewPassTwo] = useState('');
  const [NewPassTwoFocused, setNewPassTwoFocused] = useState(false);
  // ------------------------------------

  React.useEffect(() => {
    if (Boolean(user)) {
      setName(user.user_data.name);
      setPhone(user.user_data.user_login);
      setEmail(user.user_data.email);
    }
  }, [user]);

  const submitHandler = () => {
    if (NewPass === '') {
      ToastShow('Введите пароль!', 2000, 'error');
    } else if (NewPassTwo !== NewPass) {
      ToastShow('Пароли не совпадают!', 2000, 'error');
    } else {
      setLoading(true);
      dispatch(
        changeUserPassword(
          {password: NewPass, password_confirm: NewPassTwo},
          json => {
            setLoading(false);
            if (json) {
              ToastShow(json.message, 2000, 'success');
            }
          },
        ),
      );
    }
  };
  return (
    <SafeAreaView>
      <Toast style={{zIndex: 1}} ref={ref => Toast.setRef(ref)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderComponent
          arrow={true}
          title="Настройки"
          navigation={navigation}
        />
        <ImagePicker disabled />
        {/* --- Start Inputs --- */}
        <CustomInput
          keyboardType="number-pad"
          value={Name}
          Placeholder="Личные данные"
          Title="Номер телефона"
          setValueFocused={setNameFocused}
          ValueFocused={NameFocused}
          onChange={setName}
          contextMenuHidden={true}
          editable={false}
          selectTextOnFocus={false}
        />
        {/* -------------------------- */}
        <CustomInput
          value={Phone}
          Title="Личные данные"
          Placeholder="Номер телефона"
          setValueFocused={setPhoneFocused}
          ValueFocused={PhoneFocused}
          onChange={setPhone}
          contextMenuHidden={true}
          editable={false}
          selectTextOnFocus={false}
        />
        {/* -------------------------- */}
        <CustomInput
          value={Email}
          Title="Личные данные"
          Placeholder="Email"
          setValueFocused={setEmailFocused}
          ValueFocused={EmailFocused}
          onChange={setEmail}
          contextMenuHidden={true}
          editable={false}
          selectTextOnFocus={false}
        />
        {/* --- End Inputs --- */}

        {/* ----------- START CHANGE PASSWORD ----------- */}
        <Text style={{marginHorizontal: 20, marginTop: 50, fontSize: 16}}>
          Сменить пароль от личного кабинета
        </Text>

        {/* -------------------------- */}
        <CustomInput
          value={NewPass}
          Title="Новый пароль"
          Placeholder="Введите новый пароль"
          setValueFocused={setNewPassFocused}
          ValueFocused={NewPassFocused}
          onChange={setNewPass}
          security={true}
        />
        {/* -------------------------- */}
        <CustomInput
          value={NewPassTwo}
          Title="Повторите пароль"
          Placeholder="Повторите новый пароль"
          setValueFocused={setNewPassTwoFocused}
          ValueFocused={NewPassTwoFocused}
          onChange={setNewPassTwo}
          security={true}
        />
        {/* -------------------------- */}
        <View style={{marginVertical: 25}} />
        <ShadowButton
          width="80%"
          text="ПОМЕНЯТЬ ПАРОЛЬ"
          Press={submitHandler}
          isLoading={isLoading}
        />
        <View style={{marginVertical: 25}} />

        {/* -----------  END  CHANGE PASSWORD ----------- */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
