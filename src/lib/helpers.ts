import fallbackImage from '$lib/assets/404.jpg';

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
