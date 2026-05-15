<script lang="ts">
  import { onDestroy } from 'svelte';
  import RefreshCcw from '@lucide/svelte/icons/refresh-ccw';

  type Props = {
    onResend?: () => void;
    cooldownSeconds?: number;
  };

  const { onResend, cooldownSeconds = 30 }: Props = $props();

  let remaining = $state(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const handleClick = () => {
    if (remaining > 0) return;
    onResend?.();
    remaining = cooldownSeconds;
    stopTimer();
    timer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) stopTimer();
    }, 1000);
  };

  onDestroy(stopTimer);
</script>

<button
  type="button"
  disabled={remaining > 0}
  aria-disabled={remaining > 0}
  onclick={handleClick}
  class="border-line flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border bg-white/[0.04] font-sans text-[14px] font-semibold text-white transition-colors duration-(--duration-fast,150ms) ease-(--ease-standard) hover:enabled:border-white/35 hover:enabled:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
>
  <RefreshCcw size={16} strokeWidth={2} />
  {#if remaining > 0}
    Resend in {remaining}s
  {:else}
    Resend email
  {/if}
</button>
