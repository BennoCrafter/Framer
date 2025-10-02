"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Vibrant } from "node-vibrant/browser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hexToRgb = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.slice(1), 16);

  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

export const imageToBase64 = async (
  imageUrl: string | URL,
): Promise<string> => {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const base64String = btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    ),
  );

  return base64String;
};

export interface Swatch {
  rgb: [number, number, number];
  population: number;
  hsl: [number, number, number];
  hex: string;
}

export interface Palette {
  Vibrant: Swatch | null;
  Muted: Swatch | null;
  DarkVibrant: Swatch | null;
  DarkMuted: Swatch | null;
  LightVibrant: Swatch | null;
  LightMuted: Swatch | null;
  [name: string]: Swatch | null;
}

export async function getPaletteFromImage(
  imageUrl: string,
): Promise<string[] | null> {
  try {
    const palette: Palette = await Vibrant.from(imageUrl).getPalette();
    const swatches: string[] = [];

    if (palette.Vibrant) {
      swatches.push(palette.Vibrant.hex);
    }
    if (palette.DarkVibrant) {
      swatches.push(palette.DarkVibrant.hex);
    }
    if (palette.LightVibrant) {
      swatches.push(palette.LightVibrant.hex);
    }
    if (palette.Muted) {
      swatches.push(palette.Muted.hex);
    }
    if (palette.DarkMuted) {
      swatches.push(palette.DarkMuted.hex);
    }

    return swatches;
  } catch (error) {
    console.error("Error getting palette from image:", error);

    return null;
  }
}

// export async function getPaletteFromImage(imageUrl: string): Promise<string[]> {
//   const img = new Image();

//   img.crossOrigin = "Anonymous"; // important for remote images
//   img.src = imageUrl;

//   await new Promise((resolve, reject) => {
//     img.onload = resolve;
//     img.onerror = reject;
//   });

//   const colorThief = new ColorThief();
//   const palette = colorThief.getPalette(img, 5); // 5 dominant colors

//   return palette.map(
//     (rgb: number[]) =>
//       "#" + rgb.map((x) => x.toString(16).padStart(2, "0")).join(""),
//   );
// }
