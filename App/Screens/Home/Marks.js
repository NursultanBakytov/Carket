import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  BackHandler,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import GoBack from '../../Components/GoBack';
import {getBrands} from '../../api';
import {load} from '../../Components/Loader';
import {setData} from '../../Store';

const Marks = ({navigation, route}) => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const [Search, setSearch] = React.useState('');
  const [brands, setBrands] = React.useState('');
  const {cleanBrandForFilter} = route.params;

  const backAction = () => {
    if (cleanBrandForFilter) {
      navigation.navigate('PartsSearch', {
        isSparePart: true,
        cleanBrandForFilter: false,
      });
    } else {
      navigation.goBack();
    }
    return true;
  };
  React.useEffect(() => {
    if (Boolean(state.brands) && !Boolean(brands)) {
      setBrands(state.brands);
    }
    if (!Boolean(state.brands) && !Boolean(brands)) {
      dispatch(getBrands());
    }
  }, [state, brands]);
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const searchFilter = text => {
    if (Boolean(brands)) {
      if (text) {
        setBrands(state =>
          state.filter(item => item.name.match(new RegExp(`^${text}`, 'gi'))),
        );
      } else {
        setBrands('');
      }
    }
    setSearch(text);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={{marginLeft: 5}}>
        <GoBack navigation={() => backAction()} />
      </View>
      <View style={{paddingHorizontal: 20}}>
        <Text style={{fontSize: 35, fontWeight: '500'}}>Марки</Text>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F4F6F8',
            alignItems: 'center',
            minHeight: 40,
            borderRadius: 10,
            paddingHorizontal: 14,
            marginTop: 15,
          }}>
          <Image
            style={{width: 14, height: 14}}
            source={require('../../assets/MinSearch.png')}
          />
          <TextInput
            value={Search}
            onChangeText={text => searchFilter(text)}
            placeholderTextColor="#9C9C9C"
            style={{marginLeft: 10, width: '90%'}}
            placeholder="Поиск марки"
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 140}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              marginTop: 25,
              marginBottom: 41,
            }}>
            Популярные
          </Text>
          {brands
            ? brands.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setData({brandForFilter: item}));
                    backAction();
                  }}
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 15,
                    borderBottomColor: '#c8c8c8',
                    borderBottomWidth: brands.length === index + 1 ? 0 : 1,
                  }}>
                  <Image
                    style={{width: 34, height: 25}}
                    source={{
                      uri: `https://carket.kg/assets/img/car-logo/${item.x_icon}`,
                    }}
                  />
                  <Text style={{fontSize: 18, marginLeft: 23}}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))
            : load}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Marks;
