export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Framer",
  description:
    "Transform your favourite albums, movies & series into stunning posters—perfect for upgrading your room.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Editor",
      href: "/editor",
    },
    {
      label: "Discover",
      href: "/discover",
    },
  ],
  navMenuItems: [],
  links: {
    github: "https://github.com/BennoCrafter/Framer",
  },
};
