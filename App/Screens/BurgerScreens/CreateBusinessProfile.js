import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {useDispatch, useSelector} from 'react-redux';
import {getTariffPlans} from '../../api';

import HeaderComponent from '../../Components/HeaderComponent';
import ShadowButton from '../../Components/ShadowButton';
import {load} from '../../Components/Loader';

const CreateBusinessProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const {tariffPlans, user} = useSelector(store => store.appReducer);

  React.useEffect(() => {
    if (!Boolean(tariffPlans.allPlans)) {
      dispatch(getTariffPlans());
    }
  }, [tariffPlans]);

  function Body({text}) {
    return (
      <View style={{flexDirection: 'row', width: '85%', marginTop: 24}}>
        <Image
          style={{width: 18, height: 18, marginRight: 17}}
          source={require('../../assets/CheckIcon.png')}
        />
        <Text style={{width: '90%'}}>{text}</Text>
      </View>
    );
  }
  return (
    <SafeAreaView>
      <HeaderComponent
        arrow={true}
        title="Создать бизнес аккаунт"
        navigation={navigation}
      />
      <ScrollView style={{paddingVertical: 60}}>
        {Boolean(tariffPlans.allPlans)
          ? tariffPlans.allPlans.map((tariff, index, arr) => (
              <View key={tariff.id}>
                <Card elevation={5} style={styles.card}>
                  <Text style={[styles.text]}>{tariff.name}</Text>
                  <Text
                    style={[
                      styles.text,
                      {color: '#EA4F3D'},
                    ]}>{`${tariff.price} сом`}</Text>
                  <Text
                    style={[
                      styles.text,
                      {fontSize: 12},
                    ]}>{`за ${tariff.term} дней`}</Text>
                  {tariff.description.split('\r\n').map((text, index) => (
                    <Body text={text} key={index} />
                  ))}
                  <View style={{marginTop: 20}}>
                    <ShadowButton
                      width={170}
                      text="Подключить"
                      Press={() => {
                        if (!Boolean(user)) {
                          navigation.navigate('Login');
                        } else if (user.bussines) {
                          alert('У вас уже есть бизнес аккаунт!');
                        } else {
                          navigation.navigate('Business', {
                            bussines: false,
                            tariff,
                          });
                        }
                      }}
                    />
                  </View>
                </Card>
                <View
                  style={{marginVertical: arr.length === index + 1 ? 60 : 10}}
                />
              </View>
            ))
          : load}
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateBusinessProfile;

const styles = StyleSheet.create({
  text: {fontSize: 25, fontWeight: '500', color: '#3C3C3C', marginTop: 5},
  card: {
    width: '90%',
    marginBottom: 50,
    paddingTop: 34,
    minHeight: 550,
    paddingHorizontal: 10,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  twoHandred: {
    backgroundColor: '#55BB00',
    width: 124,
    height: 35,
    borderRadius: 26,
    justifyContent: 'center',
    marginTop: 35,
  },
});
