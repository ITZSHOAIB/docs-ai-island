import { parts } from "../generated/customization-contract.ts";
import type { DocsAiIslandIcon, DocsAiIslandIconName } from "../public-types.ts";

const paths: Record<DocsAiIslandIconName, readonly string[]> = {
  sparkles: [
    "M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z",
    "M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z",
  ],
  chatgpt: [
    "M12 3.2a4.1 4.1 0 0 1 7.1 2.7 4.1 4.1 0 0 1 1.7 6.8 4.1 4.1 0 0 1-3.7 6 4.1 4.1 0 0 1-6.9.5 4.1 4.1 0 0 1-6.5-3.5 4.1 4.1 0 0 1-1.1-7 4.1 4.1 0 0 1 5.5-5.1A4.1 4.1 0 0 1 12 3.2Z",
    "m8.2 7.1 7.6 4.4v5m0 .4-7.6-4.4v-5m-2.5 5.2 7.6-4.4 4.3 2.5m.7.5-7.6 4.4-4.3-2.5",
  ],
  claude: ["M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M3 12h18M7.5 4.2l9 15.6M16.5 4.2l-9 15.6"],
  copy: ["M8 8h11v11H8z", "M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"],
  file: ["M6 3h8l4 4v14H6V3Z", "M14 3v5h5M9 13h6M9 17h4"],
  link: [
    "m9.5 14.5 5-5M7.5 17.5l-1 1a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0M16.5 6.5l1-1a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0",
  ],
  external: ["M8 16 16 8M10 8h6v6", "M16 13v5H6V8h5"],
};

export function createIcon(document: Document, icon: DocsAiIslandIcon): Node | undefined {
  if (icon === false) return undefined;
  if (typeof icon === "function") return icon(document);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("data-part", parts.icon);

  for (const pathData of paths[icon]) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    svg.append(path);
  }
  return svg;
}
