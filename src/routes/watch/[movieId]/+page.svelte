<script lang="ts">
  import { page } from '$app/state';
  import Player from '$lib/components/Player.svelte';
  import { getMovieCardContext } from '$lib/stores/MovieCardStore.svelte';

  const {
    params: { movieId }
  } = $derived(page);
  const movieCardState = getMovieCardContext();

  let videoId: string | null = $state(null);
  let loading = $state(false);
  let error = $state('');

  let fetchedMovieId: string | null = $state(null);

  $effect(() => {
    if (movieId && movieId !== fetchedMovieId) {
      fetchedMovieId = movieId;

      // reset the movie card state when navigating to a new movie page
      movieCardState.isHovered = false;
      movieCardState.movie = null;
      movieCardState.position = { x: -500, y: 0 };

      (async () => {
        loading = true;
        error = '';
        videoId = null;
        try {
          const response = await fetch(`/api/trailer/${movieId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch video trailer');
          }
          const data = await response.json();

          if (data.trailer && data.trailer.key) {
            videoId = data.trailer.key;
          } else {
            error = 'No Trailer Found...';
          }
        } catch (error) {
          error = 'No Trailer Found...';
        } finally {
          loading = false;
        }
      })();
    }
  });
</script>

<div class="h-screen bg-black">
  {#if loading}
    <p class="absolute top-28 left-12 w-full text-white">Loading Trailer...</p>
  {:else if videoId}
    <Player {videoId} isMuted={false} showControls={true} />
  {:else if error}
    <p class="absolute top-28 left-12 w-full text-white">{error}</p>
  {:else}
    <p class="absolute top-28 left-12 w-full text-white">No Trailer Found...</p>
  {/if}
</div>
