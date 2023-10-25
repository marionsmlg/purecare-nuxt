import { fetchUserBeautyProfile, checkUserAuthentication } from "@/utils.js";
import { auth } from "@/firebaseconfig.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = auth.currentUser;
  const hasBeautyProfile = await fetchUserBeautyProfile(user);
  if (!hasBeautyProfile) {
    return navigateTo("/profil-beaute");
  }
});
