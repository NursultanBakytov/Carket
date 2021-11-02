import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {WebView} from 'react-native-webview';
import HeaderComponent from '../../Components/HeaderComponent';

export default function WebViewScreen({navigation}) {
  const {webViewData} = useSelector(store => store.appReducer);
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />
      <HeaderComponent
        arrow={true}
        title="Пополнение баланса"
        navigation={navigation}
      />

      <WebView
        originWhitelist={['*']}
        source={{html: `${webViewData}`}}
        sharedCookiesEnabled
      />
    </SafeAreaView>
  );
}
