export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("token");
  if (to?.path === "/logout") {
    return new Promise((resolve) => {
      token.value = null;
      // Attendre que la valeur du cookie soit mise à jour (vérification toutes les 100 ms)
      const interval = setInterval(() => {
        if (!token.value) {
          clearInterval(interval); // Arrêtez de vérifier lorsque le cookie est nul
          resolve();
        }
      }, 100);
    }).then(() => {
      return navigateTo("/");
    });
  }
});
