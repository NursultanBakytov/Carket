import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import HeaderComponent from '../../Components/HeaderComponent';
import CustomInput from '../../Components/CustomInput';
import styles from '../../styles';
import ShadowButton from '../../Components/ShadowButton';
import {useDispatch} from 'react-redux';
import {setData} from '../../Store';
import {balanceReplenishment} from '../../api';

const VisaPay = ({navigation}) => {
  const dispatch = useDispatch();

  const [sum, setSum] = useState('');
  const [SumFocused, setSumFocused] = useState(false);
  const [isLoading, setLoading] = useState(false);

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent
        arrow={true}
        title="Пополнение через платежную карту"
        navigation={navigation}
      />
      {/* ----- Start Body ----- */}
      <View style={[styles.ph20, {alignItems: 'center'}]}>
        {/* ----- Icon ----- */}
        <TouchableOpacity style={styless.visaBlock}>
          <Image
            resizeMode="contain"
            style={{width: 58, height: 58}}
            source={require('../../assets/Visa.png')}
          />
        </TouchableOpacity>
        {/* -----  ----- */}

        {/* -----  ----- */}
      </View>
      <View style={{alignSelf: 'center', marginTop: 44, width: '100%'}}>
        <CustomInput
          keyboardType="number-pad"
          value={sum}
          Title="Сумма пополнения"
          Placeholder="Сумма пополнения"
          setValueFocused={setSumFocused}
          ValueFocused={SumFocused}
          onChange={setSum}
        />
        <View style={{marginVertical: 14.5}} />
        <ShadowButton
          text="ПОПОЛНИТЬ"
          Press={() => {
            setLoading(true);
            if (parseInt(sum) > 0) {
              dispatch(
                balanceReplenishment({sum, payment_system: 'card'}, success => {
                  setLoading(false);
                  if (success) {
                    navigation.navigate('WebView');
                  }
                }),
              );
            } else {
              setLoading(false);
              dispatch(
                setData({
                  alert: {message: 'Введите сумму!', severity: 'error'},
                }),
              );
            }
          }}
          isLoading={isLoading}
        />
      </View>
      {/* ----- End Body ----- */}
    </SafeAreaView>
  );
};

export default VisaPay;

const styless = StyleSheet.create({
  visaBlock: {
    width: 95,
    height: 95,
    borderRadius: 4,
    borderColor: '#C4C4C4',
    marginTop: 40,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 10,
    alignItems: 'center',
  },
});
