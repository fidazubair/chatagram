import firebase from 'firebase'
import 'firebase/firestore'
const config = {
  apiKey: "AIzaSyC89ztu81CI9a8C55mVuwF2-DT-QXAAUqs",
  authDomain: "inspired-rhythm-221812.firebaseapp.com",
  databaseURL: "https://inspired-rhythm-221812.firebaseio.com",
  projectId: "inspired-rhythm-221812",
  storageBucket: "inspired-rhythm-221812.appspot.com",
  messagingSenderId: "334584220850"
};
// const config = {
//   apiKey: "AIzaSyC7kIJ7T1sLRWYT8yhirrLOuEw-5MSEVg4",
//   authDomain: "cp3700-f5264.firebaseapp.com",
//   databaseURL: "https://cp3700-f5264.firebaseio.com",
//   projectId: "cp3700-f5264",
//   storageBucket: "cp3700-f5264.appspot.com",
//   messagingSenderId: "143283342395"
//   };
firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
export default db;