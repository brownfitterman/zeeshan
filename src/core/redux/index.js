const defaults = {
  isFetching: false,
  error: null,
  data: null
};

export default class ReduxGenerator {
  static getReducer(actionName) {
    const resetType = `${actionName.toUpperCase()}_RESET`;
    const requestType = `${actionName.toUpperCase()}_REQUEST`;
    const successType = `${actionName.toUpperCase()}_SUCCESS`;
    const failedType = `${actionName.toUpperCase()}_FAILURE`;
    const setType = `${actionName.toUpperCase()}_SET`;
    return function(state = { ...defaults }, action) {
      switch (action.type) {
        case resetType:
          return { ...state, ...defaults };
        case requestType:
          return { ...state, ...defaults, isFetching: true };
        case successType:
          return { ...state, ...defaults, data: { ...action.payload } };
        case failedType:
          return { ...state, ...defaults, error: action.error.response.data };
        case setType:
          return {
            ...state,
            ...defaults,
            data: { ...state.data, ...action.payload }
          };
        default:
          return state;
      }
    };
  }
}
