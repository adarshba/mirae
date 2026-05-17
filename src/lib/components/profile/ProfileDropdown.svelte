<script lang="ts">
  import { goto } from '$app/navigation';
  import { getAuthContext } from '$stores/authStore.svelte';
  import User from '@lucide/svelte/icons/user';
  import HelpCircle from '@lucide/svelte/icons/help-circle';
  import LogOut from '@lucide/svelte/icons/log-out';

  type Props = { onClose: () => void };
  const { onClose }: Props = $props();

  const authStore = getAuthContext();

  const displayName = $derived(
    authStore.user?.displayName?.trim() || authStore.user?.email?.split('@')[0] || 'Guest'
  );

  const navigate = (path: string) => {
    onClose();
    goto(path);
  };

  const handleSignOut = async () => {
    onClose();
    await authStore.signOut();
    await goto('/login', { replaceState: true });
  };

  const linkCls =
    'flex w-full cursor-pointer items-center gap-2.5 rounded-md border-0 bg-transparent px-2.5 py-2 text-left text-[14px] text-[color:var(--text-primary)] hover:bg-white/[0.06]';
</script>

<div
  class="pdd absolute top-[calc(100%+14px)] right-0 z-[60] w-[280px] animate-[pdd-in_0.18s_ease] rounded-lg border border-white/[0.08] bg-[rgba(20,20,22,0.96)] px-0 py-2 shadow-[0_24px_60px_rgba(0,0,0,0.65)] backdrop-blur-[20px]"
  role="menu"
  aria-label="Profile menu"
>
  <span
    class="absolute -top-1.5 right-[18px] h-3 w-3 rotate-45 border-t border-l border-white/[0.08] bg-[rgba(20,20,22,0.96)]"
    aria-hidden="true"
  ></span>

  <div class="px-4 pt-3.5 pb-2">
    <div class="truncate text-[15px] font-bold text-[color:var(--text-primary)]">
      {displayName}
    </div>
    {#if authStore.user?.email}
      <div class="mt-0.5 truncate text-[12px] text-[color:var(--muted-foreground)]">
        {authStore.user.email}
      </div>
    {/if}
  </div>
  <div class="my-1.5 h-px bg-white/[0.06]"></div>

  <div class="px-1.5 py-1">
    <button type="button" class={linkCls} onclick={() => navigate('/account')}>
      <User size={18} class="shrink-0 text-[color:var(--muted-foreground)]" />
      Account
    </button>
    <button type="button" class={linkCls}>
      <HelpCircle size={18} class="shrink-0 text-[color:var(--muted-foreground)]" />
      Help Center
    </button>
    <div class="my-1.5 h-px bg-white/[0.06]"></div>
    <button
      type="button"
      class="flex w-full cursor-pointer items-center gap-2.5 rounded-md border-0 bg-transparent px-2.5 py-2 text-left text-[14px] text-[color:var(--accent-danger-soft)] hover:bg-white/[0.06]"
      onclick={handleSignOut}
    >
      <LogOut size={18} class="shrink-0 text-[color:var(--accent-danger-soft)]" />
      Sign Out
    </button>
  </div>
</div>

<style>
  @keyframes pdd-in {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
