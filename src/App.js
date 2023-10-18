import React, { Component } from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import { IonRouterOutlet, IonPage ,} from "@ionic/react";
import Login from "screens/login";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./app.css";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import Register from "screens/Register";
import "daytheme.css";
import { connect } from "react-redux";
// import "@teamhive/capacitor-video-recorder";
import { SplashScreen, Storage, Plugins, Capacitor } from "@capacitor/core";
import Tabs from "Components/tabs";
import { IonReactRouter } from "@ionic/react-router";
import { createSqlTable, selectData } from "utils/sqllite";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

const { PushNotifications } = Plugins;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: true,
    };
    createSqlTable();
    SplashScreen.hide();
    ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    // if (
    //   this.props.location.pathname == "/login" ||
    //   this.props.location.pathname == "/"
    // )
      // this.getIsLogged();
  }

  componentDidMount() {
    // if (Capacitor.isNative) {
    //   document.addEventListener("ionBackButton", (ev) => {
    //     ev.detail.register(10, () => {
    //       alert(window.location.toString());
    //       if (
    //         window.location.toString().includes("/login") ||
    //         window.location.toString().includes("/tabs/AdminOrder")
    //       ) {
    //         Plugins.App.exitApp();
    //       }
    //     });
    //   });
    // }
  }

  // push = async () => {
  //   const { value } = await Storage.get({ key: "colID" });
  //   const colID = value;
  //   PushNotifications.register();

  //   // Show us the notification payload if the app is open on our device
  //   PushNotifications.addListener(
  //     "pushNotificationReceived",
  //     (notification) => {
  //       alert(`
  //       ${notification.title}
  //       ${notification.body}
  //       `);
  //     }
  //   );

  //   PushNotifications.addListener(
  //     "pushNotificationActionPerformed",
  //     (notification) => {}
  //   );
  //   PushNotifications.addListener("registration", async (token) => {
  //     const { value } = await Storage.get({ key: "pushToken" });
  //     if (value !== token.value) {
  //       this.props.firestore.update("Employee/" + colID, { key: value });
  //     }
  //   });

  //   PushNotifications.addListener("registrationError", (error) => {
  //     alert("Error on registration: " + JSON.stringify(error));
  //   });
  // };

  // getIsLogged = async () => {
  //   const { value } = await Storage.get({ key: "isLogged" });
  //   if (value) {
  //     await this.push();
  //     this.props.history.push("/tabs");
  //   } else {
  //     selectData();
  //     this.props.history.push("/login");
  //   }
  // };

  render() {
    return (
      <IonPage id="main">
        <IonRouterOutlet>
          {/* <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} /> */}
           
           <Route
          path="/"
          render={() => <Redirect to="/tabs/AdminOrder" />}
          exact={true}
        />
          <Route
            path="/tabs/AdminOrder"
            exact
            component={() => (
              <IonReactRouter>
                <Tabs />
              </IonReactRouter>
            )}
          />
          <Route
            path="/tabs/profile"
            exact
            component={() => (
              <IonReactRouter>
                <Tabs />
              </IonReactRouter>
            )}
          />
        </IonRouterOutlet>
      </IonPage>
    );
  }
}

export default compose(firestoreConnect(), connect())(withRouter(App));
