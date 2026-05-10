<script lang="ts">
  import { goto } from '$app/navigation';
  import Play from '@lucide/svelte/icons/play';
  import { getModalContext } from '$lib/stores/ModalStore.svelte';
  import { handleNoImageError } from '$lib/helpers';

  const { closeModal } = getModalContext();

  const {
    id,
    title,
    description,
    duration = '22m',
    imageUrl,
    match = '67% Match',
    rating = '5+'
  }: Props = $props();

  type Props = {
    description: string;
    id: number;
    title: string;
    imageUrl: string;
    duration?: string;
    match?: string;
    rating?: string;
  };
</script>

<div class="w-40 rounded-lg bg-[#181818] text-white shadow-md sm:w-48">
  <div class="relative">
    <img
      src={imageUrl}
      alt={title}
      onerror={handleNoImageError}
      class="h-40 w-full rounded-t-lg object-cover"
    />

    <div
      class="absolute top-2 right-2 rounded-md bg-[#000000b3] px-2 py-0.5 text-sm font-semibold text-white"
    >
      {duration}
    </div>

    <div class="absolute inset-0 bg-linear-to-t from-[#141414] to-transparent"></div>

    <h3 class="absolute bottom-0 left-2 mb-1.5 text-base font-semibold">{title}</h3>
  </div>

  <div class="p-3">
    <div class="mb-1 flex flex-col text-sm">
      <div class="flex justify-between">
        <div class="flex flex-col items-center justify-between">
          <div class="text-[#46d369]">
            <span>{match}</span>
          </div>
          <div class="text-[#b3b3b3]">
            <span class="mr-2 border border-[#b3b3b3] px-1">{rating}</span>
            <span>2023</span>
          </div>
        </div>

        <div>
          <button
            onclick={() => {
              goto(`watch/${id}`);
              closeModal();
            }}
            class="rounded-full border-2 border-gray-700 p-3 transition-colors duration-200 hover:border-white"
          >
            <Play class="h-6 w-6 text-white" /></button
          >
        </div>
      </div>
    </div>
    <p class="mb-3 text-xs leading-tight text-[#b3b3b3]">{description.substring(0, 50) + '...'}</p>
  </div>
</div>
