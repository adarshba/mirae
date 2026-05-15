import type { PageServerLoad } from './$types';
import { fetchPopularMovies } from '$api/catalog';

export const load: PageServerLoad = async ({ fetch }) => {
  const suggestions = await fetchPopularMovies(fetch);
  return { suggestions: suggestions ?? [] };
};
