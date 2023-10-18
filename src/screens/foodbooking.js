import React, { Component } from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonToggle,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonRadio,
  IonRadioGroup,
  IonItemDivider,
  IonListHeader,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import Header from "./Header1";
import { Plugins } from "@capacitor/core";
import { connect } from "react-redux";
import { Actions } from "core/redux-helper";
import { IonSlides, IonSlide } from "@ionic/react";
import { addOutline, removeOutline, cart, menu } from "ionicons/icons";
import { menuList } from "../utils/menuList";
import { getCurrentBranch } from "../store/actions/index";
import { IoT1ClickProjects } from "aws-sdk";
const { SplashScreen } = Plugins;

class Home extends Component {
  state = {
    placeTypes: [],
    qty: 0,
    familyQty:0,
    selected: "biff",
    item: {},
    order: [],
    pepsi:'',
    sevenUP:'',
    water:''
  };
  componentDidMount() {
    let item = menuList.find(
      (menu) => this.props.match.params.id == menu.itemid
    );
    this.setState({ item: item });
  }
  componentWillReceiveProps({ orderList }) {
    if (orderList && orderList != this.props.orderList) {
      this.setState({
        order: orderList,
      });
    }
  }
  order() {
    const { item, qty, order ,familyQty,pepsi,water,sevenUP} = this.state;
    let itemOrder = [{ ...item, quantity: qty,familyqty:familyQty,pepsi,water,sevenUP}];
    let final = [...itemOrder, ...order];

    this.props.dispatch(getCurrentBranch(final));
  }
  incrementQty() {
    if (this.state.qty < 10) {
      this.setState({ qty: (this.state.qty += 1) });
    }
  }
  decrementQty() {
    if (this.state.qty < 1) {
      this.setState({ qty: 0 });
    } else {
      this.setState({ qty: (this.state.qty -= 1) });
    }
  }
  incrementFamilyQty() {
    if (this.state.familyQty < 10) {
      this.setState({ familyQty: (this.state.familyQty += 1) });
    }
  }
  decrementFamilyQty() {
    if (this.state.familyQty < 1) {
      this.setState({ familyQty: 0 });
    } else {
      this.setState({ familyQty: (this.state.familyQty -= 1) });
    }
  }
  componentWillUnmount() {
    this.setState({ item: {} });
  }
  render() {
    const { selected, item,pepsi,sevenUP,water,familyQty,qty } = this.state;
    if (item && item.itemid != this.props.match.params.id) {
      let item = menuList.find(
        (menu) => this.props.match.params.id == menu.itemid
      );
      this.setState({ item: item,qty:0,familyQty:0 });
    }
    return (
      <IonPage>
        <IonContent className="Main-content">
          <Header back={true} />
          <img src={item.img} className="food-img" />
          <h6>{item.title}</h6>
          <IonGrid style={{ marginTop: "20px" }}>
            <IonRow>
              <IonCol size={6}></IonCol>
              <IonCol size={6} style={{ textAlign: "center" }}>
                <IonButton color="success" onClick={this.order.bind(this)} disabled={familyQty!=0||qty!=0?false:true}>
                  {" "}
                  <IonIcon icon={cart} /> &nbsp; ADD TO CART
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size={12}>
                <h4
                  style={{
                    textAlign: "center",
                    backgroundColor: "grey",
                    padding: "10px",
                    margin: "0px",
                  }}
                >
                  Size and price
                </h4>
                {/* <IonList>
                  <IonRadioGroup
                    value={selected}
                    onIonChange={(e) =>
                      this.setState({ selected: e.detail.value })
                    }
                  >
                    <IonItem lines="none">
                      <IonRadio slot="end" value="biff" />
                      <IonLabel>Small</IonLabel>
                    </IonItem>

                    <IonItem lines="none">
                      <IonLabel>Large</IonLabel>
                      <IonRadio slot="end" value="griff" />
                    </IonItem>
                  </IonRadioGroup>
                </IonList> */}
              </IonCol>
              <IonCol size={6}>
                <h6>Plate</h6>
              </IonCol>
              <IonCol size={6}>
                <div style={{ float: "right" }}>
                  <IonButton
                    color="danger"
                    onClick={this.decrementQty.bind(this)}
                    shape="round"
                  >
                    {" "}
                    <IonIcon icon={removeOutline} />
                  </IonButton>
                  <span
                    style={{
                      padding: "7px",
                      fontSize: "18px",
                      fontWeight: "500",
                      position: "relative",
                      top: "8px",
                    }}
                  >
                    {this.state.qty}
                  </span>
                  <IonButton
                    color="primary"
                    onClick={this.incrementQty.bind(this)}
                    shape="round"
                  >
                    {" "}
                    <IonIcon icon={addOutline} />
                  </IonButton>
                </div>
              </IonCol>

              <IonCol size={6}>
                <h6>Family Pack</h6>
              </IonCol>
              <IonCol size={6}>
                <div style={{ float: "right" }}>
                  <IonButton
                    color="danger"
                    onClick={this.decrementFamilyQty.bind(this)}
                    shape="round"
                  >
                    {" "}
                    <IonIcon icon={removeOutline} />
                  </IonButton>
                  <span
                    style={{
                      padding: "7px",
                      fontSize: "18px",
                      fontWeight: "500",
                      position: "relative",
                      top: "8px",
                    }}
                  >
                    {this.state.familyQty}
                  </span>
                  <IonButton
                    color="primary"
                    onClick={this.incrementFamilyQty.bind(this)}
                    shape="round"
                  >
                    {" "}
                    <IonIcon icon={addOutline} />
                  </IonButton>
                </div>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size={12}>
                <h4
                  style={{
                    textAlign: "center",
                    backgroundColor: "grey",
                    padding: "10px",
                    margin: "0px",
                  }}
                >
                  Add extra choice
                </h4>
                <IonList>
                  <IonItem>
                    <IonLabel>Pepsi</IonLabel>
                    <IonSelect
                      value={pepsi}
                      placeholder="Select Unit"
                      onIonChange={(e) => this.setState({pepsi:e.detail.value})}
                    >
                      <IonSelectOption value="250ML">250ML</IonSelectOption>
                      <IonSelectOption value="400ML">400ML</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel>7 Up</IonLabel>
                    <IonSelect
                      value={sevenUP}
                      placeholder="Select Unit"
                      onIonChange={(e) => this.setState({sevenUP:e.detail.value})}
                    >
                      <IonSelectOption value="250ML">250ML</IonSelectOption>
                      <IonSelectOption value="400ML">400ML</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Water</IonLabel>
                    <IonSelect
                      value={water}
                      placeholder="Select Unit"
                      onIonChange={(e) => this.setState({water:e.detail.value})}
                    >
                      <IonSelectOption value="1L">1 L</IonSelectOption>
                      <IonSelectOption value="2L">2 L</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonList>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size={6}>
                <IonButton
                  color="success"
                  expand="block"
                  style={{ textAlign: "center" }}
                  onClick={() => this.props.history.push("/checkout")}
                >
                  {" "}
                  <IonIcon icon={cart} /> &nbsp; CHECKOUT
                </IonButton>
              </IonCol>
              <IonCol size={6}>
                <IonButton
                  color="success"
                  expand="block"
                  style={{ textAlign: "center" }}
                  onClick={() => {
                    this.props.history.push("/home");
                  }}
                >
                  {" "}
                  <IonIcon icon={cart} /> &nbsp; CONTINUE SHOPPING
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }
}

const mapStateToProps = ({ get_order }) => {
  let orderList = [];

  if (get_order.orderData) {
    orderList = get_order.orderData;
  }

  return { orderList };
};

export default connect(mapStateToProps)(withRouter(Home));
