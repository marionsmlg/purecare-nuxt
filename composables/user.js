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
