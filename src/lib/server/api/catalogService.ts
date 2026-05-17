import { tmdbFetch } from './tmdbClient';

const KOREAN_FILTER = {
  with_original_language: 'ko',
  region: 'KR'
} as const;

const fetchTitleList = async (
  endpoint: string,
  fetchFn: typeof fetch,
  params: Record<string, string | number | boolean> = {}
): Promise<Title[]> => {
  const data = await tmdbFetch<TmdbResponse<Title>>(endpoint, params, fetchFn);
  return data?.results ?? [];
};

export const fetchPopularTitles = (fetchFn: typeof fetch) =>
  fetchTitleList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'popularity.desc',
    'vote_count.gte': 50
  });

export const fetchTrendingTitles = (fetchFn: typeof fetch) => {
  const since = new Date();
  since.setFullYear(since.getFullYear() - 2);
  const sinceDate = since.toISOString().slice(0, 10);
  return fetchTitleList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'popularity.desc',
    'primary_release_date.gte': sinceDate,
    'vote_count.gte': 10
  });
};

export const fetchTopRatedTitles = (fetchFn: typeof fetch) =>
  fetchTitleList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'vote_average.desc',
    'vote_count.gte': 200
  });

export const fetchNewReleases = (fetchFn: typeof fetch) => {
  const today = new Date().toISOString().slice(0, 10);
  return fetchTitleList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': today,
    'vote_count.gte': 5
  });
};

export const getTitlesByGenre = (fetchFn: typeof fetch, id: number | string) =>
  fetchTitleList('discover/movie', fetchFn, {
    ...KOREAN_FILTER,
    sort_by: 'popularity.desc',
    with_genres: id
  });

export const getGenres = async (fetchFn: typeof fetch): Promise<Genre[] | null> => {
  const data = await tmdbFetch<{ genres: Genre[] }>('genre/movie/list', {}, fetchFn);
  return data?.genres ?? null;
};

export const getTitleTrailer = async (
  titleId: number,
  fetchFn: typeof fetch
): Promise<Trailer | null> => {
  const data = await tmdbFetch<TmdbResponse<Trailer>>(`movie/${titleId}/videos`, {}, fetchFn);
  return data?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ?? null;
};

export const getTitleById = (fetchFn: typeof fetch, titleId: string) =>
  tmdbFetch<TitleDetails>(`movie/${titleId}`, {}, fetchFn);

export const getSimilarTitles = async (
  fetchFn: typeof fetch,
  titleId: string
): Promise<Title[]> => {
  const data = await tmdbFetch<TmdbResponse<Title>>(`movie/${titleId}/similar`, {}, fetchFn);
  return data?.results ?? [];
};

// FIXME: post-filtering by `original_language === 'ko'` breaks pagination. Switch to `discover/movie` with `with_original_language=ko`, or accumulate pages until N results.
export const searchTitles = async ({
  fetchFn,
  searchQuery,
  page = 1
}: {
  fetchFn: typeof fetch;
  searchQuery: string;
  page: number;
}): Promise<Title[]> => {
  if (!searchQuery.trim()) return [];

  const results = await fetchTitleList('search/movie', fetchFn, {
    query: searchQuery.trim(),
    page,
    region: 'KR'
  });
  return results.filter((t) => t.original_language === 'ko');
};
