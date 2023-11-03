import { fetchUserBeautyProfile, refreshToken } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  await refreshToken();
  const beautyProfile = useCookie("beautyProfile");
  const token = useCookie("token");
  const userHasBeautyProfile = await fetchUserBeautyProfile(token.value);
  if (!beautyProfile.value && !token.value && !userHasBeautyProfile) {
    return navigateTo("/profil-beaute");
  }
});
