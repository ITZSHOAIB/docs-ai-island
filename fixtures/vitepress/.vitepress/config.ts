import { defineConfig } from "vitepress";

const publicOrigin = "https://vitepress-fixture.docs-ai-island.dev";

export default defineConfig({
  title: "Northstar SDK",
  description: "A realistic VitePress integration fixture for Docs AI Island.",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Reference", link: "/reference/options" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting started", link: "/guide/getting-started" },
          { text: "Long guide", link: "/guide/long-page" },
        ],
      },
      {
        text: "Reference",
        items: [{ text: "Client options", link: "/reference/options" }],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/ITZSHOAIB/docs-ai-island" }],
  },
  transformPageData(pageData) {
    const path = pageData.relativePath.replace(/index\.md$/, "").replace(/\.md$/, "");
    const canonical =
      typeof pageData.frontmatter.canonical === "string"
        ? pageData.frontmatter.canonical
        : `${publicOrigin}/${path}`;
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(["link", { rel: "canonical", href: canonical }]);
  },
});
