import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';

import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';

const ElsomPay = ({navigation}) => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent
        arrow={true}
        title="Пополнение через Элсом"
        navigation={navigation}
      />
      {/* ----- Start Body ----- */}
      <ScrollView>
        <View style={[styles.ph20, {alignItems: 'center'}]}>
          {/* ----- Icon ----- */}
          <TouchableOpacity style={styless.visaBlock}>
            <Image
              resizeMode="contain"
              style={{width: 58, height: 58}}
              source={require('../../assets/elsom.png')}
            />
          </TouchableOpacity>
          {/* -----  ----- */}
          <Text style={{fontSize: 16, width: '100%'}}>
            {`Пополнить лицевой счет Вы сможее с\nпомощью электронного кошелька Элсом.\n\nДля этого вам необходимо:\n\n1. Выбрать раздел услуги\n2. Далее “Реклама”\n3. В появившемся окне выбираете Carket.kg\n4. Вводите лицевой счет\n5. Производите оплату`}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              alignSelf: 'flex-start',
              marginTop: 12,
            }}>
            {'Ваш лицевой счет: 0702 752 658'}
          </Text>
          <View
            style={[
              styles.Line,
              {marginVertical: 40, backgroundColor: '#D9D9D9', width: '100%'},
            ]}
          />
          <Text style={{fontSize: 18, alignSelf: 'flex-start'}}>
            Пример оплаты
          </Text>
          <Swiper
            paginationStyle={{marginTop: 200}}
            dotStyle={{backgroundColor: '#C4C4C4', width: 4, height: 4}}
            activeDotStyle={{backgroundColor: '#EA4F3D', width: 4, height: 4}}
            style={{height: 650, marginTop: 23}}>
            <Image
              style={{width: 335, height: 598}}
              source={require('../../assets/elsomPayExample.png')}
            />
            <Image
              style={{width: 335, height: 598}}
              source={require('../../assets/elsomPayExample.png')}
            />
            <Image
              style={{width: 335, height: 598}}
              source={require('../../assets/elsomPayExample.png')}
            />
            <Image
              style={{width: 335, height: 598}}
              source={require('../../assets/elsomPayExample.png')}
            />
          </Swiper>
        </View>
        {/* -----  ----- */}

        <View style={{marginVertical: 50}} />
      </ScrollView>
      {/* ----- End Body ----- */}
    </SafeAreaView>
  );
};

export default ElsomPay;

const styless = StyleSheet.create({
  visaBlock: {
    width: 95,
    height: 95,
    borderRadius: 4,
    borderColor: '#C4C4C4',
    marginVertical: 40,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 10,
    alignItems: 'center',
  },
});
