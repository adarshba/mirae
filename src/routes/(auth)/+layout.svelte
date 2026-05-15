<script lang="ts">
  import type { Snippet } from 'svelte';
  import AuthLayout from '$components/auth/AuthLayout.svelte';

  type Props = { children: Snippet };
  const { children }: Props = $props();
</script>

<svelte:head>
  <title>Mirae · Sign In</title>
</svelte:head>

<AuthLayout>
  {@render children()}
</AuthLayout>
