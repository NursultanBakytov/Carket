import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import CheckboxComponent from '../../Components/CheckboxComponent';
import GoBack from '../../Components/GoBack';
import {load} from '../../Components/Loader';
import ShadowButton from '../../Components/ShadowButton';
import {getBrands, getBrandModels} from '../../api';
import {setData} from '../../Store';
import Ripple from 'react-native-material-ripple';

const MarksModel = ({navigation}) => {
  const scrollView = React.useRef();
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const [Marka, setMarka] = useState(
    Boolean(state.brandForFilter) ? state.brandForFilter : {alias: ''},
  );
  const [Model, setModel] = useState(
    Boolean(state.modelForFilter) ? state.modelForFilter : {alias: ''},
  );
  const [Search, setSearch] = React.useState('');
  const [brands, setBrands] = React.useState('');

  React.useEffect(() => {
    if (Boolean(state.brands) && !Boolean(brands)) {
      setBrands(state.brands);
    }
  }, [state, brands]);
  React.useEffect(() => {
    if (!Boolean(state.brands) && !Boolean(brands)) {
      dispatch(getBrands());
    }
    if (!Boolean(Marka.alias) && Boolean(state.brandForFilter)) {
      setMarka(state.brandForFilter);
    }
    if (!Boolean(Model.alias) && Boolean(state.modelForFilter)) {
      setModel(state.modelForFilter);
    }
  });

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
  const setBrand = (brand, index) => {
    // Получение Моделей бренда
    if (!Boolean(state.models[brand.alias])) {
      dispatch(getBrandModels({brand: brand.alias}));
    }
    setMarka(brand);
    dispatch(setData({brandForFilter: brand}));
    scrollView.current.scrollTo({
      y: index === 0 ? 0 : 50 * index + 150,
    });
  };
  const selectModel = model => {
    setModel(model);
    dispatch(setData({modelForFilter: model}));
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={{marginLeft: 3}}>
        <GoBack navigation={() => navigation.goBack()} />
      </View>
      <ScrollView ref={scrollView}>
        <View style={{paddingHorizontal: 20, marginBottom: 10}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              marginVertical: 20,
            }}>
            Марка и Модель
          </Text>
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
        </View>
        {brands ? (
          brands.map((brand, index, arr) => (
            <View
              style={{
                borderBottomColor: '#F2F2F2',
                borderBottomWidth: arr.length === index + 1 ? 0 : 1,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
              key={brand.name}>
              <Ripple onPressIn={() => setBrand(brand, index)}>
                <CheckboxComponent
                  isChecked={brand.alias === Marka.alias}
                  text={brand.name}
                  onClick={() => setBrand(brand, index)}
                />
              </Ripple>
              {brand.alias === Marka.alias
                ? Boolean(state.models[Marka.alias])
                  ? state.models[Marka.alias].data.map(model => (
                      <Ripple
                        onPress={() => selectModel(model)}
                        style={{
                          paddingLeft: 20,
                        }}
                        key={model.alias + brand.name}>
                        <CheckboxComponent
                          textStyle={{fontSize: 14, color: 'black'}}
                          isChecked={model.alias === Model.alias}
                          text={model.name}
                          onClick={() => selectModel(model)}
                        />
                      </Ripple>
                    ))
                  : load
                : null}
            </View>
          ))
        ) : (
          <View style={{marginTop: 20}}>{load}</View>
        )}
      </ScrollView>
      <ShadowButton
        width="80%"
        text="Показать объявления"
        Press={() => navigation.navigate('Search', {isSparePart: true})}
        fixed
      />
    </SafeAreaView>
  );
};

export default MarksModel;
