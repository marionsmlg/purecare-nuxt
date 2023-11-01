import IconOilySkin from "@/components/icons/SkinTypes/IconOilySkin.vue";
import IconDrySkin from "@/components/icons/SkinTypes/IconDrySkin.vue";
import IconNormalSkin from "@/components/icons/SkinTypes/IconNormalSkin.vue";
import IconMixedSkin from "@/components/icons/SkinTypes/IconMixedSkin.vue";
import IconSmoothHair from "@/components/icons/HairTypes/IconSmoothHair.vue";
import IconFrizzyHair from "@/components/icons/HairTypes/IconFrizzyHair.vue";
import IconWavyHair from "@/components/icons/HairTypes/IconWavyHair.vue";
import IconCurlyHair from "@/components/icons/HairTypes/IconCurlyHair.vue";
import { markRaw } from "vue";
import { z } from "zod";

export function addIcon(objectWithoutIcon) {
  const arrOfIcons = [
    {
      name: "Sèche",
      icon: markRaw(IconDrySkin),
    },
    {
      name: "Grasse",
      icon: markRaw(IconOilySkin),
    },
    {
      name: "Mixte",
      icon: markRaw(IconMixedSkin),
    },
    {
      name: "Normale",
      icon: markRaw(IconNormalSkin),
    },
    { name: "Lisses", icon: markRaw(IconSmoothHair) },
    { name: "Ondulés", icon: markRaw(IconWavyHair) },
    { name: "Bouclés", icon: markRaw(IconCurlyHair) },
    { name: "Frisées / Crépus", icon: markRaw(IconFrizzyHair) },
  ];

  if (Array.isArray(objectWithoutIcon)) {
    for (const objet of objectWithoutIcon) {
      const correspondingIcon = arrOfIcons.find(
        (icon) => icon.name === objet.name
      );

      if (correspondingIcon) {
        objet.icon = correspondingIcon.icon;
      }
    }
  } else {
    const correspondingIcon = arrOfIcons.find(
      (icon) => icon.name === objectWithoutIcon.name
    );
    if (correspondingIcon) {
      objectWithoutIcon.icon = correspondingIcon.icon;
    }
  }
}

export function capitalizeFirstLetter(str) {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://purecare-api-production.up.railway.app"
    : "http://localhost:3000";

// export const apiUrl = 'http://localhost:3000'

export function pushObjectValueInNewArr(arrOfobject) {
  const newArr = [];
  for (const object of arrOfobject) {
    const arrOfkey = Object.keys(object);
    const key = arrOfkey[0];
    newArr.push(object[key]);
  }
  return newArr;
}

export function uuidIsValid(uuid) {
  const uuidSchema = z.string().uuid({ message: "Invalid UUID" });
  return uuidSchema.safeParse(uuid).success;
}

export function uidFirebaseValid(uidFirebase) {
  const uidSchema = z
    .string()
    .refine((value) => /^[a-zA-Z0-9]{28}$/.test(value), {
      message: "L'UID Firebase n'est pas valide.",
    });
  const result = uidSchema.safeParse(uidFirebase);
  if (result.success) {
    return result.data;
  } else {
    return null;
  }
}

export async function postData(url, data) {
  const { $auth } = useNuxtApp();
  try {
    const user = $auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
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
      const token = await user.getIdToken();
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
      const token = await user.getIdToken();
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

export async function fetchRecipes(queryParams) {
  try {
    const queryString = `/api/v1/recipes?${queryParams}`;
    const url = apiUrl + queryString;
    const response = await fetch(url);
    const dataRecipes = await response.json();
    return dataRecipes;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchBeautyProfile(queryParams) {
  try {
    const queryString = `/api/v1/beauty-profile?${queryParams}`;
    const url = apiUrl + queryString;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function checkUserAuthentication() {
  return new Promise((resolve, reject) => {
    const unsubscribe = $auth.onAuthStateChanged((user) => {
      unsubscribe(); // Arrête d'écouter après la première notification
      if (user) {
        resolve(user.uid);
      } else {
        resolve(null);
      }
    });
  });
}

export async function checkUserAuth() {
  const { $auth } = useNuxtApp();
  const user = $auth.currentUser;
  try {
    if (user) {
      const token = await user.getIdToken();
      console.log(token);
      const queryString = `/api/v1/user-logged-in?user_token=${token}`;
      const url = apiUrl + queryString;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } else {
      console.error("L'utilisateur n'est pas connecté.");
    }
  } catch (error) {
    return false;
  }
}
