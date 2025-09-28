import { button as buttonStyles } from "@heroui/theme";
import { Link } from "@heroui/link";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Music } from "lucide-react";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Transform your&nbsp;</span>
          <span className={title({ color: "yellow" })}>favourite&nbsp;</span>
          <br />
          <span className={title({ color: "violet" })}>
            albums, movies & series&nbsp;
          </span>
          <span className={title()}> into stunning posters</span>
          <div className={subtitle({ class: "mt-4" })}>
            Perfect for upgrading your room.
          </div>
        </div>

        {/* Go to Editor button */}
        {/*<div className="flex gap-3">
          <Link
            className={buttonStyles({ variant: "bordered", size: "lg" })}
            href="/editor"
          >
            Go to Editor
          </Link>
        </div>*/}

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-4xl">
          {/* Album Poster Card */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
            <CardHeader className="flex items-center gap-3">
              <Music className="w-8 h-8 text-yellow-600" />
              <h3 className="text-xl font-semibold">Create Album Poster</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Turn your favorite albums and tracks into stylish album posters.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/search?type=album">Open Album Editor</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Movie Poster Card */}
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
            <CardHeader className="flex items-center gap-3">
              <Film className="w-8 h-8 text-violet-600" />
              <h3 className="text-xl font-semibold">Create Movie Poster</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Design cinematic posters inspired by your favorite movies and TV
                series.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/search?type=movie">Open Movie Editor</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
