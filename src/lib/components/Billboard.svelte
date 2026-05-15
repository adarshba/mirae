<script lang="ts">
  import Check from '@lucide/svelte/icons/check';
  import Play from '@lucide/svelte/icons/play';
  import Plus from '@lucide/svelte/icons/plus';
  import Volume2 from '@lucide/svelte/icons/volume-2';
  import VolumeOff from '@lucide/svelte/icons/volume-off';
  import { getMoviesContext } from '$stores/MovieStore.svelte';
  import { goto } from '$app/navigation';
  import { fetchTrailer } from '$utils/helpers';
  import VideoPlayer from '$components/VideoPlayer.svelte';
  import { getFavoritesContext } from '$stores/favoriteListStore.svelte';
  import { getAuthContext } from '$stores/AuthStore.svelte';

  const movieStore = getMoviesContext();
  const selectedMovie = $derived(movieStore.selectedMovie);
  let trailerId = $state('');
  let isMuted = $state(true);

  const favorites = getFavoritesContext();
  const authStore = getAuthContext();
  const isInteractive = $derived(!!authStore.user);

  const handlePlay = () => {
    if (!selectedMovie) return;
    if (!isInteractive) {
      goto('/login');
      return;
    }
    goto(`/watch/${selectedMovie.id}`);
  };

  const year = $derived(selectedMovie?.release_date?.slice(0, 4) ?? '');
  const rating = $derived(selectedMovie?.vote_average ?? 0);
  const matchPct = $derived(rating > 0 ? Math.round(rating * 10) : 0);
  const isListed = $derived(
    !!selectedMovie && favorites.favorites.some((m) => m.id === selectedMovie.id)
  );

  const toggleList = () => {
    if (!selectedMovie) return;
    if (!isInteractive) {
      goto('/login');
      return;
    }
    if (isListed) favorites.removeFromFavorites(selectedMovie);
    else favorites.addToFavorites(selectedMovie);
  };

  $effect(() => {
    if (!selectedMovie?.id) return;
    trailerId = '';
    fetchTrailer(selectedMovie.id.toString()).then((key) => {
      if (key) {
        trailerId = key;
      } else {
        movieStore.pickRandom();
      }
    });
  });

  const toggleMute = () => {
    isMuted = !isMuted;
  };
</script>

<section class="relative h-[92vh] min-h-[36rem] overflow-hidden">
  <div class="absolute inset-0">
    {#if selectedMovie?.backdrop_path}
      <img
        class="h-full w-full object-cover"
        src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
        alt={selectedMovie.title ?? ''}
      />
    {/if}
    {#if trailerId}
      <div class="absolute inset-0">
        <VideoPlayer videoId={trailerId} {isMuted} />
      </div>
    {/if}
  </div>

  <div
    class="pointer-events-none absolute inset-0"
    style="background-image:linear-gradient(to top, var(--bg-app) 0%, rgba(10,10,11,0.6) 30%, rgba(10,10,11,0.1) 60%, transparent 100%);"
  ></div>
  <div
    class="pointer-events-none absolute inset-0"
    style="background-image:linear-gradient(to left, rgba(10,10,11,0.7) 0%, rgba(10,10,11,0.25) 40%, transparent 70%);"
  ></div>

  {#if selectedMovie}
    <div
      class="absolute bottom-[18%] left-6 z-10 flex max-w-[38rem] flex-col gap-4 md:bottom-[22%] md:left-12 md:gap-5 lg:max-w-[42rem]"
    >
      <h1
        class="text-display m-0 text-[color:var(--text-primary)]"
        style="text-shadow:0 4px 24px rgba(0,0,0,0.6);"
      >
        {selectedMovie.title}
      </h1>

      <div
        class="flex flex-wrap items-center gap-3 text-[0.875rem] font-medium text-[color:var(--text-secondary)]"
      >
        {#if matchPct > 0}
          <span class="badge-match">{matchPct}% Match</span>
        {/if}
        {#if year}<span>{year}</span>{/if}
        <span class="badge-rating">16+</span>
        <span class="text-[color:var(--muted-foreground)]">·</span>
        <span>Korea</span>
        <span
          class="inline-block rounded-sm border border-[color:var(--border-default)] px-1 text-[0.6875rem] leading-[1.4] font-bold tracking-[0.06em] text-[color:var(--text-secondary)]"
        >
          HD
        </span>
      </div>

      <p
        class="text-body m-0 hidden text-[color:var(--text-secondary)] md:block md:text-[1.05rem] md:leading-[1.55]"
        style="text-shadow:0 2px 8px rgba(0,0,0,0.5);"
      >
        {selectedMovie.overview ?? ''}
      </p>

      <div class="mt-3 flex flex-wrap items-center gap-3">
        <button class="btn btn-primary" onclick={handlePlay}>
          <Play size={20} fill="currentColor" />
          <span class="text-button">Play</span>
        </button>

        {#if isInteractive}
          <button class="btn btn-secondary" onclick={toggleList} aria-pressed={isListed}>
            {#if isListed}
              <Check size={20} />
              <span class="text-button">In My List</span>
            {:else}
              <Plus size={20} />
              <span class="text-button">My List</span>
            {/if}
          </button>
        {/if}
      </div>
    </div>

    <div class="absolute right-0 bottom-[22%] z-10 flex items-center gap-4 md:bottom-[26%]">
      <button class="btn-icon" aria-label={isMuted ? 'Unmute' : 'Mute'} onclick={toggleMute}>
        {#if isMuted}
          <VolumeOff size={18} />
        {:else}
          <Volume2 size={18} />
        {/if}
      </button>
      <div
        class="border-l-[3px] border-white/60 bg-black/50 py-2 pr-4 pl-3 text-[0.8125rem] font-semibold tracking-[0.06em] text-[color:var(--text-primary)]"
      >
        16+
      </div>
    </div>
  {/if}
</section>
