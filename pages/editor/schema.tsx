import { ConfigSchema } from "./types";

export const albumConfigSchema: ConfigSchema[] = [
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
];

export const movieConfigSchema: ConfigSchema[] = [
  {
    key: "outerMargin",
    label: "Outer Margin Size",
    type: "slider",
    min: 0,
    max: 100,
    default: 10,
  },
];
