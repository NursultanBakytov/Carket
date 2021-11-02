import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getSalonsFiltered} from '../../api';
import HeaderComponent from '../../Components/HeaderComponent';
import {load, noData} from '../../Components/Loader';
import {setData} from '../../Store';

const AutoSalons = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {salonsFiltered, totalCounts} = useSelector(store => store.appReducer);

  const window = Dimensions.get('window');
  const [isLoading, setLoading] = React.useState(false);
  const [isNoData, setNoData] = React.useState(false);
  const [page, setPage] = React.useState(0);

  React.useEffect(() => {
    if (!isLoading && page === 0 && !Boolean(route.params?.new_salon)) {
      getData(page.toString());
    }
  }, []);
  React.useEffect(() => {
    if (Boolean(route.params?.new_salon)) {
      setLoading(true);
      setPage(0);
    }
  }, [route]);

  const getKey = React.useCallback(service => service.alias, []);
  const renderSalon = React.useCallback(
    ({item, index}) => (
      <View
        style={{
          marginRight: 0,
          marginBottom: 25,
          paddingRight: index % 2 === 0 ? 10 : 0,
          paddingLeft: index % 2 !== 0 ? 10 : 0,
          width: '50%',
          alignItems: 'center',
        }}
        key={item.alias + index}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AutosComponent', {
              salon: item,
              isOwnSalon: false,
            })
          }
          style={{width: '100%'}}>
          <Image
            resizeMode="cover"
            style={{width: '100%', height: 150, borderRadius: 10}}
            source={{
              uri: `https://carket.kg/img/salons/photo/${item.photo}`,
            }}
          />
          <Text style={{fontSize: 18, marginTop: 10}}>{item.name}</Text>
          <Text>{`Объявлений: ${item.all_advice}`}</Text>
          {item.address !== 'undefined' && (
            <Text style={{fontSize: 12, color: '#747474'}}>{item.address}</Text>
          )}
        </TouchableOpacity>
      </View>
    ),
    [],
  );

  const getData = page => {
    setLoading(true);
    dispatch(getSalonsFiltered({page}, () => setLoading(false), true));
  };
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent
        arrow={true}
        title="Автобизнес"
        navigation={{
          goBack: () => {
            navigation.navigate('Home');
          },
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />

      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        style={{
          marginHorizontal: 10,
          paddingTop: 40,
          alignSelf: 'center',
        }}
        data={salonsFiltered}
        keyExtractor={getKey}
        renderItem={renderSalon}
        ListFooterComponent={
          <View style={{marginBottom: isLoading ? 130 : 80}}>
            {isLoading ? load : isNoData ? noData : null}
          </View>
        }
        onEndReached={() => {
          let isLimit = salonsFiltered.length >= totalCounts?.all_salons;
          if (!isLimit && !isLoading) {
            getData(page + 1);
            setPage(page + 1);
          }
          if (isLimit) {
            setNoData(true);
          }
        }}
        onEndReachedThreshold={0}
      />
    </SafeAreaView>
  );
};

export default AutoSalons;
