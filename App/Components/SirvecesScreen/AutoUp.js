import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {Slider} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

import styles from '../../styles';
import HeaderComponent from '../HeaderComponent';
import ShadowButton from '../ShadowButton';
import {addAutoUp} from '../../api';
import {ToastShow} from '../ToastShow';

const AutoUp = ({navigation, route}) => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const {alias} = route.params;

  const [LineSlider, setLineSlider] = useState(1);
  const [date, setDate] = useState(new Date(new Date().setHours(0, 0)));
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const Line = ({top, bottom}) => (
    <View
      style={{
        backgroundColor: '#D9D9D9',
        height: 1,
        marginTop: top || 30,
        marginBottom: bottom || 20,
      }}
    />
  );

  return (
    <SafeAreaView>
      <Toast style={{zIndex: 1}} ref={ref => Toast.setRef(ref)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
        <HeaderComponent arrow={true} title="Авто Up" navigation={navigation} />
        <View style={styles.ph20}>
          <Text style={{marginTop: 20, fontSize: 16, fontWeight: '900'}}>
            Автоподнятие
          </Text>
          <Text
            style={{
              color: '#3C3C3C',
              fontSize: 12,
              marginTop: 15,
              lineHeight: 21,
            }}>
            Объявление будет автоматически подниматься вверх в заданное время
            дня.
          </Text>
          <Line />
          <View style={[styles.fdRow, {justifyContent: 'space-between'}]}>
            <Text style={styles.fsz16}>Стоимость услуги</Text>
            <Text style={styles.fsz16}>40 ед/день</Text>
          </View>
          <Line top={20} bottom={15} />
          <View
            style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
            <View
              style={[
                styles.fdRow,
                {justifyContent: 'space-between', marginBottom: 10},
              ]}>
              <Text style={styles.fsz16}>Количество недель</Text>
              <Text style={styles.fsz16}>{LineSlider}</Text>
            </View>
            <Slider
              value={LineSlider}
              maximumValue={4}
              minimumValue={1}
              step={1}
              trackStyle={{height: 3, backgroundColor: '#EA4F3D'}}
              thumbStyle={{
                height: 25,
                width: 25,
                backgroundColor: 'rgba(0,0,0,0.1)',
              }}
              minimumTrackTintColor="#EA4F3D"
              onValueChange={setLineSlider}
              thumbProps={{
                Component: Animated.Image,
                source: require('../../assets/Slider.png'),
                height: 3,
              }}
            />
          </View>
          <Line top={10} />
          <View
            style={[
              styles.fdRow,
              {justifyContent: 'space-between', marginBottom: 10},
            ]}>
            <Text style={styles.fsz16}>Время поднятия объявления</Text>
            <Text style={styles.fsz16}>
              {date.getHours()}:{date.getMinutes()}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#E7E7E7',
              width: 152,
              height: 40,
              borderRadius: 7,
              alignSelf: 'center',
              justifyContent: 'center',
              marginVertical: 20,
            }}
            onPress={() => setShow(true)}>
            <Text style={{fontSize: 18, alignSelf: 'center'}}>
              {date.getHours()} : {date.getMinutes()}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onChange}
            />
          )}

          <Line top={10} bottom={5} />
          {/* ------------ Start Balance ------------ */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text style={{fontSize: 16}}>Текущий баланс</Text>
            <Text
              style={{
                color: '#EA4F3D',
                fontSize: 16,
              }}>{`${state.user.user_data.balance} ед`}</Text>
          </View>
          {40 * LineSlider > state.user.user_data.balance && (
            <Text style={{color: '#FF5C5C', marginTop: 15}}>
              Недостаточно средств на балансе
            </Text>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('Balance')}
            style={[
              styles.fdRow,
              {justifyContent: 'space-between', marginTop: 15},
            ]}>
            <View style={styles.fdRow}>
              <Image
                style={{width: 24, height: 24}}
                source={require('../../assets/VipReplenishIcon.png')}
              />
              <Text style={{color: '#EA4F3D', marginLeft: 8}}>
                Пополнить баланс
              </Text>
            </View>
            <Image
              style={{width: 24, height: 24}}
              source={require('../../assets/VipRedArrow.png')}
            />
          </TouchableOpacity>
          <View style={{marginVertical: 30}} />
          <ShadowButton
            width="90%"
            text={`Оплатить ${40 * LineSlider} ЕД`}
            Press={() => {
              setLoading(true);
              dispatch(
                addAutoUp(
                  {
                    upped_at: `${date.getHours()} : ${date.getMinutes()}`,
                    weeks: LineSlider,
                    alias,
                  },
                  res => {
                    setLoading(false);
                    if (res) {
                      ToastShow(res.message, 2000, 'success');
                    }
                  },
                ),
              );
            }}
            isLoading={isLoading}
          />
          <View style={{marginVertical: 40}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AutoUp;
