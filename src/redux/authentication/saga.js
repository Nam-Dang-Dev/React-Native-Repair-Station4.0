import {put, takeLatest, call, all, take} from 'redux-saga/effects';
import * as typesAction from './actions/typesAction';
import * as authenticationAction from './actions/actions';
import {
  showNotification,
  setRoot,
  showModalNavigation,
} from '../../navigation/function';
import {
  registerApi,
  loginApi,
  updateApi,
  getMyAccountApi,
} from '../../api/auth';

import {eventChannel} from 'redux-saga';
import {Navigation} from 'react-native-navigation';
import {AsyncStorage} from 'react-native';

function* login(actions) {
  try {
    const response = yield call(loginApi, actions.userData);
    yield AsyncStorage.setItem('token', response.data);
    yield call(updateApi, {deviceToken: actions.tokenDevice}, response.data);
    yield put(authenticationAction.loginSuccess());
  } catch (error) {
    console.log('error saga', error.data);
    yield showNotification(
      'showNotification',
      'Đăng nhập không thành công',
      'error',
    );
    yield put(authenticationAction.loginFailed(error.data));
  }
}

function* logOut() {
  try {
    yield AsyncStorage.clear();
    yield put(authenticationAction.logOutSuccess());
    yield setRoot('login');
  } catch (error) {
    console.log('error', error);
    yield put(authenticationAction.logOutFailed());
  }
}

function* register(actions) {
  try {
    const response = yield call(registerApi, actions.data);
    yield showNotification(
      'showNotification',
      'Đăng kí thành công, Tiến hành đăng kí thông tin cửa hàng',
      'success',
    );
    yield AsyncStorage.setItem('token', response.data);
    yield showModalNavigation('registerStation');
    yield Navigation.dismissModal(actions.componentId);
  } catch (error) {
    console.log('error', error);
    yield showNotification(
      'showNotification',
      'Đăng kí không thành công!',
      'error',
    );
    yield put(authenticationAction.registerFailed(error.data));
  }
}

function* getMyAccount(actions) {
  try {
    const token = yield AsyncStorage.getItem('token');
    let response = yield call(getMyAccountApi, token);
    console.log('response 2222', JSON.stringify(response.data, null, 4));
    yield put(authenticationAction.getMyAccountSuccess(response.data));
  } catch (error) {
    console.log('error', error);
    yield put(authenticationAction.getMyAccountFailed(error));
  }
}

const rootSagaAuthentication = () => [
  takeLatest(typesAction.LOGIN, login),
  takeLatest(typesAction.LOGOUT, logOut),
  takeLatest(typesAction.REGISTER, register),
  takeLatest(typesAction.GET_MY_ACCOUNT, getMyAccount),
];
export default rootSagaAuthentication();
