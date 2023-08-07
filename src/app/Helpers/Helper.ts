export class Helper {
    private key = 'favoriteMovies';

    addMovieToFavorites(movieId: number) {
        const favoriteMovies: number[] = this.getFavoriteMovies();
        if (!favoriteMovies.includes(movieId)) {
            favoriteMovies.push(movieId);
            this.saveFavoriteMovies(favoriteMovies);
        }
    }

    removeMovieFromFavorites(movieId: number): void {
        let favoriteMovies: number[] = this.getFavoriteMovies();
        favoriteMovies = favoriteMovies.filter((id) => id !== movieId);
        this.saveFavoriteMovies(favoriteMovies);
    }

    getFavoriteMovies(): number[] {
        const favoriteMoviesJSON: string | null = localStorage.getItem(this.key);
        return favoriteMoviesJSON ? JSON.parse(favoriteMoviesJSON) : [];
    }

    saveFavoriteMovies(favoriteMovies: number[]): void {
        const favoriteMoviesJSON: string = JSON.stringify(favoriteMovies);
        localStorage.setItem(this.key, favoriteMoviesJSON);
    }

    isMovieInFavorites(movieId: number): boolean {
        const favoriteMovies: number[] = this.getFavoriteMovies();
        return favoriteMovies.includes(movieId);
    }
}
