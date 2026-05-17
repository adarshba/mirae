<script lang="ts">
  import Play from '@lucide/svelte/icons/play';
  import Pause from '@lucide/svelte/icons/pause';
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import RotateCw from '@lucide/svelte/icons/rotate-cw';
  import SkipForward from '@lucide/svelte/icons/skip-forward';
  import Maximize from '@lucide/svelte/icons/maximize';
  import { getPlayerContext } from '$stores/playerStore.svelte';
  import PlayerControlButton from './PlayerControlButton.svelte';
  import ScrubBar from './ScrubBar.svelte';
  import VolumeControl from './VolumeControl.svelte';
  import SpeedMenu from './SpeedMenu.svelte';
  import SubtitlesMenu from './SubtitlesMenu.svelte';
  import EpisodesMenu from './EpisodesMenu.svelte';
  import PictureInPictureButton from './PictureInPictureButton.svelte';
  import { formatPlayerTime } from './playerTime';
  import { CURRENT_EPISODE_LABEL } from './player.fixtures';

  type Props = {
    onPlayPause: () => void;
    onSeek: (time: number) => void;
    onSeekBy: (delta: number) => void;
    onVolume: (vol: number) => void;
    onMuteToggle: () => void;
    onSpeed: (rate: number) => void;
    onFullscreen: () => void;
    onPip: () => void;
    onNextEpisode: () => void;
  };

  const {
    onPlayPause,
    onSeek,
    onSeekBy,
    onVolume,
    onMuteToggle,
    onSpeed,
    onFullscreen,
    onPip,
    onNextEpisode
  }: Props = $props();

  const player = getPlayerContext();
</script>

<div class="absolute inset-x-0 bottom-0 z-[2] px-10 pb-7">
  <ScrubBar {onSeek} />

  <div class="mt-1.5 flex items-center justify-between">
    <div class="flex items-center gap-[18px]">
      <PlayerControlButton
        onclick={onPlayPause}
        label={player.paused ? 'Play' : 'Pause'}
        tooltip="{player.paused ? 'Play' : 'Pause'} (k)"
        size="lg"
      >
        {#if player.paused}
          <Play size={28} fill="currentColor" />
        {:else}
          <Pause size={28} fill="currentColor" />
        {/if}
      </PlayerControlButton>

      <PlayerControlButton
        onclick={() => onSeekBy(-10)}
        label="Back 10 seconds"
        tooltip="Back 10s (j)"
      >
        <span class="relative inline-flex items-center justify-center">
          <RotateCcw size={22} />
          <span class="absolute -bottom-1 text-[9px] leading-none font-bold">10</span>
        </span>
      </PlayerControlButton>

      <PlayerControlButton
        onclick={() => onSeekBy(10)}
        label="Forward 10 seconds"
        tooltip="Forward 10s (l)"
      >
        <span class="relative inline-flex items-center justify-center">
          <RotateCw size={22} />
          <span class="absolute -bottom-1 text-[9px] leading-none font-bold">10</span>
        </span>
      </PlayerControlButton>

      <PlayerControlButton onclick={onNextEpisode} label="Next Episode" tooltip="Next Episode (n)">
        <SkipForward size={22} fill="currentColor" />
      </PlayerControlButton>

      <VolumeControl {onVolume} {onMuteToggle} />

      <div class="ml-2 text-sm tracking-[0.5px] text-white/90 tabular-nums">
        <span>{formatPlayerTime(player.currentTime)}</span>
        <span class="text-fg-2"> / {formatPlayerTime(player.duration)}</span>
      </div>

      <div class="text-fg-1 ml-2 border-l border-white/20 pl-3 text-sm">
        <div class="text-fg-2 text-[11px] tracking-[1px] uppercase">Episode</div>
        <div class="font-semibold">{CURRENT_EPISODE_LABEL}</div>
      </div>
    </div>

    <div class="flex items-center gap-[18px]">
      <SpeedMenu onSelect={onSpeed} />
      <SubtitlesMenu />
      <EpisodesMenu />
      <PictureInPictureButton onclick={onPip} />
      <PlayerControlButton onclick={onFullscreen} label="Fullscreen" tooltip="Fullscreen (f)">
        <Maximize size={22} />
      </PlayerControlButton>
    </div>
  </div>
</div>
