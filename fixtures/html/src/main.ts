import { mountDocsAiIsland } from "docs-ai-island";
import "docs-ai-island/styles.css";

const controller = mountDocsAiIsland({
  pageTitle: () => document.querySelector("h1")?.textContent ?? document.title,
});

document.querySelector<HTMLButtonElement>("[data-navigate]")?.addEventListener("click", () => {
  history.pushState({}, "", "/guide");
  document.title = "Guide route";
  const heading = document.querySelector("h1");
  if (heading) heading.textContent = "Guide route";
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = "https://plain.example.dev/guide";
  controller.refresh();
});
