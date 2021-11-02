import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import {getUserCars, getUserServices, getUserSpareParts} from '../../api';
import FavoritesComponent from '../../Components/FavoritesComponent';
import {load, noData} from '../../Components/Loader';
import styles from '../../styles';
import HeaderComponent from '../../Components/HeaderComponent';

export default function UserAllAds(props) {
  const {navigation} = props;
  const window = Dimensions.get('window');
  const [width, setwidth] = useState(window.width);
  const dispatch = useDispatch();
  const {userCars, userSpareParts, userServices, totalCounts, user} =
    useSelector(store => store.appReducer);
  const [isLoading, setLoading] = useState(false);
  const [ads, setAds] = useState('Легковые');
  const [currentAds, setCurrentAds] = useState([]);
  const [page, setPage] = useState(0);
  const actualList = ['Легковые', 'Запчасти', 'Услуги'];

  React.useEffect(() => {
    if (page !== 0) {
      setLoading(true);
      switch (ads) {
        case ads === 'Легковые': {
          dispatch(
            getUserCars({page: page.toString(), per_page: 12}, currentAds, () =>
              setLoading(false),
            ),
          );
        }
        case ads === 'Запчасти': {
          dispatch(
            getUserSpareParts(
              {
                page: page.toString(),
                per_page: 12,
              },
              currentAds,
              () => setLoading(false),
            ),
          );
        }
        default: {
          dispatch(
            getUserServices(
              {page: page.toString(), per_page: 12},
              currentAds,
              () => setLoading(false),
            ),
          );
        }
      }
    }
  }, [page, ads]);
  React.useEffect(() => {
    if (ads === 'Легковые' && userCars.length > 0) {
      setCurrentAds(userCars);
    }
    if (ads === 'Услуги' && userServices.length > 0) {
      setCurrentAds(userServices);
    }
    if (ads === 'Запчасти' && userSpareParts.length > 0) {
      setCurrentAds(userSpareParts);
    }
  }, [userCars, userServices, userSpareParts]);
  React.useEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setwidth(width);
        setHorizontal(false);
      } else {
        setwidth(width);
        setHorizontal(true);
      }
      setwidth(width);
    });
  }, []);

  const getCountKey = {
    Легковые: 'all_user_cars',
    Запчасти: 'all_user_parts',
    Услуги: 'all_user_services',
  };
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value,
        },
      ],
    };
  });
  // const getOffset = React.useCallback(() => {
  //   return (offset.value = withTiming(
  //     ads === 'Легковые'
  //       ? 0
  //       : ads === 'Запчасти'
  //       ? width / 3.33
  //       : (width / 3.33) * 2,
  //   ));
  // }, [ads]);
  const getKey = React.useCallback(item => item.alias, []);
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent
        arrow={true}
        title="Мои объявления"
        navigation={navigation}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={currentAds}
        keyExtractor={getKey}
        ListHeaderComponent={() => (
          <View style={[styles.ph20, {marginBottom: 25}]}>
            <View
              style={{
                flexDirection: 'row',
                height: 40,
                marginTop: 40,
                backgroundColor: '#f4f6f8',
                width: '100%',
                borderRadius: 10,
                alignSelf: 'center',
                padding: 2,
              }}>
              {/* <Animated.View
                style={[
                  styles.box,
                  {width: width / 3.3, backgroundColor: '#EA4F3D'},
                  animatedStyles,
                ]}
              /> */}

              {actualList.map(item => (
                <TouchableOpacity
                  key={item}
                  style={{
                    width: ads === item ? width / 3.3 : width / 3.45,
                    backgroundColor: ads === item ? '#EA4F3D' : '#f4f6f8',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 9,
                    height: 40,
                  }}
                  onPress={() => {
                    setAds(item);
                    setCurrentAds(
                      item === 'Легковые'
                        ? userCars
                        : item === 'Запчасти'
                        ? userSpareParts
                        : userServices,
                    );
                  }}>
                  <Text
                    style={{
                      color: ads === item ? 'white' : 'black',
                      marginHorizontal: 16,
                    }}>
                    {`${item}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        renderItem={({item, index}) => (
          <View
            style={{
              marginBottom: currentAds.length === index + 1 ? 100 : 0,
            }}>
            <FavoritesComponent
              navigation={navigation}
              imgStyle={{marginHorizontal: -20}}
              car={ads === 'Легковые' ? item : false}
              sparePart={ads === 'Запчасти' ? item : false}
              service={ads === 'Услуги' ? item : false}
              isOwnCar={true}
              salon={
                Boolean(user.bussines)
                  ? {
                      all_advice:
                        user.bussines.car_total +
                        user.bussines.parts_total +
                        user.bussines.service_total,
                      ...user.bussines.salon_info,
                    }
                  : false
              }
              setLoading={boolean => {
                setLoading(boolean);
                if (boolean) {
                  setCurrentAds([]);
                }
              }}
              country="kg"
            />
            {currentAds.length !== index + 1 && (
              <View style={{height: 5, backgroundColor: '#f2f1f6'}} />
            )}
          </View>
        )}
        ListFooterComponent={
          isLoading && <View style={{marginVertical: 10}}>{load}</View>
        }
        ListEmptyComponent={
          currentAds.length === 0 &&
          !isLoading && <View style={{marginBottom: 20}}>{noData}</View>
        }
        onEndReached={() => {
          if (totalCounts[getCountKey[ads]] > currentAds.length && !isLoading) {
            setLoading(true);
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0}
      />
    </SafeAreaView>
  );
}
