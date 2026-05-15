import { createContext } from 'svelte';

export class MovieCardStore implements CardState {
  isHovered: boolean = $state(false);
  cardId: string | number | null = $state(null);
  position: { x: number; y: number } = $state({ x: 0, y: 0 });
  movie: Movie | null = $state(null);
}

export const [getMovieCardContext, setMovieCardContext] = createContext<MovieCardStore>();
