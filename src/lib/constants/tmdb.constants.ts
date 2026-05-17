export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p';

export const TMDB_IMG_SIZE = {
  poster: 'w500',
  backdrop: 'original'
} as const;

export type TmdbImageSize = (typeof TMDB_IMG_SIZE)[keyof typeof TMDB_IMG_SIZE];

/**
 * Genre rows rendered under the billboard. IDs are TMDB genre IDs.
 * https://api.themoviedb.org/3/genre/movie/list
 */
export const CURATED_GENRE_ROWS: { id: number; name: string; genreIds: number[] }[] = [
  { id: 10749, name: 'Romance & Slice of Life', genreIds: [10749] },
  { id: 53, name: 'Thriller, Crime & Dark Drama', genreIds: [53, 80] },
  { id: 36, name: 'Sageuk · Period Dramas', genreIds: [36] }
];
