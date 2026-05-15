import { browser } from '$app/environment';
import { createContext } from 'svelte';
import { STORAGE_KEYS } from '$lib/constants';

export const createFavoriteListStore = () => {
  const key = STORAGE_KEYS.favorites;
  let favorites: Movie[] = $state([]);

  if (browser) {
    const movieInLocalStorage = localStorage.getItem(key);
    favorites = movieInLocalStorage ? (JSON.parse(movieInLocalStorage) as Movie[]) : [];
  }

  return {
    get favorites() {
      return favorites;
    },

    addToFavorites(movie: Movie | Movie[]) {
      if (Array.isArray(movie)) {
        favorites.push(...movie);
      } else {
        favorites.push(movie);
      }
      localStorage.setItem(key, JSON.stringify(favorites));
    },

    removeFromFavorites(movie: Movie) {
      favorites = favorites.filter((m) => m.id !== movie.id);
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  };
};

type UseFavoriteListType = ReturnType<typeof createFavoriteListStore>;

export const [getFavoritesContext, setFavoritesContext] = createContext<UseFavoriteListType>();
