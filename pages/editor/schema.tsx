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
    default: 10,
  },
  {
    key: "bgColor",
    label: "Background Color",
    type: "color",
    default: "#ffffff",
  },
] as const satisfies ConfigSchema;

export type AlbumConfig = ConfigValues<typeof albumConfigSchema>;

export const albumConfigScheme = {
  schema: albumConfigSchema,
  default: buildDefaults(albumConfigSchema),
};

export const movieConfigSchema = [
  {
    key: "outerMargin",
    label: "Outer Margin Size",
    type: "slider",
    min: 0,
    max: 100,
    default: 10,
  },
] as const satisfies ConfigSchema;
