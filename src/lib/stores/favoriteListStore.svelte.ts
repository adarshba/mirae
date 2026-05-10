import { browser } from "$app/environment";
import { createContext, onMount, untrack } from "svelte";


export const createFavoriteListStore = () => {

  const key = 'favorites';
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
        favorites.push(...movie)
      }
      else {
        favorites.push(movie)
        console.debug("added to favorites", movie.title);
      }
      localStorage.setItem(key, JSON.stringify(favorites));
    },

    removeFromFavorites(movie: Movie) {
      favorites = favorites.filter(m => m.id !== movie.id);
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  }
}
type UseFavoriteListType = ReturnType<typeof createFavoriteListStore>;


export const [getFavoritesContext, setFavoritesContext] = createContext<UseFavoriteListType>();

/*
// CLASS BASED IMPLEMENTATION
class UseFavoriteList {
  readonly #key = 'favorites';
  #favorites: Movie[] = $state([]);

  constructor() {
    if (browser) {
      const movieInLocalStorage = localStorage.getItem(this.#key);
      const moviesFavorites: Movie[] = movieInLocalStorage ? JSON.parse(movieInLocalStorage) : [];
      this.#favorites = moviesFavorites;
    }
  }

  get favorites() {
    return this.#favorites;
  }

  addToFavorites = (movie: Movie | Movie[]) => {
    if (Array.isArray(movie)) {
      this.#favorites.push(...movie)
    }
    else {
      this.#favorites.push(movie)
    }
    localStorage.setItem(this.#key, JSON.stringify(this.#favorites));
  }

  removeFromFavorites = (movie: Movie) => {
    this.#favorites = this.#favorites.filter(m => m.id !== movie.id);
    localStorage.setItem(this.#key, JSON.stringify(this.#favorites));
  }

}
*/