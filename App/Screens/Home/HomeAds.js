import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getCars, getSiteRates} from '../../api';
import {load} from '../../Components/Loader';
import {setData} from '../../Store';

export const getSimbol = {
  kg: '$',
  ru: '₽',
  kz: '₸',
};
const getURI = url => {
  return url.split('/')[0] === 'https:'
    ? url
    : url.split('/')[0] === 'img'
    ? `https://carket.kg/${url}`
    : `https:${url}`;
};

const HomeAds = ({navigation, header, scrollToTop, setScrollState}) => {
  const flatList = useRef();
  const dispatch = useDispatch();
  const {siteRates, newCars, totalCounts} = useSelector(
    store => store.appReducer,
  );

  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!Boolean(siteRates)) {
      dispatch(getSiteRates(() => setLoading(false)));
    }
  }, []);
  useEffect(() => {
    if (scrollToTop) {
      flatList.current.scrollToOffset({animated: true, offset: 0});
      setScrollState(false);
    }
  }, [scrollToTop]);

  const getKey = useCallback(car => car.alias);
  const renderItem = useCallback(({item, index}) => (
    <View
      style={{
        paddingRight: index % 2 === 0 ? 10 : 0,
        paddingLeft: index % 2 !== 0 ? 10 : 0,
        marginBottom: 20,
        width: '50%',
        borderRadius: 10,
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('AutoPage', {
            isOwnCar: false,
            salon: false,
            alias: item.alias,
            sparePart: false,
            service: false,
          })
        }>
        <Image
          resizeMode="cover"
          style={{
            width: '100%',
            borderRadius: 10,
            height: 120,
          }}
          source={{
            uri: getURI(item.photos[0]),
          }}
        />
      </TouchableOpacity>
      <View style={{paddingBottom: 11}}>
        <Text style={{fontSize: 10, marginTop: 10}}>
          {item.title.replace(/\s/g, ' ')}
        </Text>
        <View
          style={{
            flexDirection: item.price.length > 6 ? 'column' : 'row',
            alignItems: item.price.length > 6 ? 'flex-start' : 'center',
            marginVertical: 5,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
            }}>{`${item.price}$`}</Text>
          {Boolean(item.secondary_price) && (
            <Text
              style={{
                fontSize: 12,
                color: '#818181',
                marginLeft: item.price.length > 6 ? 0 : 10,
              }}>
              {`${item.secondary_price} сом`}
            </Text>
          )}
        </View>
        {/* <Text style={{fontSize: 10}}>{item.car_transmission}</Text> */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <Image
                style={{width: 14, height: 14}}
                source={require('../../assets/defaultAva.png')}
              /> */}
          <Text
            style={{
              fontSize: 10,
              color: '#818181',
            }}>
            {Boolean(item.upped_at_text) &&
            parseInt(item.upped_at_text.split(' ')[0]) > 0
              ? item.upped_at_text
              : item.date_text}
          </Text>
        </View>
      </View>
    </View>
  ));

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    dispatch(setData({newCars: []}));
    setRefreshing(true);
    dispatch(getCars({page: '0', per_page: 12}, () => setRefreshing(false)));
  }, []);
  return Boolean(newCars) ? (
    <View
      style={{
        paddingHorizontal: 15,
        paddingTop: 15,
        backgroundColor: 'white',
      }}>
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
        data={newCars}
        numColumns={2}
        keyExtractor={getKey}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListFooterComponent={() =>
          isLoading || refreshing ? (
            <View style={{marginVertical: 10}}>{load}</View>
          ) : null
        }
        onEndReached={() => {
          if (newCars.length < totalCounts.allNewCars && !isLoading) {
            setLoading(true);
            dispatch(getCars({page, per_page: 12}, () => setLoading(false)));
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0}
      />
    </View>
  ) : (
    load
  );
};

export default HomeAds;
