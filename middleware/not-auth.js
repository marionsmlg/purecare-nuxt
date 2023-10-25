export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $auth } = useNuxtApp();

  if ($auth?.currentUser?.uid) {
    return navigateTo("/mes-recettes");
  }
});
