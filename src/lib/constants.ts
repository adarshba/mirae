/**
 * Shared constants. Component-specific magic numbers stay in the component;
 * anything that's shared across two or more files, or that defines an external
 * contract (storage keys, route prefixes, TMDB paths), lives here.
 */

// ---------- TMDB ----------

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

// ---------- Routing ----------

export const AUTH_ROUTES = ['/login', '/signup', '/forgot', '/reset'] as const;
export const PROTECTED_ROUTES = ['/account', '/myList', '/watch'] as const;

// ---------- Storage keys ----------

export const STORAGE_KEYS = {
  favorites: 'favorites',
  devicesPrefix: 'mirae:devices:'
} as const;

// ---------- Timings (milliseconds) ----------

export const HOVER_DELAY_MS = 400;
export const AUTH_REDIRECT_DELAY_MS = 700;
export const NAVBAR_STICKY_SCROLL_PX = 30;
export const HOVER_PREVIEW_Y_OFFSET_PX = 250;
