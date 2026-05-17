import { json, type RequestHandler } from '@sveltejs/kit';
import { getTitleTrailer } from '$api/catalogService';

export const GET: RequestHandler = async ({ params, fetch }) => {
  const { titleId } = params;

  if (!titleId) {
    return json({ error: 'No title ID provided' }, { status: 400 });
  }

  try {
    const trailer = await getTitleTrailer(Number(titleId), fetch);
    if (!trailer) {
      return json({ error: 'No trailer found' }, { status: 404 });
    }
    return json({ trailer }, { status: 200 });
  } catch {
    return json({ error: 'Failed to fetch trailer' }, { status: 500 });
  }
};
