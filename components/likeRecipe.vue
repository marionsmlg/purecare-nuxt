<script setup>
import { HeartIcon as HeartIconFilled } from "@heroicons/vue/20/solid";
import { HeartIcon } from "@heroicons/vue/24/outline";
import { watchEffect } from "vue";

const props = defineProps({
  recipeId: String,
});
const liked = ref(false);
const token = useCookie("token");
const recipeId = ref(props.recipeId);

watchEffect(async () => {
  recipeId.value = props.recipeId;
  if (recipeId.value) {
    await isRecipeLikedByUser(recipeId.value);
  }
});

async function isRecipeLikedByUser(recipeId) {
  try {
    const queryString = `/api/v1/user/${recipeId}/like-status?user_token=${token.value}`;
    const url = apiUrl + queryString;
    const response = await fetch(url);
    const data = await response.json();
    liked.value = data;
  } catch (error) {
    console.error(error);
  }
}

const toggleLike = async () => {
  liked.value = !liked.value;

  try {
    if (liked.value) {
      await addFavoriteRecipe(`${apiUrl}/api/v1/user-favorite-recipe`, {
        recipe_id: props.recipeId,
      });
    } else {
      await deleteFavoriteRecipe(
        `${apiUrl}/api/v1/user-favorite-recipe`,
        props.recipeId
      );
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div>
    <button @click="toggleLike">
      <component
        :is="liked ? HeartIconFilled : HeartIcon"
        class="h-7 w-7 text-red-500"
      />
    </button>
  </div>
</template>
