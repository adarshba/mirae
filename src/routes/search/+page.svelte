<script lang="ts">
  import type { PageProps } from './$types';
  import TitleThumbnail from '$components/TitleThumbnail.svelte';

  const { data }: PageProps = $props();
</script>

<section class="search-page">
  <header class="search-page__header">
    {#if data.searchQuery}
      <p class="text-eyebrow">Search results</p>
      <h1 class="text-h1 search-page__heading">
        {data.searchResult.length} titles for "{data.searchQuery}"
      </h1>
    {:else}
      <h1 class="text-h1 search-page__heading">Search Mirae</h1>
      <p class="text-body-sm">Try a title, actor or genre.</p>
    {/if}
  </header>

  {#if data.searchQuery && data.searchResult.length === 0}
    <p class="search-page__empty">No K-dramas match "{data.searchQuery}" yet.</p>
  {:else if data.searchResult.length}
    <div class="search-page__grid">
      {#each data.searchResult as title (title.id)}
        <TitleThumbnail {title} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .search-page {
    padding: 7rem var(--space-6) var(--space-12);
  }

  .search-page__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
  }

  .search-page__heading {
    margin: 0;
    color: var(--text-primary);
  }

  .search-page__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .search-page__empty {
    margin: var(--space-6) 0;
    color: var(--muted-foreground);
    font-size: 1rem;
  }

  @media (min-width: 640px) {
    .search-page__grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 768px) {
    .search-page {
      padding: 7.5rem var(--space-10) var(--space-12);
    }
    .search-page__grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1100px) {
    .search-page__grid {
      grid-template-columns: repeat(6, 1fr);
    }
  }
</style>
