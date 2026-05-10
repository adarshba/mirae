import { json, type RequestHandler } from "@sveltejs/kit";
import { getMovieTrailer } from "$lib/server/api/api";


export const GET: RequestHandler = async ({ params }) => {
  const { movieId } = params;

  if (!movieId) {
    return json({ error: "No movie ID provided" }, { status: 400 });
  }

  try {
    const trailer = await getMovieTrailer(Number(movieId));

    return json({ trailer }, { status: 200 });
  } catch (error) {
    return json({ error: "Failed to fetch trailer" }, { status: 500 });
  }
}