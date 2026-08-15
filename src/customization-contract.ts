export const themeTokenContract = {
  accent: {
    property: "--docs-ai-island-accent",
    defaultValue: "#7567e8",
    category: "Color",
    description: "Accent used by the built-in trigger icon and focus treatment.",
  },
  surface: {
    property: "--docs-ai-island-surface",
    defaultValue: "rgb(255 255 255 / 88%)",
    category: "Color",
    description: "Trigger and menu surface color.",
  },
  foreground: {
    property: "--docs-ai-island-foreground",
    defaultValue: "#202126",
    category: "Color",
    description: "Primary text and icon color.",
  },
  muted: {
    property: "--docs-ai-island-muted",
    defaultValue: "#686a74",
    category: "Color",
    description: "Secondary text and icon color.",
  },
  faint: {
    property: "--docs-ai-island-faint",
    defaultValue: "#8f919a",
    category: "Color",
    description: "Low-emphasis labels, arrows, and chevrons.",
  },
  border: {
    property: "--docs-ai-island-border",
    defaultValue: "rgb(29 31 38 / 11%)",
    category: "Color",
    description: "Border and divider color.",
  },
  hover: {
    property: "--docs-ai-island-hover",
    defaultValue: "rgb(30 31 38 / 6%)",
    category: "Color",
    description: "Interactive hover, focus, and pending-state fill.",
  },
  focusRing: {
    property: "--docs-ai-island-focus-ring",
    defaultValue: "color-mix(in srgb, var(--docs-ai-island-accent) 32%, transparent)",
    category: "Color",
    description: "Outer focus-ring color.",
  },
  shadow: {
    property: "--docs-ai-island-shadow",
    defaultValue: "0 20px 56px rgb(20 22 30 / 18%), 0 1px 2px rgb(20 22 30 / 9%)",
    category: "Surface",
    description: "Menu box shadow.",
  },
  menuWidth: {
    property: "--docs-ai-island-menu-width",
    defaultValue: "340px",
    category: "Menu",
    description: "Preferred menu width before viewport clamping.",
  },
  menuRadius: {
    property: "--docs-ai-island-menu-radius",
    defaultValue: "18px",
    category: "Menu",
    description: "Menu corner radius.",
  },
  menuPadding: {
    property: "--docs-ai-island-menu-padding",
    defaultValue: "6px",
    category: "Menu",
    description: "Inner menu padding in compact density.",
  },
  itemHeight: {
    property: "--docs-ai-island-item-height",
    defaultValue: "50px",
    category: "Menu",
    description: "Minimum primary Action height in compact density.",
  },
  triggerWidth: {
    property: "--docs-ai-island-trigger-width",
    defaultValue: "158px",
    category: "Trigger",
    description: "Trigger width.",
  },
  triggerHeight: {
    property: "--docs-ai-island-trigger-height",
    defaultValue: "44px",
    category: "Trigger",
    description: "Trigger height.",
  },
  triggerRadius: {
    property: "--docs-ai-island-trigger-radius",
    defaultValue: "16px",
    category: "Trigger",
    description: "Trigger corner radius.",
  },
  offsetBlock: {
    property: "--docs-ai-island-offset-block",
    defaultValue: "24px",
    category: "Position",
    description: "Distance from the block-end viewport edge before safe-area inset.",
  },
  offsetInline: {
    property: "--docs-ai-island-offset-inline",
    defaultValue: "24px",
    category: "Position",
    description: "Distance from the inline viewport edge for left and right placements.",
  },
  zIndex: {
    property: "--docs-ai-island-z-index",
    defaultValue: "100",
    category: "Position",
    description: "Island stacking level.",
  },
  fontFamily: {
    property: "--docs-ai-island-font-family",
    defaultValue: "inherit",
    category: "Typography",
    description: "Font family inherited by the Island.",
  },
  backdropFilter: {
    property: "--docs-ai-island-backdrop-filter",
    defaultValue: "blur(24px) saturate(140%)",
    category: "Surface",
    description: "Backdrop effect used by frosted surfaces.",
  },
  motionDuration: {
    property: "--docs-ai-island-motion-duration",
    defaultValue: "180ms",
    category: "Motion",
    description: "Base open, close, and chevron animation duration.",
  },
  motionEasing: {
    property: "--docs-ai-island-motion-easing",
    defaultValue: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    category: "Motion",
    description: "Base open, close, and chevron animation easing.",
  },
} as const;

export const partContract = {
  action: {
    name: "action",
    element: "button",
    description: "Primary Action control.",
  },
  actionArrow: {
    name: "action-arrow",
    element: "span",
    description: "Trailing handoff arrow on a primary Action.",
  },
  actionCopy: {
    name: "action-copy",
    element: "span",
    description: "Text wrapper shared by primary and utility Actions.",
  },
  actionDescription: {
    name: "action-description",
    element: "small",
    description: "Optional primary Action description.",
  },
  actionLabel: {
    name: "action-label",
    element: "strong",
    description: "Action label.",
  },
  actions: {
    name: "actions",
    element: "div",
    description: "Primary Action group container.",
  },
  chevron: {
    name: "chevron",
    element: "span",
    description: "Trigger disclosure indicator.",
  },
  groupLabel: {
    name: "group-label",
    element: "span",
    description: "Optional Action-group label.",
  },
  header: {
    name: "header",
    element: "div",
    description: "Menu header container.",
  },
  headerCopy: {
    name: "header-copy",
    element: "span",
    description: "Menu-title and page-title wrapper.",
  },
  icon: {
    name: "icon",
    element: "svg",
    description: "Built-in decorative icon.",
  },
  iconFrame: {
    name: "icon-frame",
    element: "span",
    description: "Action icon alignment wrapper.",
  },
  liveRegion: {
    name: "live-region",
    element: "div",
    description: "Polite status announcement region.",
  },
  menu: {
    name: "menu",
    element: "div",
    description: "Dialog-like Action menu.",
  },
  pageTitle: {
    name: "page-title",
    element: "small",
    description: "Current Page Context title.",
  },
  title: {
    name: "title",
    element: "strong",
    description: "Menu title.",
  },
  trigger: {
    name: "trigger",
    element: "button",
    description: "Island disclosure trigger.",
  },
  triggerLabel: {
    name: "trigger-label",
    element: "strong",
    description: "Visible trigger label.",
  },
  utilities: {
    name: "utilities",
    element: "div",
    description: "Utility Action group container.",
  },
  utility: {
    name: "utility",
    element: "button",
    description: "Compact utility Action control.",
  },
} as const;
