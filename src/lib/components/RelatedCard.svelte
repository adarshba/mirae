<script lang="ts">
  import { goto } from '$app/navigation';
  import Play from '@lucide/svelte/icons/play';
  import { getModalContext } from '$stores/ModalStore.svelte';
  import { handleNoImageError } from '$utils/helpers';

  const { closeModal } = getModalContext();

  const {
    id,
    title,
    description,
    duration = '22m',
    imageUrl,
    match = '94% Match',
    rating = '13+'
  }: SimilarCardProps = $props();

  const handlePlay = () => {
    goto(`/watch/${id}`);
    closeModal();
  };
</script>

<article
  class="bg-card-2 flex w-full flex-col overflow-hidden rounded-[var(--radius-lg)] text-white shadow-sm transition-transform duration-150 ease-(--ease-standard) hover:-translate-y-0.5"
>
  <button
    class="group relative aspect-video w-full cursor-pointer overflow-hidden border-0 bg-black p-0"
    onclick={handlePlay}
    aria-label={`Play ${title}`}
    type="button"
  >
    <img
      src={imageUrl}
      alt={title}
      onerror={handleNoImageError}
      class="h-full w-full object-cover transition-transform duration-300 ease-(--ease-standard) group-hover:scale-105"
    />
    <span
      class="absolute top-2 right-2 rounded-[var(--radius-sm)] bg-black/80 px-2 py-[2px] text-xs font-bold text-white"
    >
      {duration}
    </span>
    <span
      class="absolute bottom-2 left-3 text-left text-[0.95rem] font-bold text-white"
      style="text-shadow:0 1px 6px rgba(0,0,0,0.8);"
    >
      {title}
    </span>
    <span
      class="bg-brand shadow-brand absolute right-2 bottom-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-white opacity-0 transition-opacity duration-150 ease-(--ease-standard) group-hover:opacity-100"
    >
      <Play size={20} fill="currentColor" />
    </span>
  </button>

  <div class="flex flex-col gap-2 px-3 pt-3 pb-4">
    <div class="flex items-center gap-3">
      <span class="badge-match">{match}</span>
      <span class="badge-rating">{rating}</span>
    </div>
    <p class="text-fg-1 m-0 text-[0.8125rem] leading-[1.4]">
      {description.length > 90 ? description.substring(0, 90) + '…' : description}
    </p>
  </div>
</article>
