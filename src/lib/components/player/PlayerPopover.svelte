<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    open: boolean;
    /** menu width — defaults to 260px. */
    widthClass?: string;
    children: Snippet;
  };

  const { open, widthClass = 'min-w-[260px]', children }: Props = $props();
</script>

<div
  class="absolute right-0 bottom-[calc(100%+12px)] z-[5] rounded-[10px] border border-white/8 bg-[rgba(20,20,22,0.94)] p-2.5 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.7),0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-[opacity,transform] duration-200 ease-(--ease-standard) {widthClass}"
  class:opacity-100={open}
  class:opacity-0={!open}
  class:translate-y-0={open}
  class:translate-y-2.5={!open}
  class:pointer-events-auto={open}
  class:pointer-events-none={!open}
  role="menu"
  aria-hidden={!open}
>
  {@render children()}
</div>
