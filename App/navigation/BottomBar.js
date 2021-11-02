import * as React from 'react';
import {Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DoubleClick from 'react-native-double-tap';

import Home from '../Screens/Home';
import AddScreen from '../Screens/Add';
import Favorites from '../Screens/Favorites';
import Profile from '../Screens/Profile';
import styles from '../styles';
import IMAGE from '../assets/SVG';
import LoginNavigation from './LoginNavigation';
import {useSelector} from 'react-redux';
import SpareParts from '../Screens/Notifications';
import {Card} from 'react-native-shadow-cards';

export default function BottomBar() {
  const token = useSelector(store => store.appReducer.token);
  const [scrollToTop, setScrollState] = React.useState(false);
  const Tab = createBottomTabNavigator();

  const getIconState = {
    Добавить: _ => IMAGE.AddIcon,
    Главная: focused =>
      focused ? IMAGE.HomeActiveIcon : IMAGE.HomeInactiveIcon,
    Запчасти: focused =>
      focused ? IMAGE.NotificationsActiveIcon : IMAGE.NotificationsInactiveIcon,
    Избранные: focused =>
      focused ? IMAGE.FavoritesActiveIcon : IMAGE.FavoritesInactiveIcon,
    Профиль: focused =>
      focused ? IMAGE.ProfileActiveIcon : IMAGE.ProfileInactiveIcon,
  };
  return (
    <Tab.Navigator
      initialRouteName="Главная"
      backBehavior="history"
      tabBarOptions={{
        activeTintColor: '#DB372A',
        keyboardHidesTabBar: true,
      }}
      tabBar={function MyTabBar({state, descriptors, navigation}) {
        const focusedOptions =
          descriptors[state.routes[state.index].key].options;

        if (focusedOptions.tabBarVisible === false) {
          return null;
        }

        return (
          <Card
            elevation={12}
            opacity={1}
            cornerRadius={0}
            style={{
              width: '100%',
              height: 60,
              paddingVertical: 10,
              paddingHorizontal: 16,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
            }}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;

              return (
                <DoubleClick
                  key={route.name}
                  activeOpacity={1}
                  singleTap={() => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  }}
                  doubleTap={() => {
                    setScrollState(true);
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}>
                    {getIconState[route.name](isFocused)}
                    <Text
                      style={{
                        color:
                          isFocused || route.name === 'Добавить'
                            ? '#DB372A'
                            : '#727272',
                        fontSize: 12,
                      }}>
                      {route.name}
                    </Text>
                  </View>
                </DoubleClick>
              );
            })}
          </Card>
        );
      }}>
      <Tab.Screen
        name="Главная"
        children={props => (
          <Home
            {...props}
            scrollToTop={scrollToTop}
            setScrollState={state => setScrollState(state)}
          />
        )}
      />
      <Tab.Screen
        name="Запчасти"
        children={props => (
          <SpareParts
            {...props}
            scrollToTop={scrollToTop}
            setScrollState={state => setScrollState(state)}
          />
        )}
      />
      <Tab.Screen
        name="Добавить"
        options={{
          tabBarLabel: () => <Text style={styles.Add}>Добавить</Text>,
        }}
        children={props =>
          token ? (
            <AddScreen
              {...props}
              scrollToTop={scrollToTop}
              setScrollState={state => setScrollState(state)}
            />
          ) : (
            <LoginNavigation />
          )
        }
      />
      <Tab.Screen
        name="Избранные"
        children={props =>
          token ? (
            <Favorites
              {...props}
              scrollToTop={scrollToTop}
              setScrollState={state => setScrollState(state)}
            />
          ) : (
            <LoginNavigation />
          )
        }
      />
      <Tab.Screen
        name="Профиль"
        children={props =>
          token ? (
            <Profile
              {...props}
              scrollToTop={scrollToTop}
              setScrollState={state => setScrollState(state)}
            />
          ) : (
            <LoginNavigation />
          )
        }
      />
    </Tab.Navigator>
  );
}
