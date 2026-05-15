<script lang="ts">
  import type { Snippet } from 'svelte';
  import Check from '@lucide/svelte/icons/check';

  type Props = {
    children: Snippet;
    type?: 'button' | 'submit';
    loading?: boolean;
    success?: boolean;
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
  };

  const {
    children,
    type = 'submit',
    loading = false,
    success = false,
    disabled = false,
    onclick
  }: Props = $props();
</script>

<button
  {type}
  class="
    relative flex h-12 w-full items-center justify-center gap-2 rounded-lg border-0
    font-sans text-[15px] font-bold tracking-[0.2px] text-white transition-colors
    duration-(--duration-fast,150ms) ease-(--ease-standard) active:translate-y-px
    disabled:pointer-events-none disabled:cursor-not-allowed
    {success ? 'bg-transparent' : 'bg-brand hover:bg-brand-2'}
    {loading ? '[&>span]:invisible' : ''}
  "
  disabled={disabled || loading || success}
  {onclick}
>
  {#if success}
    <Check size={24} strokeWidth={3} color="var(--color-success)" />
  {:else}
    <span>{@render children()}</span>
  {/if}
  {#if loading}
    <span
      aria-hidden="true"
      class="animate-cta-spin absolute top-1/2 left-1/2 -mt-[11px] -ml-[11px] h-[22px] w-[22px] rounded-full border-[2.5px] border-white/30 border-t-white"
    ></span>
  {/if}
</button>
