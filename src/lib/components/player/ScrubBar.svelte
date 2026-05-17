<script lang="ts">
  import { getPlayerContext } from '$stores/playerStore.svelte';
  import { formatPlayerTime } from './playerTime';

  type Props = {
    onSeek: (time: number) => void;
  };

  const { onSeek }: Props = $props();

  const player = getPlayerContext();

  let trackEl: HTMLDivElement;
  let hoverPct = $state(0);
  let hovering = $state(false);
  let dragging = $state(false);

  const pctFromX = (clientX: number) => {
    if (!trackEl) return 0;
    const rect = trackEl.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  function onMove(e: MouseEvent) {
    hoverPct = pctFromX(e.clientX);
    if (dragging && player.duration > 0) onSeek(hoverPct * player.duration);
  }

  function onDown(e: MouseEvent) {
    if (player.duration <= 0) return;
    dragging = true;
    const p = pctFromX(e.clientX);
    onSeek(p * player.duration);

    const move = (ev: MouseEvent) => {
      const np = pctFromX(ev.clientX);
      hoverPct = np;
      onSeek(np * player.duration);
    };
    const up = () => {
      dragging = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  const progressPct = $derived(player.progress * 100);
  const bufferedPct = $derived(player.buffered * 100);
  const tipTime = $derived(hoverPct * player.duration);
</script>

<div
  class="group relative flex h-9 cursor-pointer items-center"
  onmouseenter={() => (hovering = true)}
  onmouseleave={() => (hovering = false)}
  onmousemove={onMove}
  onmousedown={onDown}
  role="slider"
  tabindex="0"
  aria-label="Seek"
  aria-valuemin={0}
  aria-valuemax={player.duration || 0}
  aria-valuenow={player.currentTime}
>
  <div
    bind:this={trackEl}
    class="relative h-1 w-full rounded-full bg-white/25 transition-[height] duration-150 group-hover:h-1.5"
  >
    <div
      class="absolute inset-y-0 left-0 rounded-full bg-white/40"
      style="width: {bufferedPct}%"
    ></div>
    <div
      class="bg-brand absolute inset-y-0 left-0 rounded-full"
      style="width: {progressPct}%"
    ></div>
    <div
      class="bg-brand absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full shadow-[0_0_0_4px_rgba(255,45,111,0.25)] transition-transform duration-150 group-hover:scale-100"
      style="left: {progressPct}%"
    ></div>
  </div>

  {#if hovering && player.duration > 0}
    <div
      class="text-fg-1 pointer-events-none absolute bottom-9 -translate-x-1/2 rounded-md bg-black/85 px-2.5 py-1.5 text-xs font-medium tabular-nums shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
      style="left: {hoverPct * 100}%"
    >
      {formatPlayerTime(tipTime)}
    </div>
  {/if}
</div>
