import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';

import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';

const Balance = ({navigation}) => {
  const {user} = useSelector(store => store.appReducer);

  function HorScroll({text, data}) {
    return (
      <ScrollView
        horizontal
        contentContainerStyle={{
          width: Dimensions.get('window').width - 40,
          flexWrap: 'wrap',
        }}>
        <Text style={{marginTop: 62, width: '100%', fontSize: 18}}>{text}</Text>
        {data.map((item, key) => (
          <TouchableOpacity
            onPress={item.nav}
            key={key}
            style={styless.visaBlock}>
            <Image
              resizeMode="contain"
              style={{width: 58, height: 58}}
              source={item.img}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const replenishWays = [
    {img: require('../../assets/pay24.png'), nav: () => {}},
    {
      img: require('../../assets/Visa.png'),
      nav: () => navigation.navigate('VisaPay'),
    },
    {
      img: require('../../assets/Netex.png'),
      nav: () => navigation.navigate('NetexKassa'),
    },
  ];
  //  {
  //     img: require('../../assets/elsom.png'),
  //     nav: () => navigation.navigate('ElsomPay'),
  //   },
  // const OnlineWallets = [
  //   {
  //     img: require('../../assets/elsom.png'),
  //     nav: () => navigation.navigate('ElsomPay'),
  //   },
  //   {img: require('../../assets/odengi.png')},
  //   {img: require('../../assets/balance.png')},
  // ];
  // const Terminal = [
  //   {img: require('../../assets/pay24.png')},
  //   {img: require('../../assets/optima.png')},
  //   {img: require('../../assets/o.png')},
  //   {img: require('../../assets/umai.png')},
  // ];
  // const Banking = [
  //   {img: require('../../assets/mbank.png')},
  //   {img: require('../../assets/optima24.png')},
  //   {img: require('../../assets/demir.png')},
  // ];
  return (
    <SafeAreaView>
      <HeaderComponent arrow={true} title="Баланс" navigation={navigation} />
      <ScrollView style={{marginBottom: 60}}>
        {/* ---------- Balance Container Start ---------- */}
        <View style={styles.ProfileBalance}>
          <View>
            <Text style={{fontSize: 10}}>Текущий баланс</Text>
            <Text style={{fontSize: 20, fontWeight: '500'}}>
              {user.user_data.balance}
            </Text>
          </View>
          <View style={[{alignSelf: 'center'}]}>
            <Text style={{color: 'rgba(52,50,50,0.8)', fontSize: 12}}>
              Лицевой счет
            </Text>
            <Text style={{color: '#000', marginTop: 5}}>
              {user.user_data.login}
            </Text>
          </View>
        </View>
        {/* ---------- Balance Container End ---------- */}
        <View style={styles.ph20}>
          <TouchableOpacity
            onPress={() => navigation.navigate('HistoryPay')}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 34,
            }}>
            <Text style={{fontSize: 18}}>История платежей</Text>
            <Image
              style={{width: 24, height: 24, transform: [{rotate: '180deg'}]}}
              source={require('../../assets/arrowLeft.png')}
            />
          </TouchableOpacity>

          <HorScroll text="Выберите способ оплаты:" data={replenishWays} />
        </View>
        <View style={{marginVertical: 25}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Balance;

const styless = StyleSheet.create({
  visaBlock: {
    width: 95,
    height: 95,
    borderRadius: 4,
    borderColor: '#C4C4C4',
    marginTop: 20,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 10,
    alignItems: 'center',
  },
});
