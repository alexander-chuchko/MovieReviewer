import { Movie } from '../models/Movie';
import { MovieDTO } from '../models/MovieDTO';

export class Mapper {
    mapMovieToMovieDTO(movie: Movie): MovieDTO {
        const movieDTO: MovieDTO = {
            id: movie.id,
            imageUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
            title: movie.title,
            description: movie.overview,
            releaseDate: movie.release_date,
            isLiked: false,
        };

        return movieDTO;
    }

    mapMovieDetailsToMovieDTO(movie: MovieDetail): MovieDTO {
        const movieDTO: MovieDTO = {
            id: movie.id,
            imageUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
            title: movie.title,
            description: movie.overview,
            releaseDate: movie.release_date,
            isLiked: false,
        };

        return movieDTO;
    }
}
