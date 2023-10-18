import { combineReducers } from "redux";
import { ReduxGenerator } from "../../core";
import getOrder from "./getOrder";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

const rootReducer = combineReducers({
  get_order: getOrder,
  add_Order: ReduxGenerator.getReducer("ADD_ORDER"),
  get_Order_List: ReduxGenerator.getReducer("GET_ORDER_LIST"),
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});
export default rootReducer;
