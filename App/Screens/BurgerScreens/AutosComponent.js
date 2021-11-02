import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import {getSalonCars, getSalonServices, getSalonSpareParts} from '../../api';
import FavoritesComponent from '../../Components/FavoritesComponent';
import HeaderComponent from '../../Components/HeaderComponent';
import {load, noData} from '../../Components/Loader';
import CheckboxComponent from '../../Components/CheckboxComponent';
import {setData} from '../../Store';

const AutosComponent = ({navigation, route}) => {
  const flatList = React.useRef();
  const dispatch = useDispatch();
  const {salonCars, salonSpareParts, salonServices, totalCounts, comments} =
    useSelector(store => store.appReducer);
  const window = Dimensions.get('window');
  const [width, setwidth] = React.useState(window.width);
  const [descriptionMaxheight, setDescriptionMaxheight] = useState(false);
  const [workTimeMaxheight, setWorkTimeMaxheight] = useState(false);
  const [ActualShow, setActualShow] = useState(true);
  const [tabIsLoading, setTabLoading] = useState({
    Легковые: false,
    Автозапчасти: false,
    Автозапчасти: false,
  });
  const [ads, setAds] = useState('Легковые');
  const [currentAds, setCurrentAds] = useState([]);
  const [page, setPage] = useState(0);
  const {salon, isOwnSalon} = route.params;
  let schedule =
    typeof salon.schedule == 'string'
      ? JSON.parse(salon.schedule)
      : salon.schedule;

  React.useEffect(() => {
    if (page !== 0) {
      switch (ads) {
        case ads === 'Легковые': {
          setTabLoading({...tabIsLoading, Легковые: true});
          dispatch(
            getSalonCars(
              {page: page.toString(), alias: salon.alias},
              currentAds,
              () => setTabLoading({...tabIsLoading, Легковые: false}),
            ),
          );
        }
        case ads === 'Автозапчасти': {
          setTabLoading({...tabIsLoading, Автозапчасти: true});
          dispatch(
            getSalonSpareParts(
              {
                page: page.toString(),
                per_page: 16,
                alias: salon.alias,
              },
              currentAds,
              () => setTabLoading({...tabIsLoading, Автозапчасти: false}),
            ),
          );
        }
        default: {
          setTabLoading({...tabIsLoading, Автоуслуги: true});
          dispatch(
            getSalonServices(
              {page: page.toString(), alias: salon.alias},
              currentAds,
              () => setTabLoading({...tabIsLoading, Автоуслуги: false}),
            ),
          );
        }
      }
    }
  }, [page]);
  React.useEffect(() => {
    if (Boolean(salonCars[salon.alias]) && salonCars[salon.alias].length > 0) {
      setAds('Легковые');
      setCurrentAds(salonCars[salon.alias]);
    }
    if (
      Boolean(salonServices[salon.alias]) &&
      salonServices[salon.alias].length > 0
    ) {
      setAds('Автоуслуги');
      setCurrentAds(salonServices[salon.alias]);
    }
    if (
      Boolean(salonSpareParts[salon.alias]) &&
      salonSpareParts[salon.alias].length > 0
    ) {
      setAds('Автозапчасти');
      setCurrentAds(salonSpareParts[salon.alias]);
    }
  }, [salonCars, salonServices, salonSpareParts]);
  React.useEffect(() => {
    flatList.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    if (!Boolean(salonCars[salon.alias])) {
      setCurrentAds([]);
      setTabLoading({...tabIsLoading, Легковые: true});
      dispatch(
        getSalonCars({page: page.toString(), alias: salon.alias}, [], () =>
          setTabLoading({...tabIsLoading, Легковые: false}),
        ),
      );
    }
    if (!Boolean(salonServices[salon.alias])) {
      setCurrentAds([]);
      setTabLoading({...tabIsLoading, Автоуслуги: true});
      dispatch(
        getSalonServices({page: page.toString(), alias: salon.alias}, [], () =>
          setTabLoading({...tabIsLoading, Автоуслуги: false}),
        ),
      );
    }
    if (!Boolean(salonSpareParts[salon.alias])) {
      setCurrentAds([]);
      setTabLoading({...tabIsLoading, Автозапчасти: true});
      dispatch(
        getSalonSpareParts(
          {
            page: page.toString(),
            per_page: 16,
            alias: salon.alias,
          },
          [],
          () => setTabLoading({...tabIsLoading, Автозапчасти: false}),
        ),
      );
    }
  }, [salon]);
  React.useEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setwidth(width);
      } else {
        setwidth(width);
      }
      setwidth(width);
    });
  }, []);

  const openUrl = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        dispatch(
          setData({
            alert: {message: `Не удалось открыть: ${url}`, severity: 'error'},
          }),
        );
      }
    });
  };

  const actualList = ['Легковые', 'Автозапчасти', 'Автоуслуги'];
  const getCountKey = {
    Легковые: 'all_salon_cars',
    Автозапчасти: 'all_salon_parts',
    Автоуслуги: 'all_salon_services',
  };
  const days = [
    {name: 'Понедельник', id: 1, key: 'Monday'},
    {name: 'Вторник', id: 2, key: 'Tuesday'},
    {name: 'Среда', id: 3, key: 'Wednesday'},
    {name: 'Четверг', id: 4, key: 'Thursday'},
    {name: 'Пятница', id: 5, key: 'Friday'},
    {name: 'Суббота', id: 6, key: 'Sunday'},
    {name: 'Воскресенье', id: 7, key: 'Saturday'},
  ];
  return (
    <SafeAreaView>
      <FlatList
        ref={flatList}
        showsVerticalScrollIndicator={false}
        data={currentAds}
        keyExtractor={item => item.alias.toString()}
        ListHeaderComponent={() => (
          <>
            <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
            <HeaderComponent
              arrow={true}
              title={salon.name}
              navigation={navigation}
              autos={!isOwnSalon}
            />
            {Boolean(salon) && (
              <View style={{paddingHorizontal: 20}}>
                <View style={{flexDirection: 'row', paddingTop: 35}}>
                  <Image
                    resizeMode="cover"
                    style={{width: 160, height: 150}}
                    source={{
                      uri: `https://carket.kg/img/salons/photo/${salon.photo}`,
                    }}
                  />
                  {/* `/cover/${salon.cover}` */}
                  <View style={{marginLeft: 17}}>
                    <Text style={{marginTop: 20, maxWidth: width - 217}}>
                      {salon.name}
                    </Text>
                    <Text
                      style={{
                        marginTop: 10,
                      }}>{`Объявлений: ${salon.all_advice}`}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 120,
                        marginTop: 20,
                      }}>
                      {Boolean(salon.social?.facebook) && (
                        <TouchableOpacity
                          onPress={() => openUrl(salon.social.facebook)}>
                          <Image
                            style={styles.icons}
                            source={require('../../assets/FaceBook.png')}
                          />
                        </TouchableOpacity>
                      )}
                      {Boolean(salon.social?.instagram) && (
                        <TouchableOpacity
                          onPress={() => openUrl(salon.social.instagram)}>
                          <Image
                            style={styles.icons}
                            source={require('../../assets/instagramMin.png')}
                          />
                        </TouchableOpacity>
                      )}
                      {Boolean(salon.social?.twitter) && (
                        <TouchableOpacity
                          onPress={() => openUrl(salon.social.twitter)}>
                          <Image
                            style={styles.icons}
                            source={require('../../assets/telegram.png')}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
                {Boolean(salon.description) && (
                  <>
                    <Animatable.View
                      style={{
                        maxHeight: descriptionMaxheight ? '100%' : 105,
                        marginTop: 20,
                      }}>
                      <Text>{salon.description}</Text>
                    </Animatable.View>
                    <TouchableOpacity
                      onPress={() =>
                        setDescriptionMaxheight(!descriptionMaxheight)
                      }
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                      }}>
                      <Text style={{fontSize: 12, color: '#EA4F3D'}}>
                        Читать полностью
                      </Text>
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          transform: [
                            {rotate: descriptionMaxheight ? '180deg' : '0deg'},
                          ],
                        }}
                        source={require('../../assets/orangeDownArrow.png')}
                      />
                    </TouchableOpacity>
                  </>
                )}
                <View style={[styles.InputsContainer, {marginTop: 40}]}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.imgSize}
                      source={require('../../assets/Geo.png')}
                    />
                    <Text style={styles.text}>Адрес</Text>
                  </View>
                  {Boolean(salon.address) && salon.address !== 'undefined' ? (
                    <Text style={styles.secondText}>{salon.address}</Text>
                  ) : (
                    <Text style={[styles.secondText, {color: '#EA4F3D'}]}>
                      Нет информации
                    </Text>
                  )}
                </View>
                <View style={[styles.InputsContainer, {marginTop: 40}]}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.imgSize}
                      source={require('../../assets/phoneMin.png')}
                    />
                    <Text style={styles.text}>Телефон</Text>
                  </View>
                  {Boolean(salon.phone) ? (
                    salon.phone.split(',').map(phone => (
                      <TouchableOpacity
                        onPress={() => openUrl(`tel:${phone}`)}
                        key={phone}>
                        <Text style={[styles.secondText, {color: '#EA4F3D'}]}>
                          {phone}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={[styles.secondText, {color: '#EA4F3D'}]}>
                      Нет информации
                    </Text>
                  )}
                </View>
                <View style={[styles.InputsContainer, {marginTop: 40}]}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.imgSize}
                      source={require('../../assets/Site.png')}
                    />
                    <Text style={styles.text}>Веб сайт</Text>
                  </View>
                  {Boolean(salon.site) && salon.site !== 'undefined' ? (
                    <TouchableOpacity onPress={() => openUrl(salon.site)}>
                      <Text style={[styles.secondText, {color: '#EA4F3D'}]}>
                        {salon.site}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.secondText, {color: '#EA4F3D'}]}>
                      Нет информации
                    </Text>
                  )}
                </View>
                <View style={[styles.InputsContainer, {marginTop: 40}]}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.imgSize}
                      source={require('../../assets/Mail.png')}
                    />
                    <Text style={styles.text}>Электронная почта</Text>
                  </View>
                  {Boolean(salon.email) && salon.email !== 'undefined' ? (
                    <TouchableOpacity
                      onPress={() => openUrl(`mailto:${salon.email}`)}>
                      <Text style={[styles.secondText, {color: '#EA4F3D'}]}>
                        {salon.email}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.secondText, {color: '#EA4F3D'}]}>
                      Нет информации
                    </Text>
                  )}
                </View>
                <View style={[styles.InputsContainer, {marginTop: 40}]}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.imgSize}
                      source={require('../../assets/time.png')}
                    />
                    <Text style={styles.text}>Рабочее время</Text>
                  </View>
                  <Animatable.View
                    style={{
                      maxHeight: workTimeMaxheight ? '100%' : 80,
                      overflow: 'hidden',
                    }}>
                    {Boolean(schedule) ? (
                      days.map(item => {
                        return (
                          <View
                            key={item.id}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[styles.secondText, {color: '#343434'}]}>
                              {item.name}
                            </Text>
                            <Text
                              style={[styles.secondText, {color: '#343434'}]}>
                              {Boolean(schedule.time_in[item.id]) ||
                              Boolean(schedule.time_in[item.key])
                                ? `${
                                    schedule.time_in[item.id] ||
                                    schedule.time_in[item.key]
                                  } - ${
                                    schedule.time_at[item.id] ||
                                    schedule.time_at[item.key]
                                  }`
                                : 'Выходной'}
                            </Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text style={[styles.secondText, {color: '#EA4F3D'}]}>
                        Нет информации
                      </Text>
                    )}
                  </Animatable.View>
                  <TouchableOpacity
                    onPress={() => setWorkTimeMaxheight(!workTimeMaxheight)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <Text style={{color: '#EA4F3D', marginLeft: 30}}>
                      Смотреть другие дни
                    </Text>
                    <Image
                      style={{
                        width: 20,
                        height: 20,
                        transform: [
                          {rotate: workTimeMaxheight ? '180deg' : '0deg'},
                        ],
                      }}
                      source={require('../../assets/orangeDownArrow.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 50,
                    marginBottom: ActualShow ? 15 : 25,
                  }}>
                  <Text style={{color: '#0D0D0D', fontSize: 18}}>
                    Объявления
                  </Text>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => setActualShow(!ActualShow)}>
                    <Text style={{fontSize: 12}}>{ads}</Text>
                    <Image
                      style={{width: 16, height: 16}}
                      source={require('../../assets/actualIcon.png')}
                    />
                  </TouchableOpacity>
                </View>
                {ActualShow && (
                  <View style={styles.actualBox}>
                    {actualList.map((item, key) => (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          setAds(item);
                          if (item === 'Легковые')
                            setCurrentAds(salonCars[salon.alias]);
                          if (item === 'Автозапчасти')
                            setCurrentAds(salonSpareParts[salon.alias]);
                          if (item === 'Автоуслуги')
                            setCurrentAds(salonServices[salon.alias]);
                        }}
                        style={[
                          styles.row,
                          {
                            borderBottomWidth:
                              actualList.length === key + 1 ? 0 : 1,
                          },
                        ]}
                        key={key}>
                        <Text style={{fontSize: 18}}>{item}</Text>
                        <CheckboxComponent
                          isChecked={item === ads}
                          onClick={() => {
                            setAds(item);
                            setActualShow(false);
                            if (item === 'Легковые')
                              setCurrentAds(salonCars[salon.alias]);
                            if (item === 'Автозапчасти')
                              setCurrentAds(salonSpareParts[salon.alias]);
                            if (item === 'Автоуслуги')
                              setCurrentAds(salonServices[salon.alias]);
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </>
        )}
        renderItem={({item, index}) => (
          <>
            <FavoritesComponent
              navigation={navigation}
              imgStyle={{marginHorizontal: -20}}
              car={ads === actualList[0] ? item : false}
              sparePart={ads === actualList[1] ? item : false}
              service={ads === actualList[2] ? item : false}
              isOwnCar={false}
              salon={salon}
              country="kg"
            />
            {currentAds.length !== index + 1 && (
              <View style={{height: 5, backgroundColor: '#f2f1f6'}} />
            )}
          </>
        )}
        ListFooterComponent={
          tabIsLoading[ads] && <View style={{marginVertical: 10}}>{load}</View>
        }
        ListEmptyComponent={
          currentAds.length === 0 &&
          !tabIsLoading[ads] && <View style={{marginBottom: 20}}>{noData}</View>
        }
        onEndReached={() => {
          if (
            totalCounts[getCountKey[ads]] > currentAds.length &&
            !tabIsLoading[ads]
          ) {
            setTabLoading({...tabIsLoading, [ads]: true});
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0}
      />
    </SafeAreaView>
  );
};

export default AutosComponent;

const styles = StyleSheet.create({
  icons: {width: 24, height: 24},
  imgSize: {width: 18, height: 18},
  text: {marginLeft: 12, color: '#747474'},
  InputsContainer: {
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    minHeight: 50,
    paddingBottom: 20,
  },
  secondText: {marginLeft: 30, marginTop: 5},
  actualBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#F2F2F2',
    paddingVertical: 5,
  },
});
