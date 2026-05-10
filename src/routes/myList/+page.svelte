<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import { getFavoritesContext } from '$lib/stores/favoriteListStore.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const favoriteList = getFavoritesContext();
  $inspect(favoriteList.favorites, 'favoriteList.favorites');
</script>

<div class="absolute top-36 left-12 flex flex-wrap gap-4">
  {#if favoriteList.favorites.length}
    {#each favoriteList.favorites as favorite (favorite.id)}
      <Card movie={favorite} />
    {/each}
  {:else}
    <p class="text-xl text-white">No movies in your list...</p>
  {/if}
</div>
