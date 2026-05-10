<script lang="ts">
  import { getMovieCardContext } from '$lib/stores/MovieCardStore.svelte';

  let divElement: HTMLDivElement | null = $state(null);
  let clientRectState: DOMRect | null = $state(null);

  const movieCardState = getMovieCardContext();
  movieCardState.movie = { id: 1, title: 'Test Movie', backdrop_path: '/test.jpg' };
  movieCardState.isHovered = true;
  movieCardState.position = { x: 100, y: 100 };

  const onmouseenter = () => {
    if (divElement) {
      clientRectState = divElement.getBoundingClientRect();
      divElement.style.left = Math.floor(Math.random() * 1401) + 'px';
    }
  };
</script>

<h1>Test</h1>

{#if clientRectState}
  <p>{JSON.stringify(clientRectState, null, 2)}</p>
{:else}
  <p>Move your mouse over the box to see its client rect.</p>
{/if}

<p>{JSON.stringify(movieCardState.movie, null, 2)}</p>
<div role="presentation" bind:this={divElement} id="container" {onmouseenter}></div>

<style>
  :root {
    color: white;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 18px;
  }
  h1 {
    font-size: 2em;
    text-align: center;
    margin: 10px 0;
  }
  p {
    margin: 10px;
    white-space: pre-wrap;
  }

  #container {
    position: relative;
    top: 0;
    left: 200px;
    width: 200px;
    height: 200px;
    background-color: #967b7b;
  }
</style>
