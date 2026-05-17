export const calculateMatchPercent = (voteAverage: number | undefined) =>
  Math.round((voteAverage ?? 0) * 10);

export const formatReleaseYear = (releaseDate: string | undefined) =>
  releaseDate?.slice(0, 4) ?? '';

export const convertMinsToHrs = (runtime: number) => {
  const hrs = Math.floor(runtime / 60);
  const mins = runtime % 60;

  return hrs === 0 ? `${mins}m` : `${hrs}h ${mins}m`;
};
