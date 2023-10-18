import React, { useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonItem,
  IonIcon,
  IonModal,
  IonButton,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { callSharp, closeCircleOutline } from "ionicons/icons";
import { firestoreConnect } from "react-redux-firebase";
import { CallNumber } from "@ionic-native/call-number";
const Header = ({ back, history }) => {
  const [showModal, setShowModal] = useState(false);
  const fnCall = (number) => {
    CallNumber.callNumber(number, true)
      .then((res) => console.log(JSON.stringify(res)))
      .catch((err) => console.log(JSON.stringify(err)));
  };
  return (
    <>
      <IonHeader>
        <IonToolbar style={{ textAlign: "center" }} color="success">
          {back && (
            <IonButtons slot="start" style={{ position: "absolute" }}>
              <IonBackButton
                defaultHref={false}
                onClick={() => {
                  history.push(`/tabs/order`);
                  window.location.reload();
                }}
              />
            </IonButtons>
          )}
          <IonTitle style={{ fontWeight: "bold", fontSize: "20px" }}>
            Zeeshan App
          </IonTitle>

          <IonIcon
            slot="end"
            icon={callSharp}
            style={{ fontSize: "28px", color: "white", position:'absolute',right:'10px',top:'5' }}
            onClick={() => setShowModal(true)}
          />
        </IonToolbar>
      </IonHeader>
      <IonModal isOpen={showModal} cssClass="my-custom-class">
        <div style={{ position: "absolute", right: "2px", top: "10px" }}>
          <IonButtons onClick={() => setShowModal(false)}>
            <IonIcon
              icon={closeCircleOutline}
              style={{ fontSize: "38px", color: "black" }}
            />
          </IonButtons>
        </div>
        <h3 style={{ textAlign: "center" ,marginTop:'20px'}}>Numbers</h3>
        <h5 style={{ marginTop: "5vh", padding: "15px" }}>
          <span style={{ color: "blue" }}>+918555892508</span>{" "}
          <IonIcon
            icon={callSharp}
            style={{
              fontSize: "20px",
              color: "black",
              paddingRight: "10px",
              float: "right",
            }}
            onClick={fnCall.bind(this, "+918555892508")}
          />
        </h5>
        <h5 style={{ marginTop: "1vh", padding: "15px" }}>
          <span style={{ color: "blue" }}>+918019786519</span>{" "}
          <IonIcon
            icon={callSharp}
            style={{
              fontSize: "20px",
              color: "black",
              paddingRight: "10px",
              float: "right",
            }}
            onClick={fnCall.bind(this, "+918019786519")}
          />
        </h5>
      </IonModal>
    </>
  );
};
const mapStateToProps = () => {
  return {};
};

export default compose(
  firestoreConnect(),
  connect(mapStateToProps)
)(withRouter(Header));
