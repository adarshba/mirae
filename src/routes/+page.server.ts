import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, getGenres, getMoviesByGenre } from '$lib/server/api/api';
import type { PageServerLoad } from './$types';


export const load = (async ({ fetch }) => {
  try {
    const [popularMovies, topRatedMovies, trendingMovies, genres] = await Promise.all([fetchPopularMovies(fetch), fetchTopRatedMovies(fetch), fetchTrendingMovies(fetch), getGenres(fetch)]);

    const moviesByGenre: MoviesWithGenre[] = genres ? await Promise.all(genres.map(async (genre) => {
      const movies = await getMoviesByGenre(fetch, genre.id);
      return {
        id: genre.id,
        name: genre.name,
        movies
      }
    })) : [];

    if (popularMovies.length === 0) {
      throw new Error("No popular movies found.");
    }

    //TODO: fetch the trailer of the selected movie

    return { popularMovies, topRatedMovies, trendingMovies, moviesByGenre };

  } catch (error) {
    console.error("Something went wrong fetching the data.")
    return {
      popularMovies: [],
      topRatedMovies: [],
      trendingMovies: [],
      moviesByGenre: []
    }
  }
}) satisfies PageServerLoad;