import { ActionTypes } from '../constants';

export default function(state = {}, action) {
  switch (action.type) {
    case 'GET_ORDER':
      state = { ...state, orderData: action.payload };
      break;
    default:
      return state;
  }
  return state;
}
