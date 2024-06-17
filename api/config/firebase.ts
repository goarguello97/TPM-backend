import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import admin, { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";

const env = process.env.NODE_ENV;

const serviceAccount: ServiceAccount =
  env === "test"
    ? require("../../serviceAccountKey.dev.json")
    : require("../../serviceAccountKey.prod.json");

if (env === "test") {
  dotenv.config({ path: ".env.development" });
} else {
  dotenv.config({ path: ".env" });
}

const {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
} = process.env;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

export const firestoreApp = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore(firestoreApp);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const auth = admin.auth();
export const firestoreAdmin = admin.firestore();
