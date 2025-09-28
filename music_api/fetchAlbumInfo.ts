import { Album } from "./types";

export default async function fetchAlbumInfo(
  token: string,
  albumId: string,
  setLoading: (loading: boolean) => void,
): Promise<Album | undefined> {
  if (!token) return undefined;

  setLoading(true);

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorMessage = await response.text();

      throw new Error(`Error API: ${errorMessage}`);
    }
    const data: Album = await response.json();

    return data;
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}
