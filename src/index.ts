import { createController } from "./core/controller.ts";
import type { DocsAiIslandConfig, DocsAiIslandController } from "./public-types.ts";

export { copyPage, defineContentSource, markdownSource, viewMarkdown } from "./actions/content.ts";
export { copyResource, openUrl } from "./actions/resources.ts";
export { chatgpt, claude } from "./actions/targets.ts";
export type {
  DocsAiCopyPageOptions,
  DocsAiCopyResourceOptions,
  DocsAiIslandAction,
  DocsAiIslandActionContext,
  DocsAiIslandActionGroup,
  DocsAiIslandAppearance,
  DocsAiIslandClipboard,
  DocsAiIslandColorScheme,
  DocsAiIslandConfig,
  DocsAiIslandContent,
  DocsAiIslandContentReadContext,
  DocsAiIslandContentSource,
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
  DocsAiIslandViewableContentSource,
  DocsAiMarkdownSourceOptions,
  DocsAiOpenUrlOptions,
  DocsAiTargetOptions,
  DocsAiViewMarkdownOptions,
} from "./public-types.ts";

export function defineConfig<const Config extends DocsAiIslandConfig>(config: Config): Config {
  return config;
}

export function mountDocsAiIsland(config: DocsAiIslandConfig = {}): DocsAiIslandController {
  return createController(config);
}
