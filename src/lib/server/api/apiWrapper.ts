import { env } from '$env/dynamic/private';
const { TMDB_API_KEY } = env;
if (!TMDB_API_KEY) {
	throw new Error('TMDB_API_KEY is not defined in environment variables');
}
// Generic Api Wrapper
export const BASE_URL = 'https://api.themoviedb.org/3';
export async function tmdbFetch<T>(
	endpoint: string,
	params: Record<string, any> = {},
	fetchFn: typeof fetch
): Promise<T | null> {
	const url = new URL(`${BASE_URL}/${endpoint}`);

	url.searchParams.append('api_key', TMDB_API_KEY);

	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.append(key, value.toString());
	});

	try {
		const response = await fetchFn(url.toString());

		if (!response.ok) {
			console.log(`HTTP error! status: ${response.status}`);
			return null;
		}

		const data: T = await response.json();
		return data;
	} catch (error) {
		console.log('TMDB Error', error);
		return null;
	}
}
