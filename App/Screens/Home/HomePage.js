import React, {PureComponent, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {Card} from 'react-native-shadow-cards';

import styles from '../../styles';
import IMAGE from '../../assets/SVG';
import Filter from '../../Components/Filter';
import HomeAds from './HomeAds';
import {setData} from '../../Store';
import {
  appAxios,
  getFavorites,
  getUserCars,
  getUserData,
  getUserServices,
  getUserSpareParts,
} from '../../api';

const HomePage = ({navigation, scrollToTop, setScrollState}) => {
  const dispatch = useDispatch();
  const {country} = useSelector(store => store.appReducer);
  const [Item, setItem] = useState(0);
  let getID = {
    kg: 0,
    ru: 2,
    kz: 3,
  };

  React.useEffect(() => {
    async function checkStorageToken() {
      let carketToken = await AsyncStorage.getItem('carketToken');
      if (carketToken) {
        appAxios.defaults.headers['X-API-KEY'] = `Basic ${carketToken}`;
        dispatch(getUserData());
        dispatch(getFavorites());
        dispatch(getUserCars({page: '0'}));
        dispatch(getUserSpareParts({page: '0'}));
        dispatch(getUserServices({page: '0'}));
        dispatch(setData({token: carketToken}));
      }
    }
    checkStorageToken();
    // запрашиваем разрешение на запись внешнему хранилищу
    const checkAndroidPermission = async () => {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
    };
    checkAndroidPermission();
  }, []);
  React.useEffect(() => {
    if (Item !== getID[country]) {
      return country === 'ru' ? setItem(2) : setItem(3);
    }
  }, [country]);

  const Cars = [
    {
      img: 'https://m.carket.kg/assets/img/carcase/allroad.png',
      text: 'Внедорожник',
      alias: 'vnedorozhnik',
    },
    {
      img: 'https://m.carket.kg/assets/img/carcase/sedan.png',
      text: 'Седан',
      alias: 'sedan',
    },
    {
      img: 'https://m.carket.kg/assets/img/carcase/hatchback.png',
      text: 'Хэтчбек',
      alias: 'hetchbek',
    },
    {
      img: 'https://m.carket.kg/assets/img/carcase/liftback.png',
      text: 'Лифтбэк',
      alias: 'hetchbek',
    },
    {
      img: 'https://m.carket.kg/assets/img/carcase/wagon.png',
      text: 'Универсал',
      alias: 'universal',
    },
    {
      img: 'https://m.carket.kg/assets/img/carcase/minivan.png',
      text: 'Минивэн',
      alias: 'miniven',
    },
    {
      img: 'https://m.carket.kg/assets/img/carcase/coupe.png',
      text: 'Купе',
      alias: 'kupe',
    },
    {
      img: 'https://m.carket.kg/assets/img/carcase/pickup.png',
      text: 'Пикап',
      alias: 'pikap',
    },
    {
      img: 'https://m.carket.kg/assets/img/carcase/cabrio.png',
      text: 'Кабриолет',
      alias: 'cabrio',
    },
    {
      img: 'https://m.carket.kg/assets/img/carcase/van.png',
      text: 'Фургон',
      alias: 'furgon',
    },
  ];
  const listTab = [
    {id: 0, name: 'Легковые', country: 'kg'},
    {id: 1, name: 'Автозапчасти'},
    {id: 2, name: 'Автосалоны'},
    {id: 3, name: 'Услуги'},
    {id: 4, name: 'Авто  в России', country: 'ru'},
    {id: 5, name: 'Авто  в Казахстане', country: 'kz'},
  ];

  const HeaderPureComponent = React.useCallback(() => {
    return (
      <View style={styles.headerBlock}>
        <TouchableOpacity
          style={{width: 20, height: 20}}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          {IMAGE.BurgerIcon}
        </TouchableOpacity>
        <View>{IMAGE.LogoIcon}</View>
        <TouchableOpacity
          style={{width: 20, height: 20}}
          onPress={() => {
            dispatch(
              setData({
                brandForFilter: '',
                modelForFilter: '',
              }),
            );
            navigation.navigate('Search', {
              isSparePart: false,
              isService: false,
              isCar: true,
            });
          }}>
          {IMAGE.SearchIcon}
        </TouchableOpacity>
      </View>
    );
  }, []);
  const Header = () => {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#E5E5E5" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ----- Start Header ----- */}
          <HeaderPureComponent />
          {/* ----- End Header ----- */}
          <Filter
            Item={Item}
            setItem={newItem => {
              dispatch(
                setData({
                  brandForFilter: '',
                  modelForFilter: '',
                  regionForFilter: '',
                  townForFilter: '',
                }),
              );
              let params = {
                isSparePart: newItem.id === 1,
                isService: newItem.id === 3,
                isCar: newItem.id !== 1 && newItem.id !== 3,
              };
              if (newItem.country) {
                params.drawerCountry = newItem.country;
              }
              setItem(newItem.id);
              if (newItem.id === 2) {
                return navigation.navigate('Autos');
              }
              if (!Boolean(newItem.country)) {
                dispatch(
                  setData({
                    brandForFilter: '',
                    modelForFilter: '',
                  }),
                );
              }
              if (newItem.id === 1) {
                dispatch(setData({bottomNavStateIsSparePart: true}));
              }
              navigation.navigate(
                newItem.id === 1 ? 'Запчасти' : 'Search',
                params,
              );
            }}
            data={listTab}
          />
          {/* ----- Start Body(Кузов) ----- */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Cars.map((car, key) => (
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    setData({
                      brandForFilter: '',
                      modelForFilter: '',
                    }),
                  );
                  navigation.navigate('Search', {
                    carcase: car.alias,
                    isSparePart: false,
                    isService: false,
                    isCar: true,
                  });
                }}
                style={[
                  styles.center,
                  {
                    width: 128,
                    height: 100,
                    marginRight:
                      car.text === 'Фургон' || car.text === 'Внедорожник'
                        ? 10
                        : 5,
                  },
                ]}
                key={key}>
                <Image
                  style={{width: 121, height: 68}}
                  key={key}
                  source={{uri: car.img}}
                />
                <Text style={{marginTop: 17}}>{car.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* ----- End Body(Кузов) ----- */}

          {/* ----- Start Parametrs ----- */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('Parametrs', {country: 'kg'})}>
            <Card style={styles.HomeParametrs}>
              <Text>Параметры</Text>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../assets/FilterIcon.png')}
              />
            </Card>
          </TouchableOpacity>
          {/* ----- End Parametrs ----- */}
        </ScrollView>
      </>
    );
  };
  return (
    <>
      <SafeAreaView style={{backgroundColor: '#F2F1F6'}}>
        {/* ----- Start Body ----- */}
        <HomeAds
          navigation={navigation}
          Item={Item}
          header={Header}
          scrollToTop={scrollToTop}
          setScrollState={setScrollState}
        />
        {/* ----- End Body ----- */}
      </SafeAreaView>
    </>
  );
};

export default HomePage;
