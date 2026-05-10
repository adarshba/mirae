<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import type { Attachment } from 'svelte/attachments';

  type Props = {
    videoId: string;
    isMuted?: boolean;
    showControls?: boolean;
  };

  let player: Plyr | null = $state(null);
  let { videoId, isMuted = true, showControls = false }: Props = $props();

  const videoPlayer: Attachment<HTMLDivElement> = (element) => {
    if (!element) return;

    initPlayer();
    async function initPlayer() {
      const [PlyrModule] = await Promise.all([import('plyr'), import('plyr/dist/plyr.css')]);

      const Plyr = PlyrModule.default!;

      player = new Plyr(element, {
        autoplay: true,
        disableContextMenu: true,
        muted: isMuted,
        controls: showControls
          ? [
              'play-large',
              'restart',
              'rewind',
              'play',
              'fast-forward',
              'progress',
              'current-time',
              'duration',
              'mute',
              'volume',
              'captions',
              'settings',
              'pip',
              'airplay',
              'download',
              'fullscreen'
            ]
          : [],
        youtube: {
          modestBranding: 1,
          rel: 0,
          iv_load_policy: 3
        }
      });
      player.on('ready', () => {
        player?.play();
      });
      player.on('error', (event) => {
        console.error('Plyr error:', event);
      });
    }

    return () => {
      player?.destroy();
    };
  };

  // Detect changes to isMuted and update the player's muted state accordingly
  $effect(() => {
    if (player) {
      player.muted = isMuted;
    }
  });
</script>

<div
  class={[
    { 'flex h-screen items-center justify-center': showControls, 'h-full': !showControls },
    'relative overflow-hidden bg-black shadow-lg'
  ]}
>
  <div
    class={showControls
      ? 'flex aspect-video w-[90%] scale-[1.4] justify-center'
      : 'absolute inset-0 scale-[1.4]'}
  >
    <div
      id="player"
      class="h-full w-full"
      data-plyr-provider="youtube"
      data-plyr-embed-id={videoId}
      {@attach videoPlayer}
    ></div>
  </div>
</div>

<style>
  /* src/lib/PlyrCustom.css */

  /* Custom Plyr variables to style the player */
  :root {
    --plyr-color-main: #ff000078;
    --plyr-video-background: rgba(0, 0, 0, 1);
    --plyr-focus-visible-color: #00b3ff;
    --plyr-badge-background: #4a5464;
    --plyr-badge-text-color: #ffffff;
    --plyr-captions-background: rgba(0, 0, 0, 0.8);
    --plyr-captions-text-color: #ffffff;
    --plyr-control-icon-size: 24px;
    --plyr-control-spacing: 12px;
    --plyr-control-radius: 6px;
    --plyr-control-toggle-checked-background: #ff0000;
    --plyr-video-controls-background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.85));
    --plyr-video-control-color: #6d6d6d;
    --plyr-video-control-color-hover: #ff0000;
    --plyr-video-control-background-hover: #ffffff;
    --plyr-menu-background: rgba(255, 255, 255, 0.9);
    --plyr-menu-color: #000000;
    --plyr-tooltip-background: rgba(255, 255, 255, 0.9);
    --plyr-tooltip-color: #000000;
    --plyr-font-family: 'Arial', sans-serif;
    --plyr-font-size-base: 16px;
    --plyr-font-weight-bold: 600;
  }
  /*
  .plyr--video {
    height: 20px !important;
  }
  
  .plyr__spinner {
    border-top-color: var(--plyr-color-main);
  }

  .plyr__progress__filled {
    background-color: var(--plyr-color-main);
  }


  .plyr__menu__container {
    background-color: var(--plyr-menu-background);
  }
  .plyr__menu__item {
    color: var(--plyr-menu-color);
  }


  .mute-button {
   
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
    cursor: pointer;
  }

  .mute-button:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

 
  .mute-button {
    cursor: pointer;
  }

  */
</style>
