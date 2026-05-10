<script lang="ts">
  import Billboard from '$components/Billboard.svelte';
  import type { PageProps } from './$types';
  import { getMoviesContext } from '$stores/MovieStore.svelte';
  import ContentRow from '$components/ContentRow.svelte';

  const { data }: PageProps = $props();
  const movieStore = getMoviesContext();

  $effect(() => {
    movieStore.popularMovies = data.popularMovies;
  });
</script>

<Billboard />

<div class="absolute top-[35vh] flex w-full flex-col space-y-4 pl-10 md:top-[65vh] lg:top-[85vh]">
  <ContentRow title="Popular K-Dramas" movies={data.popularMovies} />
  <ContentRow title="Trending Now" movies={data.trendingMovies} />
  <ContentRow title="Top-Rated" movies={data.topRatedMovies} />

  {#each data.moviesByGenre as { id, name: title, movies } (id)}
    <ContentRow {title} {movies} />
  {/each}
</div>

<style>
  :global(body) {
    min-height: 200vh;
    color: white;
  }
</style>
