import firebase from "firebase";

export async function loginUser(user, password) {
  const email = `${user}@zeeshan.com`;

  try {
    const res = await firebase.auth().signInWithEmailAndPassword(email, password);
    console.log(res);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
function setUpRecaptcha(id){
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      id,
      {
        size: "invisible",
        callback: function (response) {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          registerUser();
        },
      }
    );
  };

export async function registerUser(number,getRes) {
    setUpRecaptcha("recptcha-container");
    var phoneNumber = `+918887610245`;
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(getRes)
      .catch(function (error) {
        // Error; SMS not sent
        // ...
      });
}
