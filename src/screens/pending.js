import React, { useState, useEffect } from "react";
import { IonGrid, IonRow, IonCol, IonThumbnail } from "@ionic/react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import OrderDetail from "screens/Orderdetail";
import moment from "moment";
import { Plugins } from "@capacitor/core";
import { useFirestoreConnect } from "react-redux-firebase";

const { Storage } = Plugins;
const Order = ({pendingList}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [data, setData] = useState({});
  const [mobile, setMobile] = useState(0);
  useFirestoreConnect([
    {
      collection: "data",
      where: [["customerDetails.mobileNo", "==", mobile],["status", "==", false]],
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
    if(mob){
    setMobile(mob.mobileNo);
  }
  };
  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            {pendingList &&
              pendingList.map((item) => {
                const { name } = item.customerDetails;
                const{img}=item.orderDetail[0];
                let total = 0;
                item.orderDetail.map((data) => {
                  data.size.map((size) => {
                    total += Number(size.price * size.qty);
                  });
                });
                let timeStamp = null;
                if (item.timeStamp) {
                  timeStamp = moment(item.timeStamp).fromNow();
                }
                return (
                  <>
                    <IonRow>
                      <IonCol size="4">
                        <IonThumbnail style={{ height: "85px", width: "100%" }}>
                          <img
                            src={img}
                            alt="image is not available"
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
                        onClick={() => {
                          setShowDetail(true);
                          setData(item);
                        }}
                      >
                        <h6 style={{ margin: "0px" }}>{name}</h6>
                        <p
                          style={{
                            marginTop: "0px",
                            fontSize: "13px",
                            fontWeight: "500",
                            paddingLeft: "5px",
                          }}
                        >
                          Order Name :
                          {item.orderDetail.map((order) => {
                            return <span>{`${order.title}, `}</span>;
                          })}
                        </p>
                        <p
                          style={{
                            position: "absolute",
                            width: "100%",
                            bottom: "0px",
                            fontSize: "12px",
                            fontWeight: "400",
                          }}
                        >
                          Total : {total}
                          <span style={{ float: "right" }}>{timeStamp}</span>
                        </p>
                        <span
                          className="status"
                          style={
                            item.status
                              ? { backgroundColor: "lightgreen" }
                              : null
                          }
                        >
                          {item.status ? "Completed" : "pending"}
                        </span>
                      </IonCol>
                    </IonRow>

                    <hr
                      style={{ width: "auto", backgroundColor: "lightgrey" }}
                    />
                  </>
                );
              })}
          </IonCol>
        </IonRow>
      </IonGrid>
      <div style={{ marginBottom: "40px" }}></div>
      <OrderDetail
        showModal={showDetail}
        close={() => setShowDetail(false)}
        order={data}
      />
    </>
  );
};

const mapStateToProps = ({ get_order ,firestore: { ordered }}) => {
  let pendingList = [];
 

if (ordered["pending"]) {
  pendingList = ordered["pending"];
}

  return { pendingList};
};

export default compose(connect(mapStateToProps))(withRouter(Order));
