import {
  fetchNewReleases,
  fetchPopularTitles,
  fetchTopRatedTitles,
  fetchTrendingTitles,
  getTitlesByGenre
} from '$api/catalogService';
import { CURATED_GENRE_ROWS } from '$lib/constants/tmdb.constants';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  try {
    const [popularTitles, topRatedTitles, trendingTitles, newReleases, ...curatedResults] =
      await Promise.all([
        fetchPopularTitles(fetch),
        fetchTopRatedTitles(fetch),
        fetchTrendingTitles(fetch),
        fetchNewReleases(fetch),
        ...CURATED_GENRE_ROWS.map((row) => getTitlesByGenre(fetch, row.genreIds.join(',')))
      ]);

    const curatedRows: TitleGenreRow[] = CURATED_GENRE_ROWS.map((row, i) => ({
      id: row.id,
      name: row.name,
      titles: curatedResults[i]
    }));

    if (popularTitles.length === 0) {
      throw new Error('No popular titles found.');
    }

    return { popularTitles, topRatedTitles, trendingTitles, newReleases, curatedRows };
  } catch (err) {
    console.error('Catalog load failed:', err);
    return {
      popularTitles: [],
      topRatedTitles: [],
      trendingTitles: [],
      newReleases: [],
      curatedRows: []
    };
  }
}) satisfies PageServerLoad;
