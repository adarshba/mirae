interface Movie {
	id: number;
	title?: string;
	backdrop_path?: string;
	overview?: string;
}

interface MovieDetails extends Movie {
	adult: boolean;
	belongs_to_collection: Belongstocollection;
	budget: number;
	genres: Genre[];
	homepage: string;
	imdb_id: string;
	origin_country: string[];
	original_language: string;
	original_title: string;
	popularity: number;
	poster_path: string;
	production_companies: Productioncompany[];
	production_countries: Productioncountry[];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: Spokenlanguage[];
	status: string;
	tagline: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

interface Spokenlanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
}

interface Productioncountry {
	iso_3166_1: string;
	name: string;
}

interface Productioncompany {
	id: number;
	logo_path: null | string;
	name: string;
	origin_country: string;
}

interface Genre {
	id: number;
	name: string;
}

interface Belongstocollection {
	id: number;
	name: string;
	poster_path: string;
	backdrop_path: string;
}

interface TMDBRespones<T> {
	results: T[];
}

interface Genre {
	id: number;
	name: string;
}

interface MoviesWithGenre {
	movies: Movie[];
	id: number;
	name: string;
}

interface Trailer {
	id: string;
	name: string;
	key: string;
	site: string;
	size: number;
	type: string;
	official: boolean;
	published_at: Date;
	iso_639_1: string;
	iso_3166_1: string;
}

interface CardState {
	isHovered: boolean;
	cardId: number | string | null;
	position: { x: number; y: number };
	dimensions: { width: number; height: number };
	movie: Movie | null;
}

interface ModalState {
	movieId: number;
	isOpen: boolean;
	trailerId: string;
	movieData: MovieDetails | null;
	loading: boolean;
	error: string | null;
	similarMovies: Movie[];
	loadingSimilarMovies: boolean;
}
