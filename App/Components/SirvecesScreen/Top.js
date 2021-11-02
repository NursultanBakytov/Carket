import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import styles from '../../styles';
import HeaderComponent from '../HeaderComponent';
import ShadowButton from '../ShadowButton';
import ServiceComp from './ServiceComp';

const Top = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);

  const [price, setPrice] = useState();
  const [choosed, setChoosed] = useState('3 день');
  const [ChoosedBalance, setChoosedBalance] = useState('200 ед');

  const graphicksData = [
    {firstText: '1 день', thirdText: '200 ед.'},
    {firstText: '3 день', secondText: '600', thirdText: '500 ед.'},
    {firstText: '5 день', secondText: '1000', thirdText: '750 ед.'},
    {firstText: '7 день', secondText: '1400', thirdText: '1000 ед.'},
    {firstText: '14 день', secondText: '2800', thirdText: '1800 ед.'},
    {firstText: '30 день', secondText: '6000', thirdText: '3200 ед.'},
  ];

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
        <HeaderComponent arrow={true} title="в ТОР" navigation={navigation} />
        <View style={styles.ph20}>
          <Text style={{marginTop: 20, fontSize: 16, fontWeight: '900'}}>
            В ТОР
          </Text>
          <Text
            style={{
              color: '#3C3C3C',
              fontSize: 12,
              marginTop: 15,
              lineHeight: 21,
            }}>
            {`•   ваше объявление будет размещено в TOP блоке выше всех бесплатных объявлений (после VIP);
•   просмотры объявления и звонки увеличиваются в 5 раз;
•   продажа совершается гораздо быстрее.`}
          </Text>
          <View
            style={{
              backgroundColor: '#D9D9D9',
              height: 1,
              marginTop: 20,
              marginBottom: 30,
            }}
          />
          {/* ••••------------------------ */}
          <Text style={{fontSize: 16, marginBottom: 30}}>
            Выберите период действий услуги
          </Text>
          {graphicksData.map((item, key) => (
            <View
              key={key}
              style={{
                borderBottomColor: '#D9D9D9',
                borderBottomWidth: key === 5 ? 0 : 1,
                paddingBottom: 5,
                paddingTop: 15,
              }}>
              <ServiceComp
                press={() => {
                  setChoosed(item.firstText),
                    setChoosedBalance(item.thirdText.toUpperCase());
                }}
                state={choosed === item.firstText ? true : false}
                firstText={item.firstText}
                secondText={item.secondText}
                thirdText={item.thirdText}
                ml={key === 0 ? 151 : 232}
              />
            </View>
          ))}
          {/* ------------ Start Balance ------------ */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 54,
            }}>
            <Text style={{fontSize: 16}}>Текущий баланс</Text>
            <Text
              style={{
                color: '#EA4F3D',
                fontSize: 16,
              }}>{`${state.user.balance} ед`}</Text>
          </View>
          {price > state.user.balance && (
            <Text style={{color: '#FF5C5C', marginVertical: 15}}>
              Недостаточно средств на балансе
            </Text>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('Balance')}
            style={[styles.fdRow, {justifyContent: 'space-between'}]}>
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
          <View style={{marginVertical: 40}} />
          <ShadowButton
            width="90%"
            text={`Оплатить ${ChoosedBalance}`}
            Press={() => {
              console.log(ChoosedBalance);
            }}
          />
          <View style={{marginVertical: 40}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Top;

// import React from 'react';
// import {SafeAreaView, ScrollView, StatusBar, View, Text} from 'react-native';
// import styles from '../../styles';

// import HeaderComponent from '../HeaderComponent';

// const Top = ({navigation}) => {
//   return (
//     <SafeAreaView>
//       <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <HeaderComponent arrow={true} title="в ТОР" navigation={navigation} />
//         <View style={styles.ph20}></View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Top;
