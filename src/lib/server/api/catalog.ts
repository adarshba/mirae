import { BASE_URL, tmdbFetch } from './tmdb-client';
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

const KOREAN_FILTER = {
  with_original_language: 'ko',
  region: 'KR'
} as const;

const fetchMovieList = async (
  endpoint: string,
  fetchFn: typeof fetch,
  params: Record<string, string | number | boolean> = {}
): Promise<Movie[]> => {
  const data = await tmdbFetch<TMDBResponse<Movie>>(endpoint, params, fetchFn);
  return data?.results ?? [];
};

export const fetchPopularMovies = (fetchFn: typeof fetch) =>
  fetchMovieList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'popularity.desc',
    'vote_count.gte': 50
  });

export const fetchTrendingMovies = (fetchFn: typeof fetch) => {
  const since = new Date();
  since.setFullYear(since.getFullYear() - 2);
  const sinceDate = since.toISOString().slice(0, 10);
  return fetchMovieList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'popularity.desc',
    'primary_release_date.gte': sinceDate,
    'vote_count.gte': 10
  });
};

export const fetchTopRatedMovies = (fetchFn: typeof fetch) =>
  fetchMovieList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'vote_average.desc',
    'vote_count.gte': 200
  });

export const fetchNewReleases = (fetchFn: typeof fetch) => {
  const today = new Date().toISOString().slice(0, 10);
  return fetchMovieList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': today,
    'vote_count.gte': 5
  });
};

export const getMoviesByGenre = (fetchFn: typeof fetch, id: number | string) =>
  fetchMovieList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'popularity.desc',
    with_genres: id
  });

export const getGenres = async (fetchFn: typeof fetch): Promise<Genre[] | null> => {
  const data = await tmdbFetch<{ genres: Genre[] }>('genre/movie/list', {}, fetchFn);
  return data?.genres || null;
};

export const getMovieTrailer = async (movieId: number): Promise<Trailer> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`);
  const data = await handleFetchResponse(response);

  const trailer = data?.results.find(
    (video: { type: string; site: string; key: string; name: string }) =>
      video.type === 'Trailer' && video.site === 'YouTube'
  );

  if (!trailer) {
    throw new Error('No trailer found');
  }
  return trailer;
};

export const getMovieById = async (
  fetchFn: typeof fetch,
  movieId: string
): Promise<MovieDetails | null> => {
  const response = await fetchFn(`${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`);
  return handleFetchResponse(response);
};

export const getSimiliarMovies = async (
  fetchFn: typeof fetch,
  movieId: string
): Promise<Movie[]> => {
  const response = await fetchFn(`${BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`);
  const data = await handleFetchResponse(response);
  return (data?.results as Movie[]) || [];
};

export const searchMovies = async ({
  fetchFn,
  searchQuery,
  page = 1
}: {
  fetchFn: typeof fetch;
  searchQuery: string;
  page: number;
}): Promise<Movie[]> => {
  if (!searchQuery.trim()) {
    return [];
  }

  const results = await fetchMovieList('search/movie', fetchFn, {
    query: searchQuery.trim(),
    page,
    region: 'KR'
  });
  return results.filter((m) => m.original_language === 'ko');
};
