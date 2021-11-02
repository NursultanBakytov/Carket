import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
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
import FavoritesComponent from '../../Components/FavoritesComponent';
import {load} from '../../Components/Loader';
import styles from '../../styles';
import HeaderComponent from '../../Components/HeaderComponent';
import {setData} from '../../Store';
import {getFavorites} from '../../api';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function FavoritesPage({
  navigation,
  scrollToTop,
  setScrollState,
}) {
  const flatList = React.useRef();
  const window = Dimensions.get('window');
  const [width, setwidth] = useState(window.width);
  const dispatch = useDispatch();
  const {favorites} = useSelector(store => store.appReducer);
  const [ads, setAds] = useState('Легковые');
  const [isLoading, setLoading] = useState(true);
  const [currentAds, setCurrentAds] = useState([]);
  const actualList = ['Легковые', 'Запчасти', 'Услуги'];
  const getAdsKey = {
    Легковые: 'cars',
    Запчасти: 'parts',
    Услуги: 'services',
  };

  React.useEffect(() => {
    if (scrollToTop) {
      flatList.current.scrollToOffset({animated: true, offset: 0});
      setScrollState(false);
    }
  }, [scrollToTop]);
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
  React.useEffect(() => {
    setCurrentAds(
      Boolean(favorites[getAdsKey[ads]]) ? favorites[getAdsKey[ads]] : [],
    );
    setLoading(false);
  }, [favorites, refreshing]);

  // const offset = useSharedValue(
  //   ads === 'Легковые'
  //     ? 0
  //     : ads === 'Запчасти'
  //     ? width / 3.33
  //     : (width / 3.33) * 2,
  // );

  // const animatedStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         translateX: offset.value,
  //       },
  //     ],
  //   };
  // });
  const getKey = React.useCallback(item => item.alias.toString(), []);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    dispatch(
      setData({
        favorites: {
          cars: [],
          parts: [],
          services: [],
        },
      }),
    );
    dispatch(getFavorites());
    setRefreshing(true);
    setCurrentAds([]);
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent arrow={true} title="Избранные" navigation={navigation} />
      <FlatList
        ref={flatList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#EA4F3D']}
            tintColor="#EA4F3D"
            enabled
          />
        }
        showsVerticalScrollIndicator={false}
        data={currentAds}
        keyExtractor={getKey}
        ListHeaderComponent={() => (
          <View style={styles.ph20}>
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
                      Boolean(favorites[getAdsKey[item]])
                        ? favorites[getAdsKey[item]]
                        : [],
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
        renderItem={({item, index}) => {
          return (
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
                salon={false}
                isOwnCar={false}
                country="kg"
              />
              {currentAds.length !== index + 1 && (
                <View style={{height: 5, backgroundColor: '#f2f1f6'}} />
              )}
            </View>
          );
        }}
        ListEmptyComponent={() =>
          isLoading || refreshing ? (
            <View style={{marginVertical: 10}}>{load}</View>
          ) : (
            currentAds.length === 0 && (
              <View style={{marginVertical: 20}}>
                <Image
                  style={{width: 24, height: 24, alignSelf: 'center'}}
                  source={require('../../assets/GrayFavoritIcon.png')}
                />
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 20,
                    color: '#9C9898',
                    marginVertical: 20,
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  {`У вас ещё нет избранных\n${
                    ads === actualList[0]
                      ? 'Автомобилей'
                      : ads === actualList[1]
                      ? 'Автозапчастей'
                      : 'Услуг'
                  }`}
                </Text>
              </View>
            )
          )
        }
      />
    </SafeAreaView>
  );
}
