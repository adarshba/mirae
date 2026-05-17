<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { goto } from '$app/navigation';
  import { PlayerState, setPlayerContext } from '$stores/playerStore.svelte';
  import PlayerTopBar from './PlayerTopBar.svelte';
  import PlayerControls from './PlayerControls.svelte';
  import UpNextCard from './UpNextCard.svelte';

  type Props = {
    src: string;
    poster?: string;
    showTitle?: string;
    episodeTitle?: string;
    onBack?: () => void;
  };

  const { src, poster, showTitle = '', episodeTitle = '', onBack }: Props = $props();

  const player = new PlayerState();
  setPlayerContext(player);

  $effect(() => {
    player.showTitle = showTitle;
    player.episodeTitle = episodeTitle;
  });

  type PlyrInstance = {
    play: () => Promise<void> | void;
    pause: () => void;
    togglePlay: (toggle?: boolean) => void;
    destroy: () => void;
    on: (event: string, cb: (e?: unknown) => void) => void;
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
    speed: number;
    buffered: number;
    paused: boolean;
    fullscreen: { enter: () => void; exit: () => void; toggle: () => void; active: boolean };
  };

  let plyr: PlyrInstance | null = $state(null);
  let idleTimer: ReturnType<typeof setTimeout> | undefined;

  function markActive() {
    clearTimeout(idleTimer);
    player.controlsVisible = true;
    idleTimer = setTimeout(() => {
      if (!player.paused && player.menuOpen === null) {
        player.controlsVisible = false;
      }
    }, 3000);
  }

  const mountPlyr: Attachment<HTMLVideoElement> = (el) => {
    if (!el) return;
    let destroyed = false;
    let hls: { destroy: () => void } | null = null;

    (async () => {
      const isHls = /\.m3u8($|\?)/i.test(src);

      if (isHls && !el.canPlayType('application/vnd.apple.mpegurl')) {
        const HlsModule = await import('hls.js');
        if (destroyed) return;
        const Hls = HlsModule.default;
        if (Hls.isSupported()) {
          const h = new Hls({ enableWorker: true });
          h.loadSource(src);
          h.attachMedia(el);
          hls = h;
        } else {
          el.src = src;
        }
      } else if (isHls) {
        el.src = src;
      }

      const [PlyrModule] = await Promise.all([import('plyr'), import('plyr/dist/plyr.css')]);
      if (destroyed) return;

      const Plyr = PlyrModule.default!;
      const instance = new Plyr(el, {
        autoplay: true,
        muted: true,
        controls: [],
        clickToPlay: false,
        keyboard: { focused: false, global: false },
        disableContextMenu: true
      }) as unknown as PlyrInstance;

      plyr = instance;

      instance.on('ready', () => {
        player.duration = instance.duration || 0;
        player.volume = instance.volume;
        player.muted = instance.muted;
        player.playbackRate = instance.speed;
        instance.play();
      });
      instance.on('play', () => {
        player.paused = false;
        markActive();
      });
      instance.on('pause', () => {
        player.paused = true;
        player.controlsVisible = true;
      });
      instance.on('timeupdate', () => {
        player.currentTime = instance.currentTime;
      });
      instance.on('playing', () => {
        player.paused = false;
        markActive();
      });
      instance.on('progress', () => {
        player.buffered = instance.buffered || 0;
      });
      instance.on('loadedmetadata', () => {
        player.duration = instance.duration || 0;
      });
      instance.on('volumechange', () => {
        player.volume = instance.volume;
        player.muted = instance.muted;
      });
      instance.on('ratechange', () => {
        player.playbackRate = instance.speed;
      });
      instance.on('ended', () => {
        player.paused = true;
        player.controlsVisible = true;
      });
    })();

    return () => {
      destroyed = true;
      plyr?.destroy();
      plyr = null;
      hls?.destroy();
      hls = null;
    };
  };

  function playPause() {
    plyr?.togglePlay();
  }

  function seek(time: number) {
    if (!plyr) return;
    plyr.currentTime = Math.max(0, Math.min(player.duration || 0, time));
  }

  function seekBy(delta: number) {
    seek((player.currentTime || 0) + delta);
  }

  function setVolume(v: number) {
    if (!plyr) return;
    const next = Math.max(0, Math.min(1, v));
    plyr.volume = next;
    if (next > 0 && plyr.muted) plyr.muted = false;
  }

  function toggleMute() {
    if (!plyr) return;
    plyr.muted = !plyr.muted;
  }

  function setSpeed(rate: number) {
    if (!plyr) return;
    plyr.speed = rate;
  }

  function toggleFullscreen() {
    plyr?.fullscreen.toggle();
  }

  function back() {
    if (onBack) onBack();
    else if (typeof history !== 'undefined' && history.length > 1) history.back();
    else goto('/');
  }

  function nextEpisode() {
    goto('/');
  }

  function togglePip() {
    const video = document.querySelector('.mirae-player video') as HTMLVideoElement | null;
    if (!video) return;
    if (document.pictureInPictureElement) document.exitPictureInPicture();
    else if ('requestPictureInPicture' in video) video.requestPictureInPicture().catch(() => {});
  }

  function onSurfaceClick(e: MouseEvent) {
    if (player.menuOpen) {
      player.menuOpen = null;
      e.preventDefault();
      return;
    }
    playPause();
  }

  function onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        playPause();
        break;
      case 'j':
        e.preventDefault();
        seekBy(-10);
        break;
      case 'l':
        e.preventDefault();
        seekBy(10);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        seekBy(-5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        seekBy(5);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setVolume((player.volume || 0) + 0.05);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setVolume((player.volume || 0) - 0.05);
        break;
      case 'm':
        e.preventDefault();
        toggleMute();
        break;
      case 'f':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'i':
        e.preventDefault();
        togglePip();
        break;
      case 'n':
        e.preventDefault();
        nextEpisode();
        break;
      case 'Escape':
        if (player.menuOpen) {
          player.menuOpen = null;
          e.preventDefault();
        }
        break;
      default:
        if (/^[0-9]$/.test(e.key) && player.duration > 0) {
          e.preventDefault();
          seek((Number(e.key) / 10) * player.duration);
        }
    }
    markActive();
  }

  $effect(() => {
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('mousemove', markActive);
    window.addEventListener('mousedown', markActive);
    markActive();
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('mousemove', markActive);
      window.removeEventListener('mousedown', markActive);
    };
  });

  const chromeRevealed = $derived(player.controlsVisible || player.paused || !!player.menuOpen);
  const cursorClass = $derived(chromeRevealed ? 'cursor-default' : 'cursor-none');
</script>

<div class="mirae-player fixed inset-0 z-[60] overflow-hidden bg-black {cursorClass}">
  <video
    class="absolute inset-0 h-full w-full object-cover"
    src={/\.m3u8($|\?)/i.test(src) ? undefined : src}
    {poster}
    playsinline
    muted
    autoplay
    crossorigin="anonymous"
    {@attach mountPlyr}
  ></video>

  <!-- click absorber: toggles play/pause on bare-area click and closes any open menu -->
  <button
    type="button"
    aria-label="Toggle play"
    class="absolute inset-0 z-[1] cursor-default bg-transparent"
    onclick={onSurfaceClick}
  ></button>

  <div
    class="pointer-events-none absolute inset-0 z-[2] transition-[background-color] duration-[250ms]"
    style:background-color={player.paused ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.18)'}
  ></div>

  <!--
    Chrome wrapper: top gradient + bottom gradient + content.
    Fades out when not idle/paused/menu-open. Gradients render via pseudo elements
    on this container; children re-enable pointer events.
  -->
  <div
    class="chrome pointer-events-none absolute inset-0 z-10 transition-opacity duration-[250ms]"
    class:opacity-100={chromeRevealed}
    class:opacity-0={!chromeRevealed}
  >
    <div class="contents"><PlayerTopBar onBack={back} /></div>

    <UpNextCard onPlayNext={nextEpisode} />

    <PlayerControls
      onPlayPause={playPause}
      onSeek={seek}
      onSeekBy={seekBy}
      onVolume={setVolume}
      onMuteToggle={toggleMute}
      onSpeed={setSpeed}
      onFullscreen={toggleFullscreen}
      onPip={togglePip}
      onNextEpisode={nextEpisode}
    />
  </div>
</div>

<style>
  .chrome::before,
  .chrome::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    pointer-events: none;
  }
  .chrome::before {
    top: 0;
    height: 160px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, transparent 100%);
  }
  .chrome::after {
    bottom: 0;
    height: 240px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, transparent 100%);
  }
  .chrome > :global(*) {
    pointer-events: auto;
  }

  /* Hide Plyr's built-in chrome — we render our own. */
  .mirae-player :global(.plyr) {
    width: 100%;
    height: 100%;
    background: #000;
  }
  .mirae-player :global(.plyr__video-wrapper),
  .mirae-player :global(.plyr video) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }
  .mirae-player :global(.plyr__controls),
  .mirae-player :global(.plyr__control--overlaid),
  .mirae-player :global(.plyr__poster) {
    display: none !important;
  }
</style>
