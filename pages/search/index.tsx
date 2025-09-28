import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Film, Music } from "lucide-react";

import DefaultLayout from "@/layouts/default";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        ) : type === "album" ? (
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
  const [nextLoadingLink, setNextLoadingLink] = useState<
    URL | null | undefined
  >(undefined);

  const handleSearch = async (loadMore: boolean) => {
    const token = await fetchAccessToken();

    if (!token) return;
    console.log(loadMore);
    if (!loadMore) {
      setNextLoadingLink(null);
    }

    await fetchAlbums(
      token,
      query,
      21,
      nextLoadingLink,
      loadMore,
      (albumsSearch) => {
        if (loadMore) {
          setResults((prevAlbums) => {
            return [...prevAlbums, ...albumsSearch.items];
          });
        } else {
          setResults(albumsSearch.items);
        }
        setNextLoadingLink(albumsSearch.next);
      },
      setLoading,
    );
  };

  useEffect(() => {
    const fetchInitialAlbumResults = async () => {
      const accessToken = await fetchAccessToken();

      if (!accessToken) return;

      await fetchAlbums(
        accessToken,
        query,
        21,
        nextLoadingLink,
        false,
        (albumsSearch) => {
          setResults(albumsSearch.items);
          setNextLoadingLink(albumsSearch.next);
        },
        setLoading,
      );
    };

    fetchInitialAlbumResults();
  }, []);

  return (
    <>
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={() => handleSearch(false)}
        loading={loading}
        placeholder="Search for albums..."
      />
      <ResultGrid results={results} />
      <button
        disabled={loading || nextLoadingLink === null}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
        onClick={() => handleSearch(true)}
      >
        {loading ? "Loading..." : "Load More"}
      </button>
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
      <ResultGrid results={results} />
    </>
  );
}

function ResultGrid({ results }: { results: AlbumSearchItem[] }) {
  return results.length === 0 ? (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-500" />
    </div>
  ) : (
    <div className="flex flex-col items-center gap-6">
      <div className="grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {renderAlbumsResultsGrid({ results })}
      </div>
    </div>
  );
}

function renderAlbumsResultsGrid({ results }: { results: AlbumSearchItem[] }) {
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
    <>
      {results.map((item) => {
        const cardData = albumSearchItemToSearchResultCardData(item);

        return (
          <a
            key={item.id}
            href={`/editor?type=album&albumId=${item.id}`}
            className="group"
          >
            <SearchResultCard item={cardData} />
          </a>
        );
      })}
    </>
  );
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
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchAndBlur = () => {
    handleSearch();
    inputRef.current?.blur();
  };

  return (
    <div className="flex w-full max-w-xl gap-2">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchAndBlur();
          }
        }}
      />
      <Button disabled={loading} onClick={handleSearchAndBlur}>
        {"Search"}
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
