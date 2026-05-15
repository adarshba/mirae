<script lang="ts">
  import { goto } from '$app/navigation';
  import { sendPasswordResetEmail } from 'firebase/auth';
  import { auth, authErrorMessage } from '$utils/firebase';
  import { AUTH_REDIRECT_DELAY_MS } from '$lib/constants';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import AuthCard from '$components/auth/AuthCard.svelte';
  import TextField from '$components/auth/TextField.svelte';
  import PrimaryButton from '$components/auth/PrimaryButton.svelte';
  import OutlineButton from '$components/auth/OutlineButton.svelte';
  import Banner from '$components/auth/Banner.svelte';

  let email = $state('');
  let loading = $state(false);
  let success = $state(false);
  let submitError = $state('');

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!email) return;
    submitError = '';
    loading = true;
    const normalized = email.trim().toLowerCase();
    try {
      await sendPasswordResetEmail(auth, normalized);
      loading = false;
      success = true;
      setTimeout(
        () => goto(`/forgot/sent?e=${encodeURIComponent(normalized)}`),
        AUTH_REDIRECT_DELAY_MS
      );
    } catch (err) {
      loading = false;
      submitError = authErrorMessage(err);
    }
  };
</script>

<svelte:head>
  <title>Mirae · Forgot Password</title>
</svelte:head>

<AuthCard onsubmit={handleSubmit}>
  <h1 class="auth-title">Forgot password?</h1>
  <p class="auth-sub">
    Tell us the email on your Mirae account and we'll send you a link to set a new password. Links
    expire in 30 minutes.
  </p>

  {#if submitError}
    <Banner variant="error"><b>{submitError}</b></Banner>
  {/if}

  <TextField
    id="fp-email"
    label="Email"
    type="email"
    autocomplete="email"
    inputmode="email"
    bind:value={email}
    required
  />

  <PrimaryButton {loading} {success}>Send Reset Link</PrimaryButton>

  <div class="h-3.5"></div>

  <OutlineButton href="/login">
    <ChevronLeft size={16} strokeWidth={2.5} />
    Back to sign in
  </OutlineButton>

  <p class="auth-legal !mt-6">
    Still can't access your account? <a href="/">Contact support</a>.
  </p>
</AuthCard>
