<script lang="ts">
  import { fetchTrailer, handleNoImageError } from '$utils/helpers';
  import { getMovieCardContext } from '$stores/MovieCardStore.svelte';
  import { getModalContext } from '$stores/ModalStore.svelte';
  import { getAuthContext } from '$stores/AuthStore.svelte';

  const { movie }: { movie: Movie } = $props();
  const cardStore = getMovieCardContext();
  const modalContext = getModalContext();
  const authStore = getAuthContext();
  const isInteractive = $derived(!!authStore.user);

  const HOVER_DELAY_MS = 400;
  let hoverTimer: ReturnType<typeof setTimeout> | null = null;

  const clearHoverTimer = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  };

  const showPopover = (e: MouseEvent) => {
    const cardElement = e.currentTarget as HTMLElement;
    clearHoverTimer();
    if (cardStore.isHovered && cardStore.cardId === movie.id) return;
    hoverTimer = setTimeout(() => {
      const cardRect = cardElement.getBoundingClientRect();
      cardStore.isHovered = true;
      cardStore.movie = movie;
      cardStore.cardId = movie.id;
      cardStore.position = {
        x: cardRect.left + cardRect.width / 2,
        y: cardRect.top
      };
    }, HOVER_DELAY_MS);
  };

  const hidePopover = () => {
    clearHoverTimer();
    cardStore.isHovered = false;
  };

  const openDetails = async () => {
    clearHoverTimer();
    cardStore.isHovered = false;
    const trailer = await fetchTrailer(movie.id.toString());
    modalContext.openModal(movie.id, trailer);
  };

  const imageSrc = $derived(
    movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      : movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : ''
  );
</script>

{#if imageSrc}
  <button
    type="button"
    disabled={!isInteractive}
    class="group pointer-events-auto relative w-full border-0 bg-transparent p-0 text-left text-inherit transition-transform duration-(--duration-fast,150ms) ease-(--ease-standard) {isInteractive
      ? 'cursor-pointer hover:-translate-y-0.5'
      : 'cursor-default'}"
    onmouseenter={isInteractive ? showPopover : undefined}
    onmouseleave={isInteractive ? hidePopover : undefined}
    onclick={isInteractive ? openDetails : undefined}
  >
    <div
      class="relative aspect-video w-full overflow-hidden rounded-md bg-[color:var(--bg-elevated)] shadow-[var(--shadow-sm)]"
    >
      <img
        class="block h-full w-full object-cover transition-transform duration-(--duration-base,300ms) ease-(--ease-standard) {isInteractive
          ? 'group-hover:scale-[1.04]'
          : ''}"
        onerror={handleNoImageError}
        src={imageSrc}
        alt={movie.title ?? ''}
        loading="lazy"
      />
    </div>
    {#if movie.title}
      <p class="mt-2 mb-0 truncate text-[0.875rem] font-medium text-[color:var(--text-secondary)]">
        {movie.title}
      </p>
    {/if}
  </button>
{/if}
