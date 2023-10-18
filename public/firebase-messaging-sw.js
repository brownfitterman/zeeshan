importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');


firebase.initializeApp({
  messagingSenderId: "905870652158",
  })

const initMessaging = firebase.messaging()
firebase.messaging().getToken().then(token=>{
  console.log('Token : ',token)
}).catch(()=>{
 console.log('got some erreor')
})