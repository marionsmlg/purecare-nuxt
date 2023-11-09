export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("token");
  if (token.value) {
    refreshToken().then(async () => {
      const token = useCookie("token");
      const hasBeautyProfile = await fetchUserBeautyProfile(token.value);
      if (token.value && hasBeautyProfile) {
        return navigateTo("/mes-recettes");
      }
    });
  }
});
