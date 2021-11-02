import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import AddPage from './AddPage';
import AutosComponent from '../BurgerScreens/AutosComponent';
import WriteToUs from '../Profile/WriteToUs';
import ForeignProfile from '../Profile/ForeignProfile';

const AddScreen = () => {
  const Stack = createStackNavigator();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Add" component={AddPage} />
        <Stack.Screen name="AutosComponent" component={AutosComponent} />
        <Stack.Screen name="WriteToUs" component={WriteToUs} />
        <Stack.Screen name="ForeignProfile" component={ForeignProfile} />
      </Stack.Navigator>
    </>
  );
};

export default AddScreen;
