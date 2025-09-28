import React, { useState, useEffect } from "react";
import { useSearchParams, redirect } from "next/navigation";
import { Film, Music } from "lucide-react";
import { button as buttonStyles } from "@heroui/theme";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { title } from "@/components/primitives";
import fetchAlbums from "@/music_api/fetchAlbums";
import { fetchAccessToken } from "@/music_api/fetchAccessToken";
import artistsToString, { AlbumSearchItem } from "@/music_api/types";
import WrongPage from "@/pages/wrong_page";
import EditorLayout from "@/layouts/editor";

interface SearchResultCardData {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function Search() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || "";

  if (type !== "movie" && type !== "album") {
    return <WrongPage />;
  }

  return (
    <EditorLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-10">
        <div className="max-w-xl text-center">
          <p className={title()}>
            {type === "movie" ? (
              <span className="inline-flex items-center gap-2">
                <Film className="h-10 w-10 text-blue-500" />
                movies
              </span>
            ) : type === "album" ? (
              <span className="inline-flex items-center gap-2">
                <Music className="h-10 w-10 text-pink-500" />
                albums
              </span>
            ) : (
              <span className="text-gray-600 font-medium">anything</span>
            )}
          </p>
        </div>

        {type === "movie" ? <SearchMovies /> : <SearchMusic />}
      </section>
    </EditorLayout>
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
        className={buttonStyles({ variant: "bordered", size: "lg" })}
        disabled={loading || nextLoadingLink === null}
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
