import type { PageServerLoad } from './$types';
import { searchTitles } from '$api/catalogService';

export const load = (async ({ fetch, url }) => {
  const searchQuery = url.searchParams.get('query') ?? '';
  const searchResult = await searchTitles({ fetchFn: fetch, page: 1, searchQuery });
  return {
    searchQuery,
    searchResult
  };
}) satisfies PageServerLoad;
