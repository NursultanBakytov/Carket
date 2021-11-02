import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';

import HeaderComponent from '../../Components/HeaderComponent';
import CustomInput from '../../Components/CustomInput';
import ShadowButton from '../../Components/ShadowButton';
import {useDispatch} from 'react-redux';
import {setData} from '../../Store';
import Toast from 'react-native-toast-message';
import {ToastShow} from '../../Components/ToastShow';

const WriteToUs = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  // --------------------------------------------------
  const [Phone, setPhone] = useState('');
  const [PhoneFocused, setPhoneFocused] = useState(false);
  // --------------------------------------------------
  const [Message, setMessage] = useState('');
  const [MessageFocused, setMessageFocused] = useState(false);
  // --------------------------------------------------
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent
        arrow={true}
        title="Напишите нам"
        navigation={navigation}
      />
      <ScrollView style={{marginBottom: 60}}>
        <Toast style={{zIndex: 1000}} ref={ref => Toast.setRef(ref)} />
        <View style={{marginTop: 40, paddingHorizontal: 20}}>
          <Text style={{color: '#0d0d0d'}}>
            Если хотите получить ответ напишите свой номер
          </Text>
          <View style={{marginVertical: 15}} />
          <CustomInput
            WIDTH="100%"
            value={Phone}
            Title="Как с вами связаться"
            Placeholder="Как с вами связаться"
            setValueFocused={setPhoneFocused}
            ValueFocused={PhoneFocused}
            onChange={setPhone}
          />
          <CustomInput
            WIDTH="100%"
            value={Message}
            Title="Напишите Ваш отзыв"
            Placeholder="Напишите Ваш отзыв"
            setValueFocused={setMessageFocused}
            ValueFocused={MessageFocused}
            onChange={setMessage}
          />
          <View style={{marginVertical: 31.5}} />
          <ShadowButton
            width="100%"
            text="ОТПРАВИТЬ"
            Press={() => {
              if (Phone === '') {
                ToastShow('Введите контакты', 2000, 'success');
              } else {
                setLoading(true);
                setTimeout(() => {
                  ToastShow('Успешно отправлено', 2000, 'success'),
                    setPhone('');
                  setMessage('');
                  setLoading(false);
                }, 1000);
              }
            }}
            isLoading={isLoading}
          />
          <View style={{marginVertical: 27}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WriteToUs;
