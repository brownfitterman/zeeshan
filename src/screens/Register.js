import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonAlert,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { connect } from "react-redux";
import firebase from "firebase";
import { Plugins } from "@capacitor/core";
import { insertLoginRecord } from "utils/sqllite";
import { addImage } from "utils/uploadS3";
import { deleteSqlRecords } from "utils/sqllite";
const { Storage, PushNotifications } = Plugins;

const fileToDataUri = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

const Register = ({ history }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState("");
  const [data, setData] = useState({
    img: "profile.png",
    name: "",
    mobileNo: "",
    address1: "",
    address2: "",
    state: "",
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    getMobile();
  }, []);

  const getMobile = async () => {
    const { value } = await Storage.get({ key: "mobile" });
    setData({
      ...data,
      mobileNo: value,
    });
  };

  const fnHandel = (e) => {
    const key = e.target.name;
    const value = e.detail.value;
    setData({ ...data, [key]: value });
  };

  const handleChange = (event) => {
    if (!event.target.files[0]) {
      return;
    }

    fileToDataUri(event.target.files[0]).then((dataUri) => {
      setData({
        ...data,
        img: dataUri,
      });
    });
  };

  const fnSubmit = async () => {
    try {
      var userInfo = firebase.auth().currentUser;

      if (userInfo) {
        await Storage.set({
          key: "userInfo",
          value: JSON.stringify(userInfo),
        });
      } else {
        await Storage.clear();
      }
      await Storage.set({ key: "isLogged", value: true });
      await Storage.set({ key: "pushToken", value: token });

      if (data.img == "profile.png") {
        let finalData = {
          ...data,
        };
        let collectionRef = firebase.firestore().collection("Customer");
        let col = collectionRef.add(finalData);
        await Storage.set({ key: "colID", value: col.id });
        insertLoginRecord(userInfo.uid, token, col.id);
        setShowAlert(true);
      } else {
        addImage(data.img, "profile-img", async (loc) => {
          let finalData = {
            ...data,
            img: loc,
          };
          let collectionRef = firebase.firestore().collection("Customer");
          let col = collectionRef.add(finalData);
          await Storage.set({ key: "colID", value: col.id });
          insertLoginRecord(userInfo.uid, token, col.id);
          setShowAlert(true);
        });
      }
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonGrid>
          <h4 style={{ textAlign: "center" }}>Customer Details</h4>

          <IonRow>
            <IonCol style={{ textAlign: "center" }}>
              <input
                onChange={handleChange}
                name="img"
                id="img"
                type="file"
                hidden
              />
              <label for="img">
                <div
                  style={{
                    height: "100px",
                    width: "100px",
                    border: "1px solid black",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={data.img}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "fill",
                    }}
                  />
                </div>
              </label>
            </IonCol>
          </IonRow>
          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <IonInput name="name" onIonChange={fnHandel}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Mobile Number</IonLabel>
            <IonInput
              type="number"
              name="mobileNo"
              onIonChange={fnHandel}
              value={data.mobileNo}
              readonly={true}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked"></IonLabel>
            <IonInput
              placeholder="Address Line 1"
              name="address1"
              onIonChange={fnHandel}
            ></IonInput>
            <IonInput
              placeholder="Address Line 2"
              name="address2"
              onIonChange={fnHandel}
            ></IonInput>
            <IonInput
              placeholder="City"
              name="city"
              onIonChange={fnHandel}
            ></IonInput>
            <IonInput
              placeholder="State"
              name="state"
              onIonChange={fnHandel}
            ></IonInput>
            <IonInput
              placeholder="Zip Code"
              name="zipCode"
              onIonChange={fnHandel}
            ></IonInput>
          </IonItem>

          <IonRow>
            <IonCol size={12}>
              <IonButton
                color="success"
                expand="block"
                style={{ textAlign: "center" }}
                onClick={fnSubmit}
              >
                Register
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size={12} style={{ marginTop: "40px" }}></IonCol>
          </IonRow>
        </IonGrid>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            history.replace(`/tabs`);
            window.location.reload();
            setShowAlert(false);
          }}
          cssClass="my-custom-class"
          message={"Register successfully"}
          buttons={[
            {
              text: "Okay",
              handler: () => {},
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};
const mapStateToProps = () => {
  return;
};

export default connect(mapStateToProps)(withRouter(Register));
