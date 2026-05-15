import { createContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

export class ModalStore implements ModalState {
  isOpen = $state(false);
  trailerId = $state('');
  movieId = $state(0);
  similarMovies: Movie[] = $state([]);
  loading = $state(false);
  loadingSimilarMovies = $state(false);
  movieData: MovieDetails | null = $state(null);
  #movieCache = new SvelteMap<number, MovieDetails>();

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
    this.movieData = null;
    this.isOpen = false;
  };

  private async fetchMovieDetails(movieId: number): Promise<void> {
    try {
      const response = await fetch(`/api/movie/${movieId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        this.movieData = null;
        return;
      }

      const data = await response.json();
      const movieDataRes: MovieDetails = data.movieDetails;

      if (movieDataRes) {
        this.movieData = movieDataRes;
        this.#movieCache.set(movieId, movieDataRes);
      }
    } catch {
      this.movieData = null;
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
    } catch {
      this.similarMovies = [];
    } finally {
      this.loadingSimilarMovies = false;
    }
  }
}

export const [getModalContext, setModalContext] = createContext<ModalStore>();
