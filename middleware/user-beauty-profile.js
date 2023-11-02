import { fetchUserBeautyProfile } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("token");
  const hasBeautyProfile = await fetchUserBeautyProfile(token.value);
  console.log(to?.name);
  if (!hasBeautyProfile && to?.name !== "mes-parametres") {
    return navigateTo("/profil-beaute");
  } else if (!hasBeautyProfile && to?.name === "mes-parametres") {
    return navigateTo("/");
  }
});
