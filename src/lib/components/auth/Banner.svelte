<script lang="ts">
  import type { Snippet } from 'svelte';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import Info from '@lucide/svelte/icons/info';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import { tv } from 'tailwind-variants';

  type Props = {
    children: Snippet;
    variant?: 'error' | 'info' | 'success';
  };

  const { children, variant = 'error' }: Props = $props();

  const banner = tv({
    base: 'mb-[18px] flex items-start gap-2.5 rounded-lg border p-[12px_14px] text-[13px] leading-[1.5] [&>svg]:mt-px [&>svg]:shrink-0 [&_b]:font-bold [&_b]:text-white [&_a]:text-white [&_a]:underline',
    variants: {
      variant: {
        error:
          'border-[var(--auth-error-banner-border)] bg-[var(--auth-error-banner-bg)] text-auth-error-banner-fg',
        info: 'border-[var(--auth-info-banner-border)] bg-[var(--auth-info-banner-bg)] text-auth-info-banner-fg',
        success:
          'border-[var(--auth-success-banner-border)] bg-[var(--auth-success-banner-bg)] text-auth-success-banner-fg'
      }
    },
    defaultVariants: { variant: 'error' }
  });
</script>

<div class={banner({ variant })} role={variant === 'error' ? 'alert' : 'status'}>
  {#if variant === 'error'}
    <AlertCircle size={16} strokeWidth={2} />
  {:else if variant === 'success'}
    <CheckCircle size={16} strokeWidth={2} />
  {:else}
    <Info size={16} strokeWidth={2} />
  {/if}
  <div>{@render children()}</div>
</div>
