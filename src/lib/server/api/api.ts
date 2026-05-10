import { BASE_URL, tmdbFetch } from './apiWrapper';
import { env } from '$env/dynamic/private';
const { TMDB_API_KEY } = env;
if (!TMDB_API_KEY) {
	throw new Error('TMDB_API_KEY is not defined in environment variables');
}

const handleFetchResponse = async (response: Response) => {
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`HTTP error! status: ${response.status}, data: ${JSON.stringify(errorData)}`);
	}
	return response.json();
};

export const fetchPopularMovies = async (fetchFn: typeof fetch): Promise<Movie[]> => {
	const data = await tmdbFetch<TMDBRespones<{ id: number; title: string; backdrop_path: string }>>(
		'movie/popular',
		{},
		fetchFn
	);

	return data?.results || [];
};

export const fetchTrendingMovies = async (fetchFn: typeof fetch): Promise<Movie[]> => {
	const data = await tmdbFetch<TMDBRespones<{ id: number; title: string; backdrop_path: string }>>(
		'trending/movie/week',
		{},
		fetchFn
	);

	return data?.results || [];
};

export const fetchTopRatedMovies = async (fetchFn: typeof fetch): Promise<Movie[]> => {
	const data = await tmdbFetch<TMDBRespones<{ id: number; title: string; backdrop_path: string }>>(
		'movie/top_rated',
		{},
		fetchFn
	);

	return data?.results || [];
};

export const getGenres = async (fetchFn: typeof fetch): Promise<Genre[] | null> => {
	const data = await tmdbFetch<{ genres: Genre[] }>('genre/movie/list', {}, fetchFn);
	return data?.genres || null;
};

export const getMoviesByGenre = async (fetchFn: typeof fetch, id: number): Promise<Movie[]> => {
	const data = await tmdbFetch<TMDBRespones<{ id: number; title: string; backdrop_path: string }>>(
		'discover/movie',
		{ with_genres: id },
		fetchFn
	);
	return data?.results || [];
};

export const getMovieTrailer = async (movieId: number): Promise<Trailer> => {
	const response = await fetch(
		`${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
	);
	const data = await handleFetchResponse(response);

	const trailer = data?.results.find((video: any) => {
		return video.type === 'Trailer' && video.site === 'YouTube';
	});

	if (!trailer) {
		throw new Error('No trailer found');
	}
	return trailer;
};

export const getMovieById = async (
	fetchFn: typeof fetch,
	movieId: string
): Promise<MovieDetails | null> => {
	const response = await fetchFn(
		`${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
	);
	return handleFetchResponse(response);
};

export const getSimiliarMovies = async (
	fetchFn: typeof fetch,
	movieId: string
): Promise<Movie[]> => {
	const response = await fetchFn(
		`${BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
	);
	const data = await handleFetchResponse(response);
	return (data?.results) as Movie[] || [];
};

export const searchMovies = async (
	{
		fetchFn,
		searchQuery,
		page = 1
	}: {
		fetchFn: typeof fetch;
		searchQuery: string;
		page: number;
	}
): Promise<Movie[]> => {
	if (!searchQuery.trim()) {
		return [];
	}

	const encodedQuery = encodeURIComponent(searchQuery.trim());
	const data = await tmdbFetch<TMDBRespones<{ id: number; title: string; backdrop_path: string }>>(
		'search/movie',
		{ query: encodedQuery, page },
		fetchFn
	);
	return data?.results || [];
};
