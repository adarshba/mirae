<script lang="ts">
  import { getAccountContext } from '$stores/AccountStore.svelte';
  import { getAuthContext } from '$stores/AuthStore.svelte';
  import { getDeviceContext } from '$stores/DeviceStore.svelte';
  import Avatar from '$components/profile/Avatar.svelte';
  import Tv from '@lucide/svelte/icons/tv';
  import Smartphone from '@lucide/svelte/icons/smartphone';
  import Laptop from '@lucide/svelte/icons/laptop';

  const account = getAccountContext();
  const authStore = getAuthContext();
  const deviceStore = getDeviceContext();

  const user = $derived(authStore.user);

  const deviceIcon = (kind: DeviceKind) =>
    kind === 'tv' ? Tv : kind === 'phone' ? Smartphone : Laptop;

  const memberSince = $derived.by(() => {
    const iso = user?.metadata?.creationTime;
    if (!iso) return account.account.memberSince;
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  });

  const signOutDevice = (id: string) => {
    if (!user) return;
    deviceStore.signOutDevice(user.uid, id);
  };

  const signOutAllDevices = () => {
    if (!user) return;
    deviceStore.signOutAll(user.uid);
  };

  const downloadAccountJson = () => {
    if (!user) return;
    const data = {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      },
      account: account.account,
      devices: deviceStore.devices
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirae-account-${user.uid}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const linkBtn =
    'cursor-pointer border-0 bg-transparent p-0 text-[13px] text-zinc-400 hover:text-brand hover:underline';
</script>

<svelte:head>
  <title>Mirae · Account</title>
</svelte:head>

<section class="mx-auto max-w-[880px] px-6 pt-[120px] pb-20">
  <header class="mb-8 flex flex-wrap items-center justify-between gap-5">
    <h1 class="m-0 text-[36px] font-extrabold tracking-[-1px] text-[color:var(--text-primary)]">
      Account
    </h1>
    <div class="text-[14px] text-[color:var(--muted-foreground)] [&_b]:font-bold [&_b]:text-white">
      Member since <b>{memberSince}</b>
    </div>
  </header>

  <!-- User Details -->
  <div class="border-line border-t py-6 first-of-type:border-t-0 first-of-type:pt-0">
    <div
      class="grid grid-cols-[200px_1fr] items-start gap-6 max-[720px]:grid-cols-1 max-[720px]:gap-2"
    >
      <div
        class="text-[13px] font-semibold tracking-[0.5px] text-[color:var(--muted-foreground)] uppercase"
      >
        Signed in as
      </div>
      <div class="flex items-center gap-4">
        <Avatar name={user?.displayName} email={user?.email} seed={user?.uid} size={56} />
        <div class="min-w-0">
          <div class="truncate text-[16px] font-semibold text-zinc-100">
            {user?.displayName?.trim() || user?.email?.split('@')[0] || 'Guest'}
          </div>
          <div class="mt-1 truncate text-[13px] text-[color:var(--muted-foreground)]">
            {user?.email ?? '—'}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Settings -->
  <div class="border-line border-t py-6">
    <div
      class="grid grid-cols-[200px_1fr] items-start gap-6 max-[720px]:grid-cols-1 max-[720px]:gap-2"
    >
      <div
        class="text-[13px] font-semibold tracking-[0.5px] text-[color:var(--muted-foreground)] uppercase"
      >
        Settings
      </div>
      <div class="flex flex-col gap-2">
        <div
          class="flex items-center justify-between gap-4 border-b border-dashed border-white/[0.05] py-2.5 last:border-0"
        >
          <div><div class="text-[14px] text-zinc-200">Sign out of all other devices</div></div>
          <button type="button" class={linkBtn} onclick={signOutAllDevices}>Sign out</button>
        </div>
        <div
          class="flex items-center justify-between gap-4 border-b border-dashed border-white/[0.05] py-2.5 last:border-0"
        >
          <div><div class="text-[14px] text-zinc-200">Download your information</div></div>
          <button type="button" class={linkBtn} onclick={downloadAccountJson}>Download</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Devices -->
  <div class="border-line border-t py-6">
    <div
      class="grid grid-cols-[200px_1fr] items-start gap-6 max-[720px]:grid-cols-1 max-[720px]:gap-2"
    >
      <div
        class="text-[13px] font-semibold tracking-[0.5px] text-[color:var(--muted-foreground)] uppercase"
      >
        Devices
      </div>
      <div class="flex flex-col gap-2">
        {#if deviceStore.devices.length === 0}
          <div class="py-2.5 text-[13px] text-[color:var(--muted-foreground)]">
            No devices recorded yet.
          </div>
        {:else}
          {#each deviceStore.devices as device (device.id)}
            {@const Icon = deviceIcon(device.kind)}
            {@const isCurrent = device.id === deviceStore.currentDeviceId}
            <div
              class="flex items-center justify-between gap-4 border-b border-dashed border-white/[0.05] py-3.5 last:border-0"
            >
              <div class="flex min-w-0 items-center gap-3.5">
                <div
                  class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-zinc-300"
                >
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 text-[14px] text-zinc-200">
                    {device.label}
                    {#if isCurrent}
                      <span
                        class="bg-brand/15 text-brand rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.06em] uppercase"
                      >
                        This device
                      </span>
                    {/if}
                  </div>
                  <div class="mt-0.5 truncate text-[12px] text-[color:var(--muted-foreground)]">
                    {deviceStore.statusFor(device)}
                  </div>
                </div>
              </div>
              {#if !isCurrent}
                <button
                  type="button"
                  class="cursor-pointer rounded-md border-0 bg-transparent px-3 py-1.5 text-[13px] text-zinc-400 transition-colors duration-(--duration-fast,150ms) ease-(--ease-standard) hover:bg-white/[0.06] hover:text-white"
                  onclick={() => signOutDevice(device.id)}
                >
                  Sign out
                </button>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</section>
