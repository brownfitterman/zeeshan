import { put } from 'redux-saga/effects';

export function* processDataRequest({ api, payload, successType, failureType }) {
  try {
    const response = yield api(payload);
    yield put({
      type: successType,
      payload: response.data.data,
    });
  } catch (error) {
    let errorMessage = '';
    if (error.response) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = error.message;
    }
    yield put({
      type: failureType,
      payload: errorMessage,
    });
  }
}
