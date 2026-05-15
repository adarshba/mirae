type Movie = {
  id: number;
  title?: string;
  backdrop_path?: string;
  poster_path?: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  original_language?: string;
  original_title?: string;
  genre_ids?: number[];
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

type TMDBResponse<T> = {
  results: T[];
};

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
  movie: Movie | null;
};

type ModalState = {
  movieId: number;
  isOpen: boolean;
  trailerId: string;
  movieData: MovieDetails | null;
  loading: boolean;
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
