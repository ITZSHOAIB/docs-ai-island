export type MaybePromise<T> = T | Promise<T>;

export type DocsAiIslandPlacement = "bottom-left" | "bottom-center" | "bottom-right";
export type DocsAiIslandDensity = "compact" | "comfortable";
export type DocsAiIslandColorScheme = "auto" | "light" | "dark";
export type DocsAiIslandGroupKind = "primary" | "utility";

export type DocsAiIslandIconName =
  | "sparkles"
  | "chatgpt"
  | "claude"
  | "copy"
  | "file"
  | "link"
  | "external";

export type DocsAiIslandIcon = DocsAiIslandIconName | false | ((document: Document) => Node);

export interface DocsAiIslandPageContext {
  readonly url: URL;
  readonly canonicalUrl: URL;
  readonly title: string;
}

export interface DocsAiIslandActionContext {
  readonly page: DocsAiIslandPageContext;
  readonly signal: AbortSignal;
  readonly element: HTMLElement;
  announce(message: string): void;
  close(): void;
}

export interface DocsAiIslandAction {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: DocsAiIslandIcon;
  readonly disabled?: boolean;
  readonly closeOnSelect?: boolean;
  // biome-ignore lint/suspicious/noConfusingVoidType: callback-style actions conventionally return void.
  onSelect(context: DocsAiIslandActionContext): MaybePromise<string | void>;
}

export interface DocsAiIslandActionGroup {
  readonly id: string;
  readonly label?: string;
  readonly kind?: DocsAiIslandGroupKind;
  readonly actions: readonly DocsAiIslandAction[];
}

export interface DocsAiIslandAppearance {
  readonly placement?: DocsAiIslandPlacement;
  readonly density?: DocsAiIslandDensity;
  readonly colorScheme?: DocsAiIslandColorScheme;
  readonly surface?: "frosted" | "solid";
}

export interface DocsAiIslandMessages {
  readonly triggerLabel: string;
  readonly menuTitle: string;
  readonly actionPending: (label: string) => string;
  readonly actionSucceeded: (label: string) => string;
  readonly actionFailed: (label: string) => string;
}

export interface DocsAiIslandThemeTokens {
  readonly accent: string;
  readonly surface: string;
  readonly foreground: string;
  readonly muted: string;
  readonly faint: string;
  readonly border: string;
  readonly hover: string;
  readonly focusRing: string;
  readonly shadow: string;
  readonly menuWidth: string;
  readonly menuRadius: string;
  readonly triggerWidth: string;
  readonly triggerHeight: string;
  readonly triggerRadius: string;
  readonly offsetBlock: string;
  readonly offsetInline: string;
  readonly zIndex: string;
  readonly fontFamily: string;
  readonly motionDuration: string;
  readonly motionEasing: string;
}

export type DocsAiIslandTheme = Partial<DocsAiIslandThemeTokens>;

export type DocsAiIslandEvent =
  | { readonly type: "open" | "close" | "destroy" }
  | { readonly type: "action-start" | "action-success"; readonly actionId: string }
  | { readonly type: "action-error"; readonly actionId: string; readonly error: unknown };

export interface DocsAiIslandConfig {
  readonly container?: Element | string;
  readonly pageTitle?: string | (() => string);
  readonly initialOpen?: boolean;
  readonly groups?: readonly DocsAiIslandActionGroup[];
  readonly appearance?: DocsAiIslandAppearance;
  readonly messages?: Partial<DocsAiIslandMessages>;
  readonly theme?: DocsAiIslandTheme;
  readonly onEvent?: (event: DocsAiIslandEvent) => void;
}

export interface DocsAiIslandController {
  readonly element: HTMLElement;
  open(): void;
  close(): void;
  update(config: Partial<DocsAiIslandConfig>): void;
  destroy(): void;
}

export interface DocsAiTargetOptions {
  readonly label?: string;
  readonly description?: string;
  readonly prompt?: string | ((page: DocsAiIslandPageContext) => string);
}
