import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-0">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </footer>
    </div>
  );
}
