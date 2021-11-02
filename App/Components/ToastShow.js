import Toast from 'react-native-toast-message';

// --------------------------
export const ToastShow = (text, time, type, position) => {
  Toast.show({
    text1: text,
    type: type || 'error',
    position: position || 'bottom',
    visibilityTime: time || 0.5,
    style: {
      zIndex: 10000,
    },
    // topOffset: mtop ||null,
    // bottomOffset: mtop || null,
  });
};
