import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';

import DrawerNavigation from './DrawerNavigation';
import Splash from './Splash';
import {setData} from '../Store';
import LoginNavigation from './LoginNavigation';
import {ToastShow} from '../Components/ToastShow';
import Toast from 'react-native-toast-message';

export default function NavigationContainerComponent() {
  const dispatch = useDispatch();
  const {alert} = useSelector(store => store.appReducer);

  React.useEffect(() => {
    if (alert.message) {
      ToastShow(alert.message, 2000, alert.severity);
      dispatch(setData({alert: {message: '', severity: ''}}));
    }
  }, [alert]);

  const Stack = createStackNavigator();

  const MyTheme = {
    ...DefaultTheme,

    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };
  return (
    <NavigationContainer theme={MyTheme}>
      <Toast style={{zIndex: 10000}} ref={ref => Toast.setRef(ref)} />
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigation}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginNavigation}
          options={{
            header: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
