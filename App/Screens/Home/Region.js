import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  BackHandler,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import ShadowButton from '../../Components/ShadowButton';
import CheckboxComponent from '../../Components/CheckboxComponent';
import GoBack from '../../Components/GoBack';
import {load} from '../../Components/Loader';
import {getRegions, getRegionsTowns} from '../../api';
import {setData} from '../../Store';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ripple from 'react-native-material-ripple';

const Region = ({navigation, route}) => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const [Region, setRegion] = useState({id: ''});
  const [City, setCity] = useState(
    Boolean(state.townForFilter) ? state.townForFilter : {alias: ''},
  );
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
    // Получение всех Областей
    if (!Boolean(state.regions)) {
      dispatch(getRegions());
    }
    if (!Boolean(Region.id) && Boolean(state.regionForFilter)) {
      setRegion(state.regionForFilter);
    }
    if (!Boolean(City.alias) && Boolean(state.townForFilter)) {
      setCity(state.townForFilter);
    }
  }, []);
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const selectRegion = region => {
    if (!Boolean(state.towns[region.id])) {
      dispatch(getRegionsTowns({region_id: region.id}));
    }
    dispatch(setData({regionForFilter: region}));
    setRegion(region);
    setCity({alias: ''});
    dispatch(setData({townForFilter: ''}));
  };
  const selectTown = town => {
    setCity(town);
    dispatch(setData({townForFilter: town}));
    backAction();
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={{marginLeft: 3}}>
        <GoBack
          navigation={() => {
            backAction();
          }}
        />
      </View>
      <ScrollView>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            marginVertical: 32,
            marginLeft: 20,
          }}>
          Регионы
        </Text>
        {Boolean(state.regions)
          ? state.regions.map((region, index, arr) => (
              <View
                style={{
                  borderBottomColor: '#F2F2F2',
                  borderBottomWidth: arr.length === index + 1 ? 0 : 1,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}
                key={region.name}>
                <Ripple onPressIn={() => selectRegion(region)}>
                  <CheckboxComponent
                    isChecked={region.id === Region.id}
                    text={region.name}
                  />
                </Ripple>
                {region.id === Region.id
                  ? Boolean(state.towns[Region.id])
                    ? state.towns[Region.id].data.map(town => (
                        <Ripple
                          onPress={() => selectTown(town)}
                          style={{
                            paddingLeft: 20,
                          }}
                          key={town.alias + region.name}>
                          <CheckboxComponent
                            textStyle={{fontSize: 14, color: 'black'}}
                            isChecked={town.alias === City.alias}
                            text={town.name}
                          />
                        </Ripple>
                      ))
                    : load
                  : null}
              </View>
            ))
          : load}
        <View style={{marginVertical: 50}} />
      </ScrollView>
      <ShadowButton
        width="80%"
        text={`Показать объявления`}
        Press={() => backAction()}
        fixed
      />
    </SafeAreaView>
  );
};

export default Region;
