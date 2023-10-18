import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonThumbnail,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { connect } from "react-redux";
import { compose } from "redux";
import { Plugins } from "@capacitor/core";
import { useFirestoreConnect } from "react-redux-firebase";
const { Storage } = Plugins;
const Menu = ({ orderList }) => {
  const [mobile, setMobile] = useState(0);
  const [data, setData] = useState({});
  const storeAs = "order";
  useFirestoreConnect([
    {
      collection: "data",
      where: [["customerDetails.mobileNo", "==", mobile]],
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
  let inprogressOrder = [];
  let pendingOrder = [];
  let pastOrder = [];
  let declinedOrder=[];
  if (orderList) {
    inprogressOrder = orderList.filter((data) => {
      return data.inprogress == true;
    });
    pendingOrder = orderList.filter((data) => {
      return data.status == false;
    });
    pastOrder = orderList.filter((data) => {
      return data.completed == true;
    });
    declinedOrder = orderList.filter((data) => {
      return data.completed == true;
    });
  }
  console.log(`inprogress :-`);
  console.log(inprogressOrder);
  console.log(`pending :-`);
  console.log(pendingOrder);
  console.log(`past order `);
  console.log(pastOrder);
  return (
    <IonPage>
      <Header back={false} />
      <IonContent>
        <IonGrid>
          <h2 style={{textAlign:'center'}}>Orders</h2>
          {pendingOrder &&
            pendingOrder.map((data) => {
              let total = 0;
              return (
                <div style={{position:'relative'}}>
                  <h6 style={{ margin: "10px", color: "lightblue" }}>
                    Pending Order
                  </h6>
                  <span
                    className="status"
                    style={{ backgroundColor: "lightred" }}
                  >
                    Pending
                  </span>
                  {data.orderDetail.map((orders) => {
                    const { title, img, size } = orders;
                    return (
                      <IonRow>
                        <IonCol size="4">
                          <IonThumbnail
                            style={{ height: "85px", width: "100%" }}
                          >
                            <img src={img} style={{ borderRadius: "5px" }} />
                          </IonThumbnail>
                        </IonCol>
                        <IonCol size="8">
                          <h6 style={{ margin: "0px", fontSize: "14px" }}>
                            {title}
                          </h6>
                          {size.map((size) => {
                            total = total + size.qty * size.price;
                            return (
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
                            );
                          })}
                        </IonCol>
                      </IonRow>
                    );
                  })}

                  <hr style={{ width: "auto", backgroundColor: "lightgrey" }} />
                  <h6>
                    Order Total <span style={{ float: "right" }}>₹{total}</span>
                  </h6>
                  <hr style={{ width: "auto", backgroundColor: "black" }} />
                </div>
              );
            })}

         
          {inprogressOrder &&
            inprogressOrder.map((data) => {
              let total = 0;
              return (
                <div style={{position:'relative'}}>
                  <h6 style={{ margin: "10px", color: "lightblue" }}>
                    Current Order
                  </h6>
                  <span
                    className="status"
                    style={{ backgroundColor: "yellow" }}
                  >
                    InProgress
                  </span>
                  {data.orderDetail.map((orders) => {
                    const { title, img, size } = orders;
                    return (
                      <IonRow>
                        <IonCol size="4">
                          <IonThumbnail
                            style={{ height: "85px", width: "100%" }}
                          >
                            <img src={img} style={{ borderRadius: "5px" }} />
                          </IonThumbnail>
                        </IonCol>
                        <IonCol size="8">
                          <h6 style={{ margin: "0px", fontSize: "14px" }}>
                            {title}
                          </h6>
                          {size.map((size) => {
                            total = total + size.qty * size.price;
                            return (
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
                            );
                          })}
                        </IonCol>
                      </IonRow>
                    );
                  })}

                  <hr style={{ width: "auto", backgroundColor: "lightgrey" }} />
                  <h6>
                    Order Total <span style={{ float: "right" }}>₹{total}</span>
                  </h6>
                  <hr style={{ width: "auto", backgroundColor: "black" }} />
                </div>
              );
            })}

          

          {pastOrder &&
            pastOrder.map((data) => {
              let total = 0;
              return (
                <>
                  <h6 style={{ margin: "10px", color: "lightblue" }}>
                    Past Order
                  </h6>
                  {data.orderDetail.map((orders) => {
                    const { title, img, size } = orders;
                    return (
                      <IonRow>
                        <IonCol size="4">
                          <IonThumbnail
                            style={{ height: "85px", width: "100%" }}
                          >
                            <img src={img} style={{ borderRadius: "5px" }} />
                          </IonThumbnail>
                        </IonCol>
                        <IonCol size="8">
                          <h6 style={{ margin: "0px", fontSize: "14px" }}>
                            {title}
                          </h6>
                          {size.map((size) => {
                            total = total + size.qty * size.price;
                            return (
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
                            );
                          })}
                        </IonCol>
                      </IonRow>
                    );
                  })}

                  <hr style={{ width: "auto", backgroundColor: "lightgrey" }} />
                  <h6>
                    Order Total <span style={{ float: "right" }}>₹{total}</span>
                  </h6>
                  <hr style={{ width: "auto", backgroundColor: "black" }} />
                </>
              );
            })}

          <IonRow>
            <IonCol style={{ marginTop: "40px" }}></IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

const storeAs = "order";
const mapStateToProps = ({ firestore: { ordered } }) => {
  let orderList = [];
  if (ordered[storeAs]) {
    orderList = ordered[storeAs];
  }
  return { orderList };
};

// export default connect(mapStateToProps)(withRouter(Menu));
export default compose(connect(mapStateToProps))(withRouter(Menu));
