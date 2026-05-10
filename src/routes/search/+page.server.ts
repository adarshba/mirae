import type { PageServerLoad } from './$types';
import { searchMovies } from '$lib/server/api/api';

export const load = (async ({ fetch, url }) => {
  const searchQuery = url.searchParams.get("query") ?? '';
  const searchResult = await searchMovies({ fetchFn: fetch, page: 1, searchQuery })
  return {
    searchQuery,
    searchResult
  };
}) satisfies PageServerLoad;