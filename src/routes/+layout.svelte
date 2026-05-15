<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import type { LayoutProps } from './$types';
  import { MovieStore, setMoviesContext } from '$stores/MovieStore.svelte';
  import HoverPreview from '$components/HoverPreview.svelte';
  import { MovieCardStore, setMovieCardContext } from '$stores/MovieCardStore.svelte';
  import { createFavoriteListStore, setFavoritesContext } from '$stores/favoriteListStore.svelte';
  import Navbar from '$components/Navbar.svelte';
  import Footer from '$components/Footer.svelte';
  import { ModalStore, setModalContext } from '$stores/ModalStore.svelte';
  import ShowDetails from '$components/ShowDetails.svelte';
  import { AccountStore, setAccountContext } from '$stores/AccountStore.svelte';
  import { AuthStore, setAuthContext } from '$stores/AuthStore.svelte';
  import { DeviceStore, setDeviceContext } from '$stores/DeviceStore.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { AUTH_ROUTES, PROTECTED_ROUTES, HOVER_PREVIEW_Y_OFFSET_PX } from '$lib/constants';

  let { children }: LayoutProps = $props();

  const movieStore = new MovieStore();
  const cardStore = new MovieCardStore();
  const favoritesStore = createFavoriteListStore();
  const modalStore = new ModalStore();
  const accountStore = new AccountStore();
  const authStore = new AuthStore();
  const deviceStore = new DeviceStore();

  setMovieCardContext(cardStore);
  setMoviesContext(movieStore);
  setFavoritesContext(favoritesStore);
  setModalContext(modalStore);
  setAccountContext(accountStore);
  setAuthContext(authStore);
  setDeviceContext(deviceStore);

  $effect(() => {
    deviceStore.loadForUser(authStore.user?.uid ?? null);
  });

  const isAuthRoute = $derived(AUTH_ROUTES.some((p) => page.url.pathname.startsWith(p)));
  const isProtectedRoute = $derived(PROTECTED_ROUTES.some((p) => page.url.pathname.startsWith(p)));
  const isMinimalLayout = $derived(isAuthRoute);

  $effect(() => {
    if (!authStore.ready) return;
    if (!authStore.user && isProtectedRoute) {
      const from = page.url.pathname + page.url.search;
      goto(`/login?from=${encodeURIComponent(from)}`, { replaceState: true });
    } else if (authStore.user && isAuthRoute) {
      goto('/', { replaceState: true });
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} type="image/svg+xml" />
  <title>Mirae · K-Drama Streaming</title>
</svelte:head>
{#if !isMinimalLayout}
  <HoverPreview
    position={{ x: cardStore.position.x, y: cardStore.position.y + HOVER_PREVIEW_Y_OFFSET_PX }}
  />
  <Navbar />
  <ShowDetails />
{/if}
<main class="app-main">
  {@render children()}
</main>
{#if !isMinimalLayout}
  <Footer />
{/if}
