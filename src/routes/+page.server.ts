import {
  fetchNewReleases,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  getMoviesByGenre
} from '$api/catalog';
import type { PageServerLoad } from './$types';

const CURATED_ROWS: { id: number; name: string; genreIds: number[] }[] = [
  { id: 10749, name: 'Romance & Slice of Life', genreIds: [10749] },
  { id: 53, name: 'Thriller, Crime & Dark Drama', genreIds: [53, 80] },
  { id: 36, name: 'Sageuk · Period Dramas', genreIds: [36] }
];

export const load = (async ({ fetch }) => {
  try {
    const [popularMovies, topRatedMovies, trendingMovies, newReleases, ...curatedResults] =
      await Promise.all([
        fetchPopularMovies(fetch),
        fetchTopRatedMovies(fetch),
        fetchTrendingMovies(fetch),
        fetchNewReleases(fetch),
        ...CURATED_ROWS.map((row) => getMoviesByGenre(fetch, row.genreIds.join(',')))
      ]);

    const curatedRows: MoviesWithGenre[] = CURATED_ROWS.map((row, i) => ({
      id: row.id,
      name: row.name,
      movies: curatedResults[i]
    }));

    if (popularMovies.length === 0) {
      throw new Error('No popular movies found.');
    }

    return { popularMovies, topRatedMovies, trendingMovies, newReleases, curatedRows };
  } catch {
    console.error('Something went wrong fetching the data.');
    return {
      popularMovies: [],
      topRatedMovies: [],
      trendingMovies: [],
      newReleases: [],
      curatedRows: []
    };
  }
}) satisfies PageServerLoad;
