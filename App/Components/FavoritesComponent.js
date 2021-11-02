import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';
import {connectAdvanced} from 'react-redux';
import {deleteCar, deleteService, deleteSparePart} from '../api';
import {getSimbol} from '../Screens/Home/HomeAds';

class FavoritesComponent extends Component {
  constructor(props) {
    super(props);

    const window = Dimensions.get('window');
    this.state = {
      openModal: false,
      height: window.height,
    };
  }

  render() {
    const {
      car,
      service,
      sparePart,
      navigation,
      imgStyle,
      isOwnCar,
      salon,
      dispatch,
      country,
      isAutoPage,
      setLoading,
    } = this.props;
    const state = car || service || sparePart;
    const navigate = () => {
      if (Boolean(isAutoPage)) {
        isAutoPage(state.alias);
      } else {
        navigation.navigate('AutoPage', {
          salon,
          isOwnCar,
          alias: state.alias,
          sparePart: Boolean(sparePart),
          service: Boolean(service),
        });
      }
    };
    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: Boolean(state.car_tarrif_highlights)
            ? `#${state.car_tarrif_highlights}`
            : 'white',
        }}>
        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.openModal}
          onRequestClose={() => this.setState({openModal: false})}>
          <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 30,
                marginTop: this.state.height / 3,
                marginHorizontal: 10,
                alignItems: 'center',
              }}>
              <Text style={{lineHeight: 21, marginTop: 20}}>
                Вы уверены, что хотите удалить?
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
                    setLoading(true);
                    if (Boolean(car)) {
                      dispatch(
                        deleteCar({alias: state.alias}, () =>
                          setLoading(false),
                        ),
                      );
                    }
                    if (Boolean(sparePart)) {
                      dispatch(
                        deleteSparePart({alias: state.alias}, () =>
                          setLoading(false),
                        ),
                      );
                    }
                    if (Boolean(service)) {
                      dispatch(
                        deleteService({alias: state.alias}, () =>
                          setLoading(false),
                        ),
                      );
                    }
                    this.setState({openModal: false});
                  }}>
                  <Text style={{fontSize: 16, color: '#EA4F3D'}}>Да</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({openModal: false})}>
                  <Text style={{fontSize: 16, color: '#EA4F3D'}}>Нет</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={navigate}
            style={{width: isOwnCar ? '50%' : '100%'}}>
            <Text>{Boolean(car) ? state.title : state.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {Boolean(state.price)
                  ? `${state.price}${
                      Boolean(sparePart) ? '$' : getSimbol[country]
                    }`
                  : 'Договорная'}
              </Text>
              {Boolean(state.secondary_price) && (
                <Text style={{marginLeft: 10, fontSize: 12, color: '#818181'}}>
                  {`${state.secondary_price} сом`}
                </Text>
              )}
            </View>
            <Text style={{fontSize: 10}}>
              {Boolean(state.region)
                ? `${state.region}, ${Boolean(state.town) ? state.town : ''}`
                : country === 'kg'
                ? 'Кыргызстан'
                : country === 'ru'
                ? 'Россия'
                : 'Казахстан'}
            </Text>
            <View
              style={{flexDirection: 'row', marginTop: 6, marginBottom: 11}}>
              <Image
                style={{width: 14, height: 14}}
                source={require('../assets/defaultAva.png')}
              />
              <Text style={{fontSize: 10, color: '#636363', marginLeft: 6}}>
                {Boolean(car)
                  ? Boolean(parseInt(state.upped_at)) &&
                    parseInt(state.upped_at_text.split(' ')[0]) > 0
                    ? state.upped_at_text
                    : state.date_text
                  : state.date_text}
              </Text>
            </View>

            {Boolean(car) && Boolean(car.car_tarrif_vips_expire) && (
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 11,
                }}>
                {/* <Image
                style={{width: 45, height: 20, marginRight: 10}}
                source={require('../assets/QuicklyIcon.png')}
              /> */}
                <Image
                  style={{width: 45, height: 20, marginRight: 10}}
                  source={require('../assets/VipIcon.png')}
                />
                {/* <Image
                style={{width: 57, height: 20}}
                source={require('../assets/TopIcon.png')}
              /> */}
              </View>
            )}
          </TouchableOpacity>

          {isOwnCar && (
            <View style={{alignItems: 'flex-start'}}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                  this.setState({openModal: true});
                }}>
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../assets/DumpsterIcon.png')}
                />
                <Text style={{color: '#686868', fontSize: 12, marginLeft: 10}}>
                  Удалить
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}
                onPress={() =>
                  navigation.navigate('UpdateAd', {
                    alias: state.alias,
                    isCar: Boolean(car),
                    isSparePart: Boolean(sparePart),
                    isService: Boolean(service),
                  })
                }>
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../assets/ChangeIcon.png')}
                />
                <Text style={{color: '#686868', fontSize: 12, marginLeft: 10}}>
                  Редактировать
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* ----- Start Image ----- */}
        <View>
          <ScrollView
            style={imgStyle}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {state.photos.map((url, key) => (
              <TouchableOpacity
                activeOpacity={1}
                style={{marginLeft: 5}}
                key={key}
                onPress={navigate}>
                <Image
                  style={{
                    width: 170,
                    height: 120,
                    borderRadius: 10,
                    marginBottom: 8,
                    marginLeft: key === 0 ? 8 : 0,
                  }}
                  source={{
                    uri:
                      url.split('/')[0] === 'https:'
                        ? url
                        : url.split('/')[0] === 'img' ||
                          url.split('/')[0] === 'assets'
                        ? `https://carket.kg/${url}`
                        : `https:${url}`,
                  }}
                />
              </TouchableOpacity>
            ))}
            {Boolean(state.phone) || Boolean(state.login) ? (
              <TouchableOpacity
                style={styles.call}
                onPress={() => {
                  Linking.openURL(
                    `tel:${
                      Boolean(state.phone) ? `+${state.phone}` : state.login
                    }`,
                  );
                }}>
                <Image
                  style={{width: 24, height: 24, marginBottom: 5}}
                  source={require('../assets/phone.png')}
                />
                <Text style={{color: 'white', fontSize: 12}}>Позвонить</Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </View>
        {/* ----- End Image ----- */}
        <View style={{flexDirection: 'row', marginTop: 8, marginLeft: -3}}>
          <View>
            {Boolean(state.mileage) && (
              <Text style={styles.textStyle}>{`${state.mileage} км`}</Text>
            )}
            {Boolean(state.car_fuel) && (
              <Text style={[styles.textStyle, {marginVertical: 5}]}>
                {state.car_fuel}
              </Text>
            )}
            {Boolean(state.car_transmission) && (
              <Text style={styles.textStyle}>{state.car_transmission}</Text>
            )}
          </View>
          {/* ---------------------- */}
          <View style={{marginLeft: 90}}>
            {Boolean(state.car_steering) && (
              <Text
                style={styles.textStyle}>{`${state.car_steering} руль`}</Text>
            )}
            {Boolean(state.car_carcase) && (
              <Text style={[styles.textStyle, {marginVertical: 5}]}>
                {state.car_carcase}
              </Text>
            )}
            {Boolean(state.color_name) && (
              <Text style={styles.textStyle}>{state.color_name}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const selectorFactory = dispatch => {
  return (_, props) => ({...props, dispatch});
};

export default connectAdvanced(selectorFactory)(FavoritesComponent);

const styles = StyleSheet.create({
  textStyle: {fontSize: 10, color: '#414141'},
  call: {
    width: 80,
    height: 120,
    backgroundColor: '#EA4F3D',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 5,
  },
});
