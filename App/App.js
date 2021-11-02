import React from 'react';
import {Provider} from 'react-redux';
import NavigationContainerComponent from './navigation/NavigationContainer';
import {store} from './Store';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainerComponent />
    </Provider>
  );
};

export default App;
