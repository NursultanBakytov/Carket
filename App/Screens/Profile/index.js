import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Settings from './Settings';
import About from './About';
import Support from './Support';
import ProfilePage from './ProfilePage';
import AutosComponent from '../BurgerScreens/AutosComponent';
import Balance from './Balance';
import WriteToUs from './WriteToUs';
import HistoryPay from './HistoryPay';
import ElsomPay from './ElsomPay';
import ForeignProfile from './ForeignProfile';
import VisaPay from './VisaPay';
import CreateBusinessProfile from '../BurgerScreens/CreateBusinessProfile';
import UpdateAd from './UpdateAd';
import UserAllAds from './UserAllAds';
import Vip from '../../Components/SirvecesScreen/Vip';
import AutoUp from '../../Components/SirvecesScreen/AutoUp';
import Quickly from '../../Components/SirvecesScreen/Quickly';
import ColorScreen from '../../Components/SirvecesScreen/ColorScreen';
import WebViewScreen from './WebView';
import {useDispatch, useSelector} from 'react-redux';
import {ToastShow} from '../../Components/ToastShow';
import {setData} from '../../Store';
import Toast from 'react-native-toast-message';
import NetexKassa from './NetexKassa';
import BusinessProfile from '../BurgerScreens/BusinessProfile';

const ProfileScreen = ({scrollToTop, setScrollState}) => {
  const Stack = createStackNavigator();
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
      <Toast style={{zIndex: 1000}} ref={ref => Toast.setRef(ref)} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="ProfilePage"
          children={props => (
            <ProfilePage
              {...props}
              scrollToTop={scrollToTop}
              setScrollState={setScrollState}
            />
          )}
        />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="ForeignProfile" component={ForeignProfile} />
        <Stack.Screen name="AutosComponent" component={AutosComponent} />
        <Stack.Screen name="Balance" component={Balance} />
        <Stack.Screen name="HistoryPay" component={HistoryPay} />
        <Stack.Screen name="WriteToUs" component={WriteToUs} />
        <Stack.Screen name="ElsomPay" component={ElsomPay} />
        <Stack.Screen name="VisaPay" component={VisaPay} />
        <Stack.Screen name="NetexKassa" component={NetexKassa} />
        <Stack.Screen name="WebView" component={WebViewScreen} />
        <Stack.Screen name="UpdateAd" component={UpdateAd} />
        <Stack.Screen name="UserAllAds" component={UserAllAds} />
        <Stack.Screen name="Vip" component={Vip} />
        <Stack.Screen name="AutoUp" component={AutoUp} />
        <Stack.Screen name="Quickly" component={Quickly} />
        <Stack.Screen name="ColorScreen" component={ColorScreen} />
        <Stack.Screen name="Business" component={BusinessProfile} />
        <Stack.Screen
          name="CreateBusinessProfile"
          component={CreateBusinessProfile}
        />
      </Stack.Navigator>
    </>
  );
};

export default ProfileScreen;
