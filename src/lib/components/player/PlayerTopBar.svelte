<script lang="ts">
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import { getPlayerContext } from '$stores/playerStore.svelte';
  import { CURRENT_EPISODE_LABEL } from './player.fixtures';

  type Props = {
    onBack: () => void;
  };

  const { onBack }: Props = $props();
  const player = getPlayerContext();
</script>

<div class="absolute inset-x-0 top-0 z-[2] flex items-center px-10 py-6">
  <div class="flex min-w-0 items-center gap-[18px]">
    <button
      type="button"
      onclick={onBack}
      aria-label="Back"
      class="text-fg-0 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/30 bg-black/40 transition-[background-color,border-color] duration-150 hover:border-white hover:bg-black/70"
    >
      <ChevronLeft size={20} strokeWidth={2.5} />
    </button>

    <div class="min-w-0">
      {#if player.showTitle}
        <div class="text-fg-1 text-[13px] font-semibold tracking-[1px] uppercase">
          {player.showTitle}
        </div>
      {/if}
      <div
        class="mt-0.5 truncate text-[22px] font-bold tracking-[-0.5px] whitespace-nowrap text-white"
      >
        {CURRENT_EPISODE_LABEL}
      </div>
    </div>
  </div>
</div>
