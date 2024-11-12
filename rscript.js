const apiKey = "0f0d784f91ac4da7b92b168405520d11";
const recipeGrid = document.getElementById("recipe-grid");
const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("keyup", async (event) => {
  const query = event.target.value;

  if (query.length > 2) {
    const recipes = await fetchRecipes(query);
    displayRecipes(recipes);
  }
});

async function fetchRecipes(query) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}

function displayRecipes(recipes) {
  recipeGrid.innerHTML = "";

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <div class="recipe-info">
        <h3>${recipe.title}</h3>
        <p>Preparation time: ${recipe.readyInMinutes || "undefined"} mins</p>
        <button onclick="saveToFavorites('${recipe.id}', '${recipe.title}', '${recipe.image}')">Add to Favorites</button>
      </div>
    `;

    recipeGrid.appendChild(recipeCard);
  });
}

function saveToFavorites(id, title, image) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push({ id, title, image });
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Added to Favorites");
}