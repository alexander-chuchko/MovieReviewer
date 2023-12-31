import { Helper } from './helpers/Helper';
import { Mapper } from './helpers/Mapper';
import { Movie } from './models/Movie';
import { MovieDTO } from './models/MovieDTO';
import { Page } from './models/Page';
import { MovieService } from './services/MovieService';

/* eslint-disable */
export class MovieManager {
    init() {
        //Subscribing to events
        const inputSubmitButton = document.getElementById('submit');
        inputSubmitButton?.addEventListener('click', this.loadInfoFromSearch.bind(this));

        const loadMoreButton = document.getElementById('load-more');
        loadMoreButton?.addEventListener('click', this.loadMoreMovies.bind(this));

        document.addEventListener('DOMContentLoaded', async () => {
            await this.setupPageOnLoad();
        });
    }

    async setupPageOnLoad() {
        const radioButtons = document.querySelectorAll('.btn-check');

        let selectedId = this.defineActiveButton();
        if (selectedId) {
            this.removingAllElementsInContainer();
            await this.loadingTheSelectedCategory(selectedId, 1);
        }

        radioButtons.forEach((radioButton) => {
            radioButton.addEventListener('click', async () => {
                const selectedId = radioButton.id;
                this.removingAllElementsInContainer();
                await this.loadingTheSelectedCategory(selectedId);
            });
        });
        this.subscribeElementsToTheClickEventOnHeart.bind(this);
        this.removeAllElements('favorite-movies');
        await this.addElementsToFavorite();
    }

    async loadInfoFromSearch() {
        const infoFromFieldSearch = document.getElementById('search') as HTMLInputElement;
        const searchTerm: string = infoFromFieldSearch.value.trim();
        let numberPage = this.countTheNumberPage();
        let childClassName = 'col-lg-3 col-md-4 col-12 p-2';
        let parentClassName = 'film-container';
        const movieService = new MovieService();
        const resultPage: Page | null = await movieService.searchMovieByTitle(searchTerm, numberPage);

        if (resultPage) {
            let movies: Movie[] = resultPage?.results;

            const mapper = new Mapper();
            const movieDTOs: MovieDTO[] = movies.map((movie: Movie) => mapper.mapMovieToMovieDTO(movie));
            this.removingAllElementsInContainer();
            for (const movie of movieDTOs) {
                this.addElement(movie, childClassName, parentClassName);
            }
            this.subscribeElementsToTheClickEventOnHeart('.bi-heart-fill');
            this.addRandomlySelectedMovie(movieDTOs);
        }
    }

    removingAllElementsInContainer() {
        const filmContainer = document.getElementById('film-container');
        while (filmContainer?.firstChild) {
            filmContainer.removeChild(filmContainer.firstChild);
        }
    }

    addElement(newElement: MovieDTO, childClassName: string, parentClassName: string) {
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

    async loadMoreMovies() {
        let result = this.defineActiveButton();
        let page = this.countTheNumberPage();

        if (result) {
            await this.loadingTheSelectedCategory(result, page);
        }
    }

    defineActiveButton(): string | null {
        const buttonGroup = document.getElementById('button-wrapper');
        const activeRadioButton = buttonGroup?.querySelector('input[type="radio"]:checked');
        const activeButtonId = activeRadioButton ? activeRadioButton.id : null;

        return activeButtonId;
    }

    countTheNumberPage(): number {
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

    async loadingTheSelectedCategory(selectedId: string, numberPage: number = 1) {
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
                    this.addRandomlySelectedMovie(movieDTOs);
                    for (const movie of movieDTOs) {
                        this.addElement(movie, childClassName, parentClassName);
                    }
                    this.subscribeElementsToTheClickEventOnHeart('.bi-heart-fill');
                }

                break;

            case 'upcoming':
                const resultPageUpcoming: Page | null = await movieService.getMoviesprovideUpcoming(numberPage);
                if (resultPageUpcoming) {
                    let movies: Movie[] = resultPageUpcoming?.results;
                    const mapper = new Mapper();
                    const movieDTOs: MovieDTO[] = movies.map((movie: Movie) => mapper.mapMovieToMovieDTO(movie));
                    this.addRandomlySelectedMovie(movieDTOs);
                    for (const movie of movieDTOs) {
                        this.addElement(movie, childClassName, parentClassName);
                    }
                    this.subscribeElementsToTheClickEventOnHeart('.bi-heart-fill');
                }
                break;

            case 'top_rated':
                const resultPageTopRating: Page | null = await movieService.getMoviesWithTopRating(numberPage);
                if (resultPageTopRating) {
                    let movies: Movie[] = resultPageTopRating?.results;
                    const mapper = new Mapper();
                    const movieDTOs: MovieDTO[] = movies.map((movie: Movie) => mapper.mapMovieToMovieDTO(movie));
                    this.addRandomlySelectedMovie(movieDTOs);
                    for (const movie of movieDTOs) {
                        this.addElement(movie, childClassName, parentClassName);
                    }
                    this.subscribeElementsToTheClickEventOnHeart('.bi-heart-fill');
                }
                break;

            default:
                break;
        }
    }

    addRandomlySelectedMovie(moviesDTO: MovieDTO[]) {
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

    subscribeElementsToTheClickEventOnHeart(nameElement: string) {
        const svgElements = document.querySelectorAll(nameElement); //'.bi-heart-fill'
        svgElements.forEach((svgElement) => {
            svgElement.addEventListener('click', this.handleClick.bind(this));
        });
    }

    subscribeElementToTheClickEventOnHeart(element: Element) {
        element.addEventListener('click', this.handleClick.bind(this));
    }

    getElementByAboutId(aboutId: string): Element | null {
        const selector = `svg[aboutid="${aboutId}"]`;
        const element = document.querySelector(selector);
        return element;
    }

    unsubscribeFromAnEvent(nameElement: string) {
        const allElements = document.querySelectorAll(nameElement);
        allElements.forEach((element) => {
            element.removeEventListener('click', this.handleClick);
        });
    }

    getFavoriteMoviesSVGElements() {
        const favoriteMoviesContainer = document.getElementById('favorite-movies');
        if (favoriteMoviesContainer) {
            const svgElements = favoriteMoviesContainer.querySelectorAll('svg.bi-heart-fill');
            return svgElements;
        }
        return [];
    }

    removeAllElements(nameClass: string) {
        const filmContainer = document.getElementById(nameClass);
        while (filmContainer?.firstChild) {
            filmContainer.removeChild(filmContainer.firstChild);
        }
    }

    async addElementsToFavorite() {
        const childClassName = 'col-12 p-2';
        const parentClassName = 'favorite-movies';
        const mapper = new Mapper();
        const helper = new Helper();
        const movieService = new MovieService();

        let listMoviesId = helper.getFavoriteMovies();

        if (listMoviesId) {
            for (const id of listMoviesId) {
                let movieDetails = await movieService.getMovieDetailsById(id);
                if (movieDetails) {
                    let movieDTO = mapper.mapMovieDetailsToMovieDTO(movieDetails);
                    this.addElement(movieDTO, childClassName, parentClassName);
                }
            }
        }
    }

    handleClick(event: Event) {
        const helper = new Helper();
        const parentDiv = event.target as HTMLElement;
        const grandparentDiv = parentDiv?.parentElement;
        if (grandparentDiv) {
            const id = grandparentDiv.getAttribute('aboutid');
            if (id) {
                let resultOperation = helper.isMovieInFavorites(parseInt(id));
                if (!resultOperation) {
                    helper.addMovieToFavorites(parseInt(id));
                    this.changeColorAllElements(id, 'red');
                    this.removeAllElements('favorite-movies');
                    this.addElementsToFavorite();
                } else {
                    helper.removeMovieFromFavorites(parseInt(id));
                    this.changeColorAllElements(id, '#ff000078');
                    this.removeAllElements('favorite-movies');
                    this.addElementsToFavorite();
                }
            }
        }
    }

    changeColorAllElements(id: string, setColor: string) {
        const allElements = document.querySelectorAll('svg[aboutid]');
        allElements?.forEach((svgElement) => {
            const getId = svgElement.getAttribute('aboutid');
            if (id === getId) {
                svgElement.setAttribute('fill', setColor);
            }
        });
    }
}
