const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// API Key & Base URL
const API_KEY = "fc1fef96"; // Use your own API key
const BASE_URL = "https://www.omdbapi.com/";

// Load movies from API
async function loadMovies(searchTerm) {
    const URL = `${BASE_URL}?s=${searchTerm}&page=1&apikey=${API_KEY}`;

    try {
        const res = await fetch(URL);
        const data = await res.json();

        if (data.Response === "True") {
            displayMovieList(data.Search);
        } else {
            searchList.innerHTML = "<p class='no-results'>No results found.</p>";
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
    }
}

function findMovies() {
    let searchTerm = movieSearchBox.value.trim();

    if (searchTerm.length > 0) {
        searchList.classList.remove("hide-search-list");
        loadMovies(searchTerm);
    } else {
        searchList.classList.add("hide-search-list");
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";

    movies.forEach(movie => {
        let movieListItem = document.createElement("div");
        movieListItem.dataset.id = movie.imdbID;
        movieListItem.classList.add("search-list-item");

        let moviePoster = (movie.Poster !== "N/A") ? movie.Poster : "image_not_found.png";

        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}" alt="Movie Poster">
            </div>
            <div class="search-item-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;

        searchList.appendChild(movieListItem);
    });

    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll(".search-list-item");

    searchListMovies.forEach(movie => {
        movie.addEventListener("click", async () => {
            searchList.classList.add("hide-search-list");
            movieSearchBox.value = "";

            const URL = `${BASE_URL}?i=${movie.dataset.id}&apikey=${API_KEY}`;

            try {
                const res = await fetch(URL);
                const movieDetails = await res.json();

                displayMovieDetails(movieDetails);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster !== "N/A") ? details.Poster : "image_not_found.png"}" alt="Movie Poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
}

// Hide search list when clicking outside the search box
window.addEventListener("click", (event) => {
    if (!event.target.closest(".form-control")) {
        searchList.classList.add("hide-search-list");
    }
});
