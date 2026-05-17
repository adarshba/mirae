<script lang="ts">
  import List from '@lucide/svelte/icons/list';
  import { getPlayerContext } from '$stores/playerStore.svelte';
  import PlayerControlButton from './PlayerControlButton.svelte';
  import PlayerPopover from './PlayerPopover.svelte';
  import { EPISODE_FIXTURES } from './player.fixtures';

  const player = getPlayerContext();

  const open = $derived(player.menuOpen === 'episodes');
  function toggle() {
    player.menuOpen = open ? null : 'episodes';
  }
</script>

<div class="relative">
  <PlayerControlButton onclick={toggle} label="Episodes" tooltip="Episodes">
    <List size={22} />
  </PlayerControlButton>

  <PlayerPopover {open} widthClass="w-[480px] max-h-[60vh] overflow-y-auto">
    <div class="flex flex-col gap-2">
      {#each EPISODE_FIXTURES as ep (ep.id)}
        <button
          type="button"
          class="grid w-full cursor-pointer grid-cols-[130px_1fr] items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white/[0.06] {ep.isPlaying
            ? 'bg-[linear-gradient(90deg,rgba(255,45,111,0.15),transparent_60%)]'
            : ''}"
        >
          <div class="relative aspect-video overflow-hidden rounded-md">
            <img
              src="https://picsum.photos/seed/{ep.thumbSeed}/260/146"
              alt=""
              class="h-full w-full object-cover"
            />
            {#if ep.progress > 0}
              <div class="absolute inset-x-0 bottom-0 h-[3px] bg-white/[0.18]">
                <span class="bg-brand block h-full" style="width: {ep.progress * 100}%"></span>
              </div>
            {/if}
            <div class="absolute right-1 bottom-1 rounded-[2px] bg-black/70 px-1.5 text-[10px]">
              {ep.duration}
            </div>
          </div>
          <div class="min-w-0">
            <div class="text-fg-2 mb-0.5 text-[13px] font-semibold">Episode {ep.number}</div>
            <div class="mb-1 truncate text-sm font-semibold tracking-[-0.2px] text-white">
              {ep.title}
            </div>
            <div class="line-clamp-2 text-xs leading-[1.4] text-[#a0a0a8]">
              {ep.description}
            </div>
          </div>
        </button>
      {/each}
    </div>
  </PlayerPopover>
</div>
