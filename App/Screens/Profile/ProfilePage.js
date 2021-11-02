import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
  Linking,
  Platform,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Card} from 'react-native-shadow-cards';
import {useDispatch, useSelector} from 'react-redux';

import styles from '../../styles';
import IMAGE from '../../assets/SVG';
import {load} from '../../Components/Loader';
import FavoritesComponent from '../../Components/FavoritesComponent';
import {
  deleteTariffPlan,
  getUserCars,
  getUserData,
  getUserServices,
  getUserSpareParts,
  logout,
} from '../../api';
import moment from 'moment';
import {ToastShow} from '../../Components/ToastShow';
import {setData} from '../../Store';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const ProfilePage = ({navigation, scrollToTop, setScrollState}) => {
  const scrollView = React.useRef();
  const dispatch = useDispatch();
  const {user, userCars, userServices, userSpareParts} = useSelector(
    store => store.appReducer,
  );

  const window = Dimensions.get('window');
  const [width, setwidth] = React.useState(window.width);
  const [height, setheight] = React.useState(window.height);
  const [modal, setModal] = React.useState({
    open: false,
    question: '',
    handler: () => {},
  });
  const [data, setUserData] = React.useState('');
  const [userAdProps, setProps] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [timeleft, setTimeLeft] = React.useState(0);
  let days = Math.floor(timeleft / (3600 * 24)),
    hours = Math.floor((timeleft % (3600 * 24)) / 3600),
    minutes = Math.floor((timeleft % 3600) / 60),
    seconds = Math.floor(timeleft % 60);

  React.useEffect(() => {
    let timer;
    if (timeleft > 0) {
      timer = setInterval(() => setTimeLeft(timeleft - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timeleft]);
  React.useEffect(() => {
    if (scrollToTop) {
      scrollView.current.scrollTo({animated: true, y: 0});
      setScrollState(false);
    }
  }, [scrollToTop]);
  React.useEffect(() => {
    if (Boolean(userCars) && userCars.length > 0 && !Boolean(userAdProps)) {
      setProps({car: userCars[0], sparePart: false, service: false});
    }
    if (
      Boolean(userSpareParts) &&
      userSpareParts.length > 0 &&
      !Boolean(userAdProps)
    ) {
      setProps({car: false, sparePart: userSpareParts[0], service: false});
    }
    if (
      Boolean(userServices) &&
      userServices.length > 0 &&
      !Boolean(userAdProps)
    ) {
      setProps({car: false, sparePart: false, service: userServices[0]});
    }
  }, [userCars, userServices, userSpareParts, userAdProps]);
  React.useEffect(() => {
    if (Boolean(user)) {
      setUserData(user);
      if (Boolean(user.bussines)) {
        let bussines = user.bussines,
          current_time = moment(),
          expiration_at = moment.unix(bussines.salon_info.date_expire).utc();
        setTimeLeft(expiration_at.diff(current_time, 'seconds'));
      }
    }
  }, [user]);
  React.useEffect(() => {
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

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    dispatch(getUserData());
    dispatch(getUserCars({page: '0'}));
    dispatch(getUserServices({page: '0'}));
    dispatch(getUserSpareParts({page: '0'}));
    dispatch(
      setData({user: '', userCars: [], userServices: [], userSpareParts: []}),
    );
    setUserData('');
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false);
      setProps('');
    });
  }, []);
  return (
    <SafeAreaView>
      <ScrollView
        ref={scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#EA4F3D']}
            tintColor="#EA4F3D"
            enabled
          />
        }>
        <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />

        {/* --- Start Header --- */}
        <View style={styles.ProfileHeader}>
          <Text style={styles.MyProfileText}>Мой профиль</Text>
          <View style={styles.HeaderProfileBlock}>
            {Boolean(data) ? (
              <>
                <View style={styles.ProfileHeaderAva}>
                  <Image
                    style={{width: 65, height: 65}}
                    source={
                      Boolean(data.user_data.photo)
                        ? require('../../assets/Ava.png')
                        : require('../../assets/commentAva.png')
                    }
                  />
                </View>
                <View style={{marginLeft: 15}}>
                  <Text
                    style={{color: 'white', fontSize: 18, fontWeight: '500'}}>
                    {data.user_data.name}
                  </Text>
                  <Text style={{fontSize: 12, color: 'white', marginTop: 14}}>
                    Лицевой счет
                  </Text>
                  <Text style={{fontWeight: '500', color: 'white'}}>
                    {data.user_data.login}
                  </Text>
                </View>
              </>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>
        </View>
        {/* --- End Header --- */}

        {/* --- Start Body --- */}

        {/* --- Start MyBalance --- */}
        <View style={styles.ProfileBalance}>
          <View>
            <Text style={{fontSize: 10}}>Текущий баланс</Text>
            <Text style={{fontSize: 20, fontWeight: '500'}}>
              {Boolean(data) ? data.user_data.balance : '0'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Balance')}
            style={[styles.fdRow, {alignSelf: 'center'}]}>
            <Text style={styles.ProfileReplenishText}>Пополнить</Text>
            <View>{IMAGE.ReplenishIcon}</View>
          </TouchableOpacity>
        </View>
        {/* --- End MyBalance --- */}

        {/* --- Start announcements --- */}
        <TouchableOpacity
          onPress={() => navigation.navigate('UserAllAds')}
          style={{
            marginVertical: 25,
            marginHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text style={{fontSize: 18}}>Мои объявления</Text>
          <Image
            style={{width: 25, height: 25}}
            source={require('../../assets/VipRedArrow.png')}
          />
        </TouchableOpacity>
        {Boolean(userAdProps) ? (
          !isLoading && !refreshing ? (
            <FavoritesComponent
              navigation={navigation}
              imgStyle={{marginHorizontal: -20}}
              {...userAdProps}
              isOwnCar={true}
              salon={
                Boolean(data.bussines)
                  ? {
                      all_advice:
                        data.bussines.car_total +
                        data.bussines.parts_total +
                        data.bussines.service_total,
                      ...data.bussines.salon_info,
                    }
                  : false
              }
              setLoading={state => {
                setLoading(state);
                if (!state) {
                  setProps('');
                }
              }}
              country="kg"
            />
          ) : (
            load
          )
        ) : null}
        {/* <TouchableOpacity onPress={() => navigation.navigate('Добавить')}>
          <View style={styles.ProfileAddBlock}>
            <View>{IMAGE.PlusIcon}</View>
            <Text style={styles.ProfileAddText}>Добавить объявление</Text>
          </View>
        </TouchableOpacity> */}

        {Boolean(data.bussines) && (
          <>
            <Text style={{fontSize: 18, marginTop: 24, marginLeft: 20}}>
              {`Бизнес аккаунт ${data.bussines.listing.name}`}
            </Text>
            <LinearGradient
              colors={['#EA4F3D', '#BE2412']}
              style={{
                alignSelf: 'center',
                marginTop: 24,
                paddingVertical: 18,
                paddingHorizontal: 12,
                borderRadius: 10,
                width: '90%',
                backgroundColor: '#EA4F3D',
              }}>
              <Text
                style={{color: 'white', textAlign: 'center', lineHeight: 18}}>
                {`До окончания вашего бизнес аккаута\nосталось ${days} дней ${hours} часа ${minutes} минут ${seconds} секунд`}
              </Text>
            </LinearGradient>
            {/* ---------------- */}
            <Text style={{fontSize: 18, marginHorizontal: 20, marginTop: 30}}>
              {`Лимиты “${data.bussines.salon_info.name}”`}
            </Text>
            <Text style={{marginLeft: 20, marginTop: 10}}>
              Вы можете добавить ешё:
            </Text>

            <Card elevation={8} style={styless.limits}>
              <Text style={styless.fsz16}>Авто</Text>
              <View style={styles.fdRow}>
                <Text style={{color: 'red', fontSize: 16}}>
                  {data.bussines.car_total}
                </Text>
                <Text
                  style={
                    styless.fsz16
                  }>{`/${data.bussines.listing.ads_limit}`}</Text>
              </View>
            </Card>
            {/* ------------ */}
            <Card elevation={8} style={[styless.limits, {marginTop: 15}]}>
              <Text style={styless.fsz16}>Запчасти</Text>
              <View style={styles.fdRow}>
                <Text style={{color: 'red', fontSize: 16}}>
                  {data.bussines.parts_total}
                </Text>
                <Text
                  style={
                    styless.fsz16
                  }>{`/${data.bussines.listing.ads_limit}`}</Text>
              </View>
            </Card>
            {/* ------------ */}
            <Card elevation={8} style={[styless.limits, {marginTop: 15}]}>
              <Text style={styless.fsz16}>Услуги</Text>
              <View style={styles.fdRow}>
                <Text style={{color: 'red', fontSize: 16}}>
                  {data.bussines.service_total}
                </Text>
                <Text
                  style={
                    styless.fsz16
                  }>{`/${data.bussines.listing.ads_limit}`}</Text>
              </View>
            </Card>
            {/* ------------ */}
            <TouchableOpacity
              onPress={() =>
                setModal({
                  open: true,
                  question: 'Вы уверены, что хотите удалить?',
                  handler: () =>
                    dispatch(
                      deleteTariffPlan(
                        {salon_id: data.bussines.salon_info.id},
                        json => ToastShow(json.message, 2000, 'success'),
                      ),
                    ),
                })
              }
              style={[styles.fdRow, {marginLeft: 20, marginTop: 30}]}>
              <Image
                style={styless.Icon}
                source={require('../../assets/DumpsterIcon.png')}
              />
              <Text style={styless.IconText}>Удалить</Text>
            </TouchableOpacity>
            {/* ------------ */}
            <TouchableOpacity
              onPress={() => {
                const {car_total, parts_total, service_total, salon_info} =
                  data.bussines;
                navigation.navigate('AutosComponent', {
                  salon: {
                    all_advice: car_total + parts_total + service_total,
                    ...salon_info,
                  },
                  isOwnSalon: true,
                });
              }}
              style={[styles.fdRow, {marginLeft: 20, marginTop: 20}]}>
              <Image
                style={styless.Icon}
                source={require('../../assets/ViewIcon.png')}
              />
              <Text style={styless.IconText}>Просмотреть</Text>
            </TouchableOpacity>
            {/* ------------ */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Business', {
                  isBussines: true,
                  tariff: data.bussines.listing,
                })
              }
              style={[styles.fdRow, {marginLeft: 20, marginTop: 20}]}>
              <Image
                style={styless.Icon}
                source={require('../../assets/ChangeIcon.png')}
              />
              <Text style={styless.IconText}>Редактировать</Text>
            </TouchableOpacity>
            {/* --- End announcements --- */}
          </>
        )}
        <View style={[styles.ph20, {marginTop: 40}]}>
          {DATA.map((item, key) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  item.text === 'Выйти'
                    ? setModal({
                        open: true,
                        question: 'Вы уверены, что хотите выйти?',
                        handler: () => {
                          dispatch(logout());
                        },
                      })
                    : item.text === 'Оценить приложение'
                    ? Linking.openURL(
                        Platform.OS === 'ios'
                          ? 'https://apps.apple.com/app/id1562708082'
                          : 'https://play.google.com/store/apps/details?id=com.carket.carket',
                      )
                    : navigation.navigate(item.navigation)
                }
                key={key}
                style={[
                  styles.fdRow,
                  {marginBottom: 35, alignItems: 'center'},
                ]}>
                <View>{item.icon}</View>
                <Text style={{marginLeft: 18, fontSize: 18, fontWeight: '400'}}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* --- End Body --- */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={modal.open}
          onRequestClose={() => setModal({...modal, open: false})}>
          <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 30,
                marginTop: height / 3,
                marginHorizontal: 10,
                alignItems: 'center',
              }}>
              <Text style={{lineHeight: 21, marginTop: 20}}>
                {modal.question}
              </Text>
              <View
                style={{
                  width: '50%',
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    modal.handler();
                    setModal({...modal, open: false});
                  }}>
                  <Text style={{fontSize: 16, color: '#EA4F3D'}}>Да</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModal({...modal, open: false})}>
                  <Text style={{fontSize: 16, color: '#EA4F3D'}}>Нет</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;

const DATA = [
  {
    text: 'Настройки',
    icon: IMAGE.SettingsIcon,
    navigation: 'Settings',
  },
  {
    text: 'Тарифы',
    icon: IMAGE.TarrifsIcon,
    navigation: 'CreateBusinessProfile',
  },
  {
    text: 'Бизнес профиль',
    icon: IMAGE.CreateBusinessIcon,
    navigation: 'CreateBusinessProfile',
  },
  {
    text: 'О программе',
    icon: IMAGE.AboutIcon,
    navigation: 'About',
  },
  {
    text: 'Оценить приложение',
    icon: IMAGE.SupportIcon,
  },
  {
    text: 'Выйти',
    icon: IMAGE.ExitIcon,
  },
];

const styless = StyleSheet.create({
  limits: {
    minHeight: 53,
    borderRadius: 6,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 21,
    marginHorizontal: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#BFBFBF',
  },
  fsz16: {fontSize: 16},
  Icon: {width: 26, height: 26},
  IconText: {marginLeft: 25, color: '#686868', fontSize: 16},
});
