export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://purecare-api-production.up.railway.app"
    : "http://localhost:3000";

// export const apiUrl = 'http://localhost:3000'

export async function fetchRecipes(queryParams) {
  try {
    const queryString = `/api/v1/recipes?${queryParams}`;
    const url = apiUrl + queryString;
    const response = await fetch(url);
    const dataRecipes = await response.json();
    return dataRecipes;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchBeautyProfile(queryParams) {
  try {
    const queryString = `/api/v1/beauty-profile?${queryParams}`;
    const url = apiUrl + queryString;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
