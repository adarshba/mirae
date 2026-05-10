import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getMovieById } from '$api/catalog';

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
    const movieDetails = await getMovieById(fetch, id);
    return json(
      { movieDetails },
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
