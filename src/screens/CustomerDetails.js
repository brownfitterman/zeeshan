import React, { useState } from "react";
import {
  IonPage,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItemDivider,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonList,
  IonLabel,
  IonInput,
  IonItem,
  IonCheckbox,
  IonAvatar,
  IonModal,
  IonButton,
  IonTabButton,
  IonThumbnail,
} from "@ionic/react";
import firebase from 'firebase';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Header from "./Header1";
import { shareSocial } from "ionicons/icons";
import axios from "axios";
import { menuList } from "../utils/menuList";
import { addOrder, getCurrentBranch } from "../store/actions/index";
const Order = ({ history,dispatch,orderList }) => {
  const [data, setData] = useState();


  const fnHandel=(e)=>{
  const key=e.target.name;
  const value=e.detail.value;
  setData({...data,[key]:value});
}

  const fnSubmit=()=>{
    let collectionRef = firebase.firestore().collection("data");
    collectionRef.add({customerDetails:data,orderDetail:orderList,orderId: new Date().getTime()});
     dispatch(getCurrentBranch([]));
    history.push('/home');
  }
  return (
    <IonPage>
      <Header back={false} />
      <IonContent>
        <h4 style={{ textAlign: "center" }}>Customer Details</h4>
        <IonItem>
          <IonLabel position="floating">Name</IonLabel>
          <IonInput  name='name' onIonChange={fnHandel} ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Mobile Number</IonLabel>
          <IonInput
            type="number"
            name="mobileNo"
            onIonChange={fnHandel}
            // onIonChange={(e)=>setNumber(e.detail.value)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"></IonLabel>
          <IonInput placeholder="Address Line 1"name='Address1' onIonChange={fnHandel}></IonInput>
          <IonInput placeholder="Address Line 2"name='Address2' onIonChange={fnHandel}></IonInput>
          <IonInput placeholder="City" name='City' onIonChange={fnHandel}></IonInput>
          <IonInput placeholder="State" name='State' onIonChange={fnHandel}></IonInput>
          <IonInput placeholder="Zip Code" name='Zip Code' onIonChange={fnHandel}></IonInput>
        </IonItem>
        <IonGrid>
          <IonRow>
            <IonCol size={12}>
              <IonButton
                color="success"
                expand="block"
                style={{ textAlign: "center" }}
                onClick={fnSubmit}
              >
                {" "}
                CONTINUE
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      
      </IonContent>
    </IonPage>
  );
};
const mapStateToProps = ({ get_order, get_Order_List }) => {
  let orderList = {};

  if (get_order.orderData) {
    orderList = get_order.orderData;
  }
  return {orderList };
};


export default connect(mapStateToProps)(withRouter(Order));
