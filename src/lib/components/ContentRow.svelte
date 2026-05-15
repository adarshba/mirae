<script lang="ts">
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Thumbnail from '$components/Thumbnail.svelte';

  type Props = {
    title: string;
    movies: Movie[];
    variant?: 'default' | 'top10';
  };

  let { title = '', movies = [], variant = 'default' }: Props = $props();

  let trackEl = $state<HTMLDivElement | null>(null);
  let scrollPosition = $state(0);
  let trackWidth = $state(0);
  let trackScrollWidth = $state(0);

  const canScrollLeft = $derived(scrollPosition > 4);
  const canScrollRight = $derived(scrollPosition + trackWidth + 4 < trackScrollWidth);

  const scrollBy = (direction: -1 | 1) => {
    if (!trackEl) return;
    const amount = Math.max(320, trackEl.clientWidth * 0.85);
    trackEl.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!trackEl) return;
    scrollPosition = trackEl.scrollLeft;
    trackWidth = trackEl.clientWidth;
    trackScrollWidth = trackEl.scrollWidth;
  };

  $effect(() => {
    if (!trackEl) return;
    trackWidth = trackEl.clientWidth;
    trackScrollWidth = trackEl.scrollWidth;
  });

  const isTop10 = $derived(variant === 'top10');
  const trackCols = $derived(
    isTop10 ? 'grid-cols-[repeat(auto-fill,21rem)] sm:grid-cols-[repeat(auto-fill,25rem)]' : ''
  );
  const navBase =
    'absolute top-0 bottom-0 z-10 flex w-12 cursor-pointer items-center justify-center border-0 bg-black/55 text-[color:var(--text-primary)] opacity-0 transition-[opacity,background-color] duration-(--duration-fast,150ms) ease-(--ease-standard) group-hover:opacity-100 hover:bg-black/85';
</script>

<section class="relative mb-8 px-6 sm:px-10">
  <h2 class="text-h2 mb-3 text-[color:var(--text-primary)]">{title}</h2>

  <div class="group relative">
    {#if canScrollLeft}
      <button
        type="button"
        aria-label="Scroll left"
        onclick={() => scrollBy(-1)}
        class="{navBase} left-0 rounded-r-md"
      >
        <ChevronLeft size={32} />
      </button>
    {/if}
    {#if canScrollRight}
      <button
        type="button"
        aria-label="Scroll right"
        onclick={() => scrollBy(1)}
        class="{navBase} right-0 rounded-l-md"
      >
        <ChevronRight size={32} />
      </button>
    {/if}

    <div
      bind:this={trackEl}
      onscroll={handleScroll}
      class="no-scrollbar grid [scroll-snap-type:x_proximity] grid-flow-col gap-3 overflow-x-auto py-2 {isTop10
        ? '[grid-auto-columns:21rem] sm:[grid-auto-columns:25rem]'
        : '[grid-auto-columns:12rem] sm:[grid-auto-columns:14rem] lg:[grid-auto-columns:15rem]'} {trackCols}"
    >
      {#each movies as movie, index (movie.id)}
        <div class="snap-start {isTop10 ? 'grid grid-cols-[38%_62%] items-center gap-1' : ''}">
          {#if isTop10}
            <span
              class="translate-x-3 leading-[0.85] font-black tracking-[-0.06em] text-[color:var(--bg-app)] select-none"
              style="font-size:clamp(7rem,12vw,11rem);-webkit-text-stroke:3px var(--line);"
              aria-hidden="true"
            >
              {index + 1}
            </span>
          {/if}
          <Thumbnail {movie} />
        </div>
      {/each}
    </div>
  </div>
</section>
