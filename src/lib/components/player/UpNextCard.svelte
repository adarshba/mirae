<script lang="ts">
  import Play from '@lucide/svelte/icons/play';
  import { getPlayerContext } from '$stores/playerStore.svelte';
  import { UP_NEXT_EPISODE } from './player.fixtures';

  type Props = {
    onPlayNext: () => void;
  };

  const { onPlayNext }: Props = $props();
  const player = getPlayerContext();
</script>

<div
  class="absolute right-10 bottom-[180px] z-[3] flex w-[360px] gap-3.5 rounded-[10px] border border-white/8 bg-[rgba(20,20,22,0.95)] p-3.5 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.7),0_8px_24px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-[250ms] ease-(--ease-standard)"
  class:opacity-100={player.nearEnd}
  class:opacity-0={!player.nearEnd}
  class:pointer-events-auto={player.nearEnd}
  class:pointer-events-none={!player.nearEnd}
  class:translate-y-0={player.nearEnd}
  class:translate-y-2={!player.nearEnd}
>
  <div class="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md">
    <img
      src="https://picsum.photos/seed/{UP_NEXT_EPISODE.thumbSeed}/600/340"
      alt=""
      class="h-full w-full object-cover"
    />
  </div>
  <div class="min-w-0 flex-1">
    <div class="text-brand mb-1 text-[11px] font-bold tracking-[2px] uppercase">Up Next</div>
    <div class="mb-1 text-sm font-bold tracking-[-0.2px] text-white">
      S{UP_NEXT_EPISODE.season} · E{UP_NEXT_EPISODE.number} — {UP_NEXT_EPISODE.title}
    </div>
    <div class="text-xs text-[#a0a0a8]">
      {UP_NEXT_EPISODE.duration} · Plays in {player.upNextCountdown}s
    </div>
    <button
      type="button"
      onclick={onPlayNext}
      class="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] bg-white px-3 py-1.5 text-xs font-bold text-[#111]"
    >
      <Play size={12} fill="currentColor" />
      Play Now
    </button>
  </div>
</div>
