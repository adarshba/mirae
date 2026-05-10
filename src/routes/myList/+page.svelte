<script lang="ts">
  import Thumbnail from '$components/Thumbnail.svelte';
  import { getFavoritesContext } from '$stores/favoriteListStore.svelte';

  const favoriteList = getFavoritesContext();
</script>

<div class="absolute top-36 left-12 flex flex-wrap gap-4">
  {#if favoriteList.favorites.length}
    {#each favoriteList.favorites as favorite (favorite.id)}
      <Thumbnail movie={favorite} />
    {/each}
  {:else}
    <p class="text-xl text-white">No movies in your list...</p>
  {/if}
</div>
