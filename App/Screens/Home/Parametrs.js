import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useDispatch, useSelector} from 'react-redux';

import styles from '../../styles';
import ShadowButton from '../../Components/ShadowButton';
import GoBack from '../../Components/GoBack';
import CustomInput from '../../Components/CustomInput';
import {pickerStyles, pickerWrapper, SimpleSelect} from '../Add/InputComponent';
import {
  getBrandModels,
  getBrands,
  getCarcase,
  getCarsFiltered,
  getColors,
  getDrive,
  getFuels,
  getGeneration,
  getModification,
  getSteering,
  getTransmission,
} from '../../api';
import {setData} from '../../Store';

const Parametrs = ({navigation, route}) => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const {country} = route.params;
  const [isLoading, setLoading] = useState(false);
  // ----------------------------------------------
  const [Year, setYear] = useState('');
  // ----------------------------------------------
  const [price_from, setPriceFrom] = useState('');
  const [price_to, setPriceTo] = useState('');
  // ----------------------------------------------
  const [Color, setColor] = useState('');
  const [Transmission, setTransmission] = useState('');
  // ----------------------------------------------
  const [Carcase, setCarcase] = useState('');
  const [Fuel, setFuel] = useState('');
  // ----------------------------------------------
  const [Marka, setMarka] = useState('Марка');
  const [Model, setModel] = useState('Модель');
  // ----------------------------------------------
  const [Drive, setDrive] = useState('');
  const [Series, setSeries] = useState('');
  const [Type, setType] = useState('');
  // ----------------------------------------------
  const [Steering, setSteering] = useState('');
  const [modelYears, setModelYears] = useState([]);
  const [models, setModels] = useState({brandAlias: Marka});
  const [modifications, setModifications] = useState({generationAlias: Type});

  React.useEffect(() => {
    // Получение Моделей бренда
    if (
      models.brandAlias !== Marka &&
      Marka !== 'Марка' &&
      Boolean(state.models)
    ) {
      if (Boolean(state.models[Marka])) {
        setModels(state.models[Marka]);
      } else {
        dispatch(getBrandModels({brand: Marka}));
      }
    }
    // Получение Поколении по параметрам
    if (
      state.generation.year !== Year &&
      Year !== 'Год выпуска' &&
      Marka !== 'Марка' &&
      Model !== 'Модель'
    ) {
      dispatch(getGeneration({brand: Marka, model: Model, year: Year}));
    }
    // Получаем Модификации выбранной поколении
    if (modifications.generationAlias !== Type && Series !== 'Модификация') {
      if (state.modification[Type]) {
        setModifications(state.modification[Type]);
      } else {
        dispatch(getModification({generation: Type}));
      }
    }
    if (
      state.alert.message === 'Нет информации.' &&
      modifications.generationAlias !== Type &&
      Series !== 'Модификация'
    ) {
      setModifications({generationAlias: Type});
    }
  }, [state, Marka, Model, Year, Type, models, modifications]);
  React.useEffect(() => {
    // Получение всех Руль
    if (!Boolean(state.steering)) {
      dispatch(getSteering());
    }
    // Получение всех Кузовов
    if (!Boolean(state.carcase)) {
      dispatch(getCarcase());
    }
    // Получение всех Топливо
    if (!Boolean(state.fuels)) {
      dispatch(getFuels());
    }
    // Получение всех Приводов
    if (!Boolean(state.drive)) {
      dispatch(getDrive());
    }
    // Получение всех КПП
    if (!Boolean(state.transmission)) {
      dispatch(getTransmission());
    }
    // Получение всех Цветов автомобиля
    if (!Boolean(state.colors)) {
      dispatch(getColors());
    }
    // Получение всех Брендов
    if (!Boolean(state.brands)) {
      dispatch(getBrands());
    }
  }, []);
  const getData = () => {
    setLoading(true);
    let data = {
      page: '0',
      brand: Marka !== 'Марка' ? Marka : '',
      model: Model !== 'Модель' ? Model : '',
      year: Year !== 'Год выпуска' ? Year : '',
      price_from,
      price_to,
      transmission: Transmission !== 'КПП' ? Transmission : '',
      carcase: Carcase !== 'Кузов' ? Carcase : '',
      drive: Drive !== 'Привод' ? Drive : '',
      color: Color,
      steering: Steering !== 'Руль' ? Steering : '',
      modification: Series !== 'Модификация' ? Series : '',
      country,
    };
    dispatch(setData({params: data}));
    dispatch(
      getCarsFiltered(data, json => {
        setLoading(false);
        if (Boolean(json)) {
          navigation.navigate('Search', {
            isCar: true,
            showParamsResult: true,
            isSparePart: false,
            isService: false,
            drawerCountry: false,
          });
        } else {
          alert('Машины не найдены');
        }
      }),
    );
  };
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <GoBack navigation={() => navigation.goBack()} />
        {/* -------------------- */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            marginVertical: 20,
            marginLeft: 17,
          }}>
          Параметры
        </Text>
        <View style={{paddingHorizontal: 20}}>
          <SimpleSelect
            state={Marka}
            setState={alias => {
              setMarka(alias);
              if (alias !== 'Марка') {
                dispatch(
                  setData({
                    brandForFilter: state.brands.filter(
                      item => item.alias === alias,
                    )[0],
                  }),
                );
              }
            }}
            defaultValue="Марка"
            data={state.brands}
            isLoading={Boolean(state.brands)}
          />
          {/* ------------ */}
          <SimpleSelect
            state={Model}
            setState={value => {
              if (value !== 'Модель') {
                let currentModel = models.data.filter(
                  model => model.alias === value,
                )[0];
                let years = [];
                for (let i = currentModel.c_to; i >= currentModel.c_from; i--) {
                  years.push(i.toString());
                }
                setModelYears(years);
                dispatch(setData({modelForFilter: currentModel}));
              }
              setModel(value);
            }}
            defaultValue="Модель"
            data={models.data}
            isLoading={models.brandAlias === Marka}
          />
          {/* -------------------- */}
          <View style={pickerWrapper}>
            <Picker
              onValueChange={value => {
                setYear(value);
              }}
              selectedValue={Year}
              dropdownIconColor="#000000"
              style={pickerStyles}>
              <Picker.Item label="Год выпуска" value="Год выпуска" />
              {Boolean(modelYears) &&
                modelYears.map((str, index) => (
                  <Picker.Item label={str} value={str} key={index} />
                ))}
            </Picker>
          </View>
          {/* ------------ */}
          <SimpleSelect
            state={Type}
            setState={setType}
            defaultValue="Поколение"
            data={state.generation.data}
            isLoading={state.generation.year === Year}
          />
          {/* ------------ */}
          <SimpleSelect
            state={Series}
            setState={setSeries}
            defaultValue="Модификация"
            data={modifications.data}
            isLoading={modifications.generationAlias === Type}
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="Руль"
            state={Steering}
            setState={setSteering}
            data={state.steering}
            isLoading={Boolean(state.steering)}
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="Кузов"
            state={Carcase}
            setState={setCarcase}
            data={state.carcase}
            isLoading={Boolean(state.carcase)}
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="Топливо"
            state={Fuel}
            setState={setFuel}
            data={state.fuels}
            isLoading={Boolean(state.fuels)}
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="Привод"
            state={Drive}
            setState={setDrive}
            data={state.drive}
            isLoading={Boolean(state.drive)}
          />
          {/* ------------ */}
          <SimpleSelect
            defaultValue="КПП"
            state={Transmission}
            setState={setTransmission}
            data={state.transmission}
            isLoading={Boolean(state.transmission)}
          />
          <Text style={styles.AddPageTitleStyles}>Цвет автомобиля</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {state.colors &&
              state.colors.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    marginRight: state.colors.length === index + 1 ? 0 : 15,
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                    alignItems: 'center',
                    elevation: 0.5,
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  }}>
                  <TouchableOpacity
                    onPress={() => setColor(item.id)}
                    activeOpacity={1}
                    style={{
                      backgroundColor: 'white',
                      width: 28,
                      height: 28,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // padding: 4,
                    }}>
                    <View
                      style={{
                        backgroundColor: `#${item.hex}`,
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: 50,
                      }}>
                      <Image
                        style={{
                          width: 24,
                          height: 24,
                          opacity: Color === item.id ? 1 : 0,
                          alignSelf: 'center',
                        }}
                        source={
                          item.alias === 'white' || item.alias === 'beige'
                            ? require('../../assets/CheckIcon.png')
                            : require('../../assets/DoneIcon.png')
                        }
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
          {/* --------------------------- */}
          <CustomInput
            keyboardType="number-pad"
            value={price_from}
            Title="Цена от"
            Placeholder="Цена от"
            onChange={setPriceFrom}
            WIDTH="100%"
          />
          <CustomInput
            keyboardType="number-pad"
            value={price_to}
            Title="Цена до"
            Placeholder="Цена до"
            onChange={setPriceTo}
            WIDTH="100%"
          />
          {/*  ----- Start Button ----- */}
          <View style={{marginVertical: 40}} />

          <View style={{marginVertical: 40}} />
          {/*  ----- End Button ----- */}
        </View>
      </ScrollView>

      <ShadowButton
        width="80%"
        text="Показать объявления"
        Press={() => getData()}
        isLoading={isLoading}
        fixed
      />
    </SafeAreaView>
  );
};

export default Parametrs;
