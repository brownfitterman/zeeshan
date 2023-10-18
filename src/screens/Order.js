import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { Route, withRouter } from "react-router-dom";
import Header from "./Header";
import { connect } from "react-redux";
import Pending from "./pending";
import Completed from "./complete";
import Declined from "./Decline";
import Inprogress from "./Inprogress";

const Order = ({ history }) => {
  const [activePage, setActivePage] = useState("pending");
  return (
    <IonPage>
      <Header back={false} />
      <IonContent>
        <IonSegment value={activePage} mode='ios'>
          <IonSegmentButton
            value="pending"
            onClick={() => setActivePage("pending")}
          >
            <IonLabel>Pending</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton
            value="inprogress"
            onClick={() => setActivePage("inprogress")}
          >
            <IonLabel>In Progress</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton
            value="completed"
            onClick={() => setActivePage("completed")}
          >
            <IonLabel>Completed</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton
            value="decline"
            onClick={() => setActivePage("decline")}
          >
            <IonLabel>Decline</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {activePage == "pending" ? (
          <Pending />
        ) : activePage == "inprogress" ? (
          <Inprogress />
        ) : activePage == "completed" ? (
          <Completed />
        ) : (
          <Declined />
        )}
      </IonContent>
    </IonPage>
  );
};
const mapStateToProps = ({ get_order, get_Expenses_List }) => {
  let orderList = [];

  if (get_order.orderData) {
    orderList = get_order.orderData;
  }

  return { orderList };
};
export default connect(mapStateToProps)(withRouter(Order));
