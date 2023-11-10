import { fetchUserBeautyProfile, refreshToken } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("token");
  if (token.value) {
    refreshToken().then(async () => {
      const hasBeautyProfile = await fetchUserBeautyProfile(token.value);
      if (token.value && hasBeautyProfile) {
        return navigateTo("/mes-recettes");
      }
    });
  }
});
