import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import FavoritesPage from './FavoritesPage';
import AutosComponent from '../BurgerScreens/AutosComponent';
import WriteToUs from '../Profile/WriteToUs';
import ForeignProfile from '../Profile/ForeignProfile';

const FavoritesScreen = ({scrollToTop, setScrollState}) => {
  const Stack = createStackNavigator();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="FavoritesPage"
          children={props => (
            <FavoritesPage
              {...props}
              scrollToTop={scrollToTop}
              setScrollState={setScrollState}
            />
          )}
        />
        <Stack.Screen name="AutosComponent" component={AutosComponent} />
        <Stack.Screen name="WriteToUs" component={WriteToUs} />
        <Stack.Screen name="ForeignProfile" component={ForeignProfile} />
      </Stack.Navigator>
    </>
  );
};

export default FavoritesScreen;
