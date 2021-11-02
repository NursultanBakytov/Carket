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
} from 'react-native';
import {Slider} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';

import styles from '../../styles';
import HeaderComponent from '../HeaderComponent';
import ShadowButton from '../ShadowButton';

const Quickly = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const [LineSlider, setLineSlider] = useState(1);

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

  let Clock = [{clock: ''}];
  for (let i = 0; i < 25; i++) {
    Clock.push({clock: i});
  }
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
        <HeaderComponent
          arrow={true}
          title="Метка срочно"
          navigation={navigation}
        />
        <View style={styles.ph20}>
          <Text style={{marginTop: 20, fontSize: 16, fontWeight: '900'}}>
            Метка срочно
          </Text>
          <Text
            style={{
              color: '#3C3C3C',
              fontSize: 12,
              marginTop: 15,
              lineHeight: 21,
            }}>
            Ваше объявление украсит метка со словом "Срочно". Пользователи
            увидят ваше объявление в разделе "Срочно".
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
          {price > state.user.user_data.balance && (
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
          <View style={{marginVertical: 70}} />
          <ShadowButton
            width="90%"
            text={`Оплатить ${40 * LineSlider} ЕД`}
            Press={() => {
              console.log('ChoosedBalance');
            }}
          />
          <View style={{marginVertical: 40}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Quickly;
// import React from 'react';
// import {SafeAreaView, ScrollView, StatusBar, View, Text} from 'react-native';
// import styles from '../../styles';

// import HeaderComponent from '../HeaderComponent';

// const Quickly = ({navigation}) => {
//   return (
//     <SafeAreaView>
//       <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <HeaderComponent
//           arrow={true}
//           title="Метка срочно"
//           navigation={navigation}
//         />
//         <View style={styles.ph20}></View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Quickly;
