const API_KEY = '949258ff4ff329d48e662c7badcd4ac9';
const BASE_URL = 'https://api.themoviedb.org/3';

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const moviesContainer = document.getElementById('movies');

// Fetch trending movies by default
async function fetchTrendingMovies() {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        moviesContainer.innerHTML = "<p>Failed to load movies. Try again later.</p>";
    }
}

// Fetch trailer for a movie
async function fetchTrailer(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
        const data = await response.json();
        return data.results.find(video => video.type === 'Trailer');
    } catch (error) {
        console.error(`Error fetching trailer for movie ${movieId}:`, error);
        return null;
    }
}

// Display movies in a grid
function displayMovies(movies) {
    moviesContainer.innerHTML = '';

    if (!movies.length) {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const posterPath = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';

        movieElement.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average}</p>
            <button class="watch-button" onclick="toggleTrailer(${movie.id})">Watch Me</button>
            <div class="trailer" id="trailer-${movie.id}" style="display:none;"></div>
        `;

        moviesContainer.appendChild(movieElement);
    });
}

// Fetch and display all search results
async function fetchMovie(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();

        if (data.results.length > 0) {
            displayMovies(data.results); // Display all results
        } else {
            moviesContainer.innerHTML = '<p>No movies found.</p>';
        }
    } catch (error) {
        console.error("Error fetching searched movies:", error);
        moviesContainer.innerHTML = "<p>Search failed. Please try again.</p>";
    }
}

// Show/hide trailer when clicking "Watch Me"
async function toggleTrailer(movieId) {
    const trailerDiv = document.getElementById(`trailer-${movieId}`);

    if (trailerDiv.innerHTML === '') {
        const trailer = await fetchTrailer(movieId);
        if (trailer) {
            trailerDiv.innerHTML = `<iframe width="100%" height="300" src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>`;
        } else {
            trailerDiv.innerHTML = "<p>No trailer available.</p>";
        }
    }

    trailerDiv.style.display = trailerDiv.style.display === "none" ? "block" : "none";
}

// Trigger search on Enter key press
searchInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

// Trigger search when clicking search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovie(query);
    }
});

// Fetch trending movies on page load
fetchTrendingMovies();
