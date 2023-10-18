import { ActionTypes } from '../constants';
// import API from '../requests';

// const getPhotos = payload => {
//   return {
//     type: ActionTypes.PHOTOS_REQUEST,
//     payload: payload
//   };
// };

const getCurrentBranch = payload => {
  return {
    type: 'GET_ORDER',
    payload: payload
  };
};
const addOrder = payload => {
  return {
    type: ActionTypes.ADD_ORDER_REQUEST,
    payload: payload
  };
};
const getOrderList = payload => {
  return {
    type: ActionTypes.GET_ORDER_LIST_REQUEST,
    payload: payload
  };
};
export {
  getCurrentBranch,
  addOrder,
  getOrderList,
};
