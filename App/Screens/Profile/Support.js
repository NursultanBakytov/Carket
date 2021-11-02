import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';

import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';

const Support = ({navigation}) => {
  const Items = [
    {
      text: 'Напишите нам',
      navigation: () => navigation.navigate('WriteToUs'),
    },
    {
      text: 'Рекламодателям',
      navigation: () => navigation.navigate('CreateBusinessProfile'),
    },
    {
      text: 'Оцените приложение',
      navigation: () =>
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.carket.carket',
        ),
    },
    {
      text: 'О приложении',
      navigation: () => navigation.navigate('About'),
    },
    {
      text: 'Баланс',
      navigation: () => navigation.navigate('Balance'),
    },
  ];
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent arrow={true} title="Помощь" navigation={navigation} />
      <ScrollView style={{marginBottom: 60}}>
        <View style={[styles.ph20, {marginTop: 40}]}>
          {Items.map((item, key) => (
            <TouchableOpacity
              onPress={item.navigation}
              key={key}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 34,
              }}>
              <Text style={{fontSize: 18}}>{item.text}</Text>
              <Image
                style={{width: 24, height: 24, transform: [{rotate: '180deg'}]}}
                source={require('../../assets/arrowLeft.png')}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Support;
