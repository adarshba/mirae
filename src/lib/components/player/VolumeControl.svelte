<script lang="ts">
  import Volume2 from '@lucide/svelte/icons/volume-2';
  import VolumeX from '@lucide/svelte/icons/volume-x';
  import { getPlayerContext } from '$stores/playerStore.svelte';
  import PlayerControlButton from './PlayerControlButton.svelte';

  type Props = {
    onVolume: (v: number) => void;
    onMuteToggle: () => void;
  };

  const { onVolume, onMuteToggle }: Props = $props();
  const player = getPlayerContext();

  const displayVolume = $derived(player.muted ? 0 : player.volume);
  const isOff = $derived(player.muted || player.volume === 0);
</script>

<div class="group/vol flex items-center gap-2">
  <PlayerControlButton
    onclick={onMuteToggle}
    label={player.muted ? 'Unmute' : 'Mute'}
    tooltip="Volume (m)"
  >
    {#if isOff}
      <VolumeX size={22} />
    {:else}
      <Volume2 size={22} />
    {/if}
  </PlayerControlButton>

  <div
    class="relative h-1 w-0 overflow-hidden rounded-full bg-white/30 transition-[width] duration-[250ms] ease-(--ease-standard) group-focus-within/vol:w-20 group-hover/vol:w-20"
  >
    <div
      class="pointer-events-none absolute inset-y-0 left-0 bg-white"
      style="width: {displayVolume * 100}%"
    ></div>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={displayVolume}
      oninput={(e) => onVolume(Number((e.currentTarget as HTMLInputElement).value))}
      aria-label="Volume"
      class="absolute inset-x-0 -inset-y-2 h-5 w-full cursor-pointer opacity-0"
    />
  </div>
</div>
