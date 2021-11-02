import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';

import Login from './Welcome/Login';
import Signup from './Welcome/Signup';
import UserActivation from './Welcome/Activation';
import Recover from './Welcome/Recover';
import {ToastShow} from '../Components/ToastShow';
import {setData} from '../Store';

const LoginStack = createStackNavigator();

const LoginNavigation = () => {
  const dispatch = useDispatch();
  const {alert} = useSelector(store => store.appReducer);

  React.useEffect(() => {
    if (alert.message) {
      ToastShow(alert.message, 2000, alert.severity);
      dispatch(setData({alert: {message: '', severity: ''}}));
    }
  }, [alert]);
  return (
    <>
      <Toast style={{zIndex: 1}} ref={ref => Toast.setRef(ref)} />
      <LoginStack.Navigator>
        <LoginStack.Screen
          name="Login"
          component={Login}
          options={{
            header: () => null,
          }}
        />
        <LoginStack.Screen
          name="Activation"
          component={UserActivation}
          options={{
            header: () => null,
          }}
        />
        <LoginStack.Screen
          name="Recover"
          component={Recover}
          options={{
            header: () => null,
          }}
        />
        <LoginStack.Screen
          name="Signup"
          component={Signup}
          options={{
            header: () => null,
          }}
        />
      </LoginStack.Navigator>
    </>
  );
};

export default LoginNavigation;
