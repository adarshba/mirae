<script lang="ts">
  import { goto } from '$app/navigation';
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { auth, authErrorMessage } from '$lib/firebaseClient';
  import { AUTH_REDIRECT_DELAY_MS } from '$lib/constants/timing.constants';
  import AuthCard from '$components/auth/AuthCard.svelte';
  import TextField from '$components/auth/TextField.svelte';
  import PasswordField from '$components/auth/PasswordField.svelte';
  import PrimaryButton from '$components/auth/PrimaryButton.svelte';
  import Banner from '$components/auth/Banner.svelte';

  let firstName = $state('');
  let email = $state('');
  let password = $state('');
  let agreed = $state(false);
  let loading = $state(false);
  let success = $state(false);
  let submitError = $state('');

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!agreed) return;
    submitError = '';
    loading = true;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      if (firstName.trim()) {
        await updateProfile(cred.user, { displayName: firstName.trim() });
      }
      loading = false;
      success = true;
      setTimeout(() => goto('/'), AUTH_REDIRECT_DELAY_MS);
    } catch (err) {
      loading = false;
      submitError = authErrorMessage(err);
    }
  };
</script>

<svelte:head>
  <title>Mirae · Create Account</title>
</svelte:head>

<AuthCard onsubmit={handleSubmit}>
  <h1 class="auth-title">Create your account</h1>
  <p class="auth-sub">
    Just an email and password to start. You can pick a plan after — or finish setup later from
    Account.
  </p>

  {#if submitError}
    <Banner variant="error"><b>{submitError}</b></Banner>
  {/if}

  <TextField
    id="su-name"
    label="First name"
    type="text"
    autocomplete="given-name"
    maxlength={60}
    bind:value={firstName}
    required
  />

  <TextField
    id="su-email"
    label="Email"
    type="email"
    autocomplete="email"
    inputmode="email"
    bind:value={email}
    required
  />

  <PasswordField
    id="su-pass"
    label="Password"
    autocomplete="new-password"
    minlength={8}
    bind:value={password}
    showStrength
    required
  />

  <div class="h-1.5"></div>
  <label class="auth-check !mb-[18px] !items-start">
    <input type="checkbox" bind:checked={agreed} required />
    <span class="auth-check-box mt-px shrink-0"></span>
    <span class="leading-normal text-zinc-400">
      I agree to Mirae's <a href="/" class="auth-link-muted">Terms of Use</a> and
      <a href="/" class="auth-link-muted">Privacy Policy</a>. I'm at least 13 years old.
    </span>
  </label>

  <PrimaryButton {loading} {success} disabled={!agreed}>Create Account</PrimaryButton>

  <div class="auth-foot-link">
    Already on Mirae? <a href="/login">Sign in.</a>
  </div>
</AuthCard>
