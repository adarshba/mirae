import { tmdbFetch } from './tmdb-client';

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
  return data?.genres ?? null;
};

export const getMovieTrailer = async (
  movieId: number,
  fetchFn: typeof fetch
): Promise<Trailer | null> => {
  const data = await tmdbFetch<TMDBResponse<Trailer>>(`movie/${movieId}/videos`, {}, fetchFn);
  return data?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ?? null;
};

export const getMovieById = (fetchFn: typeof fetch, movieId: string) =>
  tmdbFetch<MovieDetails>(`movie/${movieId}`, {}, fetchFn);

export const getSimilarMovies = async (
  fetchFn: typeof fetch,
  movieId: string
): Promise<Movie[]> => {
  const data = await tmdbFetch<TMDBResponse<Movie>>(`movie/${movieId}/similar`, {}, fetchFn);
  return data?.results ?? [];
};

// TODO: TMDB pagination is broken once we post-filter by `original_language === 'ko'` —
// some pages return zero results even when more pages exist. Either switch fully to
// discover/movie with `with_original_language=ko` + free-text genre matching, or
// fetch multiple pages until N results are accumulated.
export const searchMovies = async ({
  fetchFn,
  searchQuery,
  page = 1
}: {
  fetchFn: typeof fetch;
  searchQuery: string;
  page: number;
}): Promise<Movie[]> => {
  if (!searchQuery.trim()) return [];

  const results = await fetchMovieList('search/movie', fetchFn, {
    query: searchQuery.trim(),
    page,
    region: 'KR'
  });
  return results.filter((m) => m.original_language === 'ko');
};
