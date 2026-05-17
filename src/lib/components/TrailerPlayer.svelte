<script lang="ts">
  import type { Attachment } from 'svelte/attachments';

  type Props = {
    videoId: string;
    isMuted?: boolean;
  };

  let player: Plyr | null = $state(null);
  let { videoId, isMuted = true }: Props = $props();

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
        controls: [],
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

  $effect(() => {
    if (player) {
      player.muted = isMuted;
    }
  });
</script>

<div class="shadow-card relative overflow-hidden bg-black">
  <div class="absolute inset-0 scale-[1.4]">
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
  :global(:root) {
    --plyr-color-main: var(--color-brand);
    --plyr-video-background: rgba(0, 0, 0, 1);
    --plyr-focus-visible-color: #00b3ff;
  }
</style>
