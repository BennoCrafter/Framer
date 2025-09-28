import { useSearchParams } from "next/navigation";
import { MovieEditor } from "./movie_editor";
import { AlbumEditor } from "./album_editor";
import { WrongPage } from "../wrong_page";

export default function Editor() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || "";
  const albumId = searchParams?.get("albumId") || null;

  if (type === "movie") {
    return <MovieEditor />;
  }
  if (type === "album" && albumId) {
    return <AlbumEditor albumId={albumId} />;
  }

  return <WrongPage />;
}
