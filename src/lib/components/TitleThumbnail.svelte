<script lang="ts">
  import { fetchTrailer, handleNoImageError, getTmdbPosterUrl } from '$lib/tmdb';
  import { HOVER_DELAY_MS } from '$lib/constants/timing.constants';
  import { getTitleCardContext } from '$stores/titleCardStore.svelte';
  import { getModalContext } from '$stores/modalStore.svelte';
  import { getAuthContext } from '$stores/authStore.svelte';

  const { title }: { title: Title } = $props();
  const cardStore = getTitleCardContext();
  const modalContext = getModalContext();
  const authStore = getAuthContext();
  const isInteractive = $derived(!!authStore.user);

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
    if (cardStore.isHovered && cardStore.cardId === title.id) return;
    hoverTimer = setTimeout(() => {
      const cardRect = cardElement.getBoundingClientRect();
      cardStore.isHovered = true;
      cardStore.title = title;
      cardStore.cardId = title.id;
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
    const trailer = await fetchTrailer(title.id.toString());
    modalContext.openModal(title.id, trailer);
  };

  const imageSrc = $derived(getTmdbPosterUrl(title.backdrop_path ?? title.poster_path));
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
        alt={title.title ?? ''}
        loading="lazy"
      />
    </div>
    {#if title.title}
      <p class="mt-2 mb-0 truncate text-[0.875rem] font-medium text-[color:var(--text-secondary)]">
        {title.title}
      </p>
    {/if}
  </button>
{/if}
