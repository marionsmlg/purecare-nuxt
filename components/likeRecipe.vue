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

async function toggleLike() {
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
}
</script>

<template>
  <div class="rounded-full overflow-hidden">
    <button
      aria-label="Ajouter aux favoris"
      @click="toggleLike"
      class="rounded-full bg-white p-1 bg-opacity-70"
    >
      <component
        :is="liked ? HeartIconFilled : HeartIcon"
        :class="[
          liked ? 'text-red-500' : 'text-gray-700',
          'md:h-6 md:w-6 h-7 w-7 pt-0.5',
        ]"
      />
    </button>
  </div>
</template>
