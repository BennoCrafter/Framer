export async function getItunesUncompressedAlbumCover(
  searchQuery: string,
  country: string = "us",
): Promise<URL | null> {
  try {
    let apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&country=${country}&entity=album&limit=1`;

    let response = await fetch(apiUrl);

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    let data = await response.json();

    if (!data.results?.length) {
      // console.warn("No album data found.");

      return null;
    }

    let result = data.results[0];
    let hires = result.artworkUrl100.replace("100x100bb", "100000x100000-999");
    let parts = hires.split("/image/thumb/");

    let uncompressedCover =
      parts.length === 2
        ? `https://a5.mzstatic.com/us/r1000/0/${parts[1].split("/").slice(0, -1).join("/")}`
        : "";

    return new URL(uncompressedCover);
  } catch (error: any) {
    console.error("Error fetching album cover:", error.message);

    return null;
  }
}
