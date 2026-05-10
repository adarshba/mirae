type Show = {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
  overview?: string;
};

type ShowDetails = Show & {
  adult: boolean;
  created_by: Creator[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode | null;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
};

type Creator = {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
};

type Episode = {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
};

type Network = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};

type Season = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
};

type ProductionCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};

type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

// Legacy Movie types (kept for compatibility)
type Movie = {
  id: number;
  title?: string;
  backdrop_path?: string;
  overview?: string;
};

type MovieDetails = Movie & {
  adult: boolean;
  belongs_to_collection: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type BelongsToCollection = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
};

type Genre = {
  id: number;
  name: string;
};

type TMDBResponse<T> = {
  results: T[];
};

type ShowsWithGenre = {
  shows: Show[];
  id: number;
  name: string;
};

// Legacy type aliases
type TMDBRespones<T> = TMDBResponse<T>;
type MoviesWithGenre = {
  id: number;
  name: string;
  movies: Movie[];
};

type Trailer = {
  id: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: Date;
  iso_639_1: string;
  iso_3166_1: string;
};

type CardState = {
  isHovered: boolean;
  cardId: number | string | null;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  movie: Movie | null;
};

type ModalState = {
  movieId: number;
  isOpen: boolean;
  trailerId: string;
  movieData: MovieDetails | null;
  loading: boolean;
  error: string | null;
  similarMovies: Movie[];
  loadingSimilarMovies: boolean;
};

type PopupPosition = {
  x: number;
  y: number;
};

type SimilarCardProps = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  duration?: string;
  match?: string;
  rating?: string;
};

type PlayerProps = {
  videoId: string;
  isMuted?: boolean;
  showControls?: boolean;
};
