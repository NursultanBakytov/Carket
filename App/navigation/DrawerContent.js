import React from 'react';
import {Text, View, TouchableOpacity, Image, Platform} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Card} from 'react-native-shadow-cards';

import IMAGE from '../assets/SVG';
import styles from '../styles';
// ************************************************************************

const DrawerContent = props => {
  return (
    <DrawerContentScrollView
      showsVerticalScrollIndicator={false}
      {...props}
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        // paddingTop: 75,
      }}>
      {/* <View>{IMAGE.LogoIcon}</View> */}

      {/* Start Screens */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Autos');
        }}
        style={[styles.BurgerText, {marginTop: 20}]}>
        <Image
          style={{width: 20, height: 20, marginRight: 10}}
          source={require('../assets/added.png')}
        />
        <Text>Автосалоны</Text>
      </TouchableOpacity>
      {/* ----------- */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Search', {
            isSparePart: false,
            isService: false,
            isCar: true,
            drawerCountry: 'ru',
          });
        }}
        style={styles.BurgerText}>
        <Image
          style={{width: 20, height: 20, marginRight: 10}}
          source={require('../assets/added.png')}
        />
        <Text>Авто в России</Text>
      </TouchableOpacity>
      {/* ----------- */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Search', {
            isSparePart: false,
            isService: false,
            isCar: true,
            drawerCountry: 'kz',
          });
        }}
        style={styles.BurgerText}>
        <Image
          style={{width: 20, height: 20, marginRight: 10}}
          source={require('../assets/added.png')}
        />
        <Text>Авто в Казахстане</Text>
      </TouchableOpacity>
      {/* ----------- */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('CreateBusinessProfile');
        }}
        style={styles.BurgerText}>
        <Image
          style={{width: 20, height: 20, marginRight: 10}}
          source={require('../assets/added.png')}
        />
        <Text>Бизнес Профиль</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Добавить');
        }}
        style={[styles.BurgerText, {borderBottomWidth: 0}]}>
        <Image
          style={{width: 20, height: 20, marginRight: 10}}
          source={require('../assets/added.png')}
        />
        <Text style={{color: '#000'}}>Добавить объявление</Text>
      </TouchableOpacity>

      {/* End Screens */}

      {/* <View style={styles.BurgerLine} /> */}

      {/* <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Профиль');
        }}
        style={{flexDirection: 'row', marginTop: 18}}>
        {IMAGE.BurgerParams}
        <Text style={{marginLeft: 15}}>Настройки приложения</Text>
      </TouchableOpacity> */}

      {/* Start Social Network */}
      <View style={styles.socialIconsBlock}>
        {/* --- Whats App --- */}
        <Card
          elevation={Platform.OS === 'ios' ? 0 : 5}
          style={styles.SocialShadow}>
          <TouchableOpacity style={styles.socialIconsStyle}>
            {IMAGE.WhatsappIcon}
          </TouchableOpacity>
        </Card>
        {/* --- Instagram --- */}
        <Card
          elevation={Platform.OS === 'ios' ? 0 : 5}
          style={styles.SocialShadow}>
          <TouchableOpacity style={styles.socialIconsStyle}>
            {IMAGE.InstagramIcon}
          </TouchableOpacity>
        </Card>
        {/* --- YouTube --- */}
        <Card
          elevation={Platform.OS === 'ios' ? 0 : 5}
          style={styles.SocialShadow}>
          <TouchableOpacity style={styles.socialIconsStyle}>
            {IMAGE.YouTubeIcon}
          </TouchableOpacity>
        </Card>
        {/* --- Facebook --- */}
        <Card
          elevation={Platform.OS === 'ios' ? 0 : 5}
          style={{...styles.SocialShadow}}>
          <TouchableOpacity style={styles.socialIconsStyle}>
            {IMAGE.FacebookIcon}
          </TouchableOpacity>
        </Card>
      </View>
      <View style={{marginVertical: 70}} />
      {/* End Social Network */}
    </DrawerContentScrollView>
  );
};
export default DrawerContent;

{
  //   const shadowOpt = {
  //     width:160,
  //     height:170,
  //     color:"#000",
  //     border:2,
  //     radius:3,
  //     opacity:0.2,
  //     x:0,
  //     y:3,
  //     style:{marginVertical:5}
  // }
  /* <Card>
<TouchableHighlight style={{
    positioCardelative",
    width: 160,
    height: 170,
    backgroundColor: "#fff",
    borderRadius:3,
    // marginVertical:5,
    overflow:"hidden"}}>
    …………………………
</TouchableHighlight>
</Card> */
}
