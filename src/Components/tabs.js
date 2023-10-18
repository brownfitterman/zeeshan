import React, { useEffect, useState } from "react";
import {
  IonLabel,
  IonTabButton,
  IonIcon,
  IonTabs,
  IonTabBar,
  IonRouterOutlet,
  IonBadge,
  IonPage,
} from "@ionic/react";
import {
  home,
  documentOutline,
  heartOutline,
  personOutline,
  chatbox,
  cart,
} from "ionicons/icons";
import { Route, withRouter, Redirect } from "react-router-dom";
import AdminOrder from "screens/Menu";
import Checkout from "screens/checkout";
import Order from "screens/Order";
import Profile from "screens/Profile";
import { connect } from "react-redux";
import { compose } from "redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const Tabs = ({ history, orderNumber, pending, inprogress }) => {
  const [mobile, setMobile] = useState(0);
  useFirestoreConnect([
    {
      collection: "data",
      where: [
        ["customerDetails.mobileNo", "==", mobile],
        ["inprogress", "==", true],
      ],
      storeAs: "inprogress",
      queryParams: ["orderByid=desc"],
    },
    {
      collection: "data",
      where: [
        ["customerDetails.mobileNo", "==", mobile],
        ["status", "==", false],
      ],
      storeAs: "pending",
      queryParams: ["orderByid=desc"],
    },
  ]);
  useEffect(() => {
    getMobile();
  });

  const getMobile = async () => {
    const { value } = await Storage.get({ key: "profile" });
    let mob = JSON.parse(value);
    if (mob) {
      setMobile(mob.mobileNo);
    }
  };

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/AdminOrder" component={AdminOrder} exact={true} />
        <Route path="/tabs/order" component={Order} exact={true} />
        <Route path="/tabs/checkout" exact component={Checkout} />
        <Route path="/tabs/profile" exact component={Profile} />
        <Route
          path="/tabs"
          render={() => <Redirect to="/tabs/AdminOrder" />}
          exact={true}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" color="dark" href="/tabs/AdminOrder">
        <IonTabButton tab="AdminOrder" href="/tabs/AdminOrder">
          <IonIcon icon={home} />
          <IonLabel>Menu</IonLabel>
        </IonTabButton>

        <IonTabButton tab="order" href="/tabs/order">
          <IonIcon icon={documentOutline} />
          {pending > 0 && (
            <span
              className="circle"
              style={{ top: "3px", left: "4px", backgroundColor: "#E68F90" }}
            >
              {pending}
            </span>
          )}
          <IonLabel>Order</IonLabel>
          {inprogress > 0 && (
            <span
              className="circle"
              style={{ top: "3px", right: "4px", backgroundColor: "#E6D88F" }}
            >
              {inprogress}
            </span>
          )}
        </IonTabButton>

        <IonTabButton tab="cart" href="/tabs/checkout">
          <IonIcon icon={cart} />
          <IonLabel>Cart</IonLabel>
          {orderNumber > 0 && (
            <span
              className="circle"
              style={{ top: "3px", right: "6px", backgroundColor: "red" }}
            >
              {orderNumber}
            </span>
          )}
        </IonTabButton>

        <IonTabButton
          tab="customer"
          // href="/tabs/profile"
          onClick={() => {
            history.push("/tabs/profile");
            window.location.reload();
          }}
        >
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

// export default withRouter(Tabs);
const mapStateToProps = ({ get_order, firestore: { ordered } }) => {
  let orderNumber = 0;
  let inprogress = null,
    pending = null;

  if (get_order.orderData) {
    let total = 0;
    get_order.orderData.map((size) => {
      total += size.qty;
    });
    orderNumber = total;
  }

  if (ordered["inprogress"]) {
    inprogress = ordered["inprogress"].length;
  }

  if (ordered["pending"]) {
    pending = ordered["pending"].length;
  }

  return { orderNumber, inprogress, pending };
};
export default compose(connect(mapStateToProps))(withRouter(Tabs));
