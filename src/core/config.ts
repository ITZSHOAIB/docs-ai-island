import { defaultGroups } from "../actions/targets.ts";
import type {
  DocsAiIslandActionGroup,
  DocsAiIslandAppearance,
  DocsAiIslandConfig,
  DocsAiIslandMessages,
  DocsAiIslandTheme,
} from "../public-types.ts";

export interface NormalizedConfig {
  readonly container?: Element | string;
  readonly pageTitle?: string | (() => string);
  readonly initialOpen: boolean;
  readonly groups: readonly DocsAiIslandActionGroup[];
  readonly appearance: Required<DocsAiIslandAppearance>;
  readonly messages: DocsAiIslandMessages;
  readonly theme: DocsAiIslandTheme;
  readonly onEvent?: DocsAiIslandConfig["onEvent"];
}

export const defaultAppearance: Required<DocsAiIslandAppearance> = {
  placement: "bottom-center",
  density: "compact",
  colorScheme: "auto",
  surface: "frosted",
};

export const defaultMessages: DocsAiIslandMessages = {
  triggerLabel: "Ask AI",
  menuTitle: "Ask about this page",
  actionPending: (label) => `Opening ${label}`,
  actionSucceeded: (label) => `${label} opened`,
  actionFailed: (label) => `${label} could not be opened`,
};

function assertUniqueActionIds(groups: readonly DocsAiIslandActionGroup[]): void {
  const ids = new Set<string>();
  for (const group of groups) {
    for (const action of group.actions) {
      if (!/^[a-z0-9][a-z0-9-_]*$/i.test(action.id)) {
        throw new TypeError(`Invalid action id: ${action.id}`);
      }
      if (ids.has(action.id)) {
        throw new TypeError(`Duplicate action id: ${action.id}`);
      }
      ids.add(action.id);
    }
  }
}

export function normalizeConfig(config: DocsAiIslandConfig): NormalizedConfig {
  const groups = config.groups ?? defaultGroups();
  assertUniqueActionIds(groups);

  return {
    ...(config.container === undefined ? {} : { container: config.container }),
    ...(config.pageTitle === undefined ? {} : { pageTitle: config.pageTitle }),
    ...(config.onEvent === undefined ? {} : { onEvent: config.onEvent }),
    initialOpen: config.initialOpen ?? false,
    groups,
    appearance: { ...defaultAppearance, ...config.appearance },
    messages: { ...defaultMessages, ...config.messages },
    theme: { ...config.theme },
  };
}

export function mergeConfig(
  current: DocsAiIslandConfig,
  update: Partial<DocsAiIslandConfig>,
): DocsAiIslandConfig {
  return {
    ...current,
    ...update,
    appearance: { ...current.appearance, ...update.appearance },
    messages: { ...current.messages, ...update.messages },
    theme: { ...current.theme, ...update.theme },
  };
}
