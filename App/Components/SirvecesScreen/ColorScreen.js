import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Slider} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {addHighlight, getSiteHighlights} from '../../api';
import {setData} from '../../Store';

import styles from '../../styles';
import HeaderComponent from '../HeaderComponent';
import ShadowButton from '../ShadowButton';
import {ToastShow} from '../ToastShow';

const ColorScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);

  const [LineSlider, setLineSlider] = useState(5);
  const [color, setColor] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const {alias} = route.params;

  React.useEffect(() => {
    if (!Boolean(state.siteHighlights)) {
      dispatch(getSiteHighlights());
    }
    if (Boolean(state.siteHighlights) && !color) {
      dispatch(setData({alert: {message: 'success', severity: 'success'}}));
      setColor(state.siteHighlights[0]);
    }
  }, [state]);

  const Line = ({top, bottom}) => (
    <View
      style={{
        backgroundColor: '#D9D9D9',
        height: 1,
        marginTop: top || 30,
        marginBottom: bottom || 20,
      }}
    />
  );

  return (
    <SafeAreaView>
      <Toast style={{zIndex: 1}} ref={ref => Toast.setRef(ref)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
        <HeaderComponent
          arrow={true}
          title="Выделить цветом"
          navigation={navigation}
        />
        <View style={styles.ph20}>
          <Text style={{marginTop: 20, fontSize: 16, fontWeight: '900'}}>
            Выделить цветом
          </Text>
          <Text
            style={{
              color: '#3C3C3C',
              fontSize: 12,
              marginTop: 15,
              lineHeight: 21,
            }}>
            Отличная возможность выделить объявление среди других - в
            результатах поиска оно будет привлекать больше внимания
            пользователей.
          </Text>
          <Line />
          <View style={[styles.fdRow, {justifyContent: 'space-between'}]}>
            <Text style={styles.fsz16}>Стоимость услуги</Text>
            <Text style={styles.fsz16}>10 ед/день</Text>
          </View>
          <Line top={20} bottom={15} />
          <View
            style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
            <View
              style={[
                styles.fdRow,
                {justifyContent: 'space-between', marginBottom: 10},
              ]}>
              <Text style={styles.fsz16}>Количество дней</Text>
              <Text style={styles.fsz16}>{LineSlider}</Text>
            </View>
            <Slider
              value={LineSlider}
              maximumValue={10}
              minimumValue={1}
              step={1}
              trackStyle={{height: 3, backgroundColor: '#EA4F3D'}}
              thumbStyle={{
                height: 25,
                width: 25,
                backgroundColor: 'rgba(0,0,0,0.1)',
              }}
              minimumTrackTintColor="#EA4F3D"
              onValueChange={setLineSlider}
              thumbProps={{
                Component: Animated.Image,
                source: require('../../assets/Slider.png'),
                height: 3,
              }}
            />
          </View>
          <Line top={10} />
          <View
            style={[
              styles.fdRow,
              {justifyContent: 'space-between', marginBottom: 10},
            ]}>
            <Text style={styles.fsz16}>Выберите цвет</Text>
            <Text style={styles.fsz16}>{color.name}</Text>
          </View>
          <View style={[styles.fdRow, {justifyContent: 'space-between'}]}>
            {Boolean(state.siteHighlights) &&
              state.siteHighlights.map(item => (
                <View
                  key={item.alias}
                  style={{
                    width: 45,
                    borderRadius: 50,
                    alignItems: 'center',
                    height: 45,
                    marginTop: 20,
                    elevation: 0.5,
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  }}>
                  <TouchableOpacity
                    onPress={() => setColor(item)}
                    activeOpacity={1}
                    style={{
                      backgroundColor: 'white',
                      width: 43,
                      height: 43,
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 4,
                    }}>
                    <View
                      style={{
                        backgroundColor: `#${item.hex}`,
                        justifyContent: 'center',
                        width: 35,
                        height: 35,
                        borderRadius: 50,
                      }}>
                      <Image
                        style={{
                          width: 24,
                          opacity: color.id === item.id ? 1 : 0,
                          height: 24,
                          alignSelf: 'center',
                        }}
                        source={require('../../assets/DoneIcon.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
          {/* ------------ Start Balance ------------ */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 40,
            }}>
            <Text style={{fontSize: 16}}>Текущий баланс</Text>
            <Text
              style={{
                color: '#EA4F3D',
                fontSize: 16,
              }}>{`${state.user.user_data.balance} ед`}</Text>
          </View>
          {10 * LineSlider > state.user.user_data.balance && (
            <Text style={{color: '#FF5C5C', marginTop: 15}}>
              Недостаточно средств на балансе
            </Text>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('Balance')}
            style={[
              styles.fdRow,
              {justifyContent: 'space-between', marginTop: 15},
            ]}>
            <View style={styles.fdRow}>
              <Image
                style={{width: 24, height: 24}}
                source={require('../../assets/VipReplenishIcon.png')}
              />
              <Text style={{color: '#EA4F3D', marginLeft: 8}}>
                Пополнить баланс
              </Text>
            </View>
            <Image
              style={{width: 24, height: 24}}
              source={require('../../assets/VipRedArrow.png')}
            />
          </TouchableOpacity>
          <View style={{marginVertical: 30}} />
          <ShadowButton
            width="90%"
            text={`Оплатить ${10 * LineSlider} ЕД`}
            Press={() => {
              setLoading(true);
              dispatch(
                addHighlight(
                  {
                    color_id: color.id,
                    days: LineSlider,
                    alias,
                  },
                  res => {
                    setLoading(false);
                    if (res) {
                      ToastShow(res.message, 2000, 'success');
                    }
                  },
                ),
              );
            }}
            isLoading={isLoading}
          />
          <View style={{marginVertical: 40}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ColorScreen;
