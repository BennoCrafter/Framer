import { AlbumsSearch } from "./types";

interface SearchApiResponse {
  albums: AlbumsSearch;
}

export default async function fetchAlbums(
  token: string,
  query: string | null,
  limit: number,
  url: URL | null | undefined,
  loadMore: boolean,
  setAlbums: (albums: AlbumsSearch) => void,
  setLoading: (loading: boolean) => void,
): Promise<void> {
  if (!token) return;

  setLoading(true);

  try {
    let response;
    const currentOffset = 0;

    if (url && loadMore) {
      response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else if (query) {
      response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}&offset=${currentOffset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } else {
      response = await fetch(
        `https://api.spotify.com/v1/browse/new-releases?offset=${currentOffset}&limit=${limit}&locale=en-US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }

    if (!response.ok) {
      const errorMessage = await response.text();

      throw new Error(`Error API: ${errorMessage}`);
    }

    const data: SearchApiResponse = await response.json();
    console.log(data.albums.next);
    setAlbums(data.albums);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}
