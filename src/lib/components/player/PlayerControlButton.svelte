<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    onclick?: (e: MouseEvent) => void;
    label: string;
    tooltip?: string;
    size?: 'sm' | 'md' | 'lg';
    children: Snippet;
  };

  const { onclick, label, tooltip, size = 'md', children }: Props = $props();

  const dim = $derived(size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10');
  const surface = $derived(
    size === 'lg' ? 'bg-white/[0.08] hover:bg-white/[0.18]' : 'bg-transparent hover:bg-white/[0.12]'
  );
</script>

<button
  type="button"
  {onclick}
  aria-label={label}
  class="group text-fg-0 relative inline-flex cursor-pointer items-center justify-center rounded-full border-0 transition-[background-color,transform] duration-150 ease-(--ease-standard) {surface} {dim}"
>
  {@render children()}
  {#if tooltip}
    <span
      class="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-[var(--radius-sm)] bg-black/85 px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100"
    >
      {tooltip}
    </span>
  {/if}
</button>
