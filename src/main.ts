import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/styles.css';
import { Page } from './app/models/Page';
import { Movie } from './app/models/Movie';
import { MovieDTO } from './app/models/MovieDTO';
import { MovieService } from './app/services/MovieService';
import { Mapper } from './app/helpers/Mapper';
import { Helper } from './app/helpers/Helper';

/* eslint-disable */

const inputSubmitButton = document.getElementById('submit');
inputSubmitButton?.addEventListener('click', loadInfoAboutSearch);

const loadMoreButton = document.getElementById('load-more');
loadMoreButton?.addEventListener('click', loadMoreMovies);

document.addEventListener('DOMContentLoaded', async () => {
    const radioButtons = document.querySelectorAll('.btn-check');

    let selectedId = defineActiveButton();
    if (selectedId) {
        removingAllElementsInContainer();
        await loadingTheSelectedCategory(selectedId, 1);
    }

    radioButtons.forEach((radioButton) => {
        radioButton.addEventListener('click', async () => {
            const selectedId = radioButton.id;
            removingAllElementsInContainer();
            await loadingTheSelectedCategory(selectedId);
        });
    });

    subscribeToTheClickEventOnHeart();
    removeAllElements('favorite-movies');
    await addElementsToFavorite();
});

async function loadMoreMovies() {
    let result = defineActiveButton();
    let page = countTheNumberPage();

    if (result) {
        await loadingTheSelectedCategory(result, page);
    }
}

async function loadInfoAboutSearch() {
    const input4 = document.getElementById('search') as HTMLInputElement;
    const searchTerm: string = input4.value.trim();
    let numberPage = countTheNumberPage();
    let childClassName = 'col-lg-3 col-md-4 col-12 p-2';
    let parentClassName = 'film-container';
    const movieService = new MovieService();
    const resultPage: Page | null = await movieService.searchMovieByTitle(searchTerm, numberPage);

    if (resultPage) {
        let movies: Movie[] = resultPage?.results;

        const mapper = new Mapper();
        const movieDTOs: MovieDTO[] = movies.map((movie: Movie) => mapper.mapMovieToMovieDTO(movie));
        removingAllElementsInContainer();
        for (const movie of movieDTOs) {
            addElement(movie, childClassName, parentClassName);
        }
        subscribeToTheClickEventOnHeart();
        addRandomlySelectedMovie(movieDTOs);
    }
}

function addRandomlySelectedMovie(moviesDTO: MovieDTO[]) {
    const movieService = new MovieService();
    let randomlySelectedMovie = movieService.getRandomMovie(moviesDTO);

    const movieNameElement = document.getElementById('random-movie-name');
    const movieDescriptionElement = document.getElementById('random-movie-description');
    const sectionElement = document.getElementById('random-movie');

    if (movieNameElement && movieDescriptionElement && sectionElement) {
        sectionElement.style.backgroundImage = `url("${randomlySelectedMovie.imageUrl}")`;
        sectionElement.style.backgroundSize = 'cover';
        sectionElement.style.backgroundPosition = 'center center';
        sectionElement.style.backgroundRepeat = 'no-repeat';
        movieNameElement.textContent = randomlySelectedMovie.title;
        movieDescriptionElement.textContent = randomlySelectedMovie.description;
    }
}

function addElement(newElement: MovieDTO, childClassName: string, parentClassName: string) {
    const helper = new Helper();
    let resultOperation = helper.isMovieInFavorites(newElement.id);
    let colorLikeOrDislike = resultOperation ? 'red' : '#ff000078';
    const newDiv = document.createElement('div');
    newDiv.className = childClassName;
    newDiv.setAttribute('id', newElement.id.toString());
    newDiv.innerHTML = `
    <div class="card shadow-sm">
    <img
        src="${newElement.imageUrl}"
    />
    <svg
        xmlns="http://www.w3.org/2000/svg"
        stroke="red"
        fill=${colorLikeOrDislike}
        width="50"
        height="50"
        class="bi bi-heart-fill position-absolute p-2"
        viewBox="0 -2 18 22"
        aboutid =${newElement.id.toString()}
    >
        <path
            fill-rule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
        />
    </svg>
    <div class="card-body">
        <p class="card-text truncate">
            ${newElement.description}
        </p>
        <div
            class="
                d-flex
                justify-content-between
                align-items-center
            "
        >
            <small class="text-muted">${newElement.releaseDate}</small>
        </div>
    </div>
</div>
  `;

    const containerDiv = document.getElementById(parentClassName);
    containerDiv?.appendChild(newDiv);
}

async function addElementsToFavorite() {
    let childClassName = 'col-12 p-2';
    let parentClassName = 'favorite-movies';
    const mapper = new Mapper();
    const helper = new Helper();
    const movieService = new MovieService();

    let listMoviesId = helper.getFavoriteMovies();

    if (listMoviesId) {
        for (const id of listMoviesId) {
            let movieDetails = await movieService.getMovieDetailsById(id);
            if (movieDetails) {
                let movieDTO = mapper.mapMovieDetailsToMovieDTO(movieDetails);
                addElement(movieDTO, childClassName, parentClassName);
            }
        }
    }
}

function removeAllElements(nameClass: string) {
    const filmContainer = document.getElementById(nameClass);
    while (filmContainer?.firstChild) {
        filmContainer.removeChild(filmContainer.firstChild);
    }
}

function subscribeToTheClickEventOnHeart() {
    const svgElements = document.querySelectorAll('.bi-heart-fill');
    svgElements.forEach((svgElement) => {
        svgElement.addEventListener('click', handleClick);
    });
}

function removingAllElementsInContainer() {
    const filmContainer = document.getElementById('film-container');
    while (filmContainer?.firstChild) {
        filmContainer.removeChild(filmContainer.firstChild);
    }
}

async function loadingTheSelectedCategory(selectedId: string, numberPage: number = 1) {
    const movieService = new MovieService();
    let childClassName = 'col-lg-3 col-md-4 col-12 p-2';
    let parentClassName = 'film-container';

    switch (selectedId) {
        case 'popular':
            const resultPageMovies: Page | null = await movieService.getPopularMovies(numberPage);
            if (resultPageMovies) {
                let movies: Movie[] = resultPageMovies?.results;
                const mapper = new Mapper();
                const movieDTOs: MovieDTO[] = movies.map((movie: Movie) => mapper.mapMovieToMovieDTO(movie));
                addRandomlySelectedMovie(movieDTOs);
                for (const movie of movieDTOs) {
                    addElement(movie, childClassName, parentClassName);
                }
                subscribeToTheClickEventOnHeart();
            }

            break;

        case 'upcoming':
            const resultPageUpcoming: Page | null = await movieService.getMoviesprovideUpcoming(numberPage);
            if (resultPageUpcoming) {
                let movies: Movie[] = resultPageUpcoming?.results;
                const mapper = new Mapper();
                const movieDTOs: MovieDTO[] = movies.map((movie: Movie) => mapper.mapMovieToMovieDTO(movie));
                addRandomlySelectedMovie(movieDTOs);
                for (const movie of movieDTOs) {
                    addElement(movie, childClassName, parentClassName);
                }
                subscribeToTheClickEventOnHeart();
            }
            break;

        case 'top_rated':
            const resultPageTopRating: Page | null = await movieService.getMoviesWithTopRating(numberPage);
            if (resultPageTopRating) {
                let movies: Movie[] = resultPageTopRating?.results;
                const mapper = new Mapper();
                const movieDTOs: MovieDTO[] = movies.map((movie: Movie) => mapper.mapMovieToMovieDTO(movie));
                addRandomlySelectedMovie(movieDTOs);
                for (const movie of movieDTOs) {
                    addElement(movie, childClassName, parentClassName);
                }
                subscribeToTheClickEventOnHeart();
            }
            break;

        default:
            break;
    }
}

function defineActiveButton(): string | null {
    const buttonGroup = document.getElementById('button-wrapper');
    const activeRadioButton = buttonGroup?.querySelector('input[type="radio"]:checked');
    const activeButtonId = activeRadioButton ? activeRadioButton.id : null;

    return activeButtonId;
}

function countTheNumberPage(): number {
    const filmContainer = document.getElementById('film-container');
    let count = 0;
    let page = 1;
    if (filmContainer) {
        count = filmContainer.childElementCount;
    }
    if (count) {
        page = count / 20 + 1;
    }
    return page;
}

// Define the click event handler function
function handleClick(event: Event) {
    const helper = new Helper();
    const parentDiv = event.target as HTMLElement;
    const grandparentDiv = parentDiv?.parentElement;
    if (grandparentDiv) {
        const id = grandparentDiv.getAttribute('aboutid');
        if (id) {
            let resultOperation = helper.isMovieInFavorites(parseInt(id));
            if (!resultOperation) {
                helper.addMovieToFavorites(parseInt(id));
                grandparentDiv.setAttribute('fill', 'red');
                removeAllElements('favorite-movies');
                addElementsToFavorite();
            } else {
                helper.removeMovieFromFavorites(parseInt(id));
                grandparentDiv.setAttribute('fill', '#ff000078');
                removeAllElements('favorite-movies');
                addElementsToFavorite();
            }
        }
    }
}
