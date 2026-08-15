import { chatgpt, claude, type DocsAiIslandController, mountDocsAiIsland } from "docs-ai-island";
import { type Theme, useData, useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h, nextTick, onMounted, onUnmounted, watch } from "vue";
import "vitepress/dist/client/theme-default/styles/vars.css";
import "docs-ai-island/styles.css";
import "./style.css";

const DocsAiIslandBridge = {
  setup() {
    const route = useRoute();
    const { isDark } = useData();
    let controller: DocsAiIslandController | undefined;

    onMounted(() => {
      controller = mountDocsAiIsland({
        pageTitle: () =>
          document.querySelector<HTMLElement>(".VPDoc h1, .VPHome h1")?.textContent ??
          document.title,
        appearance: {
          colorScheme: isDark.value ? "dark" : "light",
        },
        groups: [
          {
            id: "ai-targets",
            actions: [chatgpt(), claude()],
          },
          {
            id: "fixture-tools",
            kind: "utility",
            actions: [
              {
                id: "capture-route",
                label: "Capture route",
                icon: "link",
                closeOnSelect: false,
                onSelect({ element, page }) {
                  element.dataset.fixtureCanonical = page.canonicalUrl.href;
                  return "Current canonical URL captured";
                },
              },
            ],
          },
        ],
        theme: {
          accent: "var(--vp-c-brand-1)",
          fontFamily: "var(--vp-font-family-base)",
        },
      });
    });

    watch([() => route.path, isDark], async () => {
      await nextTick();
      controller?.update({
        appearance: {
          colorScheme: isDark.value ? "dark" : "light",
        },
      });
    });

    onUnmounted(() => {
      controller?.destroy();
      controller = undefined;
    });

    return () => null;
  },
};

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "layout-bottom": () => h(DocsAiIslandBridge),
    }),
} satisfies Theme;
