import { onAuthStateChanged } from "firebase/auth";
export async function fetchUserBeautyProfile(userToken) {
  try {
    if (userToken) {
      const queryString = `/api/v1/user-beauty-profile?user_token=${userToken}`;
      const url = apiUrl + queryString;
      const response = await fetch(url);
      const dataUser = await response.json();
      if (dataUser.physicalTrait.length === 0) {
        return false;
      } else {
        return dataUser;
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export async function refreshToken() {
  const { $auth } = useNuxtApp();
  onAuthStateChanged($auth, async (user) => {
    if (user) {
      const newToken = await user.getIdToken(true);
      const token = useCookie("token");
      token.value = newToken;
    }
  });
}
