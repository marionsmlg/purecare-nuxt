import { fetchUserBeautyProfile, refreshToken } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  await refreshToken();
  const token = useCookie("token");
  const hasBeautyProfile = await fetchUserBeautyProfile(token.value);
  if (token.value && hasBeautyProfile) {
    return navigateTo("/mes-recettes");
  }
});
