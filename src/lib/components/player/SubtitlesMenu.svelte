<script lang="ts">
  import Captions from '@lucide/svelte/icons/captions';
  import Check from '@lucide/svelte/icons/check';
  import { getPlayerContext } from '$stores/playerStore.svelte';
  import PlayerControlButton from './PlayerControlButton.svelte';
  import PlayerPopover from './PlayerPopover.svelte';
  import { AUDIO_TRACKS, SUBTITLE_TRACKS } from './player.fixtures';

  const player = getPlayerContext();

  let audioId = $state('ko-51');
  let subtitleId = $state('en-cc');

  const open = $derived(player.menuOpen === 'subs');
  function toggle() {
    player.menuOpen = open ? null : 'subs';
  }
</script>

<div class="relative">
  <PlayerControlButton onclick={toggle} label="Audio and Subtitles" tooltip="Audio & Subtitles">
    <Captions size={22} />
  </PlayerControlButton>

  <PlayerPopover {open}>
    <div class="text-fg-2 px-3.5 pt-3 pb-1.5 text-[11px] font-medium tracking-[1.5px] uppercase">
      Audio
    </div>
    {#each AUDIO_TRACKS as track (track.id)}
      <button
        type="button"
        onclick={() => {
          audioId = track.id;
        }}
        class="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm transition-colors hover:bg-white/[0.08] {track.id ===
        audioId
          ? 'text-brand'
          : 'text-fg-0'}"
      >
        <span class="flex-1 text-left">{track.label}</span>
        {#if track.sublabel}
          <span class="text-fg-2 text-[13px]">{track.sublabel}</span>
        {/if}
        {#if track.id === audioId}
          <Check size={14} strokeWidth={2.5} />
        {/if}
      </button>
    {/each}

    <div class="my-1.5 h-px bg-white/[0.08]"></div>

    <div class="text-fg-2 px-3.5 pt-3 pb-1.5 text-[11px] font-medium tracking-[1.5px] uppercase">
      Subtitles
    </div>
    {#each SUBTITLE_TRACKS as track (track.id)}
      <button
        type="button"
        onclick={() => {
          subtitleId = track.id;
        }}
        class="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm transition-colors hover:bg-white/[0.08] {track.id ===
        subtitleId
          ? 'text-brand'
          : 'text-fg-0'}"
      >
        <span class="flex-1 text-left">{track.label}</span>
        {#if track.sublabel}
          <span class="text-fg-2 text-[13px]">{track.sublabel}</span>
        {/if}
        {#if track.id === subtitleId}
          <Check size={14} strokeWidth={2.5} />
        {/if}
      </button>
    {/each}
  </PlayerPopover>
</div>
