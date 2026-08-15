export type IslandState =
  | { readonly status: "closed" }
  | { readonly status: "open"; readonly activeActionId?: string };

export type IslandStateEvent =
  | { readonly type: "open" }
  | { readonly type: "close" }
  | { readonly type: "action-start"; readonly actionId: string }
  | { readonly type: "action-end"; readonly actionId: string };

export const initialState: IslandState = { status: "closed" };

export function transition(state: IslandState, event: IslandStateEvent): IslandState {
  switch (event.type) {
    case "open":
      return state.status === "open" ? state : { status: "open" };
    case "close":
      return state.status === "closed" ? state : initialState;
    case "action-start":
      return { status: "open", activeActionId: event.actionId };
    case "action-end":
      return state.status === "open" && state.activeActionId === event.actionId
        ? { status: "open" }
        : state;
  }
}
