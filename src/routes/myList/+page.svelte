<script lang="ts">
  import Thumbnail from '$components/Thumbnail.svelte';
  import { getFavoritesContext } from '$stores/favoriteListStore.svelte';
  import type { PageProps } from './$types';
  import X from '@lucide/svelte/icons/x';

  const { data }: PageProps = $props();
  const favoriteList = getFavoritesContext();

  const removeFavorite = (movie: Movie, event: MouseEvent) => {
    event.stopPropagation();
    favoriteList.removeFromFavorites(movie);
  };
</script>

<section class="my-list">
  <header class="my-list__header">
    <p class="text-eyebrow">Saved by you</p>
    <h1 class="text-h1 my-list__heading">My List</h1>
    <p class="text-body-sm">Pick up where you left off — your favorites live here.</p>
  </header>

  {#if favoriteList.favorites.length}
    <div class="my-list__grid">
      {#each favoriteList.favorites as favorite (favorite.id)}
        <div class="my-list__card">
          <Thumbnail movie={favorite} />
          <button
            type="button"
            class="my-list__remove"
            aria-label="Remove from My List"
            onclick={(event) => removeFavorite(favorite, event)}
          >
            <X size={16} />
          </button>
        </div>
      {/each}
    </div>
  {:else}
    <div class="my-list__empty">
      <p class="text-h3 my-list__empty-title">Your list is empty</p>
      <p class="text-body-sm my-list__empty-sub">
        Add titles from any K-drama card to save them here.
      </p>
    </div>

    {#if data.suggestions.length}
      <div class="my-list__suggested">
        <h2 class="text-h3 my-list__suggested-heading">Suggested for you</h2>
        <div class="my-list__grid">
          {#each data.suggestions.slice(0, 12) as movie (movie.id)}
            <Thumbnail {movie} />
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</section>

<style>
  .my-list {
    padding: 7rem var(--space-6) var(--space-12);
  }

  .my-list__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
  }

  .my-list__heading {
    margin: 0;
    color: var(--text-primary);
  }

  .my-list__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .my-list__card {
    position: relative;
  }

  .my-list__remove {
    position: absolute;
    top: var(--space-2);
    right: var(--space-2);
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.7);
    color: var(--text-primary);
    cursor: pointer;
    opacity: 0;
    transition:
      opacity var(--duration-fast, 150ms) ease,
      background-color var(--duration-fast, 150ms) ease;
  }

  .my-list__card:hover .my-list__remove,
  .my-list__remove:focus-visible {
    opacity: 1;
  }

  .my-list__remove:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  .my-list__empty {
    margin-top: var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-8);
    border: 1px dashed var(--line);
    border-radius: var(--radius-lg);
    text-align: center;
  }

  .my-list__empty-title {
    margin: 0;
    color: var(--text-primary);
  }

  .my-list__empty-sub {
    margin: 0;
    color: var(--muted-foreground);
  }

  .my-list__suggested {
    margin-top: var(--space-10);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .my-list__suggested-heading {
    margin: 0;
    color: var(--text-primary);
  }

  @media (min-width: 640px) {
    .my-list__grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 768px) {
    .my-list {
      padding: 7.5rem var(--space-10) var(--space-12);
    }
    .my-list__grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1100px) {
    .my-list__grid {
      grid-template-columns: repeat(6, 1fr);
    }
  }
</style>
