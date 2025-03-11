import { env } from "@/config/env";
import { firebaseConfig } from "@/config/firebase";
import { debugLog } from "@/utils/debugLog";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);

export const clientAuth = getAuth(app);
export const clientFirestore = getFirestore(app);
export const clientStorage = getStorage(app);
export const clientFunctions = getFunctions(app);

const isUsingEmulators = env.NEXT_PUBLIC_IS_USING_EMULATORS === true;
if (isUsingEmulators && env.NODE_ENV !== "production") {
  debugLog("Firebase Client", "connecting to emulators");
  connectFirestoreEmulator(
    clientFirestore,
    env.NEXT_PUBLIC_EMULATOR_HOST,
    env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT
  );
  connectAuthEmulator(clientAuth, env.NEXT_PUBLIC_AUTH_EMULATOR_HOST);
  connectStorageEmulator(
    clientStorage,
    env.NEXT_PUBLIC_EMULATOR_HOST,
    env.NEXT_PUBLIC_STORAGE_EMULATOR_PORT
  );
  connectFunctionsEmulator(
    clientFunctions,
    env.NEXT_PUBLIC_EMULATOR_HOST,
    env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT
  );
}
