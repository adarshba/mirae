import { createContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

export class MovieStore {
  popularMovies: Movie[] = $state([]);
  selectedMovie: MovieDetails | null = $state(null);
  private tried = new SvelteSet<number>();

  constructor() {
    $effect(() => {
      if (this.popularMovies.length === 0 || this.selectedMovie) return;
      this.pickRandom();
    });
  }

  pickRandom() {
    // TODO: `tried` is never cleared, so once every popular movie has been picked
    // (e.g. all trailer lookups fail), the Billboard silently stalls. Reset the
    // set when the pool is exhausted instead of returning early.
    const pool = this.popularMovies.filter((m) => !this.tried.has(m.id));
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.tried.add(pick.id);
    this.selectedMovie = pick as MovieDetails;
  }
}

export const [getMoviesContext, setMoviesContext] = createContext<MovieStore>();
