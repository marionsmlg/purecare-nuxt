import { fetchUserBeautyProfile, checkUserAuthentication } from "@/utils.js";

const user = await checkUserAuthentication();
const hasBeautyProfile = await fetchUserBeautyProfile(user);

export default defineNuxtRouteMiddleware((to, from) => {
  if (!hasBeautyProfile) {
    return navigateTo("/profil-beaute");
  }
});
