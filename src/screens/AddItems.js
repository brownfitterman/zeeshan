import React, { useState,useEffect } from "react";
import {
  IonButton,
} from "@ionic/react";
import { withRouter } from "react-router-dom";

const News = ({ history,additems,reset }) => {

  const [qty, setQty] = useState(0);
  const [load,setLoad]=useState(false);
  const incrementQty=()=> {
    if (qty < 10) {
      setQty(qty+1);
    }
    // additems(qty+1);
  }
  const decrementQty=()=> {
    if (qty < 1) {
      setQty(0)
   
    } else {
      setQty(qty-1);

    }
    // additems(qty-1);
  }
  useEffect(() => {
    if(load){
      additems(qty);
    }
      setLoad(true)
  
   
}, [qty]);
 
  return (
    <>
      {qty != 0 ? (
        <div class="quantity">
          <span class="quantity__minus" onClick={decrementQty}>-</span>
          <input
            name="quantity"
            type="text"
            class="quantity__input"
            value={qty}
          />
          <span class="quantity__plus" onClick={incrementQty}>+</span>
        </div>
      ) : (
        <IonButton
          color="primary"
          size="small"
          style={{fontSize:'10px',position:' absolute',right: '5px' }}
          onClick={()=>setQty(1)}
        >
          add
        </IonButton>
      )}
    </>
  );
};

export default withRouter(News);
