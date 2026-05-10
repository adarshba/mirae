<script lang="ts">
  import HeroSection from '$lib/components/HeroSection.svelte';
  import type { PageProps } from './$types';
  import { getMoviesContext } from '$lib/stores/MovieStore.svelte';
  import Carousel from '$lib/components/Carousel.svelte';

  const { data }: PageProps = $props();
  const movieStore = getMoviesContext();

  $effect(() => {
    movieStore.popularMovies = data.popularMovies;
  });
</script>

<HeroSection />

<div class="absolute top-[35vh] flex w-full flex-col space-y-4 pl-10 md:top-[65vh] lg:top-[85vh]">
  <Carousel title="Popular Movies" movies={data.popularMovies} />
  <Carousel title="Trending Movies" movies={data.trendingMovies} />
  <Carousel title="Top-Rated Movies" movies={data.topRatedMovies} />

  {#each data.moviesByGenre as { id, name: title, movies } (id)}
    <Carousel {title} {movies} />
  {/each}
</div>

<style>
  :global(body) {
    min-height: 200vh;
    color: white;
  }
</style>
