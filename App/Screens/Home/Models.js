import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  BackHandler,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import CheckboxComponent from '../../Components/CheckboxComponent';
import GoBack from '../../Components/GoBack';
import {load} from '../../Components/Loader';
import {getBrandModels} from '../../api';
import {setData} from '../../Store';

const Models = ({navigation, route}) => {
  const dispatch = useDispatch();
  const state = useSelector(store => store.appReducer);
  const {alias, cleanBrandForFilter} = route.params;
  const [models, setModels] = useState(false);

  const backAction = () => {
    if (cleanBrandForFilter) {
      navigation.navigate('PartsSearch', {
        isSparePart: true,
        cleanBrandForFilter: false,
      });
    } else {
      navigation.goBack();
    }
    return true;
  };
  React.useEffect(() => {
    if (Boolean(state.models[alias]) && !Boolean(models)) {
      setModels(state.models[alias].data);
    }
    if (!Boolean(state.models[alias])) {
      dispatch(getBrandModels({brand: alias}));
    }
  }, [state, models]);
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={{marginLeft: 3}}>
        <GoBack
          navigation={() => {
            backAction();
          }}
        />
      </View>
      <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
        {Boolean(models)
          ? models.map(model => (
              <View
                style={{
                  borderBottomColor: '#F2F2F2',
                  borderBottomWidth: 1,
                  paddingVertical: 5,
                }}
                key={model.alias}>
                <CheckboxComponent
                  style={{paddingVertical: 15}}
                  isChecked={state.modelForFilter.alias === model.alias}
                  text={model.name}
                  onClick={() => {
                    dispatch(setData({modelForFilter: model}));
                    backAction();
                  }}
                />
              </View>
            ))
          : load}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Models;
