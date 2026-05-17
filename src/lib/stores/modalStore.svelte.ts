import { createContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

export class ModalStore implements ModalState {
  isOpen = $state(false);
  trailerId = $state('');
  titleId = $state(0);
  similarTitles: Title[] = $state([]);
  loadingSimilarTitles = $state(false);
  titleData: TitleDetails | null = $state(null);
  #titleCache = new SvelteMap<number, TitleDetails>();

  openModal = (titleId: number, trailerUrl: string) => {
    this.titleId = titleId;
    this.trailerId = trailerUrl;

    const cached = this.#titleCache.get(titleId);

    if (cached) {
      this.titleData = cached;
      this.isOpen = true;
      return;
    }

    this.fetchTitleDetails(titleId);
    this.fetchSimilarTitles(titleId);
  };

  closeModal = () => {
    this.titleId = 0;
    this.trailerId = '';
    this.titleData = null;
    this.isOpen = false;
  };

  private async fetchTitleDetails(titleId: number): Promise<void> {
    try {
      const response = await fetch(`/api/title/${titleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        this.titleData = null;
        return;
      }

      const data = await response.json();
      const details: TitleDetails = data.titleDetails;

      if (details) {
        this.titleData = details;
        this.#titleCache.set(titleId, details);
      }
    } catch {
      this.titleData = null;
    } finally {
      this.isOpen = true;
    }
  }

  private async fetchSimilarTitles(titleId: number): Promise<void> {
    if (titleId === 0) return;
    this.loadingSimilarTitles = true;

    try {
      const response = await fetch(`/api/title/${titleId}/similar`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      this.similarTitles = (data.similarTitles as Title[]) || [];
    } catch {
      this.similarTitles = [];
    } finally {
      this.loadingSimilarTitles = false;
    }
  }
}

export const [getModalContext, setModalContext] = createContext<ModalStore>();
