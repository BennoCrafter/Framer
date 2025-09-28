import { button as buttonStyles } from "@heroui/theme";
import { Link } from "@heroui/link";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
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
        <div className="flex gap-3">
          <Link
            className={buttonStyles({ variant: "bordered", size: "lg" })}
            href="/editor"
          >
            Go to Editor
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
