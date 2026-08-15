import { createController } from "./core/controller.ts";
import type { DocsAiIslandConfig, DocsAiIslandController } from "./public-types.ts";

export { chatgpt, claude } from "./actions/targets.ts";
export type {
  DocsAiIslandAction,
  DocsAiIslandActionContext,
  DocsAiIslandActionGroup,
  DocsAiIslandAppearance,
  DocsAiIslandColorScheme,
  DocsAiIslandConfig,
  DocsAiIslandController,
  DocsAiIslandDensity,
  DocsAiIslandEvent,
  DocsAiIslandGroupKind,
  DocsAiIslandIcon,
  DocsAiIslandIconName,
  DocsAiIslandMessages,
  DocsAiIslandPageContext,
  DocsAiIslandPlacement,
  DocsAiIslandTheme,
  DocsAiIslandThemeTokens,
  DocsAiTargetOptions,
} from "./public-types.ts";

export function defineConfig<const Config extends DocsAiIslandConfig>(config: Config): Config {
  return config;
}

export function mountDocsAiIsland(config: DocsAiIslandConfig = {}): DocsAiIslandController {
  return createController(config);
}
