import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
  BackHandler,
  ScrollView,
  Linking,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {Card} from 'react-native-shadow-cards';
import {useDispatch, useSelector} from 'react-redux';

import SwiperComponent from './SwiperComponent';
import FavoritesComponent from '../../Components/FavoritesComponent';
import HeaderComponent from '../../Components/HeaderComponent';
import styles from '../../styles';
import {ToastShow} from '../../Components/ToastShow';
import {load, noData} from '../../Components/Loader';
import {
  addToFavorites,
  deleteFromFavorites,
  getBrands,
  getCar,
  getCarsFiltered,
  getComments,
  getModel,
  getService,
  getSparePart,
} from '../../api';
import {getSimbol} from '../Home/HomeAds';
import ShadowButton from '../../Components/ShadowButton';
import {setData} from '../../Store';

const AutoPage = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {
    favorites,
    models,
    spareParts,
    services,
    cars,
    brands,
    isNoData,
    totalCounts,
    token,
    carsFiltered,
    adsPageHistory,
    country,
    comments,
  } = useSelector(store => store.appReducer);
  const [Favorit, setFavorit] = useState(false);
  const flatList = useRef();
  // ----------- AllStatusModal Visible -----------
  const [AllStatusModal, setAllStatusModal] = useState({open: false, id: 0});

  const window = Dimensions.get('window');
  const [width, setwidth] = useState(window.width);
  const [height, setheight] = useState(window.height);
  const {alias, salon, sparePart, service, isOwnCar, justCreated} =
    route.params;
  let isSparePart = Boolean(sparePart),
    isService = Boolean(service),
    isCar = !isSparePart && !isService;
  const [aliasState, setAliasState] = useState('');
  const [currentAd, setCurrentAd] = useState('');
  const [page, setPage] = useState(0);
  const [info, setInfo] = useState({brand_name: '~', model_name: '~'});
  const [carsFilteredState, setCarsFilteredState] = useState([]);
  const [showPhoneNumber, setPhoneNumberShow] = useState(false);
  const [isCurrentAdLoading, setCurrentAdLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const goBack = useCallback(() => {
    if (adsPageHistory.length === 1) {
      setAliasState('');
      dispatch(setData({adsPageHistory: []}));
      if (Boolean(justCreated)) {
        navigation.navigate('Профиль');
      } else {
        navigation.goBack();
      }
    } else {
      setCurrentAdLoading(true);
      let newHistory = adsPageHistory;
      newHistory.splice(adsPageHistory.indexOf(aliasState), 1);
      dispatch(setData({adsPageHistory: newHistory}));
      setAliasState(newHistory[newHistory.length - 1]);
    }
    return true;
  }, [adsPageHistory, justCreated, aliasState]);
  useEffect(() => {
    if (!Boolean(brands)) {
      dispatch(getBrands());
    }

    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setwidth(width);
        setheight(height);
      } else {
        setwidth(width);
        setheight(height);
      }
      setwidth(width);
      setheight(height);
    });
  }, []);
  useEffect(() => {
    setCurrentAdLoading(true);
    setAliasState(alias);
    dispatch(setData({adsPageHistory: [alias]}));
    dispatch(
      getComments({
        alias,
        category: isSparePart ? 'parts' : isService ? 'services' : 'cars',
      }),
    );
  }, [alias]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      goBack,
    );

    return () => backHandler.remove();
  }, [adsPageHistory, justCreated, aliasState]);
  useEffect(() => {
    if (
      isSparePart &&
      Boolean(aliasState) &&
      !Boolean(spareParts[aliasState])
    ) {
      setCurrentAdLoading(true);
      dispatch(getSparePart({alias: aliasState}));
    }
    if (isService && Boolean(aliasState) && !Boolean(services[aliasState])) {
      setCurrentAdLoading(true);
      dispatch(getService({alias: aliasState}));
    }
    if (isCar && Boolean(aliasState) && !Boolean(cars[aliasState])) {
      setCurrentAdLoading(true);
      dispatch(getCar(aliasState));
    }
    if (!Boolean(currentAd) || currentAd.alias !== aliasState) {
      if (isSparePart && Boolean(spareParts[aliasState])) {
        setCurrentAd(spareParts[aliasState]);
        setCurrentAdLoading(false);
      }
      if (isService && Boolean(services[aliasState])) {
        setCurrentAd(services[aliasState]);
        setCurrentAdLoading(false);
      }
      if (isCar && Boolean(cars[aliasState])) {
        setCurrentAd(cars[aliasState]);
        setCurrentAdLoading(false);
        flatList.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
        setInfo({brand_name: '~', model_name: '~'});
        if (adsPageHistory.length <= 1) {
          getTitle(cars[aliasState]);
        }
        if (
          carsFilteredState.filter(car => car.alias === aliasState).length > 0
        ) {
          setCarsFilteredState(
            carsFilteredState.filter(car => car.alias !== aliasState),
          );
        } else {
          setCarsFilteredState([]);
          getData(0, cars[aliasState]);
        }
      }
    }
  }, [
    spareParts,
    services,
    cars,
    currentAd,
    isSparePart,
    isService,
    isCar,
    aliasState,
    carsFiltered,
  ]);
  useEffect(() => {
    if (Boolean(carsFiltered[aliasState])) {
      setCarsFilteredState(carsFiltered[aliasState]);
    }
  }, [carsFiltered, aliasState]);
  useEffect(() => {
    if (Boolean(models[currentAd.model])) {
      setInfo({
        ...info,
        model_name: Boolean(models[currentAd.model])
          ? models[currentAd.model].name
          : '~',
      });
    }
  }, [models, currentAd]);
  useEffect(() => {
    if (Boolean(token)) {
      const {cars, parts, services} = favorites;
      let favoritesArr = [...cars, ...parts, ...services];

      if (
        favoritesArr.length > 0 &&
        favoritesArr.filter(item => item.alias === aliasState).length !== 0
      ) {
        setFavorit(true);
      } else {
        setFavorit(false);
      }
    }
  }, [favorites, aliasState, token]);

  const getData = useCallback((page, ad) => {
    setLoading(true);
    dispatch(
      getCarsFiltered(
        {
          country,
          page: page.toString(),
          brand: ad.brand,
          model: ad.model,
        },
        () => setLoading(false),
        ad.alias,
        page === 0 ? [] : carsFilteredState,
      ),
    );
  });
  const getTitle = AD => {
    let arr = brands.filter(brand => brand.alias === AD.brand);
    setInfo({
      ...info,
      brand_name: arr.length > 0 ? arr[0].name : '~',
    });
    dispatch(getModel({model: AD.model}));
  };
  const toggleFavorites = () => {
    const {cars, parts, services} = favorites;
    if (Favorit) {
      setFavorit(false);
      dispatch(
        deleteFromFavorites(
          {alias: aliasState},
          {
            cars: isCar ? cars.filter(car => car.alias !== aliasState) : cars,
            parts: isSparePart
              ? parts.filter(part => part.alias !== aliasState)
              : parts,
            services: isService
              ? services.filter(service => service.alias !== aliasState)
              : services,
          },
          () => {
            setTimeout(
              () => ToastShow('Успешно удалено', 2000, 'success'),
              1000,
            );
          },
        ),
      );
    } else {
      setFavorit(true);
      if (isCar) {
        cars.push(currentAd);
      }
      if (isSparePart) {
        parts.push(currentAd);
      }
      if (isService) {
        services.push(currentAd);
      }
      dispatch(
        addToFavorites(
          {
            alias: aliasState,
            category: isSparePart ? 'parts' : isService ? 'services' : 'cars',
          },
          {
            cars,
            parts,
            services,
          },
          () => {
            setTimeout(
              () => ToastShow('Успешно добавлено', 2000, 'success'),
              1000,
            );
          },
        ),
      );
    }
  };
  const FastSaleData = [
    {
      img: require('../../assets/Vip.png'),
      text: 'Сделать VIP',
      click: () => navigation.navigate('Vip', {alias: aliasState}),
    },
    {
      img: require('../../assets/Color.png'),
      text: 'Выделить цветом',
      click: () =>
        navigation.navigate('ColorScreen', {
          alias: aliasState,
        }),
    },
    {
      img: require('../../assets/AutoUp.png'),
      text: 'Авто UP',
      click: () =>
        navigation.navigate('AutoUp', {
          alias: aliasState,
        }),
    },
  ];
  const Header = () => (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <Toast style={{zIndex: 10000}} ref={ref => Toast.setRef(ref)} />
      <HeaderComponent
        arrow={true}
        title={`${
          isSparePart
            ? 'Автозапчасти • '
            : isService
            ? 'Автоуслуги • '
            : 'Легковые • '
        }${
          Boolean(currentAd.name)
            ? currentAd.name
            : `${info.brand_name} • ${info.model_name}`
        }`}
        navigation={{
          goBack,
        }}
        favorit={Boolean(token)}
        favoritPress={Favorit}
        setFavoritPress={toggleFavorites}
      />
      {/* ----- Start Swiper Modal ----- */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={AllStatusModal.open}
        onRequestClose={() => setAllStatusModal({open: false})}>
        <ScrollView>
          <TouchableOpacity
            style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}}
            activeOpacity={1}
            onPress={() => setAllStatusModal({open: false})}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 30,
                marginHorizontal: 10,
                marginVertical: height / 5,
                minHeight: 471,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 18, color: '#0D0D0D', marginBottom: 15}}>
                {AllStatusModal.id === 0
                  ? 'Метка “Срочно”'
                  : AllStatusModal.id === 1
                  ? 'VIP объявление'
                  : 'В ТОР'}
              </Text>
              <Image
                // QuicklyPopUpSimple
                style={{width: 275, height: 240}}
                source={
                  AllStatusModal.id === 0
                    ? require('../../assets/QuicklyPopUpSimple.png')
                    : AllStatusModal.id === 1
                    ? require('../../assets/VipPopUpSimple.png')
                    : require('../../assets/TopPopUpSimple.png')
                }
              />
              <Text style={{lineHeight: 21, marginTop: 20}}>
                {AllStatusModal.id === 0
                  ? `- Ваше объявление украсит метка со словом "Срочно". 
- Пользователи увидят ваше объявление в разделе "Срочно".`
                  : AllStatusModal.id === 1
                  ? `- ваше объявление будет размещено в VIP блоке на самом верху списка;
- просмотры объявления и звонки увеличиваются в 10 раз;
- продажа совершается гораздо быстрее;
- отсутствие конкурентов на вашем объявлении;
- отсутствие рекламы среди фото вашего объявления.
              `
                  : `- ваше объявление будет размещено в TOP блоке выше всех бесплатных объявлений (после VIP);
- просмотры объявления и звонки увеличиваются в 5 раз;
- продажа совершается гораздо быстрее.`}
              </Text>
              {AllStatusModal.id === 1 && (
                <Image
                  style={{width: 259, height: 75}}
                  source={require('../../assets/Vipx10.png')}
                />
              )}
              {Boolean(isOwnCar) && (
                <Text
                  onPress={() =>
                    navigation.navigate(
                      `${
                        AllStatusModal.id === 0
                          ? 'Top'
                          : AllStatusModal.id === 1
                          ? 'Vip'
                          : 'AutoUp'
                      }`,
                    )
                  }
                  style={{fontSize: 16, color: '#EA4F3D', marginTop: 30}}>
                  {AllStatusModal.id === 0
                    ? 'Подключить “Срочно”'
                    : AllStatusModal.id === 1
                    ? 'Подключить “VIP”'
                    : 'Подключить “В ТОР”'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {!isCurrentAdLoading && Boolean(currentAd) ? (
        <>
          <SwiperComponent
            page={page}
            ad={currentAd}
            isLoading={isLoading}
            isCurrentAdLoading={isCurrentAdLoading}
          />
          {isCar && (
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setAllStatusModal({open: true, id: 0});
                }}>
                <Image
                  style={{width: 45, height: 20}}
                  source={require('../../assets/QuicklyIcon.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setAllStatusModal({open: true, id: 1});
                }}>
                <Image
                  style={{width: 45, height: 20, marginHorizontal: 10}}
                  source={require('../../assets/VipIcon.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setAllStatusModal({open: true, id: 2});
                }}>
                <Image
                  style={{width: 57, height: 20}}
                  source={require('../../assets/TopIcon.png')}
                />
              </TouchableOpacity>
            </View>
          )}
          {/* -------- */}
          <View style={[{paddingHorizontal: 15}]}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '33%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 16, height: 16, marginRight: 6}}
                  source={require('../../assets/View.png')}
                />
                <Text style={{color: '#818181', fontSize: 10}}>
                  {`Просмотров\n${currentAd.view}`}
                </Text>
              </View>
              <View
                style={{
                  width: '33%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 16, height: 16, marginRight: 6}}
                  source={require('../../assets/added.png')}
                />
                <Text
                  style={{
                    color: '#818181',
                    fontSize: 10,
                  }}>{`Добавлено\n${currentAd.date_text}`}</Text>
              </View>
              {Boolean(currentAd.upped_at_text) &&
                parseInt(currentAd.upped_at_text.split(' ')[0]) > 0 && (
                  <View
                    style={{
                      width: '33%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{width: 16, height: 16, marginRight: 6}}
                      source={require('../../assets/last.png')}
                    />
                    <Text style={{color: '#818181', fontSize: 10}}>
                      {`Поднято\n${currentAd.upped_at_text}`}
                    </Text>
                  </View>
                )}
            </View>
            {/* ------------------------------ */}
            <Text style={{marginTop: 17.5}}>
              {`${
                isSparePart
                  ? 'Автозапчасти • '
                  : isService
                  ? 'Автоуслуги • '
                  : 'Продажа • '
              } ${
                Boolean(currentAd.name)
                  ? currentAd.name
                  : `${info.brand_name} • ${info.model_name}`
              }`}
            </Text>
            {!isSparePart && !isService && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                  }}>
                  {`${currentAd.price}${getSimbol[country]}`}
                </Text>
                {Boolean(currentAd.secondary_price) && (
                  <Text style={{color: '#818181', marginLeft: 18}}>
                    {`${currentAd.secondary_price} сом`}
                  </Text>
                )}
              </View>
            )}
            {/* ---------- Start About ---------- */}
            <View
              style={{
                marginTop: isService ? 0 : 20,
                alignSelf: 'center',
              }}>
              {!isService && (
                <>
                  {Boolean(isSparePart) && (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                          alignSelf: 'flex-start',
                        }}>
                        <Text style={{fontSize: 12}}>Цена</Text>
                        <Text
                          style={{
                            position: 'absolute',
                            marginLeft: 202,
                            color: '#818181',
                            fontSize: 12,
                          }}>
                          {Boolean(currentAd.price)
                            ? `${currentAd.price}$`
                            : 'Договорная'}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                          alignSelf: 'flex-start',
                        }}>
                        <Text style={{fontSize: 12}}>Марка</Text>
                        <Text
                          style={{
                            position: 'absolute',
                            marginLeft: 202,
                            color: '#818181',
                            fontSize: 12,
                          }}>
                          {currentAd.part_brand}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                          alignSelf: 'flex-start',
                        }}>
                        <Text style={{fontSize: 12}}>Модель</Text>
                        <Text
                          style={{
                            position: 'absolute',
                            marginLeft: 202,
                            color: '#818181',
                            fontSize: 12,
                          }}>
                          {currentAd.part_model}
                        </Text>
                      </View>
                    </>
                  )}
                  {Boolean(currentAd.region) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Область</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.region}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.town) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Город</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.town}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.c_condition) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Состояние</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.c_condition}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.year) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Год выпуска</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.year}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.mileage) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Пробег</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {`${currentAd.mileage} км`}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_carcase) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Кузов</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_carcase}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.color_name) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Цвет</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.color_name}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_fuel) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Двигатель</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_fuel}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_transmission) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Коробка</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_transmission}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_drive) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Привод</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_drive}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_steering) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Руль</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_steering}
                      </Text>
                    </View>
                  )}
                  {Boolean(currentAd.car_status) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text style={{fontSize: 12}}>Состояние</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 202,
                          color: '#818181',
                          fontSize: 12,
                        }}>
                        {currentAd.car_status}
                      </Text>
                    </View>
                  )}
                </>
              )}
              <Text style={{fontSize: 18, marginTop: 20}}>
                Описание от продавца
              </Text>
              {Boolean(currentAd.description) && (
                <Text
                  style={{
                    marginTop: 15,
                    marginBottom: 20,
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#818181',
                  }}>
                  {currentAd.description}
                </Text>
              )}

              {Boolean(salon) ? (
                //  ----- Shadow Card -----
                <Card
                  elevation={15}
                  style={{
                    width: width - 30,
                    flexDirection: 'row',
                    marginTop: 34,
                    borderRadius: 10,
                    minHeight: 142,
                    paddingHorizontal: 35,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    resizeMode="cover"
                    style={{width: 100, height: 92, alignSelf: 'center'}}
                    source={{
                      uri: `https://carket.kg/img/salons/photo/${salon.photo}`,
                    }}
                  />
                  <View style={{alignSelf: 'center', marginLeft: 43}}>
                    <Text style={{fontSize: 16}}>{salon.name}</Text>
                    <Text style={{fontSize: 12, marginVertical: 5}}>
                      {`${salon.all_advice} объявления`}
                    </Text>
                    <Text
                      style={{fontSize: 10, color: '#747474', marginBottom: 5}}>
                      Телефон отдела продаж
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setPhoneNumberShow(true);
                        Linking.openURL(`tel:${salon.phone.split(',')[0]}`);
                      }}>
                      <Text style={{color: '#EA4F3D'}}>
                        {showPhoneNumber
                          ? salon.phone.split(',')[0]
                          : 'Показать номер'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ) : (
                // {/* ----- End Shadow Card ----- */}
                // {/* ---- Ava ---- */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{width: 65, height: 65}}
                    source={require('../../assets/Ava.png')}
                  />
                  <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 18}}>{currentAd.user_name}</Text>
                    <Text
                      style={{fontSize: 12, color: '#636363', marginTop: 10}}>
                      {Boolean(currentAd.region) ? currentAd.region : '~'}
                    </Text>
                  </View>
                </View>
              )}

              {/* ----- Row Container ----- */}
              <Card
                elevation={10}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  backgroundColor: '#EA4F3D',
                  minHeight: 68,
                  width: width - 30,
                  alignSelf: 'center',
                  marginTop: 40,
                  marginBottom: isCar ? 40 : 100,
                  alignItems: 'center',
                }}>
                {/* --------------------- */}
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setData({updateComments: true}));
                    navigation.navigate('Comments', {
                      alias: aliasState,
                      sparePart: isSparePart,
                      service: isService,
                      car: isCar,
                    });
                  }}
                  style={styless.arrowContainerView}>
                  <Image
                    style={styless.arrowContainer}
                    source={require('../../assets/CommentIcon.png')}
                  />
                  <Text style={styless.arrowContainerText}>
                    {Boolean(comments[aliasState]) &&
                    comments[aliasState].length > 0 &&
                    Array.isArray(comments[alias])
                      ? `Комментарии (${comments[aliasState].length})`
                      : 'Нет комментариев'}
                  </Text>
                </TouchableOpacity>
                {/* --------------------- */}
                <View style={styless.arrowLine} />
                <TouchableOpacity
                  onPress={() => alert('Скопировано!')}
                  style={styless.arrowContainerView}>
                  <Image
                    style={styless.arrowContainer}
                    source={require('../../assets/CopyLink.png')}
                  />
                  <Text style={styless.arrowContainerText}>
                    Скопироват ссылку
                  </Text>
                </TouchableOpacity>
                {/* --------------------- */}
                <View style={styless.arrowLine} />
                {/* --------------------- */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('WriteToUs')}
                  style={styless.arrowContainerView}>
                  <Image
                    style={styless.arrowContainer}
                    source={require('../../assets/ComplainIcon.png')}
                  />
                  <Text style={styless.arrowContainerText}>Пожаловаться</Text>
                </TouchableOpacity>
                {/* --------------------- */}
              </Card>
              {/* ---------- Start Fasat Sale ---------- */}
              {Boolean(isOwnCar) && isCar && (
                <>
                  <Text
                    style={{
                      fontSize: 18,
                      alignSelf: 'flex-start',
                      marginBottom: 20,
                    }}>
                    Быстрая продажа
                  </Text>
                  <View style={{alignSelf: 'flex-start'}}>
                    {FastSaleData.map((item, key) => (
                      <TouchableOpacity
                        onPress={item.click}
                        key={key}
                        style={[styles.fdRow, {marginBottom: 10}]}>
                        <Image
                          style={{width: 26, height: 26}}
                          source={item.img}
                        />
                        <Text
                          style={{
                            marginLeft: 25,
                            color: '#686868',
                            fontSize: 16,
                          }}>
                          {item.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
              {/* ---------- End Fast Sale ---------- */}
            </View>
            {/* ---------- End About ---------- */}
          </View>
        </>
      ) : (
        <View style={{marginTop: 20}}>{load}</View>
      )}
    </>
  );

  return (
    <SafeAreaView>
      <FlatList
        ref={flatList}
        showsVerticalScrollIndicator={false}
        data={!isCar || isCurrentAdLoading ? [] : carsFilteredState}
        keyExtractor={car => car.alias.toString()}
        onEn
        renderItem={({item, index}) => (
          <>
            <FavoritesComponent
              navigation={navigation}
              imgStyle={{marginHorizontal: -20}}
              car={item}
              country={country}
              salon={false}
              isOwnCar={false}
              isAutoPage={newAlias => {
                setCurrentAdLoading(true);
                dispatch(
                  setData({
                    adsPageHistory: [
                      ...adsPageHistory.filter(item => item !== newAlias),
                      newAlias,
                    ],
                  }),
                );
                dispatch(
                  getComments({
                    alias: newAlias,
                    category: isSparePart
                      ? 'parts'
                      : isService
                      ? 'services'
                      : 'cars',
                  }),
                );
                setAliasState(newAlias);
              }}
            />
            {carsFilteredState.length !== index + 1 && (
              <View style={{height: 5, backgroundColor: '#f2f1f6'}} />
            )}
          </>
        )}
        ListHeaderComponent={() => <Header />}
        ListFooterComponent={
          isLoading &&
          !isCurrentAdLoading && (
            <View style={{marginTop: 10, marginBottom: 100}}>{load}</View>
          )
        }
        ListEmptyComponent={
          isNoData &&
          !isLoading &&
          !isCurrentAdLoading && (
            <View style={{marginBottom: 100}}>{noData}</View>
          )
        }
        onEndReached={() => {
          if (
            totalCounts.foundCarsCount > carsFilteredState.length + 1 &&
            !isLoading
          ) {
            setLoading(true);
            getData(page, currentAd);
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0}
      />

      {Boolean(currentAd) && !isCurrentAdLoading && (
        <ShadowButton
          width={width - 40}
          text="ПОЗВОНИТЬ"
          Press={() =>
            Linking.openURL(
              `tel:${
                Boolean(currentAd.phone)
                  ? `+${currentAd.phone}`
                  : currentAd.login
              }`,
            )
          }
          fixed
        />
      )}
    </SafeAreaView>
  );
};

export default AutoPage;

const styless = StyleSheet.create({
  arrow: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  arrowContainer: {width: 24, height: 24},
  arrowContainerView: {justifyContent: 'center', alignItems: 'center'},
  arrowContainerText: {
    fontSize: 10,
    color: 'white',
    marginTop: 8,
    alignSelf: 'center',
  },
  arrowLine: {
    width: 1,
    height: 48,
    backgroundColor: 'white',
    marginHorizontal: -15,
  },
});
