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
  IonThumbnail,
  IonTextarea,
  IonSelectOption,
  IonSelect,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import moment from "moment";
import { connect } from "react-redux";
import firebase from "firebase";
import { compose } from "redux";
import { Plugins } from "@capacitor/core";
import { firestoreConnect, useFirestoreConnect } from "react-redux-firebase";
import { getCurrentBranch } from "../store/actions/index";
import { useCollection } from "react-firebase-hooks/firestore";
import AddItems from "./AddItems";
const { Storage, PushNotifications } = Plugins;

const Checkout = ({
  history,
  menuList,
  dispatch,
  orderSize,
  orderNumber,
  customerDetails,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState({});
  const [mobile, setMobile] = useState(0);
  const [orderType, setOrderType] = useState("delivery");
  const [value, loading, error] = useCollection(
    firebase.firestore().collection("Employee"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const storeAs = "register";
  useFirestoreConnect([
    {
      collection: "Customer",
      where: [["mobileNo", "==", mobile]],
      storeAs,
    },
  ]);

  useEffect(() => {
    getMobile();
  });

  const getMobile = async () => {
    const { value } = await Storage.get({ key: "mobile" });
    setMobile(value);
  };

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

  const sendNotification = (data) => {
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "https://fcm.googleapis.com/fcm/send", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader(
      "Authorization",
      `Bearer AAAA_9vz2ug:APA91bH0RnRVcRY_Lmx84S2-Ob4IM1uk0mNZOx9KcPi3e0m_zYzQmpzzr5ncswyco0eCLq82rP_MAcEhCktkAfF3fyItvBMR-o-ktvRYtUSBQMRQyYw3nfVWTxLAw_otaVcDQWa0tjda`
    );
    xhttp.send(JSON.stringify(data));
    xhttp.onload = function () {
      var res = xhttp.responseText;
      console.log(res);
    };
    xhttp.onerror = function () {
      console.log("something wentwrong");
    };
  };

  let orderDetails = [];
  if (menuList) {
    orderDetails = menuList.map((menu) => {
      let size = orderSize.filter((size) => {
        return size.sizeTitle == menu.title;
      });
      let order = {
        ...menu,
        size,
      };
      let sizeFlag = false;
      size.map((data) => {
        if (data.qty > 0) {
          sizeFlag = true;
        } else {
          // sizeFlag=false;
        }
      });
      if (sizeFlag) {
        sizeFlag = false;
        return order;
      } else {
        return null;
      }
    });
  }
  orderDetails = orderDetails.filter((data) => data);

  const fnSubmit = async () => {
    let orderId =moment().format("YYYYMMDDHHmmss");
    console.log(orderId);
    console.log(data);
    let collectionRef = firebase.firestore().collection("data");
    collectionRef
      .add({
        customerDetails: data,
        orderDetail: orderDetails,
        orderId: Number(`${orderId}`),
        status: false,
        orderType: orderType,
        timeStamp: `${new Date()}`,
      })
      .then(() => {
        setShowAlert(true);
        value.docs.map((emp) => {
          let employee = emp.data();
          let notification = {
            notification: {
              title: data.name,
              body: `${data.address}`,
              sound:"default"
            },
            to: employee.key,
          };
          sendNotification(notification);
        });
      });
    return await Storage.set({ key: "profile", value: JSON.stringify(data) });
  };
  const arrArea = [
    "Chanda Nagar",
    "Hafeezpet",
    "Madeenaguda",
    "Miyapur",
    "Allwyn Colony",
    "Madhapur",
    "Kondapur",
    "Moosapet",
  ];
  let total = 0;
  return (
    <IonPage>
      <Header />
      {orderNumber > 0 ? (
        <IonContent>
          <IonGrid>
            {orderDetails &&
              orderDetails.map((order) => {
                return (
                  <>
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
                      <IonCol
                        size="8"
                        onClick={() => history.push("/foodorder")}
                      >
                        <h6 style={{ margin: "0px" }}>{order.title}</h6>
                        {order.size.map((size) => {
                          total = total + size.qty * size.price;
                          return (
                            <>
                              {size.qty > 0 ? (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    marginTop: "5px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  {size.name} : {`${size.qty} X  ${size.price}`}
                                  <span
                                    style={{
                                      float: "right",
                                      fontWeight: "bold",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {size.qty * size.price}
                                  </span>
                                </p>
                              ) : null}
                            </>
                          );
                        })}
                      </IonCol>
                    </IonRow>
                  </>
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
                  {orderType == "delivery" ? (
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
                  Order Total{" "}
                  <span style={{ float: "right" }}>
                    {orderType == "delivery" ? total + 25 + 25 : total}
                  </span>
                  {total + 50 <= 250 && orderType == "delivery" && (
                    <span className="order-limit">
                      Order Amount must be ₹250 or greater{" "}
                    </span>
                  )}
                </p>
              </IonCol>
            </IonRow>
            <hr style={{ width: "auto", backgroundColor: "lightgrey" }} />
            <IonItem lines="none">
              <IonLabel>Order Type</IonLabel>
              <IonSelect
                value={orderType}
                placeholder="Select One"
                onIonChange={(e) => setOrderType(e.detail.value)}
              >
                <IonSelectOption value="delivery">Delivery</IonSelectOption>
                <IonSelectOption value="pickup">Pick Up</IonSelectOption>
              </IonSelect>
            </IonItem>
            <h4 style={{ textAlign: "center" }}>Customer Details</h4>
            <IonItem>
              <IonLabel position="floating">
                Name <span style={{ color: "red" }}>*</span>
              </IonLabel>
              <IonInput
                name="name"
                onIonChange={fnHandel}
                value={data.name}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">
                Mobile Number <span style={{ color: "red" }}>*</span>
              </IonLabel>
              <IonInput
                type="number"
                name="mobileNo"
                onIonChange={fnHandel}
                value={data.mobileNo}
                // onIonChange={(e)=>setNumber(e.detail.value)}
              ></IonInput>
            </IonItem>
            {orderType == "delivery" ? (
              <>
                <IonItem>
                  <IonLabel position="floating">
                    Address <span style={{ color: "red" }}>*</span>
                  </IonLabel>
                  <IonTextarea
                    rows={1}
                    // cols={20}
                    placeholder="Enter address here..."
                    name="address"
                    value={data.address}
                    onIonChange={fnHandel}
                  ></IonTextarea>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">
                    Area Name <span style={{ color: "red" }}>*</span>
                  </IonLabel>
                  <IonSelect
                    value={data.area}
                    placeholder="Select One"
                    name="area"
                    onIonChange={fnHandel}
                  >
                    {arrArea.map((data) => (
                      <IonSelectOption value={data}>{data}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">City</IonLabel>
                  <IonInput value="Hyderabad" disabled={true}></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">State</IonLabel>
                  <IonInput value="Telangana" disabled={true}></IonInput>
                </IonItem>
              </>
            ) : null}

            <IonRow>
              <IonCol size={12}>
                <IonButton
                  color="success"
                  expand="block"
                  style={{ textAlign: "center" }}
                  onClick={fnSubmit}
                  disabled={
                    data.name != "" &&
                    data.mobileNo != "" &&
                    (orderType == "pickup"
                      ? true
                      : data.address != "" && data.area != (null && "")) &&
                    (orderType == "delivery" ? total + 50 >= 250 : true)
                      ? false
                      : true
                  }
                >
                  PLACE ORDER
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size={12} style={{ marginTop: "40px" }}></IonCol>
            </IonRow>
          </IonGrid>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={async () => {
              history.replace("/tabs/AdminOrder");
              await window.location.reload();
              dispatch(getCurrentBranch([]));
              setShowAlert(false);
            }}
            cssClass="my-custom-class"
            message={"Order Placed successfully"}
            buttons={[
              {
                text: "Okay",
                handler: () => {},
              },
            ]}
          />
        </IonContent>
      ) : (
        <>
          <div style={{ margin: "10vh" }}>
            <img src="cart.png" />
            <h4 style={{ textAlign: "center" }}>Your Cart is Empty</h4>
          </div>
          <div style={{ textAlign: "center" }}>
            <IonButton
              color="success"
              onClick={() => history.push("/tabs/AdminOrder")}
            >
              Order Now
            </IonButton>
          </div>
        </>
      )}
    </IonPage>
  );
};
const storeAs = "register";

const mapStateToProps = ({ get_order, firestore }) => {
  let orderSize = [];
  let menuList = [];
  let orderNumber = 0;
  let customerDetails = "";
  if (get_order.orderData) {
    orderSize = get_order.orderData;
  }
  if (firestore.ordered.Menu) {
    menuList = [...firestore.ordered.Menu];
  }

  if (get_order.orderData) {
    let total = 0;
    get_order.orderData.map((size) => {
      total += size.qty;
    });
    orderNumber = total;
  }
  if (firestore.ordered[storeAs]) {
    customerDetails = firestore.ordered[storeAs];
  }

  return { orderSize, menuList, orderNumber, customerDetails };
};

export default compose(
  firestoreConnect(() => ["Menu"]),
  connect(mapStateToProps)
)(withRouter(Checkout));
