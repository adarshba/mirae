<script lang="ts">
  import Info from '@lucide/svelte/icons/info';
  import Play from '@lucide/svelte/icons/play';
  import Volume2 from '@lucide/svelte/icons/volume-2';
  import VolumeOff from '@lucide/svelte/icons/volume-off';
  import { getMoviesContext } from '$lib/stores/MovieStore.svelte';
  import { goto } from '$app/navigation';
  import { fetchTrailer } from '$lib/helpers';
  import Player from './Player.svelte';
  import { getModalContext } from '$lib/stores/ModalStore.svelte';

  const { popularMovies, selectedMovie } = $derived(getMoviesContext());
  let trailerId: string = $state('');
  let isMuted: boolean = $state(true);

  const modalContext = getModalContext();

  $effect(() => {
    if (!selectedMovie?.id) return;

    loadTrailer();

    async function loadTrailer() {
      const movieId = selectedMovie!.id!.toString();
      const trailer = await fetchTrailer(movieId);
      trailerId = trailer;
    }
  });

  const toggleMute = () => {
    isMuted = !isMuted;
  };
</script>

<main class="relative h-screen overflow-hidden">
  {#if trailerId}
    <Player videoId={trailerId} {isMuted} />
  {/if}

  {#if selectedMovie && !trailerId}
    <img
      src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
      alt="movie backdrop"
    />
  {/if}
  <!-- Gradient overlay -->
  <div class="to transparent absolute inset-0 bg-linear-to-t from-[#141414]"></div>

  <!-- Movie Details -->
  {#if selectedMovie}
    <div class="absolute top-[45%] z-10 w-full pl-12">
      <h1 class="mb-4 text-4xl font-bold text-white md:text-6xl">{selectedMovie.title}</h1>
      <p class="mb-6 hidden max-w-lg text-sm text-gray-300 md:block md:text-lg">
        {selectedMovie.overview?.substring(0, 200) + '...'}
      </p>
      <div class="flex flex-wrap items-center">
        <div class="flex gap-4">
          <button
            class="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-black transition hover:bg-gray-200"
            onclick={() => goto(`/watch/${selectedMovie.id}`)}
          >
            <Play size={20} />
            <span class="cursor-pointer font-semibold">Play</span>
          </button>

          <button
            class="flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-600"
            onclick={() => modalContext.openModal(selectedMovie.id!, trailerId)}
          >
            <Info size={20} />
            <span class="cursor-pointer font-semibold">More Info</span>
          </button>
        </div>

        <div class="absolute right-0 flex items-center gap-4">
          <button
            class="flex items-center gap-2 rounded-full border-2 p-4 text-white transition"
            onclick={toggleMute}
          >
            {#if isMuted}
              <VolumeOff size={20} />
            {:else}
              <Volume2 size={20} />
            {/if}
          </button>

          <div class="bg-opacity-60 border-l-2 bg-gray-600 px-3 py-2 text-white">
            {#if selectedMovie.adult}
              <span>18+</span>
            {:else}
              <span>13+</span>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>
