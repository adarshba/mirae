<script lang="ts">
  import type { Snippet } from 'svelte';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Globe from '@lucide/svelte/icons/globe';
  import logo from '$lib/assets/logo.svg';

  type Props = { children: Snippet };
  const { children }: Props = $props();
</script>

<div
  class="fixed inset-0 -z-20 bg-cover bg-center brightness-50 saturate-[80%]"
  style="background-image:url('https://picsum.photos/seed/mirae-auth-bg/1920/1080')"
></div>
<div
  class="fixed inset-0 -z-10"
  style="background:radial-gradient(1200px 800px at 50% 35%, rgba(255,45,111,0.15), transparent 60%), linear-gradient(180deg, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.75) 40%, rgba(10,10,11,0.95) 100%);"
></div>

<div class="relative isolate flex min-h-screen flex-col">
  <div class="flex items-center justify-between px-10 py-5">
    <a href="/" aria-label="Mirae home" class="block">
      <img src={logo} alt="Mirae" class="block h-[30px] w-auto" />
    </a>
    <button
      type="button"
      class="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/20 bg-black/30 px-2.5 py-1.5 text-[13px] font-medium text-zinc-300 transition-colors duration-(--duration-fast,150ms) ease-(--ease-standard) hover:border-white hover:text-white"
    >
      <Globe size={14} strokeWidth={2} />
      English
      <ChevronDown size={12} strokeWidth={2.5} />
    </button>
  </div>

  <main class="flex flex-1 items-start justify-center px-6 pt-10 pb-20 max-[520px]:p-0">
    {@render children()}
  </main>

  <footer
    class="text-auth-muted-2 [&_a]:text-auth-muted-2 px-10 py-6 text-center text-[12px] [&_a]:cursor-pointer [&_a]:no-underline hover:[&_a]:text-white hover:[&_a]:underline"
  >
    <a href="/">Need help?</a> &nbsp;·&nbsp; <a href="/">Terms</a> &nbsp;·&nbsp;
    <a href="/">Privacy</a> &nbsp;·&nbsp;
    <a href="/">Cookie Preferences</a>
    <div class="mt-2">© 2026 Mirae Networks Co., Ltd. · 미래의 이야기</div>
  </footer>
</div>
