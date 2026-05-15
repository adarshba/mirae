import {
  fetchNewReleases,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  getMoviesByGenre
} from '$api/catalog';
import { CURATED_GENRE_ROWS } from '$lib/constants';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  try {
    const [popularMovies, topRatedMovies, trendingMovies, newReleases, ...curatedResults] =
      await Promise.all([
        fetchPopularMovies(fetch),
        fetchTopRatedMovies(fetch),
        fetchTrendingMovies(fetch),
        fetchNewReleases(fetch),
        ...CURATED_GENRE_ROWS.map((row) => getMoviesByGenre(fetch, row.genreIds.join(',')))
      ]);

    const curatedRows: MoviesWithGenre[] = CURATED_GENRE_ROWS.map((row, i) => ({
      id: row.id,
      name: row.name,
      movies: curatedResults[i]
    }));

    if (popularMovies.length === 0) {
      throw new Error('No popular movies found.');
    }

    return { popularMovies, topRatedMovies, trendingMovies, newReleases, curatedRows };
  } catch (err) {
    console.error('Catalog load failed:', err);
    return {
      popularMovies: [],
      topRatedMovies: [],
      trendingMovies: [],
      newReleases: [],
      curatedRows: []
    };
  }
}) satisfies PageServerLoad;
