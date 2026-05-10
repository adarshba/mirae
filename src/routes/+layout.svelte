<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import type { LayoutProps } from './$types';
  import { MovieStore, setMoviesContext } from '$stores/MovieStore.svelte';
  import HoverPreview from '$components/HoverPreview.svelte';
  import { MovieCardStore, setMovieCardContext } from '$stores/MovieCardStore.svelte';
  import { createFavoriteListStore, setFavoritesContext } from '$stores/favoriteListStore.svelte';
  import Navbar from '$components/Navbar.svelte';
  import { ModalStore, setModalContext } from '$stores/ModalStore.svelte';
  import ShowDetails from '$components/ShowDetails.svelte';

  let { children }: LayoutProps = $props();

  const movieStore = new MovieStore();
  const cardStore = new MovieCardStore();
  const favoritesStore = createFavoriteListStore();
  const modalStore = new ModalStore();

  setMovieCardContext(cardStore);
  setMoviesContext(movieStore);
  setFavoritesContext(favoritesStore);
  setModalContext(modalStore);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<HoverPreview position={{ x: cardStore.position.x, y: cardStore.position.y + 250 }} />
<Navbar />
<ShowDetails />
{@render children()}

<style>
</style>
