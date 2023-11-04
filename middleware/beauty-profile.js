import { fetchUserBeautyProfile } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const beautyProfile = useCookie("beautyProfile");
  const token = useCookie("token");
  const userHasBeautyProfile = await fetchUserBeautyProfile(token.value);
  if (!beautyProfile.value && !token.value && !userHasBeautyProfile) {
    return navigateTo("/profil-beaute");
  }
});
