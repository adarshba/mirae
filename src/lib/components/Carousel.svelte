<script lang="ts">
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Card from '$lib/components/Card.svelte';

  let { title = '', movies = [] }: Props = $props();
  let scrollAmount = $state(320);
  let carouselContainer: HTMLDivElement | null = $state(null);
  let scrollPosition = $state(0);

  const scrollLeft = () => {
    if (carouselContainer) {
      scrollPosition = Math.max(0, scrollPosition - scrollAmount);
      carouselContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (carouselContainer) {
      scrollPosition += scrollAmount;
      carouselContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (carouselContainer) {
      scrollPosition = carouselContainer.scrollLeft;
    }
  };

  type Props = {
    title: string;
    movies: Movie[];
  };
</script>

<div class="carousel-wrapper">
  <h1 class="mt-4 mb-2 text-2xl font-semibold text-white">{title}</h1>

  <div class="carousel-container-wrapper relative">
    {#if scrollPosition > 0}
      <button onclick={scrollLeft} class="carousel-button carousel-button-left">
        <ChevronLeft />
      </button>
    {/if}
    {#if carouselContainer && scrollPosition + carouselContainer.clientWidth < carouselContainer.scrollWidth}
      <button onclick={scrollRight} class="carousel-button carousel-button-right">
        <ChevronRight />
      </button>
    {/if}

    <div bind:this={carouselContainer} class="carousel-container" onscroll={handleScroll}>
      {#each movies as movie (movie.id)}
        <div class="carousel-item">
          <Card {movie} />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .carousel-wrapper {
    position: relative;
  }

  .carousel-container-wrapper {
    position: relative;
  }

  .carousel-container {
    overflow-x: auto;
    display: flex;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .carousel-container::-webkit-scrollbar {
    display: none;
  }

  .carousel-item {
    scroll-snap-align: center;
    flex: 0 0 auto;
    margin-right: 1rem;
  }

  .carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 1rem;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.3s ease;
  }

  .carousel-button-left {
    left: 0;
    height: 100%;
  }

  .carousel-button-right {
    right: 0;
    height: 100%;
  }
</style>
