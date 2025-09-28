"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DefaultLayout from "@/layouts/default";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Music } from "lucide-react";
import { title } from "@/components/primitives";
import fetchAlbums from "@/music_api/fetchAlbums";
import { fetchAccessToken } from "@/music_api/fetchAccessToken";
import artistsToString, { AlbumSearchItem } from "@/music_api/types";

interface SearchResultCardData {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function Search() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || "";

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center">
          <p className={title()}>
            Search for{" "}
            {type === "movie" ? (
              <>
                <Film className="inline-block h-5 w-5" /> movies
              </>
            ) : type === "music" ? (
              <>
                <Music className="inline-block h-5 w-5" /> songs
              </>
            ) : (
              "anything"
            )}
          </p>
        </div>

        {type === "movie" ? (
          <SearchMovies />
        ) : type === "music" ? (
          <SearchMusic />
        ) : (
          <WrongSearch />
        )}
      </section>
    </DefaultLayout>
  );
}

function WrongSearch() {
  return (
    <>
      <Button>Go back to home</Button>
    </>
  );
}

function SearchMusic() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AlbumSearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    const token = await fetchAccessToken();

    if (!token) return;

    await fetchAlbums(
      token,
      query,
      20,
      0,
      (albumsSearch) => setResults(albumsSearch.items),
      setLoading,
      () => {},
    );
  };

  return (
    <>
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        loading={loading}
        placeholder="Search for albums..."
      />
      <SearchAlbumsResultGrid results={results} />
    </>
  );
}

function SearchMovies() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    // Implement your movie search logic here
    setLoading(false);
  };

  return (
    <>
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        loading={loading}
        placeholder="Search for movies..."
      />
      <SearchMoviesResultGrid results={results} />
    </>
  );
}

function SearchAlbumsResultGrid({ results }: { results: AlbumSearchItem[] }) {
  function albumSearchItemToSearchResultCardData(
    album: AlbumSearchItem,
  ): SearchResultCardData {
    return {
      id: album.id,
      title: album.name,
      description: artistsToString(album.artists),
      image: album.images[0].url,
    };
  }

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {results.map((item) => {
        const cardData = albumSearchItemToSearchResultCardData(item);

        return (
          <a
            key={item.id}
            href={`/editor?type=music&albumId=${item.id}`}
            className="group"
          >
            <SearchResultCard item={cardData} />
          </a>
        );
      })}
    </div>
  );
}

function SearchMoviesResultGrid({ results }: { results: any[] }) {
  return <></>;

  // return (
  //   <div className="grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  //     {results.map((item) => {
  //       return (
  //         <a key={item.id} href="/editor" className="group">
  //           <SearchResultCard item={cardData} />
  //         </a>
  //       );
  //     })}
  //   </div>
  // );
}

const SearchBar = ({
  query,
  setQuery,
  handleSearch,
  loading,
  placeholder,
}: {
  query: string;
  setQuery: (query: string) => void;
  handleSearch: () => void;
  loading: boolean;
  placeholder: string;
}) => {
  return (
    <div className="flex w-full max-w-xl gap-2">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Button disabled={loading} onClick={handleSearch}>
        {loading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

function SearchResultCard({ item }: { item: SearchResultCardData }) {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded-md"
        />
        <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{item.description}</p>
      </CardContent>
    </Card>
  );
}
