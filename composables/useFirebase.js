import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useFirebaseUser } from "./useStates";

export const initUser = async () => {
  const auth = getAuth();
  const firebaseUser = useFirebaseUser();
  firebaseUser.value = auth.currentUser;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      firebaseUser.value = user;
    }
  });
};
