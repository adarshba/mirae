import { createContext } from "svelte";


export class MovieCardStore implements CardState {
  isHovered: boolean = $state(false);
  cardId: string | number | null = $state(null);
  position: { x: number; y: number; } = $state({ x: 0, y: 0 });
  dimensions: { width: number; height: number; } = $state({ width: 0, height: 0 });
  movie: Movie | null = $state(null);
}

// export const [getMovieCardContext, setMovieCardContext] = createContext<ReturnType<typeof createMovieCardState>>();
export const [getMovieCardContext, setMovieCardContext] = createContext<MovieCardStore>();
