import React from "react";
import ReactDOM from "react-dom";
import App from "App";
import * as serviceWorker from "serviceWorker.js";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import firebase from "firebase/app";
import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import "firebase/auth";
import "firebase/firestore";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";

const rrfConfig = {
  userProfile: "users",
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};

const firebaseConfig = {
  apiKey: "AIzaSyBQAAFEmZD0iaWwzelXdeoAh-Jn6NAPCR8",
  authDomain: "restaurant-fca8e.firebaseapp.com",
  databaseURL: "https://restaurant-fca8e.firebaseio.com",
  projectId: "restaurant-fca8e",
  storageBucket: "restaurant-fca8e.appspot.com",
  messagingSenderId: "1098906852072",
  appId: "1:1098906852072:web:89fad09487b1ce0d08c75d",
  measurementId: "G-X14BP81LH5",
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <IonApp>
        <IonReactRouter>
          <App />
        </IonReactRouter>
      </IonApp>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);
defineCustomElements(window);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
// serviceWorker.register();
