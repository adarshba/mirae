import type { PageServerLoad } from './$types';
import { fetchPopularTitles } from '$api/catalogService';

export const load: PageServerLoad = async ({ fetch }) => {
  const suggestions = await fetchPopularTitles(fetch);
  return { suggestions: suggestions ?? [] };
};
