<script lang="ts">
  import { page } from '$app/state';
  import VideoPlayer from '$components/VideoPlayer.svelte';
  import { getMovieCardContext } from '$stores/MovieCardStore.svelte';
  import { fetchTrailer } from '$lib/helpers';

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

      movieCardState.isHovered = false;
      movieCardState.movie = null;
      movieCardState.position = { x: -500, y: 0 };

      (async () => {
        loading = true;
        error = '';
        videoId = null;
        const key = await fetchTrailer(movieId);
        if (key) videoId = key;
        else error = 'No Trailer Found...';
        loading = false;
      })();
    }
  });
</script>

<main class="watch-page">
  {#if loading}
    <p class="watch-page__message">Loading Trailer...</p>
  {:else if videoId}
    <VideoPlayer {videoId} isMuted={false} showControls={true} />
  {:else if error}
    <p class="watch-page__message">{error}</p>
  {:else}
    <p class="watch-page__message">No Trailer Found...</p>
  {/if}
</main>

<style>
  .watch-page {
    min-height: 100vh;
    background-color: var(--bg-immersive);
  }

  .watch-page__message {
    position: absolute;
    top: 7rem;
    left: var(--space-12);
    color: var(--text-primary);
  }
</style>
