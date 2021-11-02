import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  BackHandler,
  Platform,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {useDispatch, useSelector} from 'react-redux';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

import GoBack from '../../Components/GoBack';
import IMAGE from '../../assets/SVG';
import styles from '../../styles';
import FavoritesComponent from '../../Components/FavoritesComponent';
import CheckboxComponent from '../../Components/CheckboxComponent';
import {load, noData} from '../../Components/Loader';
import {
  getCarsFiltered,
  getServicesFiltered,
  getSparePartsFiltered,
} from '../../api';
import {ToastShow} from '../../Components/ToastShow';
import {setData} from '../../Store';
import Toast from 'react-native-toast-message';

const actualList = [
  {
    text: 'Дате размещения',
    filter: arr => {
      let newArr = [...arr];
      newArr.sort((a, b) => b.date - a.date);
      return newArr;
    },
  },
  {
    text: 'Возрастанию цены',
    filter: arr => {
      let newArr = [...arr];
      newArr.sort((a, b) => parseInt(a.price) - parseInt(b.price));
      return newArr;
    },
  },
  {
    text: 'Убыванию цены',
    filter: arr => {
      let newArr = [...arr];
      newArr.sort((a, b) => parseInt(b.price) - parseInt(a.price));
      return newArr;
    },
  },
  {
    text: 'Году: новее',
    filter: arr => {
      let newArr = [...arr];
      newArr.sort((a, b) => b.year - a.year);
      return newArr;
    },
  },
  {
    text: 'Году: cтарше',
    filter: arr => {
      let newArr = [...arr];
      newArr.sort((a, b) => a.year - b.year);
      return newArr;
    },
  },
];

const SearchPage = ({navigation, route, scrollToTop, setScrollState}) => {
  const flatList = React.useRef();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const {
    bottomNavStateIsSparePart,
    sparePartsFiltered,
    servicesFiltered,
    serviceForFilter,
    brandForFilter,
    modelForFilter,
    regionForFilter,
    townForFilter,
    searchResult,
    totalCounts,
    country,
    params,
  } = useSelector(store => store.appReducer);
  const {
    isSparePart,
    isService,
    isCar,
    carcase,
    cleanBrandForFilter,
    showParamsResult,
    drawerCountry,
  } = route.params;
  // --------------------------------------
  const window = Dimensions.get('window');
  const [text, setText] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const [data, setResultData] = useState([]);
  // ---------- Start Actual ----------
  const [refreshing, setRefreshing] = useState(false);
  const [ActualShow, setActualShow] = useState(false);
  const [filterBy, setFilterBy] = useState(actualList[0]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (Boolean(cleanBrandForFilter)) {
          dispatch(
            setData({
              bottomNavStateIsSparePart: false,
              brandForFilter: '',
              modelForFilter: '',
              regionForFilter: '',
              townForFilter: '',
            }),
          );
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if (Boolean(cleanBrandForFilter) && brandForFilter !== '') {
      dispatch(
        setData({
          brandForFilter: '',
          modelForFilter: '',
          regionForFilter: '',
          townForFilter: '',
        }),
      );
      setText('Марка');
    }
  }, [cleanBrandForFilter, brandForFilter]);
  useEffect(() => {
    if (scrollToTop) {
      flatList.current.scrollToOffset({animated: true, offset: 0});
      setScrollState(false);
    }
  }, [scrollToTop]);
  useEffect(() => {
    if (Boolean(showParamsResult)) {
      setText(
        brandForFilter !== ''
          ? `${brandForFilter.name}${
              modelForFilter !== '' ? `, ${modelForFilter.name}` : ''
            }`
          : 'Марка',
      );
    }
    if (
      isCar &&
      !bottomNavStateIsSparePart &&
      !Boolean(showParamsResult) &&
      !isLoading
    ) {
      dispatch(setData({searchResult: []}));
      setLoading(true);
      setResultData([]);
      if (!Boolean(cleanBrandForFilter)) {
        setText(brandForFilter !== '' ? brandForFilter.name : 'Марка');
      } else {
        setText('Марка');
      }
      getData('0');
      setPage(1);
      setFilterBy(actualList[0]);
    }
    if (Boolean(isSparePart) && !isLoading) {
      if (!Boolean(cleanBrandForFilter)) {
        setText(
          brandForFilter !== ''
            ? `${brandForFilter.name}${
                modelForFilter !== '' ? `, ${modelForFilter.name}` : ''
              }`
            : 'Марка',
        );
      } else {
        setText('Марка');
      }
      setLoading(true);
      setFilterBy(actualList[0]);
      setResultData([]);
      dispatch(
        getSparePartsFiltered(
          {
            page: '0',
            brand: brandForFilter.alias,
            model: modelForFilter.alias,
            region: regionForFilter.id,
            town: townForFilter.id,
          },
          () => {
            setLoading(false);
            setRefreshing(false);
          },
        ),
      );
      setPage(1);
    }
    if (isService && !isLoading) {
      if (!Boolean(cleanBrandForFilter)) {
        setText(
          serviceForFilter !== '' ? serviceForFilter.name : 'Выберите раздел',
        );
      } else {
        setText('Марка');
      }
      setLoading(true);
      setResultData([]);
      dispatch(
        getServicesFiltered(
          {
            page: '0',
            region: regionForFilter.id,
            town: townForFilter.id,
            category: serviceForFilter.value,
          },
          () => {
            setLoading(false);
            setRefreshing(false);
          },
        ),
      );
      setPage(1);
    }
  }, [
    carcase,
    brandForFilter,
    modelForFilter,
    regionForFilter,
    townForFilter,
    serviceForFilter,
    drawerCountry,
    refreshing,
  ]);
  const getData = React.useCallback(pageCount => {
    setLoading(true);
    setNoData(false);
    let requestData = Boolean(showParamsResult)
      ? {...params, page: pageCount}
      : {
          page: pageCount,
          carcase,
          brand: brandForFilter.alias,
          model: modelForFilter.alias,
          region: regionForFilter.id,
          town: townForFilter.id,
          country: drawerCountry || country,
          sort_column: 'date',
        };

    dispatch(
      getCarsFiltered(
        requestData,
        () => {
          setLoading(false);
          setRefreshing(false);
        },
        false,
      ),
    );
  });
  useEffect(() => {
    if (!isLoading && Boolean(isCar) && Boolean(searchResult)) {
      setResultData(searchResult);
    }
    if (!isLoading && Boolean(isSparePart) && Boolean(sparePartsFiltered)) {
      setResultData(sparePartsFiltered);
    }
    if (!isLoading && Boolean(isService) && Boolean(servicesFiltered)) {
      setResultData(servicesFiltered);
    }
  }, [searchResult, sparePartsFiltered, servicesFiltered, isLoading]);

  const getKey = React.useCallback((car, index) => car.alias + index, []);
  const RenderFlatlistItem = React.useCallback(
    ({item, index}) => (
      <>
        <FavoritesComponent
          navigation={navigation}
          imgStyle={{marginHorizontal: -20}}
          car={isCar ? item : false}
          sparePart={Boolean(isSparePart) ? item : false}
          service={isService ? item : false}
          salon={false}
          isOwnCar={false}
          country={drawerCountry || country}
        />
        {data.length !== index + 1 && (
          <View style={{height: 5, backgroundColor: '#f2f1f6'}} />
        )}
      </>
    ),
    [drawerCountry],
  );
  // ---------- End Actual ----------

  const listTab = [
    {id: 0, name: 'Все'},
    {id: 1, name: 'Новые'},
    {id: 2, name: 'С пробегом'},
  ];

  // ---------- animation ----------
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(
      setData({
        brandForFilter: '',
        modelForFilter: '',
        regionForFilter: '',
        townForFilter: '',
      }),
    );
    setText('Марка');
  }, []);
  return (
    <SafeAreaView style={{backgroundColor: '#f2f1f6'}}>
      <Toast style={{zIndex: 10000}} ref={ref => Toast.setRef(ref)} />
      {/* ----- Start Body ----- */}
      <View style={{backgroundColor: 'white'}}>
        <FlatList
          ref={flatList}
          style={{paddingBottom: 50}}
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
          data={data}
          keyExtractor={getKey}
          renderItem={RenderFlatlistItem}
          ListHeaderComponent={() => (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* ----- Header Start ----- */}
              <View
                style={[
                  styles.headerBlock,
                  {marginHorizontal: 0, marginTop: 10},
                ]}>
                <GoBack
                  navigation={() => {
                    navigation.goBack();
                    if (Boolean(cleanBrandForFilter)) {
                      dispatch(
                        setData({
                          bottomNavStateIsSparePart: false,
                          brandForFilter: '',
                          modelForFilter: '',
                          regionForFilter: '',
                          townForFilter: '',
                        }),
                      );
                    }
                  }}
                />

                <View style={{marginLeft: -50}}>{IMAGE.LogoIcon}</View>
                <View />
              </View>
              {/* ----- Header End ----- */}
              {/* ----- Filter Start ----- */}
              <Card
                elevation={Platform.OS === 'android' ? 10 : 0}
                style={styles.FilterFilterBLock}>
                {/* ----- Start Marks ----- */}
                <TouchableOpacity
                  style={styles.FilterInputs}
                  onPress={() =>
                    navigation.navigate(
                      isService
                        ? 'ServiceCategory'
                        : Boolean(isSparePart)
                        ? 'PartsMarks'
                        : 'Marks',
                      {
                        cleanBrandForFilter,
                      },
                    )
                  }>
                  <View>
                    <Text
                      style={{
                        color: '#9C9C9C',
                        fontSize: 8,
                        marginBottom: 2,
                      }}>
                      {isService ? 'Категория' : 'Марка'}
                    </Text>
                    <Text
                      style={{
                        color:
                          (!isService && text !== 'Марка') ||
                          (isService && serviceForFilter !== '')
                            ? 'black'
                            : '#9C9C9C',
                      }}>
                      {text}
                    </Text>
                  </View>
                  {(!isService && text !== 'Марка') ||
                  (isService && serviceForFilter !== '') ? (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(
                          setData(
                            !isService
                              ? {brandForFilter: '', modelForFilter: ''}
                              : {serviceForFilter: ''},
                          ),
                        );
                      }}
                      style={styless.clearField}>
                      <Image
                        style={{width: 14, height: 14}}
                        source={require('../../assets/MinX.png')}
                      />
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>
                {/* ----- End Marks ----- */}

                <View
                  style={{
                    height: 1,
                    backgroundColor: '#F2F2F2',
                    marginVertical: 8.5,
                  }}
                />

                {/* ----- Start Models ----- */}
                <TouchableOpacity
                  style={styles.FilterInputs}
                  onPress={() => {
                    if (Boolean(isService)) {
                      return navigation.navigate('Region', {
                        cleanBrandForFilter,
                      });
                    }
                    if (brandForFilter !== '') {
                      navigation.navigate(
                        Boolean(isSparePart) ? 'PartsModels' : 'Models',
                        {
                          alias: brandForFilter.alias,
                          cleanBrandForFilter,
                        },
                      );
                    } else {
                      ToastShow('Сначала выберите марку', 3000, 'error', 'top');
                    }
                  }}>
                  <View>
                    <Text
                      style={{
                        color: '#9C9C9C',
                        fontSize: 8,
                        marginBottom: 2,
                      }}>
                      {Boolean(isService) ? 'Любой регион' : 'Модель'}
                    </Text>
                    <Text
                      style={{
                        color:
                          (modelForFilter !== '' && !isService) ||
                          (regionForFilter !== '' && isService)
                            ? 'black'
                            : '#9C9C9C',
                      }}>
                      {!Boolean(isService) && modelForFilter !== ''
                        ? modelForFilter.name
                        : Boolean(isService) && regionForFilter !== ''
                        ? `${regionForFilter.name}${
                            townForFilter !== ''
                              ? `, ${townForFilter.name}`
                              : ''
                          }`
                        : Boolean(isService)
                        ? 'Любой регион'
                        : 'Модель'}
                    </Text>
                  </View>
                  {modelForFilter !== '' ? (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setData({modelForFilter: ''}));
                      }}
                      style={styless.clearField}>
                      <Image
                        style={{width: 14, height: 14}}
                        source={require('../../assets/MinX.png')}
                      />
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>
                {/* ----- End Models ----- */}
              </Card>
              {/* ----- Filter End ----- */}
              {/* ----- Second Filter Start ----- */}
              <View
                style={{
                  marginTop: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '94%',
                  alignSelf: 'center',
                }}>
                {Boolean(isCar) && (
                  <>
                    <Card
                      elevation={Platform.OS === 'android' ? 10 : 0}
                      style={styles.FilterSecondBlock}>
                      <Image
                        style={{width: 16, height: 16, marginRight: 5}}
                        source={require('../../assets/MinFilterIcon.png')}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Parametrs', {country})
                        }
                        style={styles.FilterInnerButton}>
                        <Text>Параметры</Text>
                      </TouchableOpacity>
                    </Card>
                    <Card
                      elevation={Platform.OS === 'android' ? 10 : 0}
                      style={styles.FilterSecondBlock}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('MarksModel')}
                        style={styles.FilterInnerButton}>
                        <Text>Марка, модель</Text>
                      </TouchableOpacity>
                    </Card>
                  </>
                )}
                {!Boolean(isService) && (
                  <Card
                    elevation={Platform.OS === 'android' ? 10 : 0}
                    style={[
                      styles.FilterSecondBlock,
                      {width: Boolean(isCar) ? '31.3%' : '100%'},
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate(
                          Boolean(isSparePart) ? 'PartsRegion' : 'Region',
                          {cleanBrandForFilter},
                        );
                      }}
                      style={styles.FilterInnerButton}>
                      <Text>Любой регион</Text>
                    </TouchableOpacity>
                  </Card>
                )}
              </View>
              {/* ----- Second Filter End ----- */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                  marginVertical: 20,
                }}>
                <Text style={{color: '#9C9C9C', fontSize: 12}}>
                  {`${
                    Boolean(isSparePart)
                      ? Boolean(totalCounts.foundSparePartsCount)
                        ? totalCounts.foundSparePartsCount
                        : '0'
                      : isService
                      ? Boolean(totalCounts.foundServices)
                        ? totalCounts.foundServices
                        : '0'
                      : Boolean(totalCounts.foundCarsCount)
                      ? totalCounts.foundCarsCount
                      : '0'
                  } предложений`}
                </Text>
                <TouchableOpacity
                  onPress={() => setActualShow(!ActualShow)}
                  style={styles.fdRow}>
                  <Text
                    style={{
                      fontSize: 12,
                    }}>{`По ${filterBy.text.toLowerCase()}`}</Text>
                  <Image
                    style={{width: 16, height: 16}}
                    source={require('../../assets/actualIcon.png')}
                  />
                </TouchableOpacity>
              </View>
              {/* ----- Start ActualBox ----- */}
              {ActualShow && (
                <View style={styless.actualBox}>
                  {actualList.map((item, key) =>
                    item.text === 'Году: новее' ||
                    item.text === 'Году: cтарше' ? null : (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          setFilterBy(item);
                          setResultData(item.filter(data));
                          setActualShow(false);
                        }}
                        style={[
                          styless.row,
                          {
                            borderBottomWidth:
                              actualList.length === key + 1 ? 0 : 1,
                          },
                        ]}
                        key={key}>
                        <Text style={{fontSize: 18}}>{item.text}</Text>
                        <CheckboxComponent
                          isChecked={item.text === filterBy.text}
                          onClick={() => {
                            setFilterBy(item);
                            setResultData(item.filter(data));
                            setActualShow(false);
                          }}
                        />
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              )}
              {/* ----- End ActualBox ----- */}
            </ScrollView>
          )}
          ListFooterComponent={
            <View style={{marginVertical: 10}}>
              {isLoading || refreshing
                ? load
                : isNoData || data.length === 0
                ? noData
                : null}
            </View>
          }
          onEndReached={() => {
            if (
              (isCar &&
                totalCounts.foundCarsCount > data.length &&
                !isLoading) ||
              (Boolean(isSparePart) &&
                totalCounts.foundSparePartsCount > data.length &&
                !isLoading) ||
              (isService &&
                totalCounts.foundServices > data.length &&
                !isLoading)
            ) {
              setLoading(true);
              if (Boolean(isSparePart)) {
                dispatch(
                  getSparePartsFiltered(
                    {
                      page,
                      brand: brandForFilter.alias,
                      model: modelForFilter.alias,
                      region: regionForFilter.id,
                      town: townForFilter.id,
                    },
                    () => {
                      setLoading(false);
                      setRefreshing(false);
                    },
                  ),
                );
              }
              if (isService) {
                dispatch(
                  getServicesFiltered(
                    {
                      page,
                      region: regionForFilter.id,
                      town: townForFilter.id,
                    },
                    () => {
                      setLoading(false);
                      setRefreshing(false);
                    },
                  ),
                );
              }
              if (isCar) {
                getData(page);
              }
              setPage(parseInt(page) + 1);
            }
            if (
              (isCar &&
                data.length >= totalCounts.foundCarsCount &&
                !isLoading) ||
              (Boolean(isSparePart) &&
                data.length >= totalCounts.foundSparePartsCount &&
                !isLoading) ||
              (isService &&
                data.length >= totalCounts.foundServices &&
                !isLoading)
            ) {
              setNoData(true);
            }
          }}
          onEndReachedThreshold={0}
        />
      </View>
      {/* ----- End Body ----- */}
    </SafeAreaView>
  );
};

export default SearchPage;

const styless = StyleSheet.create({
  actualBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 25,
    paddingRight: 15,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#F2F2F2',
    paddingVertical: 5,
  },
  clearField: {
    zIndex: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
