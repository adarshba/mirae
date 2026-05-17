import { json } from '@sveltejs/kit';
import { getSimilarTitles } from '$api/catalogService';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, fetch }) => {
  const { id } = params;

  if (!id) {
    return json(
      { error: 'No title ID provided' },
      {
        status: 400
      }
    );
  }

  try {
    const similarTitles = await getSimilarTitles(fetch, id);
    return json(
      { similarTitles },
      {
        status: 200
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return json(
      { error: message },
      {
        status: 500
      }
    );
  }
};
