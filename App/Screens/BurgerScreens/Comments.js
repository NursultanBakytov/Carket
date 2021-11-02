import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addComments, getComments} from '../../api';

import HeaderComponent from '../../Components/HeaderComponent';
import {load} from '../../Components/Loader';
import ShadowButton from '../../Components/ShadowButton';
import {setData, updateData} from '../../Store';
import styles from '../../styles';

const Comments = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {comments, updateComments, user} = useSelector(
    store => store.appReducer,
  );
  const {alias, sparePart, service} = route.params;
  const [isLoading, setLoading] = useState(false);
  const [isCommentsLoading, setCommentsLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentsState, setCommentsState] = useState([]);

  useEffect(() => {
    if (updateComments) {
      setCommentsLoading(true);
      dispatch(
        getComments(
          {
            alias,
            category: Boolean(sparePart)
              ? 'parts'
              : Boolean(service)
              ? 'services'
              : 'cars',
          },
          () => {
            setCommentsLoading(false);
            dispatch(setData({updateComments: false}));
          },
        ),
      );
    }
    if (Boolean(comments[alias]) && Array.isArray(comments[alias])) {
      setCommentsState(comments[alias]);
    }
  }, [comments, updateComments, alias]);
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#EA4F3D" />

      <HeaderComponent
        arrow={true}
        title={`Комментарии (${commentsState.length})`}
        navigation={navigation}
      />
      {/* ----- Start Body ----- */}
      <ScrollView>
        <View style={styles.ph10}>
          {/* ---------- Start Container ---------- */}
          {commentsState.length > 0 ? (
            commentsState.map((object, index, arr) => (
              <View key={object.id}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: index === 0 ? 40 : 0,
                    alignSelf: 'center',
                  }}>
                  <Image
                    style={{width: 40, height: 40}}
                    source={require('../../assets/commentAva.png')}
                  />
                  <View style={{marginLeft: 10, width: '100%'}}>
                    <Text
                      style={{fontSize: 16, fontWeight: '900', marginTop: 10}}>
                      {object.name}
                    </Text>
                    <Text style={{marginVertical: 10}}>{object.comment}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        width: '85%',
                      }}>
                      <Text style={{fontSize: 12}}>{object.created_at}</Text>
                      {/* <View style={styles.fdRow}>
                        <TouchableOpacity style={{marginLeft: 15}}>
                          <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                            Удалить
                          </Text>
                        </TouchableOpacity>
                      </View> */}
                    </View>
                  </View>
                </View>
                {/* ------------------------------------ */}
                {arr.length !== index + 1 && (
                  <View
                    style={[
                      styles.Line,
                      {backgroundColor: '#C4C4C4', marginVertical: 20},
                    ]}
                  />
                )}
              </View>
            ))
          ) : isCommentsLoading ? (
            <View style={{marginTop: 20}}>{load}</View>
          ) : (
            <Text
              style={{
                color: 'rgb(112, 118, 135)',
                fontSize: 18,
                width: '100%',
                textAlign: 'center',
                padding: 10,
                marginVertical: 20,
              }}>
              Нет комментариев
            </Text>
          )}
          {/* ---------- End Container ---------- */}

          <Text style={{fontSize: 20, marginVertical: 20, marginTop: 100}}>
            Написать комментарий
          </Text>
          <TextInput
            multiline={true}
            placeholder="Комментарий..."
            value={comment}
            onChangeText={setComment}
            style={{
              minHeight: 165,
              paddingBottom: 131,
              paddingHorizontal: 21,
              backgroundColor: '#EEEEEE',
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <View style={{marginVertical: 10}} />
          <ShadowButton
            width="80%"
            text="ОТПРАВИТЬ"
            Press={() => {
              if (Boolean(user)) {
                setLoading(true);
                dispatch(
                  addComments(
                    {
                      alias,
                      comment,
                      category: Boolean(sparePart)
                        ? 'parts'
                        : Boolean(service)
                        ? 'services'
                        : 'cars',
                      name: user.user_data.name,
                      login: user.user_data.login,
                    },
                    () => {
                      setLoading(false);
                      setComment('');
                    },
                  ),
                );
              } else {
                navigation.navigate('Login', {goBack: true});
              }
            }}
            isLoading={isLoading}
          />
          {/* ----- Start inputs ----- */}
          {/* ----- End inputs ----- */}
        </View>
        <View style={{marginVertical: 60}} />
      </ScrollView>
      {/* ----- End Body ----- */}
    </SafeAreaView>
  );
};

export default Comments;
