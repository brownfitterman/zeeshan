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
  IonButtons,
  IonButton,
  IonTextarea,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { connect } from "react-redux";
import firebase from "firebase";
import { Plugins } from "@capacitor/core";
import { insertLoginRecord } from "utils/sqllite";
import { deleteSqlRecords } from "utils/sqllite";
import { compose } from "redux";
import { addImage } from "utils/uploadS3";
import { firestoreConnect, useFirestoreConnect } from "react-redux-firebase";
const { Storage, PushNotifications } = Plugins;

const fileToDataUri = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

const Register = ({ history, orderList }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [mobile, setMobile] = useState(0);
  const [data, setData] = useState({
    img: "profile.png",
    name: "",
    mobileNo: "",
    address: "",
  });
  const storeAs = "register";
  useFirestoreConnect([
    {
      collection: "Customer",
      where: [["mobileNo", "==", mobile]],
      storeAs,
    },
  ]);
  useEffect(() => {
    getProfile();
    
  }, []);



  const getProfile = async () => {
    const { value } = await Storage.get({ key: "profile" });
    setData({ ...data, ...JSON.parse(value) });
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
    await Storage.set({ key: "profile", value: JSON.stringify(data) });
    setShowAlert(true);
    return getProfile();
  };

 


  return (
    <IonPage>
      <Header back={false} />
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
                {" "}
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
            <IonInput
              name="name"
              onIonChange={fnHandel}
              value={data.name}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Mobile Number</IonLabel>
            <IonInput
              type="number"
              name="mobileNo"
              onIonChange={fnHandel}
              value={data.mobileNo}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Address</IonLabel>
            <IonTextarea
              rows={3}
              cols={20}
              placeholder="Enter address here..."
              name="address"
              value={data.address}
              onIonChange={fnHandel}
            ></IonTextarea>
          </IonItem>
          <IonRow>
            <IonCol size={12}>
              <IonButton
                color="success"
                expand="block"
                style={{ textAlign: "center" }}
                onClick={fnSubmit}
              >
                Save
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
          message={"Profile Updated Successfully."}
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

const storeAs = "register";

const mapStateToProps = ({ firestore: { ordered } }) => {
  let orderList = [];
  if (ordered[storeAs]) {
    orderList = ordered[storeAs];
  }
  return { orderList };
};

export default compose(connect(mapStateToProps))(withRouter(Register));
