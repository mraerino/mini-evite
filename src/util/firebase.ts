import firebaseConfig from "../../firebase.config.js";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";

const app = firebase.initializeApp(firebaseConfig);
export default app;

export { app as firebase, firebase as firebaseNS };
