
import { initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsQeGltjrr9iVLBTsIAOK4m-AAs8LCJiY",
  authDomain: "clothing-brand-clothura.firebaseapp.com",
  projectId: "clothing-brand-clothura",
  storageBucket: "clothing-brand-clothura.firebasestorage.app",
  messagingSenderId: "203793046142",
  appId: "1:203793046142:web:a4d92a2c0ad5228d87562f",
  measurementId: "G-Y4LG10QZFJ"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 