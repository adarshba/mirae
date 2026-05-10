import { json } from '@sveltejs/kit';
import { getSimiliarMovies } from '$api/catalog';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, fetch }) => {
  const { id } = params;

  if (!id) {
    return json(
      { error: 'No Movie ID provided' },
      {
        status: 400
      }
    );
  }

  try {
    const similarMovies = await getSimiliarMovies(fetch, id);
    return json(
      { similarMovies },
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
