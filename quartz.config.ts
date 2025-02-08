import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "d'DG",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "debarchito.is-a.dev",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    generateSocialImages: false,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Raleway",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#eff1f5",
          lightgray: "#ccd0da",
          gray: "#9399b2",
          darkgray: "#6c6f85",
          dark: "#4c4f69",
          secondary: "#8839ef",
          tertiary: "#7287fd",
          highlight: "rgba(139, 170, 248, 0.15)",
          textHighlight: "#d7827e88",
        },
        darkMode: {
          light: "#1e1e2e",
          lightgray: "#313244",
          gray: "#585b70",
          darkgray: "#a6adc8",
          dark: "#cdd6f4",
          secondary: "#cba6f7",
          tertiary: "#b4befe",
          highlight: "rgba(245, 194, 231, 0.15)",
          textHighlight: "#cba6f788",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
// import { QuartzConfig } from "./quartz/cfg"
// import * as Plugin from "./quartz/plugins"

// /**
//  * Quartz 4.0 Configuration
//  *
//  * See https://quartz.jzhao.xyz/configuration for more information.
//  */
// const config: QuartzConfig = {
//   configuration: {
//     pageTitle: "jzhao.xyz",
//     enableSPA: true,
//     enablePopovers: true,
//     analytics: {
//       provider: "plausible",
//     },
//     locale: "en-US",
//     baseUrl: "jzhao.xyz",
//     ignorePatterns: ["private", "templates"],
//     defaultDateType: "created",
//     generateSocialImages: false,
//     theme: {
//       fontOrigin: "googleFonts",
//       cdnCaching: true,
//       typography: {
//         header: "DM Serif Display",
//         body: "Bricolage Grotesque",
//         code: "JetBrains Mono",
//       },
//       colors: {
//         lightMode: {
//           light: "#fffdfa",
//           lightgray: "#d1caba",
//           gray: "#9c9384",
//           darkgray: "#2A354B",
//           dark: "#08142C",
//           secondary: "#274B75",
//           tertiary: "#84a59d",
//           highlight: "rgba(143, 159, 169, 0.15)",
//           textHighlight: "#fff23688",
//         },
//         darkMode: {
//           light: "#0c0f14",
//           lightgray: "#1D232D",
//           gray: "#5A657B",
//           darkgray: "#d4d4d4",
//           dark: "#ebebec",
//           secondary: "#7188A9",
//           tertiary: "#84a59d",
//           highlight: "rgba(143, 159, 169, 0.15)",
//           textHighlight: "#b3aa0288",
//         },
//       },
//     },
//   },
//   plugins: {
//     transformers: [
//       Plugin.FrontMatter(),
//       Plugin.CreatedModifiedDate({
//         priority: ["frontmatter", "filesystem"],
//       }),
//       // Plugin.Poetry(),
//       Plugin.Latex({ renderEngine: "katex" }),
//       Plugin.SyntaxHighlighting(),
//       Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false, parseTags: false, mermaid: false }),
//       Plugin.GitHubFlavoredMarkdown(),
//       Plugin.TableOfContents(),
//       Plugin.CrawlLinks({ markdownLinkResolution: "absolute", lazyLoad: true }),
//       Plugin.Description(),
//       Plugin.Latex({ renderEngine: "katex" }),
//     ],
//     filters: [Plugin.RemoveDrafts()],
//     emitters: [
//       Plugin.AliasRedirects(),
//       Plugin.ComponentResources(),
//       Plugin.ContentPage(),
//       Plugin.FolderPage(),
//       Plugin.TagPage(),
//       Plugin.ContentIndex({
//         enableSiteMap: true,
//         enableRSS: true,
//       }),
//       Plugin.Assets(),
//       Plugin.Static(),
//       Plugin.NotFoundPage(),
//     ],
//   },
// }

// export default config
