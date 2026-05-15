<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    type?: 'button' | 'submit';
    href?: string;
    onclick?: (e: MouseEvent) => void;
    disabled?: boolean;
  };

  const { children, type = 'button', href, onclick, disabled = false }: Props = $props();

  const cls =
    'flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-line bg-white/[0.04] font-sans text-[14px] font-semibold text-white no-underline transition-colors duration-(--duration-fast,150ms) ease-(--ease-standard) hover:enabled:border-white/35 hover:enabled:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50';
</script>

{#if href}
  <a class={cls} {href}>
    {@render children()}
  </a>
{:else}
  <button {type} class={cls} {disabled} {onclick}>
    {@render children()}
  </button>
{/if}
