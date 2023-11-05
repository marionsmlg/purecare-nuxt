import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { defineNuxtPlugin } from "nuxt/app";
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
    measurementId: config.public.measurementId,
  };

  const firebaseApp = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(firebaseApp);
  const auth = getAuth();

  initUser();

  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);
});
