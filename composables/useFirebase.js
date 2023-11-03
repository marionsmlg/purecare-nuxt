import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { fetchUserBeautyProfile } from "@/utils.js";

import { useFirebaseUser } from "./useStates";

export const initUser = async () => {
  const auth = getAuth();
  const firebaseUser = useFirebaseUser();
  firebaseUser.value = auth.currentUser;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      firebaseUser.value = user;
    } else {
      firebaseUser.value = null;
    }
  });
};

export async function loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup($auth, provider);
    const user = result.user;
    const token = useCookie("token");
    token.value = await user.getIdToken(true);
    const hasBeautyProfile = await fetchUserBeautyProfile(
      await user.getIdToken(true)
    );
    if (hasBeautyProfile) {
      router.push("/mes-recettes");
    } else {
      router.push("/profil-beaute");
    }
  } catch (error) {
    // Gérez les erreurs ici
  }
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup($auth, provider);
    const user = result.user;
    const token = useCookie("token");
    token.value = await user.getIdToken(true);
    const hasBeautyProfile = await fetchUserBeautyProfile(
      await user.getIdToken(true)
    );
    console.log({ hasBeautyProfile });
    if (hasBeautyProfile) {
      router.push("/mes-recettes");
    } else {
      router.push("/profil-beaute");
    }
  } catch (error) {
    // Gérez les erreurs ici
  }
}
