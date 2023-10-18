import React from 'react';

import {
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
}
  from "@ionic/react"

const ReduxTextField = ({
  input,
  label,
  ...custom
}) => (
    <>
      <IonLabel position="floating">{label}</IonLabel>
      <IonInput
        {...input}
        {...custom}
      />

    </>
  );

const ReduxSelectField = ({
  label,
  ...custom
}) => (
    <>
      <IonLabel>{label}</IonLabel>
      <IonSelect
        {...custom}
      />
        

    </>
  );

  const ReduxDateField = ({
    label,
    value,
    ...custom
  }) => (
      <>
        <IonLabel>{label}</IonLabel>
        <IonDatetime
        value={value}
          {...custom}
        />
  
      </>
    );


export { ReduxTextField, ReduxSelectField ,ReduxDateField};
