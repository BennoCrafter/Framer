import { ConfigSchema, ConfigValues, buildDefaults } from "./types";

export const albumConfigSchema = [
  {
    key: "artistName",
    label: "Artist Name",
    type: "text",
    default: "Artist name",
  },
  {
    key: "albumName",
    label: "Album Name",
    type: "text",
    default: "ALBUM NAME",
  },
  {
    key: "fontSize",
    label: "Font Size",
    type: "slider",
    min: 20,
    max: 100,
    default: 40,
  },
  {
    key: "outerMargin",
    label: "Outer Margin Size",
    type: "slider",
    min: 0,
    max: 100,
    default: 50,
  },
  {
    key: "bgColor",
    label: "Background Color",
    type: "color",
    default: "#ffffff",
  },
  {
    key: "albumCover",
    label: "Cover",
    type: "file",
    default: null,
    accept: "image/jpeg, image/png",
  },
] as const satisfies ConfigSchema;

export const movieConfigSchema = [
  {
    key: "outerMargin",
    label: "Outer Margin Size",
    type: "slider",
    min: 0,
    max: 20,
    default: 100,
  },
  {
    key: "posterOrientation",
    label: "Poster Orientation",
    type: "choice",
    options: [
      {
        id: "landscape",
        label: "Landscape",
        description: "Landscape orientation",
      },
      {
        id: "portrait",
        label: "Portrait",
        description: "Portrait orientation",
      },
    ],
    inline: false,
    default: "portrait",
  },
  {
    key: "moviePoster",
    label: "Movie Poster",
    type: "file",
    default: null,
  },
] as const satisfies ConfigSchema;

export type AlbumConfig = ConfigValues<typeof albumConfigSchema>;

export const albumConfigScheme = {
  schema: albumConfigSchema,
  default: buildDefaults(albumConfigSchema),
};

export type MovieConfig = ConfigValues<typeof movieConfigSchema>;

export const movieConfigScheme = {
  schema: movieConfigSchema,
  default: buildDefaults(movieConfigSchema),
};
