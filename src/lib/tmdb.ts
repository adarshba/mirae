import fallbackImage from '$lib/assets/404.jpg';
import { TMDB_IMG_BASE, TMDB_IMG_SIZE, type TmdbImageSize } from '$lib/constants/tmdb.constants';

export const getTmdbImageUrl = (path: string | null | undefined, size: TmdbImageSize): string =>
  path ? `${TMDB_IMG_BASE}/${size}/${path}` : '';

export const getTmdbPosterUrl = (path: string | null | undefined) =>
  getTmdbImageUrl(path, TMDB_IMG_SIZE.poster);

export const getTmdbBackdropUrl = (path: string | null | undefined) =>
  getTmdbImageUrl(path, TMDB_IMG_SIZE.backdrop);

export function handleNoImageError(event: Event) {
  const img = event.target as HTMLImageElement;

  if (img.src !== fallbackImage) {
    img.src = fallbackImage;
  }
}

export const fetchTrailer = async (titleId: string): Promise<string> => {
  if (!titleId) throw new Error('No title ID provided');
  try {
    const response = await fetch(`/api/trailer/${titleId}`, {
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
