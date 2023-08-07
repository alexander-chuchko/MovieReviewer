import { Movie } from './Movie';
/* eslint-disable */
export interface Page {
    page: number;
    results: Movie[];
    totalPages: number;
    totalResults: number;
}
