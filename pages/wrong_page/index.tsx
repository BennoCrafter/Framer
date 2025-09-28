import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function WrongPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Woops&nbsp;</span>
          <div className={subtitle({ class: "mt-4" })}>
            {"It seems like you've landed on the wrong page."}
          </div>
        </div>

        {/* Go back to home */}
        <div className="flex gap-3">
          <Link
            className={buttonStyles({ variant: "bordered", size: "lg" })}
            href="/"
          >
            Go back to home
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
