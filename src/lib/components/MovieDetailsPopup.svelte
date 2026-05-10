<script lang="ts">
  import Play from '@lucide/svelte/icons/play';
  import Plus from '@lucide/svelte/icons/plus';
  import Check from '@lucide/svelte/icons/check';
  import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Volume2 from '@lucide/svelte/icons/volume-2';
  import VolumeOff from '@lucide/svelte/icons/volume-off';
  import Player from '$lib/components/Player.svelte';
  import type PlayerComponent from '$lib/components/Player.svelte';
  import { fetchTrailer, handleNoImageError } from '$lib/helpers';
  import { getMovieCardContext } from '$lib/stores/MovieCardStore.svelte';
  import { goto } from '$app/navigation';
  import { getFavoritesContext } from '$lib/stores/favoriteListStore.svelte';
  import { page } from '$app/state';
  import { getModalContext } from '$lib/stores/ModalStore.svelte';

  let { position }: Props = $props();

  let { movie, isHovered } = $derived(getMovieCardContext());
  const modalContext = getModalContext();

  let isTrailerDisplayed = $state(false);
  let trailerUrl = $state('');
  let title: string = $derived(movie?.title ?? 'no title');
  let imageUrl: string = $derived(`https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`);
  let movieId: number = $derived(movie?.id ?? -1);
  const favoriteList = getFavoritesContext();
  const addedToFavorites = $derived(favoriteList.favorites.some((fav) => fav.id === movie?.id));

  let player: PlayerComponent | null = $state(null);
  let isMuted = $state(true);

  $effect(() => {
    if (movie) {
      loadTrailer();
    }

    async function loadTrailer() {
      if (!movie?.id) return;

      trailerUrl = await fetchTrailer(movie.id.toString());
      isTrailerDisplayed = true;
    }

    return () => {
      trailerUrl = '';
      isTrailerDisplayed = false;
    };
  });

  const displayPopover = (e: MouseEvent) => {
    e.stopPropagation();

    isHovered = true;
  };
  const hidePopover = (e?: MouseEvent) => {
    e?.stopPropagation();

    if (isHovered || movie || isTrailerDisplayed) {
      isHovered = false;
      movie = null;
      isTrailerDisplayed = false;
    }
  };
  const toggleMute = () => {
    isMuted = !isMuted;
  };

  const handleImageMouseEnter = () => {
    isTrailerDisplayed = !isTrailerDisplayed;
  };
  const handleImageMouseEnterAction = () => {
    isTrailerDisplayed = true;
  };

  const toggleMuteAction = () => {
    if (player) {
      isMuted = !isMuted;
    }
  };

  const navigateToWatchPage = () => {
    goto(`watch/${movieId}`);
  };

  const toggleFavorites = () => {
    if (!movie) return;

    if (addedToFavorites) {
      favoriteList.removeFromFavorites(movie);
      if (page.url.pathname === '/myList') {
        hidePopover();
      }
      return;
    }
    favoriteList.addToFavorites(movie);
  };

  type Props = {
    position: {
      x: number;
      y: number;
    };
  };
</script>

<svelte:window onscroll={() => hidePopover()} />

<div
  class={[
    'popup-card z-40 flex flex-col text-white transition-all duration-300',
    {
      'popup-scale-up opacity-100': isHovered,
      'popup-scale-down opacity-0': !isHovered,
      hidden: !isHovered
    }
  ]}
  style="position: fixed; top:{position.y}px ; left:{position.x < 200
    ? position.x + 60
    : window?.innerWidth - position.x < 200
      ? position.x - 60
      : position.x}px; width:350px ;z-index:1000;overflow:hidden"
  onmouseenter={displayPopover}
  onmouseleave={hidePopover}
  role="presentation"
>
  <div class="relative w-full">
    <div class="flex items-center">
      <p class="absolute top-36 left-2 z-50 text-xl font-semibold text-ellipsis">
        {title.length > 25 ? title.substring(0, 25) + '...' : title}
      </p>

      <span
        role="presentation"
        onclick={toggleMute}
        class="absolute top-36 right-4 z-50 cursor-pointer rounded-full border-2 border-gray-700 p-3 transition-colors duration-200 hover:border-white"
      >
        {#if isMuted}
          <VolumeOff size={20} class="cursor-pointer" />
        {:else}
          <Volume2 size={20} class="cursor-pointer" />
        {/if}
      </span>
    </div>
    {#if trailerUrl && isHovered && isTrailerDisplayed}
      <div class="pointer-events-none relative aspect-video overflow-hidden">
        <Player bind:this={player} videoId={trailerUrl} {isMuted} />
      </div>
    {:else if imageUrl && isHovered}
      <img
        class="h-50 w-full object-cover"
        src={imageUrl}
        alt="Poster"
        onerror={handleNoImageError}
        onmouseenter={handleImageMouseEnter}
      />
    {:else}
      <div class="flex h-50 w-full items-center justify-center bg-gray-500">
        <span class="text-sm text-white">No Image Available</span>
      </div>
    {/if}
  </div>

  <div
    role="presentation"
    onmouseenter={handleImageMouseEnterAction}
    class="flex items-center justify-between p-4"
  >
    <!-- Action Buttons -->
    <div class="flex space-x-2">
      <button
        onclick={navigateToWatchPage}
        class="rounded-full border-2 border-gray-700 p-3 transition-colors duration-200 hover:border-white"
        ><Play class="h-6 w-6 cursor-pointer text-white" />
      </button>

      <button
        onclick={toggleFavorites}
        class="rounded-full border-2 border-gray-700 p-3 transition-colors duration-200 hover:border-white"
      >
        {#if addedToFavorites}
          <Check class="h-6 w-6 cursor-pointer text-white" />
        {:else}
          <Plus class="h-6 w-6 cursor-pointer text-white" />
        {/if}
      </button>

      <button
        class="rounded-full border-2 border-gray-700 p-3 transition-colors duration-200 hover:border-white"
      >
        <ThumbsUp class="h-6 w-6 cursor-pointer text-white" />
      </button>
    </div>

    <button
      class="rounded-full border-2 border-gray-700 p-3 transition-colors duration-200 hover:border-white"
      onclick={() => modalContext.openModal(movieId, trailerUrl)}
    >
      <ChevronDown class="h-6 w-6 cursor-pointer text-white" />
    </button>
  </div>
  <!-- Movie Info -->
  <div class="p-4">
    <div class="flex gap-3">
      <span class="text-green-400">70% Match</span>
      <span class="rounded-sm border-2 border-gray-600 text-sm">13 +</span>
      <span class="font-bold">21m</span>
      <span class="rounded-sm border-2 border-gray-600 text-sm">HD</span>
    </div>
    <div class="mt-2 flex space-x-2 text-lg">
      <span>Witty • Heartflet • Drama</span>
    </div>
  </div>
</div>

<style>
  .popup-card {
    background-color: rgb(20, 20, 20);

    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 2px 1px 1px,
      rgba(0, 0, 0, 0.14) 0px 1px 1px 0px,
      rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;

    background-image: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05));

    border-radius: 8px;
    transform-origin: center;
  }

  .popup-scale-down {
    transform: translate(-50%, -100%) scale(0.1);
  }

  .popup-scale-up {
    transform: translate(-50%, -100%) scale(1);
    opacity: 1;
  }

  .transition-all {
    transition:
      transform 0.3s ease 0.1s,
      opacity 0.3s ease;
  }
</style>
