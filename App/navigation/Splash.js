import React, {useEffect} from 'react';
import {View, StatusBar} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import IMAGE from '../assets/SVG';
import styles from '../styles';

const Splash = nav => {
  useEffect(() => {
    setTimeout(() => {
      nav.navigation.replace('Drawer');
    }, 2000);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#EC392B" />
      <LinearGradient style={styles.container} colors={['#ed392b', '#a51208']}>
        {IMAGE.SplachScreenIcon}
      </LinearGradient>
    </>
  );
};

export default Splash;
