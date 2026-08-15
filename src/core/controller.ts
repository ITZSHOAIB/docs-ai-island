import type {
  DocsAiIslandAction,
  DocsAiIslandActionContext,
  DocsAiIslandActionGroup,
  DocsAiIslandConfig,
  DocsAiIslandController,
  DocsAiIslandEvent,
  DocsAiIslandPageContext,
  DocsAiIslandThemeTokens,
} from "../public-types.ts";
import { createIcon } from "../ui/icons.ts";
import { mergeConfig, type NormalizedConfig, normalizeConfig } from "./config.ts";
import { type IslandState, initialState, transition } from "./state.ts";

type ActionEntry = {
  readonly action: DocsAiIslandAction;
  readonly group: DocsAiIslandActionGroup;
};

type CloseOptions = { readonly restoreFocus?: boolean };
type ActionOperation = {
  readonly actionId: string;
  readonly abortController: AbortController;
  readonly button?: HTMLButtonElement;
};

const controllers = new WeakMap<Element, DocsAiIslandController>();
let islandId = 0;

const themeProperties: Record<keyof DocsAiIslandThemeTokens, string> = {
  accent: "--docs-ai-island-accent",
  surface: "--docs-ai-island-surface",
  foreground: "--docs-ai-island-foreground",
  muted: "--docs-ai-island-muted",
  faint: "--docs-ai-island-faint",
  border: "--docs-ai-island-border",
  hover: "--docs-ai-island-hover",
  focusRing: "--docs-ai-island-focus-ring",
  shadow: "--docs-ai-island-shadow",
  menuWidth: "--docs-ai-island-menu-width",
  menuRadius: "--docs-ai-island-menu-radius",
  triggerWidth: "--docs-ai-island-trigger-width",
  triggerHeight: "--docs-ai-island-trigger-height",
  triggerRadius: "--docs-ai-island-trigger-radius",
  offsetBlock: "--docs-ai-island-offset-block",
  offsetInline: "--docs-ai-island-offset-inline",
  zIndex: "--docs-ai-island-z-index",
  fontFamily: "--docs-ai-island-font-family",
  motionDuration: "--docs-ai-island-motion-duration",
  motionEasing: "--docs-ai-island-motion-easing",
};

function resolveContainer(document: Document, container?: Element | string): Element {
  if (container instanceof Element) return container;
  if (typeof container === "string") {
    const resolved = document.querySelector(container);
    if (!resolved) throw new TypeError(`Container not found: ${container}`);
    return resolved;
  }
  if (!document.body) throw new TypeError("Cannot mount before document.body exists");
  return document.body;
}

function resolvePageContext(
  document: Document,
  pageTitle?: string | (() => string),
): DocsAiIslandPageContext {
  const location = document.defaultView?.location;
  const url = new URL(location?.href ?? document.baseURI);
  const canonicalHref = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  let canonicalUrl = url;
  if (canonicalHref) {
    try {
      canonicalUrl = new URL(canonicalHref, url);
    } catch {
      canonicalUrl = url;
    }
  }

  const resolvedTitle = typeof pageTitle === "function" ? pageTitle() : pageTitle;
  return {
    url,
    canonicalUrl,
    title: resolvedTitle?.trim() || document.title || canonicalUrl.pathname,
  };
}

function emit(config: NormalizedConfig, event: DocsAiIslandEvent): void {
  try {
    config.onEvent?.(event);
  } catch {
    // Consumer analytics must never break the interaction.
  }
}

function createText(document: Document, part: string, text: string, tag = "span"): HTMLElement {
  const element = document.createElement(tag);
  element.dataset.part = part;
  element.textContent = text;
  return element;
}

export function createController(input: DocsAiIslandConfig = {}): DocsAiIslandController {
  if (typeof document === "undefined") {
    throw new TypeError("mountDocsAiIsland() can only be called in a browser");
  }

  const ownerDocument = document;
  let sourceConfig: DocsAiIslandConfig = input;
  let config = normalizeConfig(sourceConfig);
  let container = resolveContainer(ownerDocument, config.container);
  controllers.get(container)?.destroy();

  const root = ownerDocument.createElement("div");
  root.dataset.docsAiIsland = "";
  root.dataset.state = config.initialOpen ? "open" : "closed";
  root.setAttribute("dir", "auto");
  let state: IslandState = config.initialOpen ? { status: "open" } : initialState;
  let destroyed = false;
  let activeAction: ActionOperation | undefined;
  let actionRegistry = new Map<string, ActionEntry>();
  let trigger: HTMLButtonElement;
  let menu: HTMLElement;
  let liveRegion: HTMLElement;
  const menuId = `docs-ai-island-menu-${++islandId}`;
  const listeners = new AbortController();

  function announce(message: string): void {
    liveRegion.textContent = "";
    const target = liveRegion;
    ownerDocument.defaultView?.requestAnimationFrame(() => {
      if (!destroyed && target === liveRegion && target.isConnected) target.textContent = message;
    });
  }

  function applyTheme(): void {
    for (const [token, property] of Object.entries(themeProperties) as [
      keyof DocsAiIslandThemeTokens,
      string,
    ][]) {
      const value = config.theme[token];
      if (value === undefined) root.style.removeProperty(property);
      else root.style.setProperty(property, value);
    }
  }

  function createActionButton(entry: ActionEntry): HTMLButtonElement {
    const { action, group } = entry;
    const button = ownerDocument.createElement("button");
    button.type = "button";
    button.dataset.part = group.kind === "utility" ? "utility" : "action";
    button.dataset.actionId = action.id;
    button.disabled = action.disabled ?? false;

    const icon = createIcon(ownerDocument, action.icon ?? "external");
    if (icon) {
      const iconFrame = ownerDocument.createElement("span");
      iconFrame.dataset.part = "icon-frame";
      iconFrame.append(icon);
      button.append(iconFrame);
    }

    const copy = ownerDocument.createElement("span");
    copy.dataset.part = "action-copy";
    copy.append(createText(ownerDocument, "action-label", action.label, "strong"));
    if (action.description && group.kind !== "utility") {
      copy.append(createText(ownerDocument, "action-description", action.description, "small"));
    }
    button.append(copy);

    if (group.kind !== "utility") {
      button.append(createText(ownerDocument, "action-arrow", "↗"));
    }
    return button;
  }

  function render(): void {
    actionRegistry = new Map();
    root.replaceChildren();
    root.dataset.state = state.status;
    root.dataset.placement = config.appearance.placement;
    root.dataset.density = config.appearance.density;
    root.dataset.colorScheme = config.appearance.colorScheme;
    root.dataset.surface = config.appearance.surface;
    applyTheme();

    menu = ownerDocument.createElement("div");
    menu.id = menuId;
    menu.dataset.part = "menu";
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "false");
    menu.setAttribute("aria-label", config.messages.menuTitle);
    menu.setAttribute("aria-hidden", String(state.status !== "open"));

    const page = resolvePageContext(ownerDocument, config.pageTitle);
    const header = ownerDocument.createElement("div");
    header.dataset.part = "header";
    const headerCopy = ownerDocument.createElement("span");
    headerCopy.dataset.part = "header-copy";
    headerCopy.append(createText(ownerDocument, "title", config.messages.menuTitle, "strong"));
    headerCopy.append(createText(ownerDocument, "page-title", page.title, "small"));
    header.append(headerCopy);
    menu.append(header);

    for (const group of config.groups) {
      const groupElement = ownerDocument.createElement("div");
      groupElement.dataset.part = group.kind === "utility" ? "utilities" : "actions";
      groupElement.dataset.groupId = group.id;
      if (group.label) {
        groupElement.append(createText(ownerDocument, "group-label", group.label));
      }
      for (const action of group.actions) {
        const entry = { action, group };
        actionRegistry.set(action.id, entry);
        groupElement.append(createActionButton(entry));
      }
      menu.append(groupElement);
    }

    trigger = ownerDocument.createElement("button");
    trigger.type = "button";
    trigger.dataset.part = "trigger";
    trigger.setAttribute("aria-controls", menuId);
    trigger.setAttribute("aria-expanded", String(state.status === "open"));
    trigger.setAttribute("aria-label", config.messages.triggerLabel);
    const triggerIcon = createIcon(ownerDocument, "sparkles");
    if (triggerIcon) trigger.append(triggerIcon);
    trigger.append(
      createText(ownerDocument, "trigger-label", config.messages.triggerLabel, "strong"),
    );
    const chevron = createText(ownerDocument, "chevron", "⌃");
    chevron.setAttribute("aria-hidden", "true");
    trigger.append(chevron);

    liveRegion = ownerDocument.createElement("div");
    liveRegion.dataset.part = "live-region";
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");

    root.append(menu, trigger, liveRegion);
  }

  function focusFirstAction(): void {
    root.querySelector<HTMLButtonElement>("[data-action-id]:not([disabled])")?.focus();
  }

  function open(): void {
    if (destroyed || state.status === "open") return;
    state = transition(state, { type: "open" });
    root.dataset.state = "open";
    menu.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    focusFirstAction();
    emit(config, { type: "open" });
  }

  function close(options: CloseOptions = {}): void {
    if (destroyed || state.status === "closed") return;
    state = transition(state, { type: "close" });
    root.dataset.state = "closed";
    menu.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");
    if (options.restoreFocus) trigger.focus();
    emit(config, { type: "close" });
  }

  function finishAction(operation: ActionOperation): void {
    if (activeAction !== operation) return;
    activeAction = undefined;
    state = transition(state, { type: "action-end", actionId: operation.actionId });
    operation.button?.removeAttribute("aria-busy");
    if (root.dataset.actionStatus !== "error") delete root.dataset.actionStatus;
  }

  function abortActiveAction(): void {
    const operation = activeAction;
    if (!operation) return;
    operation.abortController.abort();
    delete root.dataset.actionStatus;
    finishAction(operation);
  }

  async function runAction(actionId: string): Promise<void> {
    const entry = actionRegistry.get(actionId);
    if (!entry || entry.action.disabled) return;

    abortActiveAction();
    const { action, group } = entry;
    const button = root.querySelector<HTMLButtonElement>(
      `[data-action-id="${CSS.escape(action.id)}"]`,
    );
    const operation: ActionOperation = {
      actionId,
      abortController: new AbortController(),
      ...(button === null ? {} : { button }),
    };
    activeAction = operation;
    state = transition(state, { type: "action-start", actionId });
    button?.setAttribute("aria-busy", "true");
    root.dataset.actionStatus = "pending";
    announce(config.messages.actionPending(action.label));
    emit(config, { type: "action-start", actionId });

    const page = resolvePageContext(ownerDocument, config.pageTitle);
    const context: DocsAiIslandActionContext = {
      page,
      signal: operation.abortController.signal,
      element: root,
      clipboard: {
        writeText(value) {
          const clipboard = ownerDocument.defaultView?.navigator.clipboard;
          if (!clipboard) throw new TypeError("Clipboard is unavailable");
          return clipboard.writeText(value);
        },
      },
      announce,
      close: () => close(),
    };

    try {
      const result = await action.onSelect(context);
      if (operation.abortController.signal.aborted || destroyed) return;
      announce(result || config.messages.actionSucceeded(action.label));
      emit(config, { type: "action-success", actionId });
      if (action.closeOnSelect ?? group.kind !== "utility") close();
    } catch (error) {
      if (operation.abortController.signal.aborted || destroyed) return;
      root.dataset.actionStatus = "error";
      announce(config.messages.actionFailed(action.label));
      emit(config, { type: "action-error", actionId, error });
    } finally {
      if (!destroyed) finishAction(operation);
    }
  }

  root.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-part="trigger"]')) {
        if (state.status === "open") close({ restoreFocus: true });
        else open();
        return;
      }
      const actionButton = target.closest<HTMLElement>("[data-action-id]");
      if (actionButton?.dataset.actionId) void runAction(actionButton.dataset.actionId);
    },
    { signal: listeners.signal },
  );

  root.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && state.status === "open") {
        event.preventDefault();
        close({ restoreFocus: true });
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const actions = [
        ...root.querySelectorAll<HTMLButtonElement>("[data-action-id]:not([disabled])"),
      ];
      if (actions.length === 0) return;
      const current = actions.indexOf(ownerDocument.activeElement as HTMLButtonElement);
      let next = current;
      if (event.key === "ArrowDown") next = (current + 1) % actions.length;
      if (event.key === "ArrowUp") next = (current - 1 + actions.length) % actions.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = actions.length - 1;
      actions[next]?.focus();
      event.preventDefault();
    },
    { signal: listeners.signal },
  );

  ownerDocument.addEventListener(
    "pointerdown",
    (event) => {
      if (state.status === "open" && event.target instanceof Node && !root.contains(event.target))
        close();
    },
    { signal: listeners.signal },
  );

  const controller: DocsAiIslandController = {
    element: root,
    open,
    close: () => close(),
    update(update) {
      if (destroyed) return;
      abortActiveAction();
      delete root.dataset.actionStatus;
      sourceConfig = mergeConfig(sourceConfig, update);
      config = normalizeConfig(sourceConfig);
      const nextContainer = resolveContainer(ownerDocument, config.container);
      if (nextContainer !== container) {
        controllers.delete(container);
        controllers.get(nextContainer)?.destroy();
        container = nextContainer;
        container.append(root);
        controllers.set(container, controller);
      }
      render();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      abortActiveAction();
      listeners.abort();
      controllers.delete(container);
      root.remove();
      emit(config, { type: "destroy" });
    },
  };

  render();
  container.append(root);
  controllers.set(container, controller);
  return controller;
}
