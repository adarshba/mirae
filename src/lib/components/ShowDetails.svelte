<script lang="ts">
  import { goto } from '$app/navigation';
  import Play from '@lucide/svelte/icons/play';
  import Plus from '@lucide/svelte/icons/plus';
  import Check from '@lucide/svelte/icons/check';
  import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
  import Volume2 from '@lucide/svelte/icons/volume-2';
  import VolumeOff from '@lucide/svelte/icons/volume-off';
  import X from '@lucide/svelte/icons/x';
  import VideoPlayer from '$components/VideoPlayer.svelte';
  import {
    convertMinsToHrs,
    tmdbBackdrop,
    tmdbPoster,
    matchPercent,
    releaseYear
  } from '$utils/helpers';
  import { getModalContext } from '$stores/ModalStore.svelte';
  import { browser } from '$app/environment';
  import { getFavoritesContext } from '$stores/favoriteListStore.svelte';
  import RelatedCard from '$components/RelatedCard.svelte';

  const modalContext = getModalContext();
  const { favorites, addToFavorites } = $derived(getFavoritesContext());

  let isMuted = $state(true);

  const data = $derived(modalContext.movieData);
  const matchPct = $derived(matchPercent(data?.vote_average));
  const year = $derived(releaseYear(data?.release_date));
  const addedToFav = $derived(favorites.some((fav) => fav.id === modalContext.movieId));
  // FIXME: the "Add to list" button below always calls addToFavorites, so clicking
  // when addedToFav is true creates a duplicate. Should branch on addedToFav and
  // call favorites.removeFromFavorites instead — see HoverPreview.svelte for the
  // correct toggle pattern.

  $effect(() => {
    if (!browser) return;
    document.body.style.overflow = modalContext.isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });

  const toggleMute = () => {
    isMuted = !isMuted;
  };

  const playMovie = () => {
    goto(`/watch/${modalContext.movieId}`);
    modalContext.closeModal();
  };
</script>

{#if modalContext.isOpen}
  <div class="modal-overlay" role="presentation" onclick={modalContext.closeModal}>
    <div
      class="bg-card border-line no-scrollbar relative max-h-[90vh] w-[min(95vw,56rem)] overflow-y-auto rounded-[var(--radius-xl)] border text-white shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => {
        if (e.key === 'Escape') modalContext.closeModal();
      }}
    >
      <button
        class="border-line absolute top-3 right-3 z-50 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-black/85 text-white transition-colors duration-150 ease-(--ease-standard) hover:bg-[var(--color-card-2)]"
        onclick={modalContext.closeModal}
        aria-label="Close"
        type="button"
      >
        <X size={18} />
      </button>

      <div class="relative aspect-video overflow-hidden bg-black">
        {#if modalContext.trailerId}
          <VideoPlayer videoId={modalContext.trailerId} {isMuted} />
        {:else if data?.backdrop_path}
          <img
            class="h-full w-full object-cover"
            src={tmdbBackdrop(data.backdrop_path)}
            alt={data?.title ?? ''}
          />
        {:else}
          <div class="text-fg-2 flex h-full w-full items-center justify-center">
            <span class="text-sm">No preview available</span>
          </div>
        {/if}

        <div
          class="pointer-events-none absolute inset-0"
          style="background-image:linear-gradient(to top, var(--color-card) 0%, rgba(26,26,29,0.6) 25%, transparent 60%);"
        ></div>

        <div class="absolute right-6 bottom-5 left-6 z-50 md:right-8 md:left-8">
          <h1
            class="m-0 mb-4 text-3xl leading-tight font-extrabold tracking-tight text-white md:text-4xl"
            style="text-shadow:0 2px 12px rgba(0,0,0,0.7);"
          >
            {data?.title ?? ''}
          </h1>
          <div class="flex items-center gap-3">
            <button
              class="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border-0 bg-white px-5 py-3 font-bold text-black transition-colors duration-150 ease-(--ease-standard) hover:bg-white/85"
              onclick={playMovie}
              type="button"
            >
              <Play size={20} fill="currentColor" />
              <span>Play</span>
            </button>

            <button
              class="btn-icon"
              aria-label={addedToFav ? 'Remove from list' : 'Add to list'}
              onclick={() => data && addToFavorites(data)}
              type="button"
            >
              {#if addedToFav}
                <Check size={18} />
              {:else}
                <Plus size={18} />
              {/if}
            </button>

            <button class="btn-icon" aria-label="Like" type="button">
              <ThumbsUp size={18} />
            </button>

            {#if modalContext.trailerId}
              <button
                class="btn-icon ml-auto"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                onclick={toggleMute}
                type="button"
              >
                {#if isMuted}
                  <VolumeOff size={18} />
                {:else}
                  <Volume2 size={18} />
                {/if}
              </button>
            {/if}
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8">
        <div class="mb-8 grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr] md:gap-8">
          <div>
            <div class="text-fg-1 mb-4 flex flex-wrap items-center gap-3 text-sm">
              {#if matchPct > 0}<span class="badge-match">{matchPct}% Match</span>{/if}
              {#if year}<span class="text-fg-1 font-semibold">{year}</span>{/if}
              <span class="badge-rating">{data?.adult ? '18+' : '13+'}</span>
              {#if data?.runtime}
                <span class="font-bold">{convertMinsToHrs(data.runtime)}</span>
              {/if}
              <span class="badge-rating">HD</span>
            </div>

            <p class="m-0 text-base leading-relaxed text-white">
              {data?.overview || 'No overview available.'}
            </p>
          </div>

          <aside class="flex flex-col gap-3 text-sm">
            {#if data?.genres?.length}
              <div class="flex flex-wrap gap-2">
                <span class="text-fg-2">Genres:</span>
                <span class="text-white">
                  {data.genres
                    .slice(0, 3)
                    .map((g) => g.name)
                    .join(', ')}
                </span>
              </div>
            {/if}
            {#if data?.spoken_languages?.length}
              <div class="flex flex-wrap gap-2">
                <span class="text-fg-2">Languages:</span>
                <span class="text-white">
                  {data.spoken_languages.map((l) => l.name).join(', ')}
                </span>
              </div>
            {/if}
            {#if data?.production_countries?.length}
              <div class="flex flex-wrap gap-2">
                <span class="text-fg-2">Origin:</span>
                <span class="text-white">
                  {data.production_countries.map((c) => c.name).join(', ')}
                </span>
              </div>
            {/if}
          </aside>
        </div>

        {#if modalContext.loadingSimilarMovies}
          <p class="text-fg-2 mt-4 text-center">Loading similar titles…</p>
        {:else if modalContext.similarMovies.length > 0}
          <section class="mt-4">
            <h2 class="m-0 mb-4 text-2xl font-bold tracking-tight text-white">More Like This</h2>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
              {#each modalContext.similarMovies.slice(0, 9) as similarMovie (similarMovie.id)}
                <RelatedCard
                  id={similarMovie.id}
                  title={similarMovie.title!}
                  description={similarMovie.overview!}
                  imageUrl={tmdbPoster(similarMovie.backdrop_path)}
                />
              {/each}
            </div>
          </section>
        {/if}
      </div>
    </div>
  </div>
{/if}
