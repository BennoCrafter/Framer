import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type SongData = {
  id: string;
  title: string;
  artist: string;
  coverURL: string;
  releaseDate: Date;
};

export type MovieData = {
  director: string;
  url: string;
};

export type SearchResultBase = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type SearchResultMusic = SearchResultBase & {
  songData: SongData;
};

export type SearchResultMovie = SearchResultBase & {
  movieData: MovieData;
};

export type SearchResult =
  | SearchResultBase
  | SearchResultMusic
  | SearchResultMovie;
