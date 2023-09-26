import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {

  apiKey: "AIzaSyCi0Liam5gEbTK9yOLW8uTrhztIUgAWgz8",
  authDomain: "delivery-fe345.firebaseapp.com",
  projectId: "delivery-fe345",
  storageBucket: "delivery-fe345.appspot.com",
  messagingSenderId: "655625943404",
  appId: "1:655625943404:web:08f2b8ab69e7cc56a61b49"

};


// Initialize Firebase

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);