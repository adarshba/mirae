import { createContext } from "svelte";
import type { MovieStore } from "./MovieStore.svelte";
import type { MeasureMemoryMode } from "vm";

export class ModalStore implements ModalState {
  isOpen = $state(false);
  trailerId = $state("");
  movieId = $state(0);
  similarMovies: Movie[] = $state([]);
  loading = $state(false);
  loadingSimilarMovies = $state(false);
  error: string | null = $state(null);
  movieData: MovieDetails | null = $state(null);
  #movieCache = new Map<number, MovieDetails>();


  openModal = (movieId: number, trailerUrl: string) => {
    this.loading = true;

    this.movieId = movieId;
    this.trailerId = trailerUrl;


    const movieInCache = this.#movieCache.get(movieId);

    if (movieInCache) {
      this.movieData = movieInCache;

      this.loading = false;
      this.isOpen = true;
      return;
    }

    this.fetchMovieDetails(movieId);
    this.fetchSimilarMovies(movieId);
  };

  closeModal = () => {
    this.loading = false;

    this.movieId = 0;
    this.trailerId = '';
    this.error = null;
    this.movieData = null;
    this.isOpen = false;
  };


  private async fetchMovieDetails(movieId: number): Promise<void> {
    try {
      const response = await fetch(`/api/movie/${movieId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {

        const errData = await response.json()
        if (errData.error) {
          this.error = errData.error || "Failed to fetch the movie data..."
        }
        this.movieData = null;
        return;
      }

      const data = await response.json()

      const movieDataRes: MovieDetails = data.movieDetails

      if (movieDataRes) {
        this.movieData = movieDataRes;
        this.#movieCache.set(movieId, movieDataRes)
      }

    } catch (error) {
      const err = error as Error

      this.error = err.message ?? "Failed to fetch the movie data...";
      this.movieData = null
    } finally {
      this.loading = false;
      this.isOpen = true;
    }
  }

  private async fetchSimilarMovies(movieId: number): Promise<void> {
    if (movieId === 0) return;
    this.loadingSimilarMovies = true;

    try {
      const response = await fetch(`/api/movie/${movieId}/similar`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      this.similarMovies = (data.similarMovies as Movie[]) || [];
    } catch (error) {
      this.similarMovies = [];
    } finally {
      this.loadingSimilarMovies = false;
    }
  }
}

export const [getModalContext, setModalContext] = createContext<ModalStore>();