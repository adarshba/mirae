import fallbackImage from '$lib/assets/404.jpg';
import { TMDB_IMG_BASE, TMDB_IMG_SIZE, type TmdbImageSize } from '$lib/constants';

/** Build a TMDB image URL. Returns '' when path is falsy so callers can fall back via onerror. */
export const tmdbImage = (path: string | null | undefined, size: TmdbImageSize): string =>
  path ? `${TMDB_IMG_BASE}/${size}/${path}` : '';

export const tmdbPoster = (path: string | null | undefined) =>
  tmdbImage(path, TMDB_IMG_SIZE.poster);

export const tmdbBackdrop = (path: string | null | undefined) =>
  tmdbImage(path, TMDB_IMG_SIZE.backdrop);

/** TMDB returns vote_average on a 0-10 scale; product wants a 0-100 match %. */
export const matchPercent = (voteAverage: number | undefined) =>
  Math.round((voteAverage ?? 0) * 10);

/** "2024-09-12" → "2024". Safe on empty/undefined. */
export const releaseYear = (releaseDate: string | undefined) => releaseDate?.slice(0, 4) ?? '';

export function handleNoImageError(event: Event) {
  const img = event.target as HTMLImageElement;

  if (img.src !== fallbackImage) {
    img.src = fallbackImage;
  }
}

export const fetchTrailer = async (movieId: string): Promise<string> => {
  if (!movieId) throw new Error('No movie ID provided');
  try {
    const response = await fetch(`/api/trailer/${movieId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = (await response.json()) as { trailer: Trailer };

    return data.trailer?.key ?? '';
  } catch (error) {
    console.error(error);
    return '';
  }
};

export const convertMinsToHrs = (runtime: number) => {
  const hrs = Math.floor(runtime / 60);
  const mins = runtime % 60;

  return hrs === 0 ? `${mins}m` : `${hrs}h ${mins}m`;
};
