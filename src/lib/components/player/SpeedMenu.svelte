<script lang="ts">
  import Gauge from '@lucide/svelte/icons/gauge';
  import Check from '@lucide/svelte/icons/check';
  import { getPlayerContext } from '$stores/playerStore.svelte';
  import PlayerControlButton from './PlayerControlButton.svelte';
  import PlayerPopover from './PlayerPopover.svelte';

  type Props = {
    onSelect: (speed: number) => void;
  };

  const { onSelect }: Props = $props();
  const player = getPlayerContext();

  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

  const open = $derived(player.menuOpen === 'speed');
  function toggle() {
    player.menuOpen = open ? null : 'speed';
  }
</script>

<div class="relative">
  <PlayerControlButton onclick={toggle} label="Playback speed" tooltip="Speed">
    <Gauge size={22} />
  </PlayerControlButton>

  <PlayerPopover {open} widthClass="min-w-[200px]">
    <div class="text-fg-2 px-3.5 pt-3 pb-1.5 text-[11px] font-medium tracking-[1.5px] uppercase">
      Playback Speed
    </div>
    {#each SPEEDS as s (s)}
      <button
        type="button"
        onclick={() => {
          onSelect(s);
          player.menuOpen = null;
        }}
        class="flex w-full cursor-pointer items-center gap-2 rounded-md px-3.5 py-2.5 text-sm transition-colors hover:bg-white/[0.08] {s ===
        player.playbackRate
          ? 'text-brand'
          : 'text-fg-0'}"
      >
        <span class="flex-1 text-left">{s === 1 ? 'Normal (1×)' : `${s}×`}</span>
        {#if s === player.playbackRate}
          <Check size={14} strokeWidth={2.5} />
        {/if}
      </button>
    {/each}
  </PlayerPopover>
</div>
