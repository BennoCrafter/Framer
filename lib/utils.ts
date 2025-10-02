import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
