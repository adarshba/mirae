declare global {
  namespace App {}
}

declare module '$env/static/private' {
  export const TMDB_API_KEY: string;
}

export {};
