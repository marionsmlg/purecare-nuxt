import { fetchUserBeautyProfile, refreshToken } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  await refreshToken();
  const token = useCookie("token");
  const hasBeautyProfile = await fetchUserBeautyProfile(token.value);
  if (!hasBeautyProfile && to?.name !== "mes-parametres") {
    return navigateTo("/profil-beaute");
  } else if (!hasBeautyProfile && to?.name === "mes-parametres") {
    return navigateTo("/");
  }
});
