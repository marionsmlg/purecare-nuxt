import { fetchUserBeautyProfile, checkUserAuthentication } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $auth } = useNuxtApp();

  const hasBeautyProfile = await fetchUserBeautyProfile(
    $auth?.currentUser?.uid
  );
  if (!hasBeautyProfile) {
    return navigateTo("/profil-beaute");
  }
});
