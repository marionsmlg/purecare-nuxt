import { fetchUserBeautyProfile, refreshToken } from "@/utils.js";
import { onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const beautyProfile = useCookie("beautyProfile");
  const token = useCookie("token");

  if (!beautyProfile.value && !token.value) {
    return navigateTo("/profil-beaute");
  }
  if (token.value) {
    refreshToken().then(async () => {
      const userHasBeautyProfile = await fetchUserBeautyProfile(token.value);
      if (!token.value && !userHasBeautyProfile) {
        return navigateTo("/profil-beaute");
      }
    });
  }
});
