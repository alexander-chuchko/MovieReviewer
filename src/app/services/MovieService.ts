import { MovieDTO } from '../models/MovieDTO';
import { Page } from '../models/Page';

/* eslint-disable */
export class MovieService {
    async searchMovieByTitle(nameMovie: string, numberPage = 1): Promise<Page | null> {
        const apiKey = '5aacb3a606a1eaed37dcdd5c774c6724';
        const url = `https://api.themoviedb.org/3/search/movie?query=${nameMovie}&include_adult=true&language=en-US&page=${numberPage}&api_key=${apiKey}`;
        const response = fetch(url, {
            headers: {
                accept: 'application/json',
            },
        });
        if ((await response).ok) {
            const data: Page = await (await response).json();
            return data;
        }
        // console.error('Error:', (await response).statusText);
        return null;
    }

    async getPopularMovies(numberPage = 1): Promise<Page | null> {
        const apiKey = '5aacb3a606a1eaed37dcdd5c774c6724';
        const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${numberPage}&api_key=${apiKey}`;
        const response = fetch(url, {
            headers: {
                accept: 'application/json',
            },
        });
        if ((await response).ok) {
            const data: Page = await (await response).json();
            return data;
        }
        // console.error('Error:', (await response).statusText);
        return null;
    }

    async getMoviesWithTopRating(numberPage = 1): Promise<Page | null> {
        const apiKey = '5aacb3a606a1eaed37dcdd5c774c6724';
        const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${numberPage}&api_key=${apiKey}`;
        const response = fetch(url, {
            headers: {
                accept: 'application/json',
            },
        });
        if ((await response).ok) {
            const data: Page = await (await response).json();
            return data;
        }
        // console.error('Error:', (await response).statusText);
        return null;
    }

    async getMoviesprovideUpcoming(numberPage = 1): Promise<Page | null> {
        const apiKey = '5aacb3a606a1eaed37dcdd5c774c6724';
        const url = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${numberPage}&api_key=${apiKey}`;
        const response = fetch(url, {
            headers: {
                accept: 'application/json',
            },
        });
        if ((await response).ok) {
            const data: Page = await (await response).json();
            return data;
        }
        // console.error('Error:', (await response).statusText);
        return null;
    }

    removingAllElementsInContainer() {
        const filmContainer = document.getElementById('film-container');
        while (filmContainer?.firstChild) {
            filmContainer.removeChild(filmContainer.firstChild);
        }
    }

    getRandomMovie(allMovies: MovieDTO[]): MovieDTO {
        const index = Math.floor(Math.random() * (allMovies.length - 0 + 1)) + 0;
        const selectedMovie = allMovies[index];
        return selectedMovie;
    }

    async getMovieDetailsById(id: number): Promise<MovieDetail | null> {
        const apiKey = '5aacb3a606a1eaed37dcdd5c774c6724';
        const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=${apiKey}`;
        const response = fetch(url, {
            headers: {
                accept: 'application/json',
            },
        });

        if ((await response).ok) {
            const data: MovieDetail = await (await response).json();
            return data;
        }
        // console.error('Error:', (await response).statusText);
        return null;
    }
}
