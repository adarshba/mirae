import type { PageServerLoad } from './$types';
import { searchMovies } from '$api/catalog';

export const load = (async ({ fetch, url }) => {
  const searchQuery = url.searchParams.get('query') ?? '';
  const searchResult = await searchMovies({ fetchFn: fetch, page: 1, searchQuery });
  return {
    searchQuery,
    searchResult
  };
}) satisfies PageServerLoad;
