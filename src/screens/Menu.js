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
import { getCurrentBranch } from "../store/actions/index";
import AddItems from "./AddItems";
import { menuList } from "../utils/menuList";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";

const Menu = ({ history, dispatch, orderList }) => {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection("Menu"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const removeDuplicates = (originalArray, prop) => {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  };

  const addItems = (size, menu, qty) => {
    let itemOrder = [
      {
        ...size,
        qty,
        title: `${menu.title}${size.name}`,
        sizeTitle: menu.title,
      },
    ];
    let update = orderList.find((obj) => {
      return size.name === obj.name && size.sizeTitle == obj.title;
    });

    if (update) {
      update.qty = qty;
    }
    let orderQTY = [...orderList, ...itemOrder];

    dispatch(getCurrentBranch(removeDuplicates(orderQTY, "title")));
  };

  return (
    <IonPage>
      <Header back={false} />
      <IonContent>
        <h5 style={{ textAlign: "center" }}>Menu</h5>
        <hr style={{ width: "auto", backgroundColor: "darkgrey" }} />
        <IonGrid>
          {value &&
            value.docs.map((item) => {
              let menu = item.data();
              return (
                <div style={{ position: "relative" }}>
                  <IonRow>
                    <IonCol size="4">
                      <IonThumbnail style={{ height: "85px", width: "100%" }}>
                        <img
                          src={menu.img}
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
                      // onClick={() => history.push(`/foodorder/${menu.itemid}`)}
                    >
                      <h6 style={{ margin: "0px" }}>{menu.title}</h6>

                      {menu.size.map((size) => {
                        return (
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                            }}
                          >
                            {size.name} : {size.price}
                            <AddItems
                              additems={addItems.bind(this, size, menu)}
                            />
                          </p>
                        );
                      })}
                    </IonCol>
                  </IonRow>
                  {!menu.available && (
                    <div className="unavailable">Unavailable</div>
                  )}
                  <hr style={{ width: "auto", backgroundColor: "lightgrey" }} />
                </div>
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
const mapStateToProps = ({ get_order }) => {
  let orderList = [];

  if (get_order.orderData) {
    orderList = get_order.orderData;
  }

  return { orderList };
};

export default connect(mapStateToProps)(withRouter(Menu));
