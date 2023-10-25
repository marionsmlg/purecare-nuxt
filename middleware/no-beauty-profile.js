import { fetchUserBeautyProfile, checkUserAuthentication } from "@/utils.js";
import { auth } from "@/firebaseconfig.js";

function isbeautyProfileCompleted(user, hasBeautyProfile) {
  if (process.client) {
    const strOfHairProblemId = localStorage.getItem("hairProblem");
    const strOfSkinProblemId = localStorage.getItem("skinProblem");
    const skinTypeId = localStorage.getItem("skinType");
    const hairTypeId = localStorage.getItem("hairType");
    const quizCompleted =
      strOfHairProblemId && strOfSkinProblemId && skinTypeId && hairTypeId;
    return quizCompleted || (user && hasBeautyProfile);
  }
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = auth.currentUser;
  const hasBeautyProfile = await fetchUserBeautyProfile(user);
  if (isbeautyProfileCompleted(user, hasBeautyProfile)) {
    return navigateTo("/");
  }
});
