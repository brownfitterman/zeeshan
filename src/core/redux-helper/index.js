import ReduxHandler from '../../core/handler';

var keys = [
  'HANDLE_ERROR',
  'GET_ORDER',
  'ADD_ORDER',
  'GET_ORDER_LIST',
];
var handler = new ReduxHandler(keys);

var ActionTypes = handler.getActionTypes();

var Actions = handler.getActions();

export { ActionTypes, Actions };
