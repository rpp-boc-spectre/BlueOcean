// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI0mdrIth2SVnAqSF8zBcJNeiRMR5c3pM",
  authDomain: "beepbop-9cf11.firebaseapp.com",
  projectId: "beepbop-9cf11",
  storageBucket: "beepbop-9cf11.appspot.com",
  messagingSenderId: "1027187904375",
  appId: "1:1027187904375:web:8363ea1fdf933402961b72",
  measurementId: "G-1WWZ4MNWX8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
module.exports.app = app
module.exports.storage = getStorage(app);