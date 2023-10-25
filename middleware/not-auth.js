import { checkUserAuthentication } from "@/utils.js";
import { auth } from "@/firebaseconfig.js";

export default defineNuxtRouteMiddleware((to, from) => {
  const user = auth.currentUser;
  console.log(user);

  if (user) {
    return navigateTo("/mes-recettes");
  }
});
