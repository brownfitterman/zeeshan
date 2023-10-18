import { all, put, takeLatest } from 'redux-saga/effects';
import { ActionTypes } from '../constants';
import API from '../requests';



export function* getOrderList(action) {
  try {
    const { payload } = action;
    const response = yield API.getExpensesList(payload);
    yield put({
      type: ActionTypes.GET_ORDER_LIST_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    yield put({
      type: ActionTypes.HANDLE_ERROR_LIST_REQUEST,
      successAction: action,
      error: error,
      failedAction: ActionTypes.GET_ORDER_LIST_FAILURE
    });
  }
}
export function* addOrder(action) {
  try {
    const { payload } = action;
    const response = yield API.addExpense(payload);
    yield put({
      type: ActionTypes.ADD_ORDER_SUCCESS,
      payload: response
    });
  } catch (error) {
    yield put({
      type: ActionTypes.HANDLE_ERROR_REQUEST,
      successAction: action,
      error: error,
      failedAction: ActionTypes.ADD_ORDER_FAILURE
    });
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.GET_ORDER_LIST_REQUEST, getOrderList),
    takeLatest(ActionTypes.ADD_ORDER_REQUEST, addOrder),
  ]);
}
