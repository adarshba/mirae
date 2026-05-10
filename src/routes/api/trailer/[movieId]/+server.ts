import { json, type RequestHandler } from '@sveltejs/kit';
import { getMovieTrailer } from '$api/catalog';

export const GET: RequestHandler = async ({ params }) => {
  const { movieId } = params;

  if (!movieId) {
    return json({ error: 'No movie ID provided' }, { status: 400 });
  }

  try {
    const trailer = await getMovieTrailer(Number(movieId));

    return json({ trailer }, { status: 200 });
  } catch {
    return json({ error: 'Failed to fetch trailer' }, { status: 500 });
  }
};
