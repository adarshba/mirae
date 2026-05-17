<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import type { LayoutProps } from './$types';
  import { TitleStore, setTitleContext } from '$stores/titleStore.svelte';
  import TitleHoverPreview from '$components/TitleHoverPreview.svelte';
  import { TitleCardStore, setTitleCardContext } from '$stores/titleCardStore.svelte';
  import { createFavoritesStore, setFavoritesContext } from '$stores/favoritesStore.svelte';
  import Navbar from '$components/Navbar.svelte';
  import Footer from '$components/Footer.svelte';
  import { ModalStore, setModalContext } from '$stores/modalStore.svelte';
  import TitleDetailsModal from '$components/TitleDetailsModal.svelte';
  import { AccountStore, setAccountContext } from '$stores/accountStore.svelte';
  import { AuthStore, setAuthContext } from '$stores/authStore.svelte';
  import { DeviceStore, setDeviceContext } from '$stores/deviceStore.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { AUTH_ROUTES, PROTECTED_ROUTES } from '$lib/constants/routes.constants';
  import { HOVER_PREVIEW_Y_OFFSET_PX } from '$lib/constants/timing.constants';

  let { children }: LayoutProps = $props();

  const titleStore = new TitleStore();
  const cardStore = new TitleCardStore();
  const favoritesStore = createFavoritesStore();
  const modalStore = new ModalStore();
  const accountStore = new AccountStore();
  const authStore = new AuthStore();
  const deviceStore = new DeviceStore();

  setTitleCardContext(cardStore);
  setTitleContext(titleStore);
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
  const isWatchRoute = $derived(page.url.pathname.startsWith('/watch'));
  const isMinimalLayout = $derived(isAuthRoute || isWatchRoute);

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
  <TitleHoverPreview
    position={{ x: cardStore.position.x, y: cardStore.position.y + HOVER_PREVIEW_Y_OFFSET_PX }}
  />
  <Navbar />
  <TitleDetailsModal />
{/if}
<main class="app-main">
  {@render children()}
</main>
{#if !isMinimalLayout}
  <Footer />
{/if}
