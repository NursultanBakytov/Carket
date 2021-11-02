import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AutosComponent from '../BurgerScreens/AutosComponent';
import WriteToUs from '../Profile/WriteToUs';
import ForeignProfile from '../Profile/ForeignProfile';
import Balance from '../Profile/Balance';
import Vip from '../../Components/SirvecesScreen/Vip';
import AutoUp from '../../Components/SirvecesScreen/AutoUp';
import Quickly from '../../Components/SirvecesScreen/Quickly';
import ColorScreen from '../../Components/SirvecesScreen/ColorScreen';
import {useDispatch, useSelector} from 'react-redux';
import {ToastShow} from '../../Components/ToastShow';
import {setData} from '../../Store';
import Toast from 'react-native-toast-message';
import Marks from '../Home/Marks';
import Models from '../Home/Models';
import Region from '../Home/Region';
import SearchPage from '../Home/SearchPage';

const NotificationsScreen = ({scrollToTop, setScrollState}) => {
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
      <Toast style={{zIndex: 1}} ref={ref => Toast.setRef(ref)} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="PartsSearch"
          children={props => (
            <SearchPage
              {...props}
              scrollToTop={scrollToTop}
              setScrollState={setScrollState}
            />
          )}
          initialParams={{
            isSparePart: true,
            isService: false,
            isCar: false,
            cleanBrandForFilter: true,
          }}
        />
        <Stack.Screen name="PartsMarks" component={Marks} />
        <Stack.Screen name="PartsModels" component={Models} />
        <Stack.Screen name="PartsRegion" component={Region} />
        <Stack.Screen name="AutosComponent" component={AutosComponent} />
        <Stack.Screen name="WriteToUs" component={WriteToUs} />
        <Stack.Screen name="ForeignProfile" component={ForeignProfile} />
        <Stack.Screen name="Vip" component={Vip} />
        <Stack.Screen name="AutoUp" component={AutoUp} />
        <Stack.Screen name="Quickly" component={Quickly} />
        <Stack.Screen name="ColorScreen" component={ColorScreen} />
        <Stack.Screen name="Balance" component={Balance} />
      </Stack.Navigator>
    </>
  );
};
export default NotificationsScreen;
