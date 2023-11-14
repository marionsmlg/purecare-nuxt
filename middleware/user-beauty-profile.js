export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("token");
  if (!token.value) {
    return navigateTo("/profil-beaute");
  } else {
    refreshToken().then(async () => {
      const hasBeautyProfile = await fetchUserBeautyProfile(token.value);
      if (!hasBeautyProfile && to?.name !== "mes-parametres") {
        return navigateTo("/profil-beaute");
      } else if (!hasBeautyProfile && to?.name === "mes-parametres") {
        return navigateTo("/");
      }
    });
  }
});
