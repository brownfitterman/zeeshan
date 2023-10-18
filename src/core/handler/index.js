import keyMirror from 'keymirror';

export default class ReduxHandler {
  constructor(keys) {
    this.keys = keys;
    this.keyMapper = ['RESET', 'REQUEST', 'SUCCESS', 'FAILURE', 'SET'];
    this.defaultData = { isFetching: false, error: null, data: null };
  }

  getActionTypes() {
    var actions = {};
    for (var key of this.keys) {
      for (var mapper of this.keyMapper) {
        actions[key + '_' + mapper] = undefined;
      }
    }
    return keyMirror(actions);
  }

  constructReducer(actionName) {
    const resetType = `${actionName.toUpperCase()}_RESET`;
    const requestType = `${actionName.toUpperCase()}_REQUEST`;
    const successType = `${actionName.toUpperCase()}_SUCCESS`;
    const failedType = `${actionName.toUpperCase()}_FAILURE`;
    return function(state = { ...this.defaultData }, action) {
      switch (action.type) {
        case resetType:
          return { ...state, ...this.defaultData };
        case requestType:
          return { ...state, ...this.defaultData, isFetching: true };
        case successType:
          return { ...state, ...this.defaultData, data: { ...action.payload } };
        case failedType:
          return { ...state, ...this.defaultData, error: action.error.response.data };
        default:
          return state;
      }
    };
  }

  getReducers() {
    var reducers = {};

    for (var item of this.keys) {
      var reducerKey = item.toLowerCase();
      reducers[reducerKey] = this.constructReducer(item);
    }

    return reducers;
  }

  getActionKeys(value) {
    var items = value.split('_');
    var property = items[0].toLowerCase();
    for (var i = 1; i < items.length; i++) {
      property += items[i].charAt(0).toUpperCase() + items[i].slice(1).toLowerCase();
    }
    var data = property;
    var resetProperty = 'reset' + data.charAt(0).toUpperCase() + data.slice(1);
    return [property, resetProperty];
  }

  getActions() {
    var ActionTypes = this.getActionTypes();

    var actions = {};

    for (var item of this.keys) {
      const requestAction = item + '_REQUEST';
      const resetAction = item + '_RESET';
      const actionKeys = this.getActionKeys(item);

      var requestKey = actionKeys[0];
      var resetKey = actionKeys[1];

      actions[requestKey] = payload => {
        return {
          type: ActionTypes[requestAction],
          payload: payload,
        };
      };

      actions[resetKey] = payload => {
        return {
          type: ActionTypes[resetAction],
          payload: payload,
        };
      };
    }

    return actions;
  }
}
