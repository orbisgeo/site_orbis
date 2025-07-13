const firebaseConfig = {
  apiKey: "AIzaSyCTlpyWixrespwJRK61G4iuxMqE2Ds-Qsg",
  authDomain: "ruas-gurinhem.firebaseapp.com",
  databaseURL: "https://ruas-gurinhem-default-rtdb.firebaseio.com",
  projectId: "ruas-gurinhem",
  storageBucket: "ruas-gurinhem.firebasestorage.app",
  messagingSenderId: "141299087958",
  appId: "1:141299087958:web:77a466634da1ecd00fd9f7",
  measurementId: "G-Q8ZYR49E8E"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();