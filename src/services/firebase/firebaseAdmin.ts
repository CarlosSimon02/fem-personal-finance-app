import { env } from "@/config/env";
import { debugLog } from "@/utils/debugLog";
import { normalizeNewLines } from "@/utils/normalizeNewLines";
import admin, { credential, ServiceAccount } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

type FirebaseAdminParams = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  storageBucket?: string;
};

const firebaseAdminParams = {
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: env.FIREBASE_CLIENT_EMAIL,
  privateKey: env.FIREBASE_PRIVATE_KEY,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export function initializeFirebaseAdmin(params: FirebaseAdminParams) {
  if (admin.apps.length > 0) {
    debugLog("Firebase Admin", "using cached admin instance");
    return admin.app();
  }

  const serviceAccount: ServiceAccount = {
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey: normalizeNewLines(params.privateKey),
  };

  debugLog("Firebase Admin", "initializing new admin instance");

  return admin.initializeApp({
    projectId: params.projectId,
    credential: credential.cert(serviceAccount),
    storageBucket: params.storageBucket,
  });
}

const adminApp = initializeFirebaseAdmin(firebaseAdminParams);

const IS_USING_EMULATORS = env.NEXT_PUBLIC_IS_USING_EMULATORS === true;
if (IS_USING_EMULATORS && env.NODE_ENV !== "production") {
  process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
  process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
  process.env["FIREBASE_STORAGE_EMULATOR_HOST"] = "localhost:9199";
}

export const adminFirestore = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export const adminStorageBucket = getStorage(adminApp).bucket(
  `gs://${adminApp.options.storageBucket}.appspot.com`
);
