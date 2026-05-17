import { browser } from '$app/environment';
import { createContext } from 'svelte';
import { STORAGE_KEYS } from '$lib/constants/storage.constants';

export const createFavoritesStore = () => {
  const key = STORAGE_KEYS.favorites;
  let favorites: Title[] = $state([]);

  if (browser) {
    const stored = localStorage.getItem(key);
    favorites = stored ? (JSON.parse(stored) as Title[]) : [];
  }

  return {
    get favorites() {
      return favorites;
    },

    addToFavorites(title: Title | Title[]) {
      if (Array.isArray(title)) {
        favorites.push(...title);
      } else {
        favorites.push(title);
      }
      localStorage.setItem(key, JSON.stringify(favorites));
    },

    removeFromFavorites(title: Title) {
      favorites = favorites.filter((t) => t.id !== title.id);
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  };
};

type FavoritesStore = ReturnType<typeof createFavoritesStore>;

export const [getFavoritesContext, setFavoritesContext] = createContext<FavoritesStore>();
