export default defineNuxtRouteMiddleware((to, from) => {
  const { $auth } = useNuxtApp();

  if (!$auth.currentUser?.uid) {
    return navigateTo("/login");
  }
});
