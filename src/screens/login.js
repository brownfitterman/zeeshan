import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonModal,
  IonLabel,
  IonInput,
  IonButtons,
  IonIcon,
  IonButton,
  IonLoading,
  IonSpinner
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import { Plugins } from "@capacitor/core";
import { connect } from "react-redux";
import firebase from "firebase";
import {  closeCircleOutline } from "ionicons/icons";
import { insertLoginRecord } from "utils/sqllite";

const { Storage, PushNotifications } = Plugins;
const Login = ({ history }) => {
  const [data, setData] = useState();
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showOTPSpinner, setShowOTPSpinner] = useState(false);
  const [conf, setConfirmation] = useState(null);
  const [value, loading, error] = useCollection(
    firebase.firestore().collection("Customer"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const isUserLogged = async () => {
    let { value } = await Storage.get({ key: "isLogged" });
    value = value ? true : false;
    if (value) {
      history.push("/tabs");
    }
  };

  useEffect(() => {
    isUserLogged();
  }, []);

  const onChange = (e) => {
    let key = e.target.name;
    let val = e.target.value;
    setData({
      ...data,
      [key]: val,
    });
  };

  const push = () => {
    PushNotifications.register();
    PushNotifications.addListener("registration", (token) => {
      setToken(token.value);
    });

    PushNotifications.addListener("registrationError", (error) => {
      // alert("Error on registration: " + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        alert(`
        ${notification.title}
        ${notification.body}
        `);
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {}
    );
  };

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSubmit();
        },
      }
    );
  };

  const onSubmit = async (e) => {
    setUpRecaptcha();
    setShowSpinner(true);
    var phoneNumber = `+91${data.mobile}`;
    var appVerifier = window.recaptchaVerifier;
    const authNum = await firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier);
    setConfirmation(authNum);
    await Storage.set({ key: "mobile", value: data.mobile });
    setShowModal(true);
    setShowSpinner(false);
    return push();
  };

  const fnOtp = async () => {
    let code = data.otp;
    try {
      setShowOTPSpinner(true);
      await conf.confirm(code);
      var userInfo = firebase.auth().currentUser;
      if (userInfo) {
        await Storage.set({
          key: "userInfo",
          value: JSON.stringify(userInfo),
        });
      } else {
        await Storage.clear();
      }
      let userStatus = value.docs.findIndex((emp) => {
        let x = emp.data();
        return x.mobileNo == data.mobile;
      });
      if (userStatus >= 0) {
        setShowModal(false);
        await Storage.set({ key: "isLogged", value: true });
        await Storage.set({ key: "pushToken", value: token });
        await Storage.set({ key: "colID", value: value.docs[userStatus].id });
        insertLoginRecord(userInfo.uid, token, value.docs[userStatus].id);
        history.push("/tabs");
        window.location.reload();
        setShowOTPSpinner(false);
      } else {
        setShowModal(false);
        history.push("/register");
        window.location.reload();
        setShowOTPSpinner(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonLoading
          cssClass='my-custom-class'
          isOpen={showSpinner}
          onDidDismiss={() => setShowSpinner(false)}
          message={'Getting OTP'}
        />
        <IonGrid
          style={{
            backgroundImage: "linear-gradient(360deg, #0ceefa, #29e36a)",
            height: "100%",
          }}
        >
          <IonRow>
            <IonCol>
              <h1 style={{ textAlign: "center" }}>Welcome</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol style={{ padding: "25px" }}>
              <IonItem
                style={{ borderRadius: "20px", border: "2px solid black" }}
              >
                <IonLabel position="floating">Enter Mobile Number</IonLabel>
                <IonInput onIonChange={onChange} name="mobile"></IonInput>
              </IonItem>
              <IonButton
                color="primary"
                shape="round"
                expand="block"
                style={{ marginTop: "15px" }}
                onClick={onSubmit}
              >
                Submit
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div id="recptcha-container"></div>
        <IonModal isOpen={showModal} cssClass="my-custom-class">
        <IonLoading
          cssClass='my-custom-class'
          isOpen={showOTPSpinner}
          onDidDismiss={() => setShowOTPSpinner(false)}
          message={'Verifying OTP'}
        />
        <div style={{ position: "absolute", right: "2px", top: "10px" }}>
            <IonButtons onClick={() => setShowModal(false)}>
              <IonIcon
                icon={closeCircleOutline}
                style={{ fontSize: "38px", color: "black" }}
              />
            </IonButtons>
          </div>
          <IonGrid
            style={{
              backgroundImage: "linear-gradient(360deg, #0ceefa, #29e36a)",
              height: "100%",
            }}
          >
            <IonRow>
              <IonCol>
                <h4 style={{textAlign:'center'}}>Please Enter OTP </h4>
                <IonItem style={{ marginTop: "20px", borderRadius: "20px" }}>
                  <IonLabel position="floating">Enter OTP</IonLabel>
                  <IonInput
                    // value={data.title}
                    onIonChange={onChange}
                    name="otp"
                  ></IonInput>
                </IonItem>
                <IonButton
                  color="primary"
                  shape="round"
                  expand="block"
                  style={{ marginTop: "15px" }}
                  onClick={fnOtp}
                >
                  Submit
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default connect()(withRouter(Login));
