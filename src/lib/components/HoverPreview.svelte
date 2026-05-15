<script lang="ts">
  import Play from '@lucide/svelte/icons/play';
  import Plus from '@lucide/svelte/icons/plus';
  import Check from '@lucide/svelte/icons/check';
  import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Volume2 from '@lucide/svelte/icons/volume-2';
  import VolumeOff from '@lucide/svelte/icons/volume-off';
  import VideoPlayer from '$components/VideoPlayer.svelte';
  import { fetchTrailer, handleNoImageError } from '$utils/helpers';
  import { getMovieCardContext } from '$stores/MovieCardStore.svelte';
  import { goto } from '$app/navigation';
  import { getFavoritesContext } from '$stores/favoriteListStore.svelte';
  import { page } from '$app/state';
  import { getModalContext } from '$stores/ModalStore.svelte';

  let { position }: { position: PopupPosition } = $props();

  const cardStore = getMovieCardContext();
  const modalContext = getModalContext();
  const favoriteList = getFavoritesContext();

  let trailerUrl = $state('');
  let isMuted = $state(true);

  const movie = $derived(cardStore.movie);
  const isHovered = $derived(cardStore.isHovered);
  const title = $derived(movie?.title ?? '');
  const imageUrl = $derived(
    movie?.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      : movie?.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : ''
  );
  const movieId = $derived(movie?.id ?? -1);
  const matchPct = $derived(
    movie?.vote_average ? Math.round((movie.vote_average as number) * 10) : 0
  );
  const year = $derived(movie?.release_date?.slice(0, 4) ?? '');
  const addedToFavorites = $derived(favoriteList.favorites.some((fav) => fav.id === movie?.id));

  const edgePadding = 220;
  const popupAlign = $derived.by(() => {
    if (typeof window === 'undefined') return 'center';
    if (position.x < edgePadding) return 'left';
    if (window.innerWidth - position.x < edgePadding) return 'right';
    return 'center';
  });
  const popupX = $derived.by(() => {
    if (typeof window === 'undefined') return position.x;
    if (popupAlign === 'left') return position.x + 60;
    if (popupAlign === 'right') return position.x - 60;
    return position.x;
  });

  $effect(() => {
    const id = movie?.id;
    if (!id) {
      trailerUrl = '';
      return;
    }
    let cancelled = false;
    fetchTrailer(id.toString()).then((key) => {
      if (!cancelled) trailerUrl = key;
    });
    return () => {
      cancelled = true;
      trailerUrl = '';
    };
  });

  const hidePopover = () => {
    cardStore.isHovered = false;
    cardStore.movie = null;
    cardStore.cardId = null;
  };

  const toggleMute = () => {
    isMuted = !isMuted;
  };

  const navigateToWatchPage = () => {
    goto(`/watch/${movieId}`);
  };

  const toggleFavorites = () => {
    if (!movie) return;
    if (addedToFavorites) {
      favoriteList.removeFromFavorites(movie);
      if (page.url.pathname === '/myList') hidePopover();
      return;
    }
    favoriteList.addToFavorites(movie);
  };
</script>

<svelte:window onscroll={() => hidePopover()} />

<div
  class="hover-preview bg-card border-line shadow-card pointer-events-none fixed flex w-[22rem] flex-col overflow-hidden rounded-[var(--radius-lg)] border text-white opacity-0 transition-[transform,opacity] duration-300 ease-(--ease-standard)"
  class:is-open={isHovered}
  data-align={popupAlign}
  style="--hp-x: {popupX}px; --hp-y: {position.y}px; top: var(--hp-y); left: var(--hp-x);"
  onmouseenter={() => (cardStore.isHovered = true)}
  onmouseleave={hidePopover}
  role="presentation"
>
  <div class="relative aspect-video w-full overflow-hidden bg-black">
    {#if imageUrl}
      <img
        class="absolute inset-0 h-full w-full object-cover"
        src={imageUrl}
        alt={title}
        onerror={handleNoImageError}
      />
    {:else}
      <div
        class="bg-card-2 text-fg-2 absolute inset-0 flex h-full w-full items-center justify-center"
      >
        <span class="text-sm">No preview available</span>
      </div>
    {/if}

    {#if trailerUrl && isHovered}
      <div class="pointer-events-none absolute inset-0">
        <VideoPlayer videoId={trailerUrl} {isMuted} />
      </div>
    {/if}

    <div
      class="pointer-events-none absolute inset-0"
      style="background-image:linear-gradient(to top, rgba(26,26,29,0.85), transparent 55%);"
    ></div>

    <p
      class="absolute bottom-2 left-3 z-10 m-0 text-base font-extrabold tracking-[-0.01em] text-white"
      style="text-shadow:0 1px 6px rgba(0,0,0,0.7);"
    >
      {title.length > 28 ? title.substring(0, 28) + '…' : title}
    </p>

    <button
      type="button"
      class="btn-icon absolute right-2 bottom-2 z-10 !h-[1.875rem] !w-[1.875rem]"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
      onclick={toggleMute}
    >
      {#if isMuted}
        <VolumeOff size={16} />
      {:else}
        <Volume2 size={16} />
      {/if}
    </button>
  </div>

  <div class="flex flex-col gap-3 p-4">
    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <button
          class="bg-brand shadow-brand inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 text-white transition-transform duration-150 ease-(--ease-standard) hover:scale-105"
          aria-label="Play"
          onclick={navigateToWatchPage}
          type="button"
        >
          <Play size={18} fill="currentColor" />
        </button>

        <button
          class="btn-icon"
          aria-label={addedToFavorites ? 'Remove from list' : 'Add to list'}
          onclick={toggleFavorites}
          type="button"
        >
          {#if addedToFavorites}
            <Check size={16} />
          {:else}
            <Plus size={16} />
          {/if}
        </button>

        <button class="btn-icon" aria-label="Like" type="button">
          <ThumbsUp size={16} />
        </button>
      </div>

      <button
        class="btn-icon"
        aria-label="More info"
        onclick={() => modalContext.openModal(movieId, trailerUrl)}
        type="button"
      >
        <ChevronDown size={16} />
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2 text-[0.8125rem]">
      {#if matchPct > 0}
        <span class="badge-match">{matchPct}% Match</span>
      {/if}
      <span class="badge-rating">13+</span>
      {#if year}<span class="text-fg-1 font-semibold">{year}</span>{/if}
      <span class="badge-rating">HD</span>
    </div>

    <p class="text-fg-1 m-0 text-[0.8125rem]">
      <span class="text-brand font-semibold">Witty</span> ·
      <span class="text-brand font-semibold">Heartfelt</span> ·
      <span class="text-brand font-semibold">Drama</span>
    </p>
  </div>
</div>

<style>
  .hover-preview {
    z-index: 60;
    transform-origin: center bottom;
    transform: translate(-50%, -100%) scale(0.4);
    transition-delay: 0ms, 0ms;
  }
  .hover-preview[data-align='left'] {
    transform-origin: left bottom;
    transform: translate(-30%, -100%) scale(0.4);
  }
  .hover-preview[data-align='right'] {
    transform-origin: right bottom;
    transform: translate(-70%, -100%) scale(0.4);
  }
  .hover-preview.is-open {
    transform: translate(-50%, -100%) scale(1);
    opacity: 1;
    pointer-events: auto;
    transition-delay: 60ms, 0ms;
  }
  .hover-preview[data-align='left'].is-open {
    transform: translate(-30%, -100%) scale(1);
  }
  .hover-preview[data-align='right'].is-open {
    transform: translate(-70%, -100%) scale(1);
  }
</style>
