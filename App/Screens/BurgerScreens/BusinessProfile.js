import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import HeaderComponent from '../../Components/HeaderComponent';
import CustomInput from '../../Components/CustomInput';
import ImagePickBusiness from '../../Components/native/ImagePickBusiness';
import BusinessGraphick from './BusinessGraphick';
import ShadowButton from '../../Components/ShadowButton';
import {addTariffPlan, updateTariffPlan} from '../../api';
import {getCurrentPhotos} from '../Profile/UpdateAd';
import {useDispatch, useSelector} from 'react-redux';
import {ToastShow} from '../../Components/ToastShow';
import Toast from 'react-native-toast-message';

const BusinessProfile = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(store => store.appReducer);
  const {tariff, isBussines} = route.params;
  const window = Dimensions.get('window');
  const [width, setwidth] = useState(window.width);
  const [isLoading, setLoading] = useState(false);

  // ---------------------------------------------------
  const [ModalVisible, setModalVisible] = useState(false);
  // ---------------------------------------------------
  const [Logo, SetLogo] = useState(null);
  // ---------------------------------------------------
  const [Cover, SetCover] = useState(null);
  // ---------------------------------------------------
  const [Name, setName] = useState('');
  const [NameFocused, setNameFocused] = useState(false);
  // ---------------------------------------------------
  const [Description, setDescription] = useState('');
  const [DescriptionFocused, setDescriptionFocused] = useState(false);
  // ---------------------------------------------------
  const [Phone, setPhone] = useState('');
  const [PhoneFocused, setPhoneFocused] = useState(false);
  // ---------------------------------------------------
  const [WhatsApp, setWhatsApp] = useState('');
  const [WhatsAppFocused, setWhatsAppFocused] = useState(false);
  // ---------------------------------------------------
  const [Facebook, setFacebook] = useState('');
  const [FacebookFocused, setFacebookFocused] = useState(false);
  // ---------------------------------------------------
  const [Twitter, setTwitter] = useState('');
  const [TwitterFocused, setTwitterFocused] = useState(false);
  // ---------------------------------------------------
  const [Instagram, setInstagram] = useState('');
  const [InstagramFocused, setInstagramFocused] = useState(false);
  // ---------------------------------------------------
  const [Site, setSite] = useState('');
  const [SiteFocused, setSiteFocused] = useState(false);
  // ---------------------------------------------------
  const [Mail, setMail] = useState('');
  const [MailFocused, setMailFocused] = useState(false);
  // ---------------------------------------------------
  const [Adress, setAdress] = useState('');
  const [AdressFocused, setAdressFocused] = useState(false);
  // ************************************************************
  // -------------------Start Graphicks-------------------
  // ************************************************************
  let defaultTime = new Date(new Date().setHours(0, 0));
  const [Mon, setMon] = useState(false);
  const [ShowMon, setShowMon] = useState(false);
  const [ShowMonSec, setShowMonSec] = useState(false);
  const [MonFirst, setMonFirst] = useState(defaultTime);
  const [MonSecond, setMonSecond] = useState(defaultTime);
  // --------------------------------------------
  const [Tue, setTue] = useState(false);
  const [ShowTue, setShowTue] = useState(false);
  const [ShowTueSec, setShowTueSec] = useState(false);
  const [TueFirst, setTueFirst] = useState(defaultTime);
  const [TueSecond, setTueSecond] = useState(defaultTime);
  // --------------------------------------------
  const [Wed, setWed] = useState(false);
  const [ShowWed, setShowWed] = useState(false);
  const [ShowWedSec, setShowWedSec] = useState(false);
  const [WedFirst, setWedFirst] = useState(defaultTime);
  const [WedSecond, setWedSecond] = useState(defaultTime);
  // --------------------------------------------
  const [Thu, setThu] = useState(false);
  const [ShowThu, setShowThu] = useState(false);
  const [ShowThuSec, setShowThuSec] = useState(false);
  const [ThuFirst, setThuFirst] = useState(defaultTime);
  const [ThuSecond, setThuSecond] = useState(defaultTime);
  // --------------------------------------------
  const [Fri, setFri] = useState(false);
  const [ShowFri, setShowFri] = useState(false);
  const [ShowFriSec, setShowFriSec] = useState(false);
  const [FriFirst, setFriFirst] = useState(defaultTime);
  const [FriSecond, setFriSecond] = useState(defaultTime);
  // --------------------------------------------
  const [Sat, setSat] = useState(false);
  const [ShowSat, setShowSat] = useState(false);
  const [ShowSatSec, setShowSatSec] = useState(false);
  const [SatFirst, setSatFirst] = useState(defaultTime);
  const [SatSecond, setSatSecond] = useState(defaultTime);
  // --------------------------------------------
  const [Sun, setSun] = useState(false);
  const [ShowSun, setShowSun] = useState(false);
  const [ShowSunSec, setShowSunSec] = useState(false);
  const [SunFirst, setSunFirst] = useState(defaultTime);
  const [SunSecond, setSunSecond] = useState(defaultTime);
  // ************************************************************
  // --------------------End Graphicks-------------------
  // ************************************************************
  const getDateObj = str => {
    let arr = str.split(':');
    return new Date(new Date().setHours(parseInt(arr[0]), parseInt(arr[1])));
  };
  React.useEffect(() => {
    if (Boolean(isBussines)) {
      const {
        cover,
        photo,
        phone,
        name,
        description,
        site,
        email,
        social,
        schedule,
        address,
      } = user.bussines.salon_info;
      let photos = getCurrentPhotos([
          `img/salons/photo/${photo}`,
          `img/salons/cover/${cover}`,
        ]),
        worktime = {
          Monday: (str1, str2) => {
            let isInactive = str1 === '00:00' && str2 === '00:00';
            if (!isInactive) {
              setMonFirst(getDateObj(str1));
              setMonSecond(getDateObj(str2));
              setMon(true);
            } else {
              setMon(false);
            }
          },
          Tuesday: (str1, str2) => {
            let isInactive = str1 === '00:00' && str2 === '00:00';
            if (!isInactive) {
              setTueFirst(getDateObj(str1));
              setTueSecond(getDateObj(str2));
              setTue(true);
            } else {
              setTue(false);
            }
          },
          Wednesday: (str1, str2) => {
            let isInactive = str1 === '00:00' && str2 === '00:00';
            if (!isInactive) {
              setWedFirst(getDateObj(str1));
              setWedSecond(getDateObj(str2));
              setWed(true);
            } else {
              setWed(false);
            }
          },
          Thursday: (str1, str2) => {
            let isInactive = str1 === '00:00' && str2 === '00:00';
            if (!isInactive) {
              setThuFirst(getDateObj(str1));
              setThuSecond(getDateObj(str2));
              setThu(true);
            } else {
              setThu(false);
            }
          },
          Friday: (str1, str2) => {
            let isInactive = str1 === '00:00' && str2 === '00:00';
            if (!isInactive) {
              setFriFirst(getDateObj(str1));
              setFriSecond(getDateObj(str2));
              setFri(true);
            } else {
              setFri(false);
            }
          },
          Saturday: (str1, str2) => {
            let isInactive = str1 === '00:00' && str2 === '00:00';
            if (!isInactive) {
              setSatFirst(getDateObj(str1));
              setSatSecond(getDateObj(str2));
              setSat(true);
            } else {
              setSat(false);
            }
          },
          Sunday: (str1, str2) => {
            let isInactive = str1 === '00:00' && str2 === '00:00';
            if (!isInactive) {
              setSunFirst(getDateObj(str1));
              setSunSecond(getDateObj(str2));
              setSun(true);
            } else {
              setSun(false);
            }
          },
        };
      SetLogo(photos[0]);
      SetCover(photos[1]);
      setPhone(phone);
      setName(name);
      setDescription(description);
      setSite(site);
      setMail(email);
      setAdress(address);
      if (Boolean(social)) {
        setFacebook(social.facebook ? social.facebook : '');
        setWhatsApp(social.watsapp ? social.watsapp : '');
        setInstagram(social.facebook ? social.facebook : '');
        setTwitter(social.facebook ? social.facebook : '');
      }
      for (let key in worktime) {
        if (Boolean(schedule.time_in[key])) {
          worktime[key](schedule.time_in[key], schedule.time_at[key]);
        }
      }
    }
    if (parseInt(user.user_data.balance) < parseInt(tariff.price)) {
      setModalVisible(true);
    }
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setwidth(width);
      } else {
        setwidth(width);
      }
      setwidth(width);
    });
  }, []);

  const submitHandler = () => {
    if (parseInt(user.user_data.balance) < parseInt(tariff.price)) {
      return setModalVisible(true);
    }
    setLoading(true);
    const getDateStr = date => {
      return `${date.getHours() === 0 ? '00' : date.getHours()}:${
        date.getMinutes() === 0 ? '00' : date.getMinutes()
      }`;
    };
    const data = {
      name: Name,
      description: Description,
      photo: Logo,
      cover: Cover,
      phone: Phone,
      site: Site,
      email: Mail,
      address: Adress,
      'social[facebook]': Facebook,
      'social[instagram]': Instagram,
      'social[twitter]': Twitter,
      'social[whatsapp]': WhatsApp,
      'time_at[1]': Mon ? getDateStr(MonSecond) : '',
      'time_at[2]': Tue ? getDateStr(TueSecond) : '',
      'time_at[3]': Wed ? getDateStr(WedSecond) : '',
      'time_at[4]': Thu ? getDateStr(ThuSecond) : '',
      'time_at[5]': Fri ? getDateStr(FriSecond) : '',
      'time_at[6]': Sat ? getDateStr(SatSecond) : '',
      'time_at[7]': Sun ? getDateStr(SunSecond) : '',
      'time_in[1]': Mon ? getDateStr(MonFirst) : '',
      'time_in[2]': Tue ? getDateStr(TueFirst) : '',
      'time_in[3]': Wed ? getDateStr(WedFirst) : '',
      'time_in[4]': Thu ? getDateStr(ThuFirst) : '',
      'time_in[5]': Fri ? getDateStr(FriFirst) : '',
      'time_in[6]': Sat ? getDateStr(SatFirst) : '',
      'time_in[7]': Sun ? getDateStr(SunFirst) : '',
      listing: tariff.id,
    };

    if (Boolean(isBussines)) {
      data.salon_id = user.bussines.salon_info.id;
      dispatch(
        updateTariffPlan(data, success => {
          setLoading(false);
          if (success) {
            setTimeout(() => {
              navigation.navigate('Профиль');
            }, 1000);
            ToastShow('Данные успешно обновлены!', 2000, 'success');
          }
        }),
      );
    } else {
      dispatch(
        addTariffPlan(data, success => {
          setLoading(false);
          if (success) {
            setTimeout(() => {
              navigation.navigate('Autos', {new_salon: true});
            }, 1000);
            ToastShow('Бизнес аккаунт создан!', 2000, 'success');
          }
        }),
      );
    }
  };
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <Toast style={{zIndex: 10000}} ref={ref => Toast.setRef(ref)} />
      <HeaderComponent
        arrow={true}
        title="Бизнес профиль"
        navigation={navigation}
      />
      <Modal
        transparent={true}
        animationType="slide"
        visible={ModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => setModalVisible(false)}>
          <View
            style={{
              backgroundColor: 'white',
              minHeight: 184,
              paddingHorizontal: 41,
              paddingBottom: 24,
              paddingTop: 40,
              elevation: 5,
              borderRadius: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                marginBottom: 50,
                fontSize: 16,
                lineHeight: 19,
              }}>{`Чтоб перейти на\nбизнес профиль вам надо\nпополнить баланс на ${
              parseInt(tariff.price) - parseInt(user.user_data.balance)
            } сом`}</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{color: '#8A8A8A'}}
                onPress={() => setModalVisible(false)}>
                Отмена
              </Text>
              <Text
                style={{color: '#EA4F3D'}}
                onPress={() => {
                  navigation.navigate('Balance');
                  setModalVisible(false);
                }}>
                Пополнить баланс
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <ScrollView style={{marginBottom: 65}}>
        {/* ----- Start Iputs ----- */}
        <CustomInput
          value={Name}
          Title="Название"
          Placeholder="Название"
          setValueFocused={setNameFocused}
          ValueFocused={NameFocused}
          onChange={setName}
        />
        <CustomInput
          value={Description}
          Title="Описание"
          Placeholder="Описание"
          setValueFocused={setDescriptionFocused}
          ValueFocused={DescriptionFocused}
          onChange={setDescription}
        />
        {/* ----- logo ----- */}
        <Text
          style={{
            color: '#9c9c9c',
            fontSize: 16,
            marginLeft: 18,
            marginTop: 30,
          }}>
          Логотип
        </Text>
        {Boolean(Logo) && (
          <View
            style={{
              width: width - 20,
              position: 'relative',
              marginHorizontal: 10,
            }}>
            <Image
              source={{
                uri: Logo.uri,
              }}
              style={{
                width: '100%',
                height: 100,
                borderRadius: 5,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                SetLogo(null);
              }}
              style={{
                width: 25,
                height: 25,
                position: 'absolute',
                right: 0,
                top: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#3a3a3a',
                borderRadius: 12.5,
              }}>
              <Image
                resizeMode="stretch"
                source={require('../../assets/X.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
        )}
        <ImagePickBusiness
          ToastShow={ToastShow}
          image={Logo}
          setImage={SetLogo}
        />
        {/* ----- cover ----- */}
        <Text
          style={{
            color: '#9c9c9c',
            fontSize: 16,
            marginLeft: 18,
            marginTop: 30,
          }}>
          Обложка
        </Text>
        {Boolean(Cover) && (
          <View
            style={{
              width: width - 20,
              position: 'relative',
              marginHorizontal: 10,
            }}>
            <Image
              resizeMode="stretch"
              source={{
                uri: Cover.uri,
              }}
              style={{
                width: '100%',
                height: 100,
                borderRadius: 5,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                SetCover(null);
              }}
              style={{
                width: 25,
                height: 25,
                position: 'absolute',
                right: 0,
                top: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#3a3a3a',
                borderRadius: 12.5,
              }}>
              <Image
                source={require('../../assets/X.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
        )}
        <ImagePickBusiness
          ToastShow={ToastShow}
          image={Cover}
          setImage={SetCover}
        />
        {/* ------------- */}
        <CustomInput
          value={Phone}
          Title="Телефон"
          keyboardType="number-pad"
          Placeholder="0XXX 00 00 00"
          setValueFocused={setPhoneFocused}
          ValueFocused={PhoneFocused}
          onChange={setPhone}
        />
        <CustomInput
          value={WhatsApp}
          Title="WhatsApp"
          Placeholder="WhatsApp"
          setValueFocused={setWhatsAppFocused}
          ValueFocused={WhatsAppFocused}
          onChange={setWhatsApp}
        />
        <CustomInput
          value={Facebook}
          Title="Facebook"
          Placeholder="Facebook"
          setValueFocused={setFacebookFocused}
          ValueFocused={FacebookFocused}
          onChange={setFacebook}
        />
        <CustomInput
          value={Instagram}
          Title="Instagram"
          Placeholder="Instagram"
          setValueFocused={setInstagramFocused}
          ValueFocused={InstagramFocused}
          onChange={setInstagram}
        />
        <CustomInput
          value={Twitter}
          Title="Twitter"
          Placeholder="Twitter"
          setValueFocused={setTwitterFocused}
          ValueFocused={TwitterFocused}
          onChange={setTwitter}
        />
        <CustomInput
          value={Site}
          Title="Сайт"
          Placeholder="Сайт"
          setValueFocused={setSiteFocused}
          ValueFocused={SiteFocused}
          onChange={setSite}
        />
        <CustomInput
          value={Mail}
          Title="Почта"
          Placeholder="Почта"
          setValueFocused={setMailFocused}
          ValueFocused={MailFocused}
          onChange={setMail}
        />
        <CustomInput
          value={Adress}
          Title="Адрес"
          Placeholder="Адрес"
          setValueFocused={setAdressFocused}
          ValueFocused={AdressFocused}
          onChange={setAdress}
        />
        <Text
          style={{
            fontSize: 16,
            marginLeft: 18,
            marginTop: 45,
            marginBottom: 10,
          }}>
          График работы
        </Text>
        <BusinessGraphick
          bussines={Boolean(isBussines)}
          setShow={setShowMon}
          show={ShowMon}
          setShowSecond={setShowMonSec}
          showSecond={ShowMonSec}
          date={MonFirst}
          setDate={setMonFirst}
          dateSecond={MonSecond}
          setDateSecond={setMonSecond}
          state={Mon}
          setState={setMon}
          label="Пн"
        />
        <BusinessGraphick
          bussines={Boolean(isBussines)}
          setShow={setShowTue}
          show={ShowTue}
          setShowSecond={setShowTueSec}
          showSecond={ShowTueSec}
          date={TueFirst}
          setDate={setTueFirst}
          dateSecond={TueSecond}
          setDateSecond={setTueSecond}
          state={Tue}
          setState={setTue}
          label="Вт"
        />
        <BusinessGraphick
          bussines={Boolean(isBussines)}
          setShow={setShowWed}
          show={ShowWed}
          setShowSecond={setShowWedSec}
          showSecond={ShowWedSec}
          date={WedFirst}
          setDate={setWedFirst}
          dateSecond={WedSecond}
          setDateSecond={setWedSecond}
          state={Wed}
          setState={setWed}
          label="Ср"
        />
        <BusinessGraphick
          bussines={Boolean(isBussines)}
          setShow={setShowThu}
          show={ShowThu}
          setShowSecond={setShowThuSec}
          showSecond={ShowThuSec}
          date={ThuFirst}
          setDate={setThuFirst}
          dateSecond={ThuSecond}
          setDateSecond={setThuSecond}
          state={Thu}
          setState={setThu}
          label="Чт"
        />
        <BusinessGraphick
          bussines={Boolean(isBussines)}
          setShow={setShowFri}
          show={ShowFri}
          setShowSecond={setShowFriSec}
          showSecond={ShowFriSec}
          date={FriFirst}
          setDate={setFriFirst}
          dateSecond={FriSecond}
          setDateSecond={setFriSecond}
          state={Fri}
          setState={setFri}
          label="Пт"
        />
        <BusinessGraphick
          bussines={Boolean(isBussines)}
          setShow={setShowSat}
          show={ShowSat}
          setShowSecond={setShowSatSec}
          showSecond={ShowSatSec}
          date={SatFirst}
          setDate={setSatFirst}
          dateSecond={SatSecond}
          setDateSecond={setSatSecond}
          state={Sat}
          setState={setSat}
          label="Сб"
        />
        <BusinessGraphick
          bussines={Boolean(isBussines)}
          setShow={setShowSun}
          show={ShowSun}
          setShowSecond={setShowSunSec}
          showSecond={ShowSunSec}
          date={SunFirst}
          setDate={setSunFirst}
          dateSecond={SunSecond}
          setDateSecond={setSunSecond}
          state={Sun}
          setState={setSun}
          label="Вс"
        />

        <View style={{marginVertical: 40}} />
        <ShadowButton
          width="90%"
          text={Boolean(isBussines) ? 'СОХРАНИТЬ' : 'СОЗДАТЬ'}
          Press={submitHandler}
          isLoading={isLoading}
        />
        <View style={{marginVertical: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusinessProfile;
