const apiKey = '9f56ecac0ed1625c5d805ac3e9142687';

const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const movieGrid = document.getElementById("movieGrid");
const movieDetailsContainer = document.getElementById("movieDetails");
const watchlistContainer = document.getElementById("watchlist");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (query.length > 2) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    const data = await response.json();
    displayAutoSuggest(data.results);
  }
});

function displayAutoSuggest(movies) {
  resultsContainer.innerHTML = "";
  movies.slice(0, 5).forEach(movie => {
    const item = document.createElement("div");
    item.textContent = movie.title;
    item.onclick = () => fetchMovieDetails(movie.id);
    resultsContainer.appendChild(item);
  });
}

async function fetchMovies(sortBy = "popularity.desc") {
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${sortBy}`);
  const data = await response.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  movieGrid.innerHTML = "";
  movies.forEach(movie => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-card");
    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>Release Date: ${movie.release_date}</p>
      <button onclick="fetchMovieDetails(${movie.id})">More Details</button>
      <button onclick="addToWatchlist(${movie.id}, '${movie.title}')">Add to Watchlist</button>
    `;
    movieGrid.appendChild(movieElement);
  });
}

async function fetchMovieDetails(movieId) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`);
  const movie = await response.json();
  showMovieDetails(movie);
}

function showMovieDetails(movie) {
  movieDetailsContainer.innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.overview}</p>
    <p>Rating: ${movie.vote_average}</p>
    <p>Runtime: ${movie.runtime} mins</p>
    <h3>Cast:</h3>
    <ul>
      ${movie.credits.cast.slice(0, 5).map(actor => `<li>${actor.name}</li>`).join('')}
    </ul>
    <button onclick="closeDetails()">Close</button>
  `;
  movieDetailsContainer.style.display = 'block';
}

function closeDetails() {
  movieDetailsContainer.style.display = 'none';
}

function addToWatchlist(movieId, movieTitle) {
  if (!watchlist.some(movie => movie.id === movieId)) {
    watchlist.push({ id: movieId, title: movieTitle });
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    displayWatchlist();
  }
}

function displayWatchlist() {
  watchlistContainer.innerHTML = "";
  watchlist.forEach(movie => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("watchlist-item");
    movieElement.innerHTML = `
      <h3>${movie.title}</h3>
      <button onclick="removeFromWatchlist(${movie.id})">Remove</button>
    `;
    watchlistContainer.appendChild(movieElement);
  });
}

function removeFromWatchlist(movieId) {
  watchlist = watchlist.filter(movie => movie.id !== movieId);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  displayWatchlist();
}

fetchMovies();
displayWatchlist();