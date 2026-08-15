import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const referencePath = resolve(process.cwd(), "docs/reference/customization.md");

describe("generated customization reference", () => {
  test("documents every public theme key", async () => {
    const reference = await readFile(referencePath, "utf8");
    const documentedTokens = [
      ...reference.matchAll(/^\| `([a-zA-Z]+)` \| `--docs-ai-island-/gm),
    ].map(([, token]) => token);

    expect(documentedTokens).toEqual([
      "accent",
      "surface",
      "foreground",
      "muted",
      "faint",
      "border",
      "hover",
      "focusRing",
      "shadow",
      "menuWidth",
      "menuRadius",
      "menuPadding",
      "itemHeight",
      "triggerWidth",
      "triggerHeight",
      "triggerRadius",
      "offsetBlock",
      "offsetInline",
      "zIndex",
      "fontFamily",
      "backdropFilter",
      "motionDuration",
      "motionEasing",
    ]);
  });

  test("documents the complete stable part vocabulary", async () => {
    const reference = await readFile(referencePath, "utf8");
    const documentedParts = [...reference.matchAll(/^\| `\[data-part="([^"]+)"\]` \|/gm)].map(
      ([, part]) => part,
    );

    expect(documentedParts).toEqual([
      "action",
      "action-arrow",
      "action-copy",
      "action-description",
      "action-label",
      "actions",
      "chevron",
      "group-label",
      "header",
      "header-copy",
      "icon",
      "icon-frame",
      "live-region",
      "menu",
      "page-title",
      "title",
      "trigger",
      "trigger-label",
      "utilities",
      "utility",
    ]);
  });
});
