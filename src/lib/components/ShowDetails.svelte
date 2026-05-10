<script lang="ts">
  import { goto } from '$app/navigation';
  import Play from '@lucide/svelte/icons/play';
  import Plus from '@lucide/svelte/icons/plus';
  import Check from '@lucide/svelte/icons/check';
  import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
  import Volume2 from '@lucide/svelte/icons/volume-2';
  import VolumeOff from '@lucide/svelte/icons/volume-off';
  import VideoPlayer from '$components/VideoPlayer.svelte';
  import { convertMinsToHrs } from '$utils/helpers';
  import { getModalContext } from '$stores/ModalStore.svelte';
  import { browser } from '$app/environment';
  import { getFavoritesContext } from '$stores/favoriteListStore.svelte';
  import RelatedCard from '$components/RelatedCard.svelte';

  const modalContext = getModalContext();
  const { favorites, addToFavorites } = $derived(getFavoritesContext());

  $effect(() => {
    if (browser) {
      if (modalContext.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    return () => {
      if (browser) {
        document.body.style.overflow = '';
      }
    };
  });

  const addedToFav = $derived(favorites.some((fav) => fav.id === modalContext.movieId));
  let isMuted = $state(true);

  const toggleMute = () => {
    isMuted = !isMuted;
  };
</script>

{#if modalContext.isOpen}
  <div class="overlay">
    <div
      role="presentation"
      class="modal-content w-[90%] md:w-[80%] lg:w-[50%]"
      onclick={(event) => {
        event.stopPropagation();
      }}
    >
      <button class="close-button" onclick={modalContext.closeModal} aria-label="Close Modal">
        &times;
      </button>

      <div class="content">
        {#if modalContext.trailerId}
          <div class="pointer-events-none relative aspect-video overflow-hidden">
            <div
              class="absolute inset-0 bottom-0 z-30 bg-linear-to-t from-[#141414] to-transparent"
            ></div>

            <div class="pointer-events-auto absolute bottom-0 left-6 z-50 w-[90%] md:left-12">
              <p class="mb-4 text-4xl font-bold text-white">
                {modalContext.movieData?.original_title}
              </p>

              <div class="flex w-full justify-between">
                <div class="flex h-40 items-center gap-4">
                  <button
                    class="flex items-center gap-2 rounded-md bg-white px-8 py-1 text-xl font-bold text-black transition-all hover:bg-gray-200"
                    onclick={() => {
                      goto(`/watch/${modalContext.movieId}`);
                      modalContext.closeModal();
                    }}
                  >
                    <Play size={20} class="cursor-pointer" />
                    <span class="hidden cursor-pointer font-semibold md:block">Play</span>
                  </button>

                  <button
                    class="rounded-full border-2 border-gray-700 p-3 transition-colors duration-200 hover:border-white"
                    onclick={() => addToFavorites(modalContext.movieData!)}
                  >
                    {#if addedToFav}
                      <Check class="h-6 w-6 cursor-pointer text-white" />
                    {:else}
                      <Plus class="h-6 w-6 cursor-pointer text-white" />
                    {/if}
                  </button>

                  <button
                    class="rounded-full border-2 border-gray-700 p-3 transition-colors duration-200 hover:border-white"
                  >
                    <ThumbsUp class="h-6 w-6 cursor-pointer text-white" />
                  </button>
                  <button
                    onclick={toggleMute}
                    class="rounded-full border-2 border-gray-700 p-3 transition-colors duration-200 hover:border-white"
                  >
                    {#if isMuted}
                      <VolumeOff class="h-6 w-6 cursor-pointer text-white" />
                    {:else}
                      <Volume2 class="h-6 w-6 cursor-pointer text-white" />
                    {/if}
                  </button>
                </div>
              </div>
            </div>
            {#if modalContext.trailerId}
              <VideoPlayer videoId={modalContext.trailerId} {isMuted} />
            {:else}
              <div class="flex h-64 items-center justify-center bg-gray-800">
                <p class="text-white">Video Unavailable...</p>
              </div>
            {/if}
          </div>
        {:else}
          <div class="flex h-64 items-center justify-center bg-gray-800">
            <p class="text-white">Video not available for this movie...</p>
          </div>
        {/if}

        <div class="relative px-6 pt-6 md:px-12">
          <div
            class="absolute inset-0 bottom-0 z-30 h-5 bg-linear-to-b from-[#141414] to-transparent"
          ></div>
          <div class="flex flex-col lg:flex-row">
            <div class="flex flex-1 items-center gap-3">
              <span class="text-green-400">
                {modalContext.movieData?.vote_average
                  ? `${(modalContext.movieData?.vote_average * 10).toFixed(0)}% Match`
                  : 'N/A'}
              </span>
              <span class="rounded-sm border-2 border-gray-600 text-sm">
                {modalContext.movieData?.adult ? '18+' : '13+'}
              </span>

              <span class="font-bold">
                {modalContext.movieData?.runtime
                  ? convertMinsToHrs(modalContext.movieData.runtime)
                  : 'N/A'}
              </span>

              <span class="rounded-sm border-2 border-gray-700 text-sm">4K</span>
            </div>

            <div class="flex-1 flex-col">
              <div class="flex lg:ml-40">
                {#if Array.isArray(modalContext?.movieData?.genres) && modalContext.movieData.genres.length > 0}
                  <span class="font-semibold">Genre:&nbsp;</span>
                  {#each modalContext.movieData.genres.slice(0, 3) as genre (genre.id)}
                    <span class="mr-2">{genre.name}</span>
                  {/each}
                {:else}
                  <span class="font-semibold">Genre: N/A</span>
                {/if}
              </div>

              <div class="mt-2 flex lg:ml-40">
                <span class="font-semibold">Available in: &nbsp;</span>
                {#if Array.isArray(modalContext?.movieData?.spoken_languages) && modalContext.movieData.spoken_languages.length > 0}
                  {#each modalContext.movieData.spoken_languages as lang (lang.iso_639_1)}
                    <span class="mr-2">{lang.name}</span>
                  {/each}
                {:else}
                  <span class="font-semibold">N/A</span>
                {/if}
              </div>
            </div>
          </div>

          <div class="relative mt-2 w-full lg:w-1/2">
            <p>
              {modalContext.movieData?.overview || 'No overview is available for the movie.'}
            </p>
          </div>

          {#if modalContext.loadingSimilarMovies}
            <div class="mt-4">
              <p class="text-center">Loading Similar Movies...</p>
            </div>
          {:else if modalContext.similarMovies.length === 0}
            <div class="mt-4">
              <p class="text-center text-red-500">Similar Movies Not Found...</p>
            </div>
          {:else if modalContext.similarMovies.length > 0}
            <div>
              <h1 class="my-4 text-2xl font-bold">More Like This</h1>
              <div class="flex flex-wrap justify-center gap-x-4 gap-y-8 sm:justify-between">
                {#each modalContext.similarMovies.slice(0, 12) as similarMovie (similarMovie.id)}
                  <RelatedCard
                    id={similarMovie.id}
                    title={similarMovie.title!}
                    description={similarMovie.overview!}
                    imageUrl={`https://image.tmdb.org/t/p/w500${similarMovie.backdrop_path}`}
                  />
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 4rem;
    z-index: 50;
  }

  .content {
    position: relative;
    background-color: rgb(20, 20, 20);
    color: white;
    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 2px 1px 1px,
      rgba(0, 0, 0, 0.14) 0px 1px 1px 0px,
      rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
    background-image: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05));
  }

  .modal-content {
    background-color: white;
    position: relative;
    max-height: 90vh;
    height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
  }

  .modal-content::-webkit-scrollbar {
    width: 0;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .close-button {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    height: 1.5rem;
    width: 1rem;
    font-size: 1.2rem;
    top: 0.75rem;
    right: 0.75rem;
    background: black;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    z-index: 50;
  }
</style>
