import { env } from '$env/dynamic/private';
import { TMDB_BASE_URL } from '$lib/constants/tmdb.constants';

const { TMDB_API_KEY } = env;
if (!TMDB_API_KEY) {
  throw new Error('TMDB_API_KEY is not defined in environment variables');
}

export async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  fetchFn: typeof fetch
): Promise<T | null> {
  const url = new URL(`${TMDB_BASE_URL}/${endpoint}`);

  url.searchParams.append('api_key', TMDB_API_KEY!);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });

  try {
    const response = await fetchFn(url.toString());

    if (!response.ok) {
      console.error(`TMDB HTTP ${response.status} for ${endpoint}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('TMDB error', error);
    return null;
  }
}
