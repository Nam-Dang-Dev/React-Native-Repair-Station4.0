import { put, takeLatest, call, all, take } from 'redux-saga/effects';
import * as typesAction from './actions/typesAction';
import * as stationAction from './actions/actions';
import {
  showNotification,
  setRoot,
  showModalNavigation,
} from '../../navigation/function';

import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native';
import {
  registerStationApi,
  getStationByIdApi,
  getMyStationApi,
  changePowerApi,
  changeStationByIdApi,
} from '../../api/station';
import startApp from '../../navigation/bottomTab';
function* registerStation(actions) {
  try {
    const token = yield AsyncStorage.getItem('token');
    const response = yield call(registerStationApi, actions.station, token);
    yield AsyncStorage.setItem('stationId', response.data.id);
    yield put(stationAction.registerStationSuccess());
    setRoot('splashScreen');
  } catch (error) {
    console.log('error saga', error);
    yield showNotification(
      'showNotification',
      'Đăng kí không thành công!',
      'error',
    );
    yield put(stationAction.registerStationFailed(error.data));
  }
}

function* getStationById(actions) {
  try {
    const token = yield AsyncStorage.getItem('token');
    const response = yield call(getStationByIdApi, actions.stationId, token);
    yield put(stationAction.getStationByIdSuccess(response.data));
  } catch (error) {
    console.log('error', error.data);
  }
}

function* getMyStation() {
  try {
    const token = yield AsyncStorage.getItem('token');
    const response = yield call(getMyStationApi, token);
    if (!response.data.length) {
      setRoot('registerStation');
    }
    yield put(stationAction.getMyStationSuccess(response.data));
  } catch (error) {
    console.log('error', error);
  }
}

function* changePower(actions) {
  try {
    const token = yield AsyncStorage.getItem('token');
    const response = yield call(
      changePowerApi,
      actions.stationId,
      {
        isAvailable: actions.isOn,
      },
      token,
    );
    yield put(stationAction.changePowerSuccess());
  } catch (error) {
    console.log('error change power', error.data);
    yield put(stationAction.changePowerFailed());
  }
}

function* changeStationById(actions) {
  try {
    const token = yield AsyncStorage.getItem('token');
    const response = yield call(
      changeStationByIdApi,
      actions.stationId,
      {
        id: actions.data.id,
        address: actions.data.address,
        latitude: actions.data.latitude,
        longitude: actions.data.longitude,
        hasAmbulatory: actions.data.hasAmbulatory,
        owner: { name: actions.data.owner.name, phoneNumber: actions.data.phone },
        services: actions.data.services,
      },
      token,
    );
    yield put(stationAction.changeStationByIdSuccess());
  } catch (error) {
    console.log('error change station', error.data);
    yield put(stationAction.changeStationByIdFailed());
  }
}

const rootSagaStation = () => [
  takeLatest(typesAction.REGISTER_STATION, registerStation),
  takeLatest(typesAction.GET_STATION_BY_ID, getStationById),
  takeLatest(typesAction.CHANGE_POWER, changePower),
  takeLatest(typesAction.CHANGE_STATION_BY_ID, changeStationById),
  takeLatest(typesAction.GET_MY_STATION, getMyStation),
];
export default rootSagaStation();
