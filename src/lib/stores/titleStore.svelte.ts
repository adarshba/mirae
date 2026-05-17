import { createContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

export class TitleStore {
  popularTitles: Title[] = $state([]);
  selectedTitle: TitleDetails | null = $state(null);
  private tried = new SvelteSet<number>();

  constructor() {
    $effect(() => {
      if (this.popularTitles.length === 0 || this.selectedTitle) return;
      this.pickRandom();
    });
  }

  pickRandom() {
    let pool = this.popularTitles.filter((t) => !this.tried.has(t.id));
    if (pool.length === 0) {
      if (this.popularTitles.length === 0) return;
      this.tried.clear();
      pool = this.popularTitles;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.tried.add(pick.id);
    this.selectedTitle = pick as TitleDetails;
  }
}

export const [getTitleContext, setTitleContext] = createContext<TitleStore>();
