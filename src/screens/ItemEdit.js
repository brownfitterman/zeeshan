import React, { Component, useState } from "react";
import {
  IonSelect,
  IonSelectOption,
  IonItemDivider,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonList,
  IonLabel,
  IonInput,
  IonItem,
  IonButton,
  IonDatetime,
  IonImg,
} from "@ionic/react";
import { connect } from "react-redux";
import firebase from "firebase";
import { Field, reduxForm } from "redux-form";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  ReduxTextField,
  ReduxSelectField,
  ReduxDateField,
} from "../customComponents";
const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

const TodoForm = ({ handleSubmit, close,id }) => {
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [inputList, setInputList] = useState([{ name: "", price: "" }]);
  var docRef = firebase
  .firestore()
  .collection("Menu").doc(id);

  docRef.get().then(function(doc) {
      if (doc.exists && !flag) {
          setData(doc.data());
          setInputList(doc.data().size)
          setFlag(true)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });


  

  const onSubmit = (finalData) => {
    finalData = { ...finalData, ...data,size:inputList };
    let sfRef = firebase.firestore().collection("Menu").doc(id);
    sfRef.set(
      finalData
    ,
      { merge: true }
    );
    close();
  };
  const onChange = (e) => {
    let key = e.target.name;
    let val = e.target.value;

    // console.log(`${time[0]}:${time[1]}`);

    setData({
      ...data,
      [key]: val,
    });
  };
  const handleChange = (event) => {
    // this.setState({
    //   data: {
    //     ...this.state.data,
    //     img: URL.createObjectURL(event.target.files[0]),
    //   },
    // });

    if (!event.target.files[0]) {
      return;
    }

    fileToDataUri(event.target.files[0]).then((dataUri) => {
      setData({
        ...data,
        img: dataUri,
      });
    });
  };
 
  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { name: "", price: "" }]);
  };

  return (
    <>
      <IonContent>
        <form onSubmit={handleSubmit(onSubmit)}>

            <IonGrid>
              {/* {value && value.docs.map((data1)=>{
                console.log(data1.data())
                return<IonRow><IonCol>
                  <h3>welcome</h3>
                  </IonCol></IonRow> 
              })} */}
            <IonRow>
              <IonCol size="12">
                <h2>Edit Menu Items</h2>
                <IonItemDivider style={{ marginTop: "-10px" }} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size={12}>
                <img src={data.img} height="175" width="100%" />
              </IonCol>
            </IonRow>
            <IonItem>
              {/* <IonLabel position="floating">Title</IonLabel> */}
              <input onChange={handleChange} name="img" type="file" />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Title</IonLabel>
              <IonInput
                value={data.title}
                onIonChange={onChange}
                name="title"
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Description</IonLabel>
              <IonInput
                value={data.description}
                onIonChange={onChange}
                name="description"
              ></IonInput>
            </IonItem>
            <hr style={{ width: "100%" }} />
            <IonRow>
              <IonCol size={4}>Size</IonCol>

              <IonCol size={4}>
                <span>Price</span>
              </IonCol>
              <IonCol size={4}>
               
              </IonCol>
            </IonRow>
            {inputList.map((x, i) => {
              return (
                <>
                  <IonRow>
                    <IonCol size={4}>
                      <IonItem lines="none">
                        <IonInput
                          name="name"
                          value={x.name}
                          onIonChange={(e) => handleInputChange(e, i)}
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                    <IonCol size={4}>
                      <IonItem lines="none">
                        <IonInput
                          name="price"
                          value={x.price}
                          onIonChange={(e) => handleInputChange(e, i)}
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                    <IonCol size={4}>
                      {inputList.length !== 1 && (
                        <IonButton
                        size="small"
                        color='danger'
                          style={{ float: "right", color: "red" ,fontSize:'7px'}}
                          onClick={() => handleRemoveClick(i)}
                        >
                          delete
                        </IonButton>
                      )}

                      {inputList.length - 1 === i && (
                        <IonButton
                        size="small"
                        color='success'
                          style={{ float: "left", color: "blue",fontSize:'7px' }}
                          onClick={handleAddClick}
                        >
                          add
                        </IonButton>
                      )}

                  
                    </IonCol>
                  </IonRow>
                </>
              );
            })}
            <IonRow>
              <hr style={{ width: "100%" }} />
              <IonCol size="12" style={{ textAlign: "center" }}>
                <IonButton color="danger" onClick={close}>
                  Cancel
                </IonButton>
                <IonButton
                  type="submit"
                  color="primary"
                  style={{ marginLeft: "20px" }}
                >
                  Submit
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          </form>
       
      

       
      </IonContent>
    </>
  );
};

const EditForm = reduxForm({
  form: "editForm",
  enableReinitialize: true,
})(TodoForm);
export default connect((state) => ({
  initialValues: {
    title: "talwa beef ghost",
  },
}))(EditForm);
