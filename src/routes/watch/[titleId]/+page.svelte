<script lang="ts">
  import { page } from '$app/state';
  import VideoPlayer from '$components/player/VideoPlayer.svelte';
  import { getTitleCardContext } from '$stores/titleCardStore.svelte';
  import { formatReleaseYear } from '$lib/titleFormat';
  import { DEMO_VIDEO_SRC } from '$components/player/player.fixtures';

  const {
    params: { titleId }
  } = $derived(page);
  const titleCardState = getTitleCardContext();

  let title = $state('');
  let yearLabel = $state('');
  let loading = $state(false);
  let error = $state('');

  let fetchedFor: string | null = $state(null);

  $effect(() => {
    if (!titleId || titleId === fetchedFor) return;
    fetchedFor = titleId;

    titleCardState.isHovered = false;
    titleCardState.title = null;
    titleCardState.position = { x: -500, y: 0 };

    (async () => {
      loading = true;
      error = '';
      title = '';
      yearLabel = '';

      try {
        const details = await fetchTitleDetails(titleId);
        if (details) {
          title = details.title ?? '';
          yearLabel = formatReleaseYear(details.release_date);
        }
      } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to load';
      } finally {
        loading = false;
      }
    })();
  });

  async function fetchTitleDetails(id: string): Promise<TitleDetails | null> {
    try {
      const res = await fetch(`/api/title/${id}`);
      if (!res.ok) return null;
      const data = (await res.json()) as { titleDetails: TitleDetails };
      return data.titleDetails;
    } catch {
      return null;
    }
  }
</script>

{#if loading}
  <div class="fixed inset-0 z-[60] bg-black"></div>
{:else if error}
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black">
    <p class="text-fg-1 text-sm tracking-wide">{error}</p>
  </div>
{:else}
  <VideoPlayer src={DEMO_VIDEO_SRC} showTitle={title} episodeTitle={yearLabel} />
{/if}
