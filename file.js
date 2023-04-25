const apikey = "c1c2fd4aafeee0d22107ba8a94584a86";
const apiEndPoint = "https://api.themoviedb.org/3/";
const imgPath = "https://image.tmdb.org/t/p/original";
const moviesContainer = document.querySelector(".movie-container");
const nav = document.querySelector(".header");
const banner = document.querySelector(".banner-section");

const apiPath = {
  fetchTrending: `${apiEndPoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  fetchAllCategories: `${apiEndPoint}genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) =>
    `${apiEndPoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  searchYoutube: (query)=>`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}}&key=AIzaSyDDmXO_7K7E-qCeWuu1ggGv-ARGVBCZc2s`,
};
// 2;
function init() {
  fetchTrendingMovies();
  // buildBannerSection();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndBuildMovieSection(apiPath.fetchTrending, "Trending Now")
    .then((list) => {
      const random = parseInt(Math.random() * list.length);
      console.log(random);
      buildBannerSection(list[random]);
    })
    .catch((err) => {
      console.error(err);
    });
}
function buildBannerSection(movie) {
  console.log(movie);
  banner.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;
  const div = document.createElement("div");
  div.innerHTML = `
    <h2 class="banner-title">${movie.title}</h2>
        <p class="banner-info">Trending in movies | Releaser ${movie.release_date}</p>
        <p class="banner-overview">
        ${movie.overview}
        </p>
        <div class="button-container">
          <button class="button">Play</button>
          <button class="button">More Info</button>
        </div>
      </div>
`;
  div.className = "banner-content container";
  banner.append(div);
  console.log(banner);
}

function fetchAndBuildAllSections() {
  fetch(apiPath.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndBuildMovieSection(
            apiPath.fetchMoviesList(category.id),
            category.name
          );
        });
      }
    })
    .catch((err) => console.error(err));
}

function fetchAndBuildMovieSection(fetchUrl, categoryName) {
  //   console.log(fetchUrl, category);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      // console.log(res)
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMovieSection(movies, categoryName);
      }
      return movies;
    })
    .catch((err) => console.error(err));
}

function buildMovieSection(list, categoryName) {
  //   console.log(list, categoryName)

  const movieInnerHtml = list
    .map((item) => {
      //   console.log(item);
      return `<img class = "movie-item" src="${imgPath}/${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer('${item.title}')">` ;
    })
    .join("");

  const movieSectionHtml = `
        <h2 class="movie-sec-heading">${categoryName}<span class="explore">Explore All</span></h2>
        <div class="movie-row">
        ${movieInnerHtml}
        </div>  

    `;

  const div = document.createElement("div");
  div.className = "movie-section";
  div.innerHTML = movieSectionHtml;

  moviesContainer.append(div);
}

function searchMovieTrailer(movieName) {
  if (!movieName) return;
  fetch(apiPath.searchYoutube(movieName))
  .then(res=> res.json())
  .then(res =>{
    const bestResult = res.items[0]
    const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`
    console.log(youtubeUrl)
  })
  .catch(err=> console.error(err))
}

window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    if (window.scrollY > 5) nav.classList.add("bg");
    else nav.classList.remove("bg");
  });
});
