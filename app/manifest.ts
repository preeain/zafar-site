import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zafar Sandhu",
    short_name: "Zafar",
    description: "Official website of Punjabi artist Zafar Sandhu.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [{ src: "/icon.png", sizes: "128x128", type: "image/png" }],
  };
}
