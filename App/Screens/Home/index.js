import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SearchPage from './SearchPage';
import HomePage from './HomePage';
import Marks from './Marks';
import Models from './Models';
import Region from './Region';
import WriteToUs from '../Profile/WriteToUs';
import ForeignProfile from '../Profile/ForeignProfile';
import {useDispatch, useSelector} from 'react-redux';
import {ToastShow} from '../../Components/ToastShow';
import {setData} from '../../Store';
import Toast from 'react-native-toast-message';
import MarksModel from './Marks&Model';
import ServiceCategory from './ServiceCategory';

const HomeScreen = ({scrollToTop, setScrollState}) => {
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
          name="HomePage"
          children={props => (
            <HomePage
              {...props}
              scrollToTop={scrollToTop}
              setScrollState={setScrollState}
            />
          )}
        />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="Marks" component={Marks} />
        <Stack.Screen name="Models" component={Models} />
        <Stack.Screen name="MarksModel" component={MarksModel} />
        <Stack.Screen name="Region" component={Region} />
        <Stack.Screen name="WriteToUs" component={WriteToUs} />
        <Stack.Screen name="ForeignProfile" component={ForeignProfile} />
        <Stack.Screen name="ServiceCategory" component={ServiceCategory} />
      </Stack.Navigator>
    </>
  );
};

export default HomeScreen;
