<script lang="ts">
  import Billboard from '$components/Billboard.svelte';
  import type { PageProps } from './$types';
  import { getTitleContext } from '$stores/titleStore.svelte';
  import TitleRow from '$components/TitleRow.svelte';

  const { data }: PageProps = $props();
  const titleStore = getTitleContext();

  $effect(() => {
    titleStore.popularTitles = data.popularTitles;
  });
</script>

<Billboard />

<section class="home-rows">
  <TitleRow
    title="Top 10 in Korea Today"
    titles={data.trendingTitles.slice(0, 10)}
    variant="top10"
  />
  <TitleRow title="Trending Now" titles={data.trendingTitles} />
  <TitleRow title="New on Mirae" titles={data.newReleases} />
  <TitleRow title="Critically Acclaimed" titles={data.topRatedTitles} />

  {#each data.curatedRows as { id, name: title, titles } (id)}
    {#if titles.length}
      <TitleRow {title} {titles} />
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
