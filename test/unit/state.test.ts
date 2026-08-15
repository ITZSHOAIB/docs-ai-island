import { describe, expect, it } from "vitest";
import { initialState, transition } from "../../src/core/state.ts";

describe("island state", () => {
  it("opens, tracks an action, and closes deterministically", () => {
    const open = transition(initialState, { type: "open" });
    expect(open).toEqual({ status: "open" });

    const pending = transition(open, { type: "action-start", actionId: "copy" });
    expect(pending).toEqual({ status: "open", activeActionId: "copy" });
    expect(transition(pending, { type: "action-end", actionId: "copy" })).toEqual({
      status: "open",
    });
    expect(transition(pending, { type: "close" })).toBe(initialState);
  });

  it("ignores a stale action completion", () => {
    const pending = transition(
      { status: "open", activeActionId: "new-action" },
      { type: "action-end", actionId: "old-action" },
    );
    expect(pending).toEqual({ status: "open", activeActionId: "new-action" });
  });
});
