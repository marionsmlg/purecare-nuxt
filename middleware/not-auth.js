import { checkUserAuthentication } from "@/utils.js";
import { auth } from "@/firebaseconfig.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = auth.currentUser;

  if (user) {
    return navigateTo("/mes-recettes");
  }
});
