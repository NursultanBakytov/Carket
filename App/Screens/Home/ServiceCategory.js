import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getServicesWithCategory} from '../../api';
import GoBack from '../../Components/GoBack';
import {load} from '../../Components/Loader';
import {setData} from '../../Store';

export default function ServiceCategory({navigation}) {
  const dispatch = useDispatch();
  const {servicesWithCategory} = useSelector(store => store.appReducer);

  React.useEffect(() => {
    if (!Boolean(servicesWithCategory)) {
      dispatch(getServicesWithCategory());
    }
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={{marginLeft: 5}}>
        <GoBack navigation={() => navigation.goBack()} />
      </View>
      <View style={{paddingHorizontal: 20}}>
        <Text style={{fontSize: 20, fontWeight: '500', marginBottom: 20}}>
          Выберите раздел
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 140}}>
          {servicesWithCategory
            ? servicesWithCategory.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setData({serviceForFilter: item}));
                    navigation.goBack();
                  }}
                  key={item.alias}
                  style={{
                    paddingVertical: 15,
                    borderBottomColor: '#c8c8c8',
                    borderBottomWidth:
                      servicesWithCategory.length === index + 1 ? 0 : 1,
                  }}>
                  <Text style={{fontSize: 18}}>{item.name}</Text>
                </TouchableOpacity>
              ))
            : load}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
