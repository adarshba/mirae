<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    onsubmit?: (e: SubmitEvent) => void;
    as?: 'form' | 'div';
  };

  const { children, onsubmit, as = 'form' }: Props = $props();

  const cls =
    'animate-auth-rise w-full max-w-[440px] rounded-[14px] border border-[var(--auth-card-border)] bg-[var(--auth-card-bg)] px-14 pt-12 pb-10 shadow-auth-card backdrop-blur-[12px] backdrop-saturate-[140%] max-[520px]:min-h-screen max-[520px]:max-w-full max-[520px]:rounded-none max-[520px]:px-7 max-[520px]:pt-9 max-[520px]:pb-8';
</script>

{#if as === 'form'}
  <form class={cls} {onsubmit}>
    {@render children()}
  </form>
{:else}
  <div class={cls}>
    {@render children()}
  </div>
{/if}
