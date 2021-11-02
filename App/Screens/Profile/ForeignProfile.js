import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import FavoritesComponent from '../../Components/FavoritesComponent';
import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';

const ForeignProfile = ({navigation}) => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent arrow={true} title="Профиль" navigation={navigation} />
      <ScrollView>
        {/* --- Start Header --- */}
        <View
          style={[
            styles.HeaderProfileBlock,
            {marginHorizontal: 20, marginTop: 30},
          ]}>
          <View style={styles.ProfileHeaderAva}>
            <Image
              style={{width: 65, height: 65}}
              source={require('../../assets/Ava.png')}
            />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{fontSize: 18}}>Азим Дженалиев</Text>
            <Text style={{fontSize: 12, marginTop: 10, color: '#636363'}}>
              3 объявления пользователя
            </Text>
          </View>
        </View>
        {/* --- End Header --- */}
        <Text style={{fontSize: 18, marginHorizontal: 20, marginTop: 30}}>
          Объявления
        </Text>
        {/* ----- Start Body ----- */}
        {/* <View style={[styles.ph20, {marginTop: 26}]}>
          <FavoritesComponent
            navigation={navigation}
            imgStyle={{marginHorizontal: -20}}
            title="Nissan X-Trail III Рестайлинг, 2016"
            data={SimpleIMG}
            usd="3000$"
            KGS="254 400 сом"
            date="2 часа назад"
            navigation={navigation}
          />
        </View> */}
        {/* ----- End Body ----- */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForeignProfile;
