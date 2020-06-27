import * as typesAction from './actions/typesAction';
const init = {
  allStation: [],
  error: '',
  station: [],
  changePower: false,
};

const StationReducers = (state = init, action) => {
  switch (action.type) {
    case typesAction.REGISTER_STATION_SUCCESS:
      return {...state};
    case typesAction.REGISTER_STATION_FAILED:
      return {...state, error: action.error};
    case typesAction.GET_STATION_BY_ID_SUCCESS:
      return {...state, station: action.data};
    case typesAction.GET_MY_STATION_SUCCESS:
      return {...state, allStation: action.data};
    case typesAction.CHANGE_POWER:
      return {...state, changePower: true};
    case typesAction.CHANGE_POWER_SUCCESS:
      return {...state, changePower: false};
    case typesAction.CHANGE_POWER_FAILED:
      return {...state, changePower: false};
    default:
      return {...state};
  }
};
export default StationReducers;
