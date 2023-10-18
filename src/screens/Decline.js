import React, { useState, useEffect } from "react";
import { IonGrid, IonRow, IonCol, IonThumbnail } from "@ionic/react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import moment from "moment";
import OrderDetail from "screens/Orderdetail";
import { Plugins } from "@capacitor/core";
import { useFirestoreConnect } from "react-redux-firebase";
const { Storage } = Plugins;


const Order = ({declineList}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [data, setData] = useState({});
  const [mobile, setMobile] = useState(0);
  useFirestoreConnect([
    {
      collection: "data",
      where: [["customerDetails.mobileNo", "==", mobile],["declined", "==", true]],
      storeAs: "declined",
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
    <IonGrid>
      <IonRow>
        <IonCol>
          {declineList &&
            declineList.map((item) => {
              // const item=data.data();
              const {name} = item.customerDetails;
              const{img}=item.orderDetail[0];
              let total = 0;
              item.orderDetail.map((data) => {
                data.size.map((size) => {
                  total += Number(size.price * size.qty);
                });
              });
              let timeStamp = null;
              if (item.timeStamp) {
                let orderDate = moment(item.timeStamp).format("YYYY-MM-DD");
                let yesterday = moment(new Date())
                  .subtract(1, "day")
                  .format("YYYY-MM-DD");
                let today = moment(new Date()).format("YYYY-MM-DD");
                if (orderDate == today) {
                  timeStamp = "Today";
                } else if (orderDate == yesterday) {
                  timeStamp = "Yesterday";
                } else {
                  timeStamp = orderDate;
                }
              }
              return (
                <>
                  <IonRow>
                    <IonCol size="4">
                      <IonThumbnail style={{ height: "85px", width: "100%" }}>
                        <img src={img}  style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "fill",
                              borderRadius: "5px",
                            }} />
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
                        Order Name :{" "}
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
                        style={{ backgroundColor: "red" }}
                      >
                        Declined
                      </span>
                    </IonCol>
                  </IonRow>

                  <hr style={{ width: "auto", backgroundColor: "lightgrey" }} />
                </>
              );
            })}
        </IonCol>
      </IonRow>
      <OrderDetail
        showModal={showDetail}
        close={() => setShowDetail(false)}
        order={data}
      />
    </IonGrid>
  );
};

const mapStateToProps = ({ firestore: { ordered }}) => {
  let declineList = [];
 

if (ordered["declined"]) {
  declineList = ordered["declined"];
}

  return { declineList};
};

export default compose(connect(mapStateToProps))(withRouter(Order));
