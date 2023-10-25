import { fetchUserBeautyProfile, checkUserAuthentication } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await checkUserAuthentication();
  const hasBeautyProfile = await fetchUserBeautyProfile(user);
  if (!hasBeautyProfile) {
    return navigateTo("/profil-beaute");
  }
});
