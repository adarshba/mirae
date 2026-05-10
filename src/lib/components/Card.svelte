<script lang="ts">
  import { handleNoImageError } from '$lib/helpers';
  import { getMovieCardContext } from '$lib/stores/MovieCardStore.svelte';

  const { movie }: Props = $props();
  const cardStore = getMovieCardContext();

  const showPopover = (e: MouseEvent) => {
    const cardElement = e.currentTarget as HTMLElement;
    const cardRect = cardElement.getBoundingClientRect();

    if (cardStore.isHovered && cardStore.cardId === movie.id) {
      return;
    }
    cardStore.isHovered = true;
    cardStore.movie = movie;
    cardStore.cardId = movie.id;
    cardStore.position = {
      x: cardRect.left + cardRect.width / 2,
      y: cardRect.top
    };
  };

  const hidePopover = (e: MouseEvent) => {
    cardStore.isHovered = false;
    // Add delay before hiding to allow mouse to move to popup
    // timeout = setTimeout(() => {
    //   if (cardStore.cardId === movie.id) {
    //   }
    // }, 550);
  };

  type Props = {
    movie: Movie;
  };
</script>

{#if movie.backdrop_path}
  <div
    role="presentation"
    onmouseleave={hidePopover}
    onmouseenter={showPopover}
    class="card pointer-events-auto relative w-36 sm:w-56"
  >
    <img
      onerror={handleNoImageError}
      src={`https://image.tmdb.org/t/p/w300${movie.backdrop_path}`}
      alt={movie.title}
    />
  </div>
{/if}

<style>
  .card {
    cursor: pointer;
    color: white;
    opacity: 1;
    position: relative;
  }

  .card img {
    width: 100%;
    display: block;
  }
</style>
