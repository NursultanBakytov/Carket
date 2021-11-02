import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';
const About = ({navigation}) => {
  return (
    <SafeAreaView>
      <HeaderComponent
        arrow={true}
        title="О программе"
        navigation={navigation}
      />
      <ScrollView style={styles.ph20}>
        <View style={{alignItems: 'center'}}>
          <Image
            style={{
              width: 182,
              height: 90,
              marginTop: 30,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={require('../../assets/LogoCarket.png')}
          />
          <Text style={{marginTop: 41, color: '#3B3B3B', marginBottom: 10}}>
            База объявлений от частных лиц и автосалонов насчитывает более 100
            000 предложений со всего Кыргызстана. Купить авто на Carket — легко!
            - Нужный вам автомобиль легко отыскать с помощью фильтров. Укажите
            интересующие параметры, например, модель, год выпуска и объем
            двигателя – приложение само подберет подходящие варианты. - Читайте
            отзывы других автовладельцев и делитесь своим опытом Продать машину
            — ещё проще! Размещайте объявления о продаже вашего авто прямо с
            телефона. Рассказывайте о характеристиках вашего авто или мото.
            Дополняйте описание фотографиями.
          </Text>
          <Text style={{color: '#3B3B3B', marginVertical: 5}}>
            Версия 1.9.2.1
          </Text>
          <Text style={{color: '#3B3B3B'}}>Сборка 2.1.7.3</Text>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://odigital.app')}>
            <Image
              style={{
                width: 98,
                height: 32,
                marginTop: 79,
                marginBottom: 15,
              }}
              source={require('../../assets/odigital.png')}
            />
          </TouchableOpacity>
          <Text style={{color: '#3B3B3B'}}>
            Разработано компанией Oracle Digital
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
