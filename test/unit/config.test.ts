import { describe, expect, it } from "vitest";
import { mergeConfig, normalizeConfig } from "../../src/core/config.ts";

describe("normalizeConfig", () => {
  it("provides useful zero-config defaults", () => {
    const config = normalizeConfig({});

    expect(config.appearance).toEqual({
      placement: "bottom-center",
      density: "compact",
      colorScheme: "auto",
      surface: "frosted",
    });
    expect(config.groups.flatMap((group) => group.actions.map((action) => action.id))).toEqual([
      "chatgpt",
      "claude",
    ]);
  });

  it("merges messages and appearance without mutating the input", () => {
    const input = {
      appearance: { density: "comfortable" as const },
      messages: { triggerLabel: "Use AI" },
    };
    const config = normalizeConfig(input);

    expect(config.appearance.density).toBe("comfortable");
    expect(config.appearance.placement).toBe("bottom-center");
    expect(config.messages.triggerLabel).toBe("Use AI");
    expect(config.messages.actionPending("Claude")).toBe("Opening Claude");
    expect(config.messages.actionSucceeded("Claude")).toBe("Claude opened");
    expect(config.messages.actionFailed("Claude")).toBe("Claude could not be opened");
    expect(input).toEqual({
      appearance: { density: "comfortable" },
      messages: { triggerLabel: "Use AI" },
    });
  });

  it("preserves nested configuration when applying controller updates", () => {
    const current = {
      appearance: { density: "compact" as const, placement: "bottom-center" as const },
      messages: { triggerLabel: "Ask AI" },
      theme: { accent: "purple", menuRadius: "18px" },
    };
    const merged = mergeConfig(current, {
      appearance: { placement: "bottom-right" },
      messages: { menuTitle: "Continue with AI" },
      theme: { accent: "blue" },
    });

    expect(merged.appearance).toEqual({ density: "compact", placement: "bottom-right" });
    expect(merged.messages).toEqual({ triggerLabel: "Ask AI", menuTitle: "Continue with AI" });
    expect(merged.theme).toEqual({ accent: "blue", menuRadius: "18px" });
  });

  it("rejects duplicate and selector-unsafe action ids", () => {
    const action = { id: "copy", label: "Copy", onSelect() {} };
    expect(() =>
      normalizeConfig({
        groups: [
          { id: "one", actions: [action] },
          { id: "two", actions: [action] },
        ],
      }),
    ).toThrow("Duplicate action id");

    expect(() =>
      normalizeConfig({ groups: [{ id: "one", actions: [{ ...action, id: "copy link" }] }] }),
    ).toThrow("Invalid action id");
  });
});
