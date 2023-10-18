import { all, fork } from 'redux-saga/effects';
import admin from './admin';

export default function* root() {
  yield all([
    // fork(photos),
    fork(admin),
  ]);
}
