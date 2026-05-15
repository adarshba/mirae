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

<section class="home-rows">
  <ContentRow
    title="Top 10 in Korea Today"
    movies={data.trendingMovies.slice(0, 10)}
    variant="top10"
  />
  <ContentRow title="Trending Now" movies={data.trendingMovies} />
  <ContentRow title="New on Mirae" movies={data.newReleases} />
  <ContentRow title="Critically Acclaimed" movies={data.topRatedMovies} />

  {#each data.curatedRows as { id, name: title, movies } (id)}
    {#if movies.length}
      <ContentRow {title} {movies} />
    {/if}
  {/each}
</section>

<style>
  .home-rows {
    position: relative;
    z-index: var(--z-base);
    display: flex;
    flex-direction: column;
    margin-top: -8vh;
    padding-bottom: var(--space-12);
  }

  @media (min-width: 768px) {
    .home-rows {
      margin-top: -12vh;
    }
  }
</style>
