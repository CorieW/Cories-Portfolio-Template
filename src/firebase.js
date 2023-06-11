import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBXV4gJnhQlD8OPgxzl1jPl62Y6elNB8Do",
  authDomain: "portfolio-9202d.firebaseapp.com",
  projectId: "portfolio-9202d",
  storageBucket: "portfolio-9202d.appspot.com",
  messagingSenderId: "611495462303",
  appId: "1:611495462303:web:9665b9081e207bede169aa"
};

firebase.initializeApp(firebaseConfig);

export default firebase;