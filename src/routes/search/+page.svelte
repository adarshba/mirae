<script lang="ts">
  import type { PageProps } from './$types';
  import Thumbnail from '$components/Thumbnail.svelte';

  const { data }: PageProps = $props();
</script>

<div class="absolute top-36 w-screen">
  {#if data.searchQuery === ''}
    <p>Please search with a valid query</p>
  {:else if data.searchResult.length === 0}
    <p class="absolute left-12 text-red-500">No results found for "{data.searchQuery}"</p>
  {:else}
    <div class="absolute left-12 flex flex-wrap gap-4">
      {#each data.searchResult as movie (movie.id)}
        <Thumbnail {movie} />
      {/each}
    </div>
  {/if}
</div>
