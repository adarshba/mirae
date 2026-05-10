<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import type { LayoutProps } from './$types';
  import { MovieStore, setMoviesContext } from '$lib/stores/MovieStore.svelte';
  import PopUpCard from '$lib/components/MovieDetailsPopup.svelte';
  import { MovieCardStore, setMovieCardContext } from '$lib/stores/MovieCardStore.svelte';
  import {
    createFavoriteListStore,
    setFavoritesContext
  } from '$lib/stores/favoriteListStore.svelte';
  import Header from '$lib/components/Header.svelte';
  import { ModalStore, setModalContext } from '$lib/stores/ModalStore.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let { children }: LayoutProps = $props();

  const movieStore = new MovieStore();
  const cardStore = new MovieCardStore();
  const favoritesStore = createFavoriteListStore();
  const modalStore = new ModalStore(movieStore);

  setMovieCardContext(cardStore);
  setMoviesContext(movieStore);
  setFavoritesContext(favoritesStore);
  setModalContext(modalStore);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<PopUpCard position={{ x: cardStore.position.x, y: cardStore.position.y + 250 }} />
<Header />
<Modal />
{@render children()}

<style>
</style>
