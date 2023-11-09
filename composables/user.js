import { onAuthStateChanged } from "firebase/auth";

export async function postData(url, data) {
  const { $auth } = useNuxtApp();
  console.log(data);
  try {
    const user = $auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    } else {
      console.error("L'utilisateur n'est pas connecté.");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateData(url, data) {
  const { $auth } = useNuxtApp();
  try {
    const user = $auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    } else {
      console.error("L'utilisateur n'est pas connecté.");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteData(url) {
  const { $auth } = useNuxtApp();
  const user = $auth.currentUser;
  try {
    if (user) {
      const token = await user.getIdToken(true);
      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.error("L'utilisateur n'est pas connecté.");
    }
  } catch (error) {
    console.error(error);
  }
}

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
