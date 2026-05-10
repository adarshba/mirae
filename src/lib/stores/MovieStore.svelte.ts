import { createContext } from 'svelte';

export class MovieStore {

	popularMovies: Movie[] = $state([]);
	selectedMovie: MovieDetails | null = $state(null);
	// #trendingMovies: Movie[] = $state([]);
	// #topRatedMovies: Movie[] = $state([]);
	// #moviesWithGenres	: MoviesWithGenre[] = $state([]);

	constructor() {
		$effect(() => {
			if (this.popularMovies.length === 0) {
				// this.selectedMovie = null;
				return;
			}

			const randomIndex = Math.floor(Math.random() * this.popularMovies.length);
			this.selectedMovie = this.popularMovies[randomIndex] as MovieDetails;
		})
	}

}

export const [getMoviesContext, setMoviesContext] = createContext<MovieStore>();
