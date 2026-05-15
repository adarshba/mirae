<script lang="ts">
  import { page } from '$app/state';
  import Mail from '@lucide/svelte/icons/mail';
  import AuthCard from '$components/auth/AuthCard.svelte';
  import Banner from '$components/auth/Banner.svelte';
  import PrimaryButton from '$components/auth/PrimaryButton.svelte';
  import ResendButton from '$components/auth/ResendButton.svelte';

  const emailParam = $derived(page.url.searchParams.get('e') ?? '');

  const openMailApp = () => {
    if (typeof window !== 'undefined') window.open('mailto:', '_self');
  };
</script>

<svelte:head>
  <title>Mirae · Check Your Email</title>
</svelte:head>

<AuthCard as="div">
  <div
    class="border-brand/30 mx-auto mb-[22px] flex h-[84px] w-[84px] items-center justify-center rounded-full border"
    style="background:linear-gradient(140deg, rgba(255,45,111,0.18), rgba(124,92,255,0.1));"
  >
    <Mail size={38} strokeWidth={1.8} color="var(--color-brand)" />
  </div>

  <h1 class="auth-title text-center">Check your email</h1>
  <p class="auth-sub text-center [&_b]:font-bold [&_b]:text-white">
    We sent a password reset link to<br />
    <b>{emailParam || 'your email'}</b>. It expires in 30 minutes.
  </p>

  <Banner variant="info">
    Can't find it? Check your spam folder, or wait a minute — it can take a moment to arrive.
  </Banner>

  <PrimaryButton type="button" onclick={openMailApp}>Open Email App</PrimaryButton>
  <div class="h-3"></div>
  <ResendButton />

  <div class="auth-foot-link">
    Different email? <a href="/forgot">Try again.</a>
  </div>
</AuthCard>
