import { fetchUserBeautyProfile } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("token");
  const hasBeautyProfile = await fetchUserBeautyProfile(token.value);
  if (!hasBeautyProfile) {
    return navigateTo("/profil-beaute");
  }
});
