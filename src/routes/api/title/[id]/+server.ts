import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getTitleById } from '$api/catalogService';

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
    const titleDetails = await getTitleById(fetch, id);
    return json(
      { titleDetails },
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
