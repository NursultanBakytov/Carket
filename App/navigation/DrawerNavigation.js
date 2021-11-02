import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import BottomBar from './BottomBar';
import DrawerContent from './DrawerContent';
import CreateBusinessProfile from '../Screens/BurgerScreens/CreateBusinessProfile';
import AutoSalons from '../Screens/BurgerScreens/AutoSalons';
import AutosComponent from '../Screens/BurgerScreens/AutosComponent';
import AutoPage from '../Screens/BurgerScreens/AutoPage';
import Comments from '../Screens/BurgerScreens/Comments';
import WriteToUs from '../Screens/Profile/WriteToUs';
import ForeignProfile from '../Screens/Profile/ForeignProfile';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {ToastShow} from '../Components/ToastShow';
import {setData} from '../Store';
import Parametrs from '../Screens/Home/Parametrs';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
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
      <Drawer.Navigator
        initialRouteName="Home"
        drawerStyle={{
          width: '90%',
        }}
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={BottomBar} />
        <Drawer.Screen name="WriteToUs" component={WriteToUs} />
        <Drawer.Screen
          name="CreateBusinessProfile"
          component={CreateBusinessProfile}
        />
        <Drawer.Screen name="AutoPage" component={AutoPage} />
        <Drawer.Screen name="Comments" component={Comments} />
        <Drawer.Screen name="Parametrs" component={Parametrs} />
        <Drawer.Screen name="Autos" component={AutoSalons} />
        <Drawer.Screen name="AutosComponent" component={AutosComponent} />
        <Drawer.Screen name="ForeignProfile" component={ForeignProfile} />
      </Drawer.Navigator>
    </>
  );
}

export default DrawerNavigation;
