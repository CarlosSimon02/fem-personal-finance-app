import { firebaseAdminParams } from "@/config/firebase";
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

export const adminFirestore = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export const adminStorageBucket = getStorage(adminApp).bucket(
  `gs://${adminApp.options.storageBucket}.appspot.com`
);
