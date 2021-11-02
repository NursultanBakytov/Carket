export const UPDATE_DATA = 'UPDATE_DATA';
export const SET_DATA = 'SET_DATA';

export function setData(options) {
  return {
    type: SET_DATA,
    payload: options,
  };
}
// ----------------------------
export function updateData(options) {
  return {
    type: UPDATE_DATA,
    payload: options,
  };
}
// ----------------------------
export function setBrandForFilter(data) {
  return {
    type: MARKA,
    payload: data,
  };
}
// ----------------------------
export function setModelForFilter(data) {
  return {
    type: MODEL,
    payload: data,
  };
}
// ----------------------------
