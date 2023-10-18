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
  IonAlert,
  IonLabel,
  IonItem,
  IonInput,
  IonCheckbox,
  IonAvatar,
  IonButtons,
  IonModal,
  IonButton,
  IonTabButton,
  IonThumbnail,
} from "@ionic/react";
import { copy } from "ionicons/icons";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Plugins, Capacitor } from "@capacitor/core";
import { closeCircleOutline } from "ionicons/icons";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

const { App } = Plugins;
const OrderDetail = ({
  history,
  showModal,
  close,
  order,
  firestore: { update },
}) => {
  var total = 0;
  const { customerDetails, status, completed, declined } = order;
  const launchApp = async () => {
    let { address1, address2, state, city, zipCode } = customerDetails;
    address1 = address1 ? address1 + ", " : "";
    address2 = address2 ? address2 + ", " : "";
    state = state ? state + ", " : "";
    city = city ? city + ", " : "";
    zipCode = zipCode ? zipCode + ", " : "";

    const url =
      "https://www.google.com/maps/place/ " +
      address1 +
      address2 +
      state +
      city +
      zipCode;
    if (Capacitor.platform == "web") {
      window.open(url);
    } else {
      var ret = await App.canOpenUrl({ url });
      var retx = await App.openUrl({ url });
      console.log("Open url response: ", ret, retx);
    }
  };

  const copyToClipboard = () => {
    let text = document.getElementById("content").textContent;
    // console.log('text', text)
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };
  return (
    <IonModal isOpen={showModal}>
      <div style={{ position: "absolute", right: "2px", top: "10px" }}>
        <IonButtons onClick={close}>
          <IonIcon
            icon={closeCircleOutline}
            style={{ fontSize: "38px", color: "black" }}
          />
        </IonButtons>
      </div>
      {/* <IonButtons onClick={close} style={{position:'absolute',right:'5px',top:'5px'}}>Close</IonButtons> */}
      <h4 style={{ textAlign: "center" }}>Order Details</h4>
      <IonContent>
        <IonGrid>
          {order.orderDetail &&
            order.orderDetail.map((order) => {
              return (
                <IonRow>
                  <IonCol size="4">
                    <IonThumbnail style={{ height: "85px", width: "100%" }}>
                      <img
                        src={order.img}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "fill",
                          borderRadius: "5px",
                        }}
                      />
                    </IonThumbnail>
                  </IonCol>
                  <IonCol size="8" onClick={() => history.push("/foodorder")}>
                    <h6 style={{ margin: "0px" }}>{order.title}</h6>

                    {order.size.map((size) => {
                      total += Number(size.price) * size.qty;
                      return (
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "400",
                            margin: "0px",
                            paddingLeft: "5px",
                          }}
                        >
                          {size.name} : {`${size.price} x ${size.qty}`}
                          <span style={{ float: "right" }}>
                            {size.price * size.qty}
                          </span>
                        </p>
                      );
                    })}
                  </IonCol>
                </IonRow>
              );
            })}

          <hr style={{ width: "auto", backgroundColor: "lightgrey" }} />

          <IonRow>
            <IonCol>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "10px",
                  paddingLeft: "5px",
                }}
              >
                {order.orderType == "delivery" ? (
                  <>
                    {" "}
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        margin: "2px",
                      }}
                    >
                      Other Charges <span style={{ float: "right" }}>25</span>
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        margin: "2px",
                      }}
                    >
                      Delivery Charges{" "}
                      <span style={{ float: "right" }}>25</span>
                    </p>{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        margin: "2px",
                      }}
                    >
                      Other Charges <span style={{ float: "right" }}>25</span>
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        margin: "2px",
                        color: "red",
                      }}
                    >
                      Pickup Discount
                      <span style={{ float: "right" }}>25</span>
                    </p>
                  </>
                )}
                Order Total
                <span style={{ float: "right" }}>{order.orderType == "delivery" ? total + 25 + 25 : total}</span>
              </p>
            </IonCol>
        
          </IonRow>
          <hr style={{ width: "auto", backgroundColor: "lightgrey" }} />
          <IonRow>
            <IonCol>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  margin: "10px",
                  paddingLeft: "5px",
                }}
              >
                Order Type
                <span style={{ float: "right" }}>{order.orderType}</span>
              </p>
            </IonCol>
          </IonRow>
          <h4 style={{ textAlign: "center" }}>Customer Details</h4>
          {customerDetails && (
            <>
              <p>Name :- {customerDetails.name}</p>
              <p>Mobile No :- {customerDetails.mobileNo}</p>
              {!completed && !declined && order.orderType =='delivery'&& (
                <p>
                  Address :-
                  <span id="content">
                    {`
                  ${customerDetails.address && customerDetails.address} 
           
                  `}
                  </span>
                </p>
              )}
            </>
          )}

          <IonRow>
            <IonCol size={12} style={{ marginTop: "40px" }}></IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};
const mapStateToProps = ({}) => {
  return {};
};

export default compose(
  firestoreConnect(),
  connect(mapStateToProps)
)(withRouter(OrderDetail));
