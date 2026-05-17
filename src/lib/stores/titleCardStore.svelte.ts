import { createContext } from 'svelte';

export class TitleCardStore implements CardState {
  isHovered: boolean = $state(false);
  cardId: string | number | null = $state(null);
  position: { x: number; y: number } = $state({ x: 0, y: 0 });
  title: Title | null = $state(null);
}

export const [getTitleCardContext, setTitleCardContext] = createContext<TitleCardStore>();
