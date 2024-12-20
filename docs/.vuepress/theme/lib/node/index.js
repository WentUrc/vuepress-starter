// src/node/theme.ts
import { sleep } from "@pengzhanbo/utils";

// src/node/autoFrontmatter/generator.ts
import { isArray, isEmptyObject, promiseParallel, toArray } from "@pengzhanbo/utils";
import chokidar from "chokidar";
import { createFilter } from "create-filter";
import grayMatter from "gray-matter";
import jsonToYaml from "json2yaml";
import { fs as fs6, hash as hash3, path as path9 } from "vuepress/utils";

// src/node/loadConfig/compiler.ts
import { promises as fsp } from "node:fs";
import path4 from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { importFileDefault } from "vuepress/utils";

// src/node/utils/index.ts
import { Logger } from "@vuepress/helper";

// src/node/utils/createFsCache.ts
import fs from "node:fs/promises";
import path from "node:path";
import { hash } from "vuepress/utils";
var CACHE_BASE = "markdown";
function createFsCache(app, name) {
  const filepath = app.dir.cache(`${CACHE_BASE}/${name}.json`);
  const cache4 = { hash: "", data: null };
  const read = async () => {
    if (!cache4.data) {
      try {
        const content = await fs.readFile(filepath, "utf-8");
        if (content) {
          const res = JSON.parse(content);
          cache4.data = res.data ?? null;
          cache4.hash = hash(res.hash || "");
        }
      } catch {
      }
    }
    return cache4.data;
  };
  let timer = null;
  const write = async (data) => {
    const currentHash = hash(data);
    if (cache4.hash && currentHash === cache4.hash)
      return;
    cache4.data = data;
    cache4.hash = currentHash;
    timer && clearTimeout(timer);
    timer = setTimeout(async () => {
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, JSON.stringify(cache4), "utf-8");
    }, 300);
  };
  return {
    get hash() {
      return cache4.hash;
    },
    get data() {
      return cache4.data;
    },
    read,
    write
  };
}

// src/node/utils/deleteAttrs.ts
function deleteAttrs(obj, ...attrs) {
  const res = {};
  for (const key in obj) {
    if (!attrs.includes(key)) {
      res[key] = obj[key];
    }
  }
  return res;
}

// src/node/utils/hash.ts
import { createHash } from "node:crypto";
import { customAlphabet } from "nanoid";
var hash2 = (content) => createHash("md5").update(content).digest("hex");
var nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);

// src/node/utils/interopDefault.ts
async function interopDefault(m) {
  const resolved = await m;
  return resolved.default || resolved;
}

// src/node/utils/package.ts
import { fs as fs2, path as path3 } from "vuepress/utils";

// src/node/utils/path.ts
import { ensureEndingSlash, ensureLeadingSlash, isLinkAbsolute, isLinkWithProtocol } from "@vuepress/helper";
import { getDirname, path as path2 } from "vuepress/utils";
var __dirname = getDirname(import.meta.url);
var resolve = (...args) => path2.resolve(__dirname, "../", ...args);
var templates = (url) => resolve("../templates", url);
var RE_SLASH = /(\\|\/)+/g;
function normalizePath(path10) {
  return path10.replace(RE_SLASH, "/");
}
function pathJoin(...args) {
  return normalizePath(path2.join(...args));
}
function normalizeLink(base, link = "") {
  return isLinkAbsolute(link) || isLinkWithProtocol(link) ? link : ensureLeadingSlash(normalizePath(`${base}/${link}/`));
}
var RE_START_END_SLASH = /^\/|\/$/g;
function getCurrentDirname(basePath, filepath) {
  const dirList = normalizePath(basePath || path2.dirname(filepath)).replace(RE_START_END_SLASH, "").split("/");
  return dirList.length > 0 ? dirList[dirList.length - 1] : "";
}
function withBase(path10 = "", base = "/") {
  path10 = ensureEndingSlash(ensureLeadingSlash(path10));
  if (path10.startsWith(base))
    return normalizePath(path10);
  return normalizePath(`${base}${path10}`);
}

// src/node/utils/package.ts
function getThemePackage() {
  let pkg = {};
  try {
    const content = fs2.readFileSync(resolve(".../../package.json"), "utf-8");
    pkg = JSON.parse(content);
  } catch {
  }
  return pkg;
}

// src/node/utils/resolveContent.ts
function resolveContent(app, { name, content, before, after }) {
  content = `${before ? `${before}
` : ""}export const ${name} = ${JSON.stringify(content)}${after ? `
${after}` : ""}`;
  if (app.env.isDev) {
    const func = `update${name[0].toUpperCase()}${name.slice(1)}`;
    content += `

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.${func}) {
    __VUE_HMR_RUNTIME__.${func}(${name})
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ ${name} }) => {
    __VUE_HMR_RUNTIME__.${func}(${name})
  })
}
`;
  }
  return content;
}

// src/node/utils/writeTemp.ts
var contentHash = /* @__PURE__ */ new Map();
async function writeTemp(app, filepath, content) {
  const currentHash = hash2(content);
  if (!contentHash.has(filepath) || contentHash.get(filepath) !== currentHash) {
    contentHash.set(filepath, currentHash);
    await app.writeTemp(filepath, content);
  }
}

// src/node/utils/index.ts
var THEME_NAME = "vuepress-theme-plume";
var logger = new Logger(THEME_NAME);

// src/node/loadConfig/compiler.ts
async function compiler(configPath) {
  if (!configPath) {
    return { config: {}, dependencies: [] };
  }
  const dirnameVarName = "__vite_injected_original_dirname";
  const filenameVarName = "__vite_injected_original_filename";
  const importMetaUrlVarName = "__vite_injected_original_import_meta_url";
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [configPath],
    outfile: "out.js",
    write: false,
    target: [`node${process.versions.node}`],
    platform: "node",
    bundle: true,
    format: "esm",
    mainFields: ["main"],
    sourcemap: "inline",
    metafile: true,
    define: {
      "__dirname": dirnameVarName,
      "__filename": filenameVarName,
      "import.meta.url": importMetaUrlVarName,
      "import.meta.dirname": dirnameVarName,
      "import.meta.filename": filenameVarName
    },
    plugins: [
      {
        name: "externalize-deps",
        setup(build2) {
          build2.onResolve({ filter: /.*/ }, ({ path: id }) => {
            if (id[0] !== "." && !path4.isAbsolute(id)) {
              return { external: true };
            }
            return null;
          });
        }
      },
      {
        name: "inject-file-scope-variables",
        setup(build2) {
          build2.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
            const contents = await fsp.readFile(args.path, "utf-8");
            const injectValues = `const ${dirnameVarName} = ${JSON.stringify(
              path4.dirname(args.path)
            )};const ${filenameVarName} = ${JSON.stringify(args.path)};const ${importMetaUrlVarName} = ${JSON.stringify(
              pathToFileURL(args.path).href
            )};`;
            return {
              loader: args.path.endsWith("ts") ? "ts" : "js",
              contents: injectValues + contents
            };
          });
        }
      }
    ]
  });
  const { text } = result.outputFiles[0];
  const tempFilePath = `${configPath}.${hash2(text)}.mjs`;
  let config;
  try {
    await fsp.writeFile(tempFilePath, text);
    config = await importFileDefault(tempFilePath);
  } finally {
    await fsp.rm(tempFilePath);
  }
  return {
    config,
    dependencies: Object.keys(result.metafile?.inputs ?? {})
  };
}

// src/node/loadConfig/findConfigPath.ts
import fs3, { constants, promises as fsp2 } from "node:fs";
import { resolve as resolve2 } from "node:path";
import process2 from "node:process";
import { colors } from "vuepress/utils";
var CONFIG_FILE_NAME = "plume.config";
var extensions = ["ts", "js", "mts", "cts", "mjs", "cjs"];
async function findConfigPath(app, configPath) {
  const cwd = process2.cwd();
  const source = app.dir.source(".vuepress");
  const paths = [];
  if (configPath) {
    const path10 = resolve2(cwd, configPath);
    if (existsSync(path10) && (await fsp2.stat(path10)).isFile()) {
      return path10;
    }
  }
  extensions.forEach(
    (ext) => paths.push(
      resolve2(cwd, `${source}/${CONFIG_FILE_NAME}.${ext}`),
      resolve2(cwd, `./${CONFIG_FILE_NAME}.${ext}`),
      resolve2(cwd, `./.vuepress/${CONFIG_FILE_NAME}.${ext}`)
    )
  );
  let current;
  for (const path10 of paths) {
    if (existsSync(path10) && (await fsp2.stat(path10)).isFile()) {
      current = path10;
      break;
    }
  }
  if (configPath && current) {
    logger.warn(`Can not find config file: ${colors.gray(configPath)}
Use config file: ${colors.gray(current)}`);
  }
  return current;
}
function existsSync(fp) {
  try {
    fs3.accessSync(fp, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

// src/node/loadConfig/loader.ts
import { deepMerge } from "@pengzhanbo/utils";
import { watch } from "chokidar";
import { path as path5 } from "vuepress/utils";

// src/node/config/resolveLocaleOptions.ts
import { entries, fromEntries, getLocaleConfig } from "@vuepress/helper";

// src/node/locales/en.ts
var enLocale = {
  selectLanguageName: "English",
  selectLanguageText: "Languages",
  appearanceText: "Appearance",
  lightModeSwitchTitle: "Switch to light theme",
  darkModeSwitchTitle: "Switch to dark theme",
  editLinkText: "Edit this page",
  contributorsText: "Contributors",
  lastUpdated: {
    text: "Last Updated"
  },
  encryptButtonText: "Confirm",
  encryptPlaceholder: "Enter password",
  encryptGlobalText: "Only password can access this site",
  encryptPageText: "Only password can access this page",
  footer: {
    message: 'Powered by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>'
  }
};
var enPresetLocale = {
  home: "Home",
  blog: "Blog",
  tag: "Tags",
  archive: "Archives",
  category: "Categories"
};
var enSearchLocale = {
  placeholder: "Search",
  resetButtonTitle: "Reset search",
  backButtonTitle: "Close search",
  noResultsText: "No results for",
  footer: {
    selectText: "to select",
    selectKeyAriaLabel: "enter",
    navigateText: "to navigate",
    navigateUpKeyAriaLabel: "up arrow",
    navigateDownKeyAriaLabel: "down arrow",
    closeText: "to close",
    closeKeyAriaLabel: "escape"
  }
};

// src/node/locales/zh.ts
var zhLocale = {
  selectLanguageName: "\u7B80\u4F53\u4E2D\u6587",
  selectLanguageText: "\u9009\u62E9\u8BED\u8A00",
  appearanceText: "\u5916\u89C2",
  lightModeSwitchTitle: "\u5207\u6362\u4E3A\u6D45\u8272\u4E3B\u9898",
  darkModeSwitchTitle: "\u5207\u6362\u4E3A\u6DF1\u8272\u4E3B\u9898",
  outlineLabel: "\u6B64\u9875\u5185\u5BB9",
  returnToTopLabel: "\u8FD4\u56DE\u9876\u90E8",
  editLinkText: "\u7F16\u8F91\u6B64\u9875",
  contributorsText: "\u8D21\u732E\u8005",
  prevPageLabel: "\u4E0A\u4E00\u9875",
  nextPageLabel: "\u4E0B\u4E00\u9875",
  lastUpdated: {
    text: "\u6700\u540E\u66F4\u65B0\u4E8E"
  },
  notFound: {
    code: "404",
    title: "\u9875\u9762\u672A\u627E\u5230",
    quote: "\u4F46\u662F\uFF0C\u5982\u679C\u4F60\u4E0D\u6539\u53D8\u65B9\u5411\uFF0C\u5E76\u4E14\u4E00\u76F4\u5BFB\u627E\uFF0C\u6700\u7EC8\u53EF\u80FD\u4F1A\u5230\u8FBE\u4F60\u8981\u53BB\u7684\u5730\u65B9\u3002",
    linkText: "\u8FD4\u56DE\u9996\u9875"
  },
  encryptButtonText: "\u786E\u8BA4",
  encryptPlaceholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
  encryptGlobalText: "\u672C\u7AD9\u53EA\u5141\u8BB8\u5BC6\u7801\u8BBF\u95EE",
  encryptPageText: "\u672C\u9875\u9762\u53EA\u5141\u8BB8\u5BC6\u7801\u8BBF\u95EE",
  footer: {
    message: 'Powered by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>'
  }
};
var zhPresetLocale = {
  home: "\u9996\u9875",
  blog: "\u535A\u5BA2",
  tag: "\u6807\u7B7E",
  archive: "\u5F52\u6863",
  category: "\u5206\u7C7B"
};
var zhDocsearchLocale = {
  placeholder: "\u641C\u7D22\u6587\u6863",
  translations: {
    button: {
      buttonText: "\u641C\u7D22\u6587\u6863",
      buttonAriaLabel: "\u641C\u7D22\u6587\u6863"
    },
    modal: {
      searchBox: {
        resetButtonTitle: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6",
        resetButtonAriaLabel: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6",
        cancelButtonText: "\u53D6\u6D88",
        cancelButtonAriaLabel: "\u53D6\u6D88"
      },
      startScreen: {
        recentSearchesTitle: "\u641C\u7D22\u5386\u53F2",
        noRecentSearchesText: "\u6CA1\u6709\u641C\u7D22\u5386\u53F2",
        saveRecentSearchButtonTitle: "\u4FDD\u5B58\u81F3\u641C\u7D22\u5386\u53F2",
        removeRecentSearchButtonTitle: "\u4ECE\u641C\u7D22\u5386\u53F2\u4E2D\u79FB\u9664",
        favoriteSearchesTitle: "\u6536\u85CF",
        removeFavoriteSearchButtonTitle: "\u4ECE\u6536\u85CF\u4E2D\u79FB\u9664"
      },
      errorScreen: {
        titleText: "\u65E0\u6CD5\u83B7\u53D6\u7ED3\u679C",
        helpText: "\u4F60\u53EF\u80FD\u9700\u8981\u68C0\u67E5\u4F60\u7684\u7F51\u7EDC\u8FDE\u63A5"
      },
      footer: {
        selectText: "\u9009\u62E9",
        navigateText: "\u5207\u6362",
        closeText: "\u5173\u95ED",
        searchByText: "\u641C\u7D22\u63D0\u4F9B\u8005"
      },
      noResultsScreen: {
        noResultsText: "\u65E0\u6CD5\u627E\u5230\u76F8\u5173\u7ED3\u679C",
        suggestedQueryText: "\u4F60\u53EF\u4EE5\u5C1D\u8BD5\u67E5\u8BE2",
        reportMissingResultsText: "\u4F60\u8BA4\u4E3A\u8BE5\u67E5\u8BE2\u5E94\u8BE5\u6709\u7ED3\u679C\uFF1F",
        reportMissingResultsLinkText: "\u70B9\u51FB\u53CD\u9988"
      }
    }
  }
};
var zhSearchLocale = {
  placeholder: "\u641C\u7D22\u6587\u6863",
  resetButtonTitle: "\u91CD\u7F6E\u641C\u7D22",
  backButtonTitle: "\u5173\u95ED",
  noResultsText: "\u65E0\u641C\u7D22\u7ED3\u679C\uFF1A",
  footer: {
    selectText: "\u9009\u62E9",
    selectKeyAriaLabel: "\u8F93\u5165",
    navigateText: "\u5207\u6362",
    navigateUpKeyAriaLabel: "\u5411\u4E0A",
    navigateDownKeyAriaLabel: "\u5411\u4E0B",
    closeText: "\u5173\u95ED",
    closeKeyAriaLabel: "\u9000\u51FA"
  }
};

// src/node/locales/index.ts
var LOCALE_OPTIONS = {
  "/zh/": zhLocale,
  "/en/": enLocale
};
var PRESET_LOCALES = {
  "/zh/": zhPresetLocale,
  "/en/": enPresetLocale
};
var DOCSEARCH_LOCALES = {
  "/zh/": zhDocsearchLocale
};
var SEARCH_LOCALES = {
  "/zh/": zhSearchLocale,
  "/en/": enSearchLocale
};

// src/node/config/resolveLocaleOptions.ts
var FALLBACK_OPTIONS = {
  appearance: true,
  blog: {
    pagination: 15,
    postList: true,
    tags: true,
    archives: true,
    categories: true,
    link: "/blog/",
    tagsLink: "/blog/tags/",
    archivesLink: "/blog/archives/",
    categoriesLink: "/blog/categories/"
  },
  article: "/article/",
  notes: { link: "/", dir: "/notes/", notes: [] },
  navbarSocialInclude: ["github", "twitter", "discord", "facebook"],
  aside: true,
  outline: [2, 3],
  externalLinkIcon: true,
  // page meta
  editLink: true,
  contributors: true,
  prevPage: true,
  nextPage: true,
  footer: {
    message: 'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>'
  }
};
function resolveLocaleOptions(app, { locales, ...options }) {
  const resolvedOptions = {
    ...FALLBACK_OPTIONS,
    ...options,
    locales: getLocaleConfig({
      app,
      name: THEME_NAME,
      default: LOCALE_OPTIONS,
      config: fromEntries(
        entries({
          "/": {},
          ...locales
        }).map(([locale, opt]) => [
          locale,
          { ...options, ...opt }
        ])
      )
    })
  };
  return resolvedOptions;
}

// src/node/loadConfig/loader.ts
var loader = null;
async function initConfigLoader(app, defaultConfig, { configFile, onChange } = {}) {
  const start = performance.now();
  const { encrypt, autoFrontmatter, ...localeOptions } = defaultConfig;
  loader = {
    configFile,
    dependencies: [],
    load: () => compiler(loader.configFile),
    loaded: false,
    changeEvents: [],
    whenLoaded: [],
    defaultConfig,
    resolvedConfig: {
      localeOptions: resolveLocaleOptions(app, localeOptions),
      encrypt,
      autoFrontmatter
    }
  };
  const findStart = performance.now();
  loader.configFile = await findConfigPath(app, configFile);
  if (app.env.isDebug) {
    logger.info(`Find config path: ${(performance.now() - findStart).toFixed(2)}ms`);
  }
  if (onChange) {
    loader.changeEvents.push(onChange);
  }
  const loadStart = performance.now();
  const { config, dependencies = [] } = await loader.load();
  if (app.env.isDebug) {
    logger.info(`theme config call load: ${(performance.now() - loadStart).toFixed(2)}ms`);
  }
  loader.loaded = true;
  loader.dependencies = [...dependencies];
  updateResolvedConfig(app, config);
  loader.whenLoaded.forEach((fn) => fn(loader.resolvedConfig));
  loader.whenLoaded = [];
  if (app.env.isDebug) {
    logger.info(`Load config: ${(performance.now() - start).toFixed(2)}ms`);
  }
}
function watchConfigFile(app, watchers, onChange) {
  if (!loader || !loader.configFile)
    return;
  const watcher = watch(loader.configFile, {
    ignoreInitial: true,
    cwd: path5.join(path5.dirname(loader.configFile), "../")
  });
  addDependencies(watcher);
  onConfigChange(onChange);
  watcher.on("change", async () => {
    if (loader) {
      loader.loaded = false;
      const { config, dependencies = [] } = await loader.load();
      loader.loaded = true;
      addDependencies(watcher, dependencies);
      updateResolvedConfig(app, config);
      runChangeEvents();
    }
  });
  watcher.on("unlink", async () => {
    updateResolvedConfig(app);
    runChangeEvents();
  });
  watchers.push(watcher);
}
async function onConfigChange(onChange) {
  if (loader && !loader.changeEvents.includes(onChange)) {
    loader.changeEvents.push(onChange);
    if (loader.loaded) {
      await onChange(loader.resolvedConfig);
    }
  }
}
function waitForConfigLoaded() {
  return new Promise((resolve3) => {
    if (loader?.loaded) {
      resolve3(loader.resolvedConfig);
    } else {
      loader?.whenLoaded.push(resolve3);
    }
  });
}
function getThemeConfig() {
  return loader.resolvedConfig;
}
function updateResolvedConfig(app, userConfig = {}) {
  if (loader) {
    const { encrypt, autoFrontmatter, ...localeOptions } = deepMerge({}, loader.defaultConfig, userConfig);
    loader.resolvedConfig = {
      localeOptions: resolveLocaleOptions(app, localeOptions),
      encrypt,
      autoFrontmatter
    };
  }
}
async function runChangeEvents() {
  if (loader) {
    await Promise.all(loader.changeEvents.map((fn) => fn(loader.resolvedConfig)));
  }
}
function addDependencies(watcher, dependencies) {
  if (!loader)
    return;
  if (dependencies?.length) {
    const deps = dependencies.filter((dep) => !loader.dependencies.includes(dep) && dep[0] === ".");
    loader.dependencies.push(...deps);
    watcher.add(deps);
  } else {
    watcher.add(loader.dependencies);
  }
}

// src/node/autoFrontmatter/readFile.ts
import fg from "fast-glob";
import { fs as fs4, path as path6 } from "vuepress/utils";
async function readMarkdownList(app, { globFilter, checkCache }) {
  const source = app.dir.source();
  const files = await fg(["**/*.md"], {
    cwd: source,
    ignore: ["node_modules", ".vuepress"]
  });
  return await Promise.all(
    files.filter((id) => {
      if (!globFilter(id))
        return false;
      return checkCache(path6.join(source, id));
    }).map((file) => readMarkdown(source, file))
  );
}
async function readMarkdown(sourceDir, relativePath) {
  const filepath = path6.join(sourceDir, relativePath);
  const stats = await fs4.promises.stat(filepath);
  return {
    filepath,
    relativePath,
    content: await fs4.promises.readFile(filepath, "utf-8"),
    createTime: getFileCreateTime(stats),
    stats
  };
}
function getFileCreateTime(stats) {
  return stats.birthtime.getFullYear() !== 1970 ? stats.birthtime : stats.atime;
}

// src/node/autoFrontmatter/resolveOptions.ts
import { uniq as uniq2 } from "@pengzhanbo/utils";
import { ensureLeadingSlash as ensureLeadingSlash2 } from "@vuepress/helper";
import { resolveLocalePath } from "vuepress/shared";
import { path as path8 } from "vuepress/utils";

// src/node/config/extendsBundlerOptions.ts
import {
  addViteConfig,
  addViteOptimizeDepsExclude,
  addViteOptimizeDepsInclude,
  addViteSsrNoExternal,
  chainWebpack
} from "@vuepress/helper";
import { isPackageExists } from "local-pkg";
function extendsBundlerOptions(bundlerOptions, app) {
  addViteConfig(bundlerOptions, app, {
    build: {
      chunkSizeWarningLimit: 2048
    }
  });
  addViteOptimizeDepsInclude(bundlerOptions, app, "@vueuse/core", true);
  addViteOptimizeDepsExclude(bundlerOptions, app, "@theme");
  addViteSsrNoExternal(bundlerOptions, app, [
    "@vuepress/helper",
    "@vuepress/plugin-reading-time",
    "@vuepress/plugin-watermark"
  ]);
  if (isPackageExists("swiper")) {
    addViteOptimizeDepsInclude(bundlerOptions, app, ["swiper/modules", "swiper/vue"]);
    addViteSsrNoExternal(bundlerOptions, app, ["swiper"]);
  }
  const silenceDeprecations = ["mixed-decls", "legacy-js-api", "import", "global-builtin"];
  chainWebpack(bundlerOptions, app, (config) => {
    config.module.rule("scss").use("sass-loader").tap((options) => ({
      ...options,
      sassOptions: {
        silenceDeprecations,
        ...options.sassOptions
      }
    }));
  });
  addViteConfig(bundlerOptions, app, {
    css: {
      preprocessorOptions: {
        sass: {
          silenceDeprecations
        },
        scss: {
          silenceDeprecations
        }
      }
    }
  });
}

// src/node/config/resolveAlias.ts
import { fs as fs5, path as path7 } from "vuepress/utils";
function resolveAlias() {
  return {
    ...Object.fromEntries(
      fs5.readdirSync(
        resolve("client/components"),
        { encoding: "utf-8", recursive: true }
      ).filter((file) => file.endsWith(".vue")).map((file) => [
        path7.join("@theme", file),
        resolve("client/components", file)
      ])
    )
  };
}

// src/node/config/resolveNotesOptions.ts
import { uniq } from "@pengzhanbo/utils";
import { entries as entries2, removeLeadingSlash } from "@vuepress/helper";
function resolveNotesLinkList(localeOptions) {
  const locales = localeOptions.locales || {};
  const notesLinks = [];
  for (const [locale, opt] of entries2(locales)) {
    const config = locale === "/" ? opt.notes || localeOptions.notes : opt.notes;
    if (config && config.notes?.length) {
      const prefix = config.link || "";
      notesLinks.push(
        ...config.notes.map(
          (note) => withBase(`${prefix}/${note.link || ""}`, locale)
        )
      );
    }
  }
  return uniq(notesLinks);
}
function resolveNotesOptions(localeOptions) {
  const locales = localeOptions.locales || {};
  const notesOptionsList = [];
  for (const [locale, opt] of entries2(locales)) {
    const options = locale === "/" ? opt.notes || localeOptions.notes : opt.notes;
    if (options) {
      options.dir = withBase(options.dir, locale);
      notesOptionsList.push(options);
    }
  }
  return notesOptionsList;
}
function resolveNotesDirs(localeOptions) {
  const notesList = resolveNotesOptions(localeOptions);
  return uniq(notesList.flatMap(
    ({ notes, dir }) => notes.map((note) => removeLeadingSlash(normalizePath(`${dir}/${note.dir || ""}/`)))
  ));
}

// src/node/config/resolveProvideData.ts
import { entries as entries3, fromEntries as fromEntries2, getRootLangPath, isPlainObject } from "@vuepress/helper";
function resolveProvideData(app, plugins) {
  const root = getRootLangPath(app);
  return {
    // 注入水印配置
    __PLUME_WM_FP__: isPlainObject(plugins.watermark) ? plugins.watermark.fullPage !== false : true,
    // 注入多语言配置
    __PLUME_PRESET_LOCALE__: fromEntries2(
      entries3(PRESET_LOCALES).map(([locale, value]) => [locale === root ? "/" : locale, value])
    )
  };
}

// src/node/config/resolveSearchOptions.ts
import { getLocaleConfig as getLocaleConfig2 } from "@vuepress/helper";
function resolveSearchOptions(app, { locales, ...options } = {}) {
  return {
    ...options,
    locales: getLocaleConfig2({
      app,
      default: SEARCH_LOCALES,
      config: locales
    })
  };
}
function resolveDocsearchOptions(app, { locales, ...options } = {}) {
  return {
    ...options,
    locales: getLocaleConfig2({
      app,
      default: DOCSEARCH_LOCALES,
      config: locales
    })
  };
}

// src/node/config/resolveThemeData.ts
import { entries as entries4, getRootLangPath as getRootLangPath2, isPlainObject as isPlainObject2 } from "@vuepress/helper";
var EXCLUDE_LIST = ["locales", "sidebar", "navbar", "notes", "sidebar", "article", "avatar"];
var EXCLUDE_LOCALE_LIST = [...EXCLUDE_LIST, "blog", "appearance"];
function resolveThemeData(app, options) {
  const themeData = { locales: {} };
  const root = getRootLangPath2(app);
  entries4(options).forEach(([key, value]) => {
    if (!EXCLUDE_LIST.includes(key))
      themeData[key] = value;
  });
  if (options.avatar) {
    themeData.profile ??= options.avatar;
  }
  if (isPlainObject2(themeData.bulletin)) {
    const { enablePage: _, ...opt } = themeData.bulletin;
    themeData.bulletin = opt;
  }
  entries4(options.locales || {}).forEach(([locale, opt]) => {
    themeData.locales[locale] = {};
    entries4(opt).forEach(([key, value]) => {
      if (!EXCLUDE_LOCALE_LIST.includes(key))
        themeData.locales[locale][key] = value;
    });
    if (opt.avatar) {
      themeData.locales[locale].profile ??= opt.avatar;
    }
    if (isPlainObject2(themeData.locales[locale].bulletin)) {
      const { enablePage: _, ...opt2 } = themeData.locales[locale].bulletin;
      themeData.locales[locale].bulletin = opt2;
    }
  });
  entries4(options.locales || {}).forEach(([locale, opt]) => {
    if (opt.navbar !== false && (!opt.navbar || opt.navbar.length === 0)) {
      const localePath = locale === "/" ? root : locale;
      const navbar = [{
        text: PRESET_LOCALES[localePath].home,
        link: locale
      }];
      if (options.blog !== false) {
        const blog = options.blog || {};
        const blogLink = blog.link || "/blog/";
        navbar.push({
          text: PRESET_LOCALES[localePath].blog,
          link: withBase(blogLink, locale)
        });
        if (blog.tags !== false) {
          navbar.push({
            text: PRESET_LOCALES[localePath].tag,
            link: withBase(blog.tagsLink || `${blogLink}/tags/`, locale)
          });
        }
        if (blog.archives !== false) {
          navbar.push({
            text: PRESET_LOCALES[localePath].archive,
            link: withBase(blog.archivesLink || `${blogLink}/archives/`, locale)
          });
        }
      }
      themeData.locales[locale].navbar = navbar;
    } else {
      themeData.locales[locale].navbar = opt.navbar;
    }
  });
  return themeData;
}

// src/node/config/resolveThemeOption.ts
function resolveThemeOptions({
  themePlugins,
  plugins,
  hostname,
  configFile,
  cache: cache4,
  ...localeOptions
}) {
  const pluginOptions = plugins ?? themePlugins ?? {};
  if (themePlugins) {
    logger.warn(
      `The 'themePlugins' option is deprecated. Please use 'plugins' instead.`
    );
  }
  return {
    cache: cache4,
    configFile,
    pluginOptions,
    hostname,
    localeOptions
  };
}

// src/node/config/templateBuildRenderer.ts
import { templateRenderer } from "vuepress/utils";
function templateBuildRenderer(template, context, options) {
  const pkg = getThemePackage();
  template = template.replace("{{ themeVersion }}", pkg.version || "").replace(/^\s+|\s+$/gm, "").replace(/\n/g, "");
  if (options.appearance ?? true) {
    const appearance = typeof options.appearance === "string" ? options.appearance : "auto";
    const script = appearance === "force-dark" ? `document.documentElement.dataset.theme = 'dark'` : `;(function () {
    const um= localStorage.getItem('vuepress-theme-appearance') || '${appearance}';
    const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = um === 'dark' || (um !== 'light' && sm);
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  })();`.replace(/^\s+|\s+$/gm, "").replace(/\n/g, "");
    template = template.replace("<!--vuepress-theme-plume-appearance-->", `<script id="check-dark-mode">${script}</script>`);
  } else {
    template = template.replace("<!--vuepress-theme-plume-appearance-->", "");
  }
  return templateRenderer(template, context);
}

// src/node/autoFrontmatter/baseFrontmatter.ts
import dayjs from "dayjs";
function createBaseFrontmatter(options) {
  const res = {};
  if (options.createTime !== false) {
    res.createTime = (formatTime, { createTime }, data) => {
      if (formatTime)
        return formatTime;
      if (data.friends || data.pageLayout === "friends")
        return;
      return dayjs(new Date(createTime)).format("YYYY/MM/DD HH:mm:ss");
    };
  }
  return res;
}

// src/node/autoFrontmatter/resolveLinkBySidebar.ts
function resolveLinkBySidebar(sidebar, _prefix) {
  const res = {};
  if (sidebar === "auto") {
    return res;
  }
  for (const item of sidebar) {
    if (typeof item !== "string") {
      const { prefix, dir = "", link = "/", items, text = "" } = item;
      getSidebarLink(items, link, text, pathJoin(_prefix, prefix || dir), res);
    }
  }
  return res;
}
function getSidebarLink(items, link, text, dir = "", res = {}) {
  if (items === "auto")
    return;
  if (!items) {
    res[pathJoin(dir, `${text}.md`)] = link;
    return;
  }
  for (const item of items) {
    if (typeof item === "string") {
      if (!link)
        continue;
      if (item) {
        res[pathJoin(dir, `${item}.md`)] = link;
      } else {
        res[pathJoin(dir, "README.md")] = link;
        res[pathJoin(dir, "index.md")] = link;
        res[pathJoin(dir, "readme.md")] = link;
      }
      res[dir] = link;
    } else {
      const { prefix, dir: subDir = "", link: subLink = "/", items: subItems, text: subText = "" } = item;
      getSidebarLink(subItems, pathJoin(link, subLink), subText, pathJoin(prefix || dir, subDir), res);
    }
  }
}

// src/node/autoFrontmatter/resolveOptions.ts
function resolveOptions(localeOptions, options) {
  const resolveLocale = (relativeFilepath) => resolveLocalePath(localeOptions.locales, ensureLeadingSlash2(relativeFilepath));
  const findNotesByLocale = (locale) => {
    const notes = localeOptions.locales?.[locale]?.notes;
    return notes === false ? void 0 : notes;
  };
  const findNote = (relativeFilepath) => {
    const locale = resolveLocale(relativeFilepath);
    const filepath = ensureLeadingSlash2(relativeFilepath);
    const notes = findNotesByLocale(locale);
    if (!notes)
      return void 0;
    const notesList = notes?.notes || [];
    const notesDir = notes?.dir || "";
    return notesList.find(
      (note) => filepath.startsWith(normalizePath(`${notesDir}/${note.dir}`))
    );
  };
  const baseFrontmatter = createBaseFrontmatter(options);
  const localesNotesDirs = resolveNotesDirs(localeOptions);
  const configs = [];
  if (localesNotesDirs.length) {
    configs.push({
      include: localesNotesDirs.map((dir) => pathJoin(dir, "/{readme,README,index}.md")),
      frontmatter: {
        title(title, { relativePath }) {
          if (title)
            return title;
          if (options.title === false)
            return;
          return findNote(relativePath)?.text || getCurrentDirname("", relativePath);
        },
        ...baseFrontmatter,
        permalink(permalink, { relativePath }, data) {
          if (permalink)
            return permalink;
          if (options.permalink === false || data.friends || data.pageLayout === "friends")
            return;
          const locale = resolveLocale(relativePath);
          const prefix = findNotesByLocale(locale)?.link || "";
          const note = findNote(relativePath);
          return pathJoin(
            prefix.startsWith(locale) ? "/" : locale,
            prefix,
            note?.link || getCurrentDirname(note?.dir, relativePath),
            "/"
          );
        }
      }
    });
    configs.push({
      include: localesNotesDirs.map((dir) => `${dir}**/**.md`),
      frontmatter: {
        title(title, { relativePath }) {
          if (title)
            return title;
          if (options.title === false)
            return;
          return path8.basename(relativePath, ".md").replace(/^\d+\./, "");
        },
        ...baseFrontmatter,
        permalink(permalink, { relativePath }, data) {
          if (permalink)
            return permalink;
          if (options.permalink === false)
            return;
          if (data.friends || data.pageLayout === "friends")
            return;
          const locale = resolveLocale(relativePath);
          const notes = findNotesByLocale(locale);
          const note = findNote(relativePath);
          const prefix = notes?.link || "";
          const args = [
            prefix.startsWith(locale) ? "/" : locale,
            prefix,
            note?.link || ""
          ];
          const sidebar = note?.sidebar;
          if (note && sidebar && sidebar !== "auto") {
            const res = resolveLinkBySidebar(sidebar, pathJoin(notes?.dir || "", note.dir || ""));
            const file = ensureLeadingSlash2(relativePath);
            if (res[file]) {
              args.push(res[file]);
            } else if (res[path8.dirname(file)]) {
              args.push(res[path8.dirname(file)]);
            }
          }
          return pathJoin(...args, nanoid(), "/");
        }
      }
    });
  }
  configs.push({
    include: "**/{readme,README,index}.md",
    frontmatter: {}
  });
  if (localeOptions.blog !== false) {
    configs.push({
      include: localeOptions.blog?.include ?? ["**/*.md"],
      frontmatter: {
        title(title, { relativePath }) {
          if (title)
            return title;
          if (options.title === false)
            return;
          return path8.basename(relativePath || "", ".md");
        },
        ...baseFrontmatter,
        permalink(permalink, { relativePath }) {
          if (permalink)
            return permalink;
          if (options.permalink === false)
            return;
          const locale = resolveLocale(relativePath);
          const prefix = withBase(localeOptions.article || "/article/", locale);
          return normalizePath(`${prefix}/${nanoid()}/`);
        }
      }
    });
  }
  configs.push({
    include: "*",
    frontmatter: {
      title(title, { relativePath }) {
        if (title)
          return title;
        if (options.title === false)
          return;
        return path8.basename(relativePath || "", ".md");
      },
      ...baseFrontmatter,
      permalink(permalink, { relativePath }) {
        if (permalink)
          return permalink;
        if (options.permalink === false)
          return;
        return ensureLeadingSlash2(normalizePath(relativePath.replace(/\.md$/, "/")));
      }
    }
  });
  return {
    include: options?.include ?? ["**/*.md"],
    exclude: uniq2([".vuepress/**/*", "node_modules", ...options?.exclude ?? []]),
    frontmatter: configs
  };
}

// src/node/autoFrontmatter/generator.ts
var CACHE_FILE = "markdown/auto-frontmatter.json";
var generate = null;
function initAutoFrontmatter(localeOptions, autoFrontmatter = {}) {
  const { include, exclude, frontmatter = {} } = resolveOptions(localeOptions, autoFrontmatter);
  const globFilter = createFilter(include, exclude, { resolve: false });
  const userConfig = isArray(frontmatter) ? frontmatter : [{ include: "*", frontmatter }];
  const globalConfig = userConfig.find(({ include: include2 }) => include2 === "*")?.frontmatter || {};
  const rules = userConfig.filter(({ include: include2 }) => include2 !== "*").map(({ include: include2, frontmatter: frontmatter2 }) => {
    return {
      include: include2,
      filter: createFilter(toArray(include2), void 0, { resolve: false }),
      frontmatter: frontmatter2
    };
  });
  const cache4 = {};
  function checkCache(filepath) {
    const stats = fs6.statSync(filepath);
    if (cache4[filepath] && cache4[filepath] === stats.mtimeMs.toString())
      return false;
    cache4[filepath] = stats.mtimeMs.toString();
    return true;
  }
  async function updateCache(app) {
    if (!isEmptyObject(cache4)) {
      await fs6.mkdir(path9.dirname(app.dir.cache(CACHE_FILE)), { recursive: true });
      await fs6.writeFile(app.dir.cache(CACHE_FILE), JSON.stringify(cache4), "utf-8");
    }
  }
  generate = {
    globFilter,
    global: globalConfig,
    rules,
    cache: cache4,
    checkCache,
    updateCache
  };
}
async function generateAutoFrontmatter(app) {
  const start = performance.now();
  if (!generate)
    return;
  const cachePath = app.dir.cache(CACHE_FILE);
  if (fs6.existsSync(cachePath)) {
    try {
      generate.cache = JSON.parse(await fs6.readFile(cachePath, "utf-8"));
    } catch {
      generate.cache = {};
    }
  }
  const markdownList = await readMarkdownList(app, generate);
  await promiseParallel(
    markdownList.map((file) => () => generator(file)),
    64
  );
  await generate.updateCache(app);
  if (app.env.isDebug) {
    logger.info(`Generate auto frontmatter: ${(performance.now() - start).toFixed(2)}ms`);
  }
}
async function watchAutoFrontmatter(app, watchers) {
  if (!generate)
    return;
  const watcher = chokidar.watch("**/*.md", {
    cwd: app.dir.source(),
    ignoreInitial: true,
    ignored: /(node_modules|\.vuepress)\//
  });
  watcher.on("add", async (relativePath) => {
    const enabled = getThemeConfig().autoFrontmatter !== false;
    if (!generate.globFilter(relativePath) || !enabled)
      return;
    const file = await readMarkdown(app.dir.source(), relativePath);
    await generator(file);
  });
  watcher.on("change", async (relativePath) => {
    const enabled = getThemeConfig().autoFrontmatter !== false;
    if (!generate.globFilter(relativePath) || !enabled)
      return;
    if (generate.checkCache(path9.join(app.dir.source(), relativePath)))
      await generate.updateCache(app);
  });
  watchers.push(watcher);
}
async function generator(file) {
  if (!generate)
    return;
  const { filepath, relativePath } = file;
  const current = generate.rules.find(({ filter }) => filter(relativePath));
  const formatter = current?.frontmatter || generate.global;
  const { data, content } = grayMatter(file.content);
  const beforeHash = hash3(data);
  for (const key in formatter) {
    const value = await formatter[key](data[key], file, data) ?? data[key];
    if (typeof value !== "undefined")
      data[key] = value;
    else
      delete data[key];
  }
  if (beforeHash === hash3(data))
    return;
  try {
    const yaml = isEmptyObject(data) ? "" : jsonToYaml.stringify(data).replace(/\n\s{2}/g, "\n").replace(/"/g, "").replace(/\s+\n/g, "\n");
    const newContent = yaml ? `${yaml}---
${content}` : content;
    await fs6.promises.writeFile(filepath, newContent, "utf-8");
    generate.checkCache(filepath);
  } catch (e) {
    console.error(e);
  }
}

// src/node/pages/createPages.ts
import { getRootLang, getRootLangPath as getRootLangPath3 } from "@vuepress/helper";
import { createPage } from "vuepress/core";
async function createPages(app, localeOption) {
  if (localeOption.blog === false)
    return;
  const pageList = [];
  const locales = localeOption.locales || {};
  const rootPath = getRootLangPath3(app);
  const rootLang = getRootLang(app);
  const blog = localeOption.blog || {};
  const link = blog.link || "/blog/";
  const getTitle = (locale, key) => {
    const opt = PRESET_LOCALES[locale] || PRESET_LOCALES[rootPath] || {};
    return opt[key] || "";
  };
  for (const localePath of Object.keys(locales)) {
    const lang = app.siteData.locales?.[localePath]?.lang || rootLang;
    const locale = localePath === "/" ? rootPath : localePath;
    if (blog.postList !== false) {
      pageList.push(createPage(app, {
        path: withBase(link, localePath),
        frontmatter: { lang, _pageLayout: "blog", title: getTitle(locale, "blog") }
      }));
    }
    if (blog.tags !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.tagsLink || `${link}/tags/`, localePath),
        frontmatter: { lang, _pageLayout: "blog-tags", title: getTitle(locale, "tag") }
      }));
    }
    if (blog.archives !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.archivesLink || `${link}/archives/`, localePath),
        frontmatter: { lang, _pageLayout: "blog-archives", title: getTitle(locale, "archive") }
      }));
    }
    if (blog.categories !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.categoriesLink || `${link}/categories/`, localePath),
        frontmatter: { lang, _pageLayout: "blog-categories", title: getTitle(locale, "category") }
      }));
    }
  }
  app.pages.push(...await Promise.all(pageList));
}

// src/node/pages/autoCategory.ts
import { ensureLeadingSlash as ensureLeadingSlash3 } from "@vuepress/helper";
var uuid = 1e4;
var cache = {};
var RE_CATEGORY = /^(?:(\d+)\.)?([\s\S]+)$/;
var LOCALE_RE;
function autoCategory(page, options) {
  const pagePath = page.filePathRelative;
  if (page.data.type || !pagePath)
    return;
  const notesLinks = resolveNotesLinkList(options);
  if (notesLinks.some((link) => page.path.startsWith(link)))
    return;
  LOCALE_RE ??= new RegExp(
    `^(${Object.keys(options.locales || {}).filter((l) => l !== "/").join("|")})`
  );
  const list = ensureLeadingSlash3(pagePath).replace(LOCALE_RE, "").replace(/^\//, "").split("/").slice(0, -1);
  const categoryList = list.map((category, index) => {
    const match = category.match(RE_CATEGORY) || [];
    if (!cache[match[2]] && !match[1]) {
      cache[match[2]] = uuid++;
    }
    return {
      id: hash2(list.slice(0, index + 1).join("-")).slice(0, 6),
      sort: Number(match[1] || cache[match[2]]),
      name: match[2]
    };
  });
  page.data.categoryList = categoryList;
}

// src/node/pages/pageBulletin.ts
import { isPlainObject as isPlainObject3 } from "@vuepress/helper";
function enableBulletin(page, options) {
  let enablePage;
  if (isPlainObject3(options.bulletin) && options.bulletin.enablePage) {
    enablePage = options.bulletin.enablePage;
  } else if (options.locales) {
    for (const locale of Object.keys(options.locales)) {
      if (isPlainObject3(options.locales[locale].bulletin) && options.locales[locale].bulletin.enablePage) {
        enablePage = options.locales[locale].bulletin.enablePage;
        break;
      }
    }
  }
  if (typeof enablePage === "function") {
    page.data.bulletin = enablePage(page) ?? true;
  } else {
    page.data.bulletin = enablePage ?? !!options.bulletin;
  }
}

// src/node/pages/extendsPage.ts
function extendsPageData(page, localeOptions) {
  cleanPageData(page);
  autoCategory(page, localeOptions);
  enableBulletin(page, localeOptions);
}
function cleanPageData(page) {
  page.data.filePathRelative = page.filePathRelative;
  page.routeMeta.title = page.frontmatter.title || page.title;
  if (page.frontmatter.icon) {
    page.routeMeta.icon = page.frontmatter.icon;
  }
  if (page.frontmatter.home) {
    page.frontmatter.pageLayout = "home";
    delete page.frontmatter.home;
  }
  if (page.frontmatter.article === false) {
    page.frontmatter.draft = true;
  }
  delete page.frontmatter.article;
  if (page.frontmatter.friends) {
    page.frontmatter.draft = true;
    page.data.type = "friends";
    page.permalink = page.permalink ?? "/friends/";
    page.frontmatter.pageLayout = "friends";
    delete page.frontmatter.friends;
  }
  const pageType = page.frontmatter._pageLayout;
  if (pageType) {
    page.frontmatter.draft = true;
    page.data.type = pageType;
    delete page.frontmatter._pageLayout;
  }
  if (page.frontmatter.pageLayout === "blog") {
    page.frontmatter.draft = true;
    page.data.type = "blog";
  }
  if ("externalLink" in page.frontmatter) {
    page.frontmatter.externalLinkIcon = page.frontmatter.externalLink;
    delete page.frontmatter.externalLink;
  }
}

// src/node/plugins/getPlugins.ts
import { isPlainObject as isPlainObject4 } from "@vuepress/helper";
import { cachePlugin } from "@vuepress/plugin-cache";
import { commentPlugin } from "@vuepress/plugin-comment";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
import { gitPlugin } from "@vuepress/plugin-git";
import { markdownHintPlugin } from "@vuepress/plugin-markdown-hint";
import { markdownImagePlugin } from "@vuepress/plugin-markdown-image";
import { markdownMathPlugin } from "@vuepress/plugin-markdown-math";
import { nprogressPlugin } from "@vuepress/plugin-nprogress";
import { photoSwipePlugin } from "@vuepress/plugin-photo-swipe";
import { readingTimePlugin } from "@vuepress/plugin-reading-time";
import { seoPlugin } from "@vuepress/plugin-seo";
import { sitemapPlugin } from "@vuepress/plugin-sitemap";
import { watermarkPlugin } from "@vuepress/plugin-watermark";
import { contentUpdatePlugin } from "@vuepress-plume/plugin-content-update";
import { fontsPlugin } from "@vuepress-plume/plugin-fonts";
import { searchPlugin } from "@vuepress-plume/plugin-search";
import { shikiPlugin } from "@vuepress-plume/plugin-shikiji";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import { markdownPowerPlugin } from "vuepress-plugin-md-power";
function getPlugins({
  app,
  pluginOptions,
  hostname,
  cache: cache4
}) {
  const isProd = app.env.isBuild;
  const plugins = [
    fontsPlugin(),
    contentUpdatePlugin(),
    markdownHintPlugin({ hint: true, alert: true, injectStyles: false })
  ];
  if (pluginOptions.readingTime !== false) {
    plugins.push(readingTimePlugin({
      locales: {
        "/zh/": {
          word: "$word\u5B57",
          less1Minute: "\u5C0F\u4E8E1\u5206\u949F",
          time: "\u7EA6$time\u5206\u949F"
        }
      },
      ...pluginOptions.readingTime
    }));
  }
  if (pluginOptions.nprogress !== false) {
    plugins.push(nprogressPlugin());
  }
  if (pluginOptions.git ?? isProd) {
    plugins.push(gitPlugin({
      createdTime: true,
      updatedTime: true,
      contributors: true
    }));
  }
  if (pluginOptions.photoSwipe !== false) {
    plugins.push(photoSwipePlugin({
      selector: ".plume-content > img, .plume-content :not(a) > img",
      delay: 300
    }));
  }
  if (pluginOptions.docsearch) {
    if (pluginOptions.docsearch.appId && pluginOptions.docsearch.apiKey)
      plugins.push(docsearchPlugin(resolveDocsearchOptions(app, pluginOptions.docsearch)));
    else
      console.error("docsearch plugin: appId and apiKey are both required");
  } else if (pluginOptions.search !== false) {
    plugins.push(searchPlugin(resolveSearchOptions(app, pluginOptions.search)));
  }
  const shikiOption = pluginOptions.shiki;
  let shikiTheme = { light: "vitesse-light", dark: "vitesse-dark" };
  if (shikiOption !== false) {
    shikiTheme = shikiOption?.theme ?? shikiTheme;
    plugins.push(shikiPlugin({
      theme: shikiTheme,
      ...shikiOption ?? {}
    }));
  }
  if (pluginOptions.markdownEnhance !== false) {
    const options = {
      ...pluginOptions.markdownEnhance
    };
    plugins.push(mdEnhancePlugin(deleteAttrs(options, "hint", "alert", "imgSize", "imgLazyload", "imgMark", "figure", "obsidianImgSize", "katex", "mathjax", "tabs", "codetabs", "align", "mark", "sub", "sup", "attrs", "tasklist", "footnote")));
  }
  if (pluginOptions.markdownPower !== false) {
    plugins.push(markdownPowerPlugin({
      fileTree: true,
      plot: true,
      icons: true,
      ...pluginOptions.markdownPower || {},
      repl: pluginOptions.markdownPower?.repl ? { theme: shikiTheme, ...pluginOptions.markdownPower?.repl } : pluginOptions.markdownPower?.repl
    }));
  }
  if (pluginOptions.markdownMath !== false) {
    plugins.push(markdownMathPlugin(pluginOptions.markdownMath ?? { type: "katex" }));
  }
  if (pluginOptions.markdownImage) {
    plugins.push(markdownImagePlugin(pluginOptions.markdownImage));
  }
  if (pluginOptions.watermark) {
    plugins.push(watermarkPlugin({
      delay: 300,
      enabled: true,
      ...isPlainObject4(pluginOptions.watermark) ? pluginOptions.watermark : {}
    }));
  }
  if (pluginOptions.comment) {
    plugins.push(commentPlugin(pluginOptions.comment));
  }
  if (pluginOptions.sitemap !== false && hostname && isProd) {
    plugins.push(sitemapPlugin({ hostname }));
  }
  if (pluginOptions.seo !== false && hostname && isProd) {
    plugins.push(seoPlugin({ hostname }));
  }
  if (cache4 !== false) {
    plugins.push(cachePlugin({ type: cache4 || "filesystem" }));
  }
  return plugins;
}

// src/node/prepare/index.ts
import { watch as watch2 } from "chokidar";

// src/node/prepare/prepareArticleTagColor.ts
import { toArray as toArray2 } from "@pengzhanbo/utils";
import { isPlainObject as isPlainObject5 } from "vuepress/shared";
var PRESET = [
  ["#6aa1b7", "#5086a1", "rgba(131, 208, 218, 0.314)"],
  ["#299764", "#18794e", "rgba(16, 185, 129, 0.14)"],
  ["#946300", "#915930", "rgba(234, 179, 8, 0.14)"],
  ["#d5393e", "#b8272c", "rgba(244, 63, 94, 0.14)"],
  ["#7e4cc9", "#6f42c1", "rgba(159, 122, 234, 0.14)"],
  ["#3a5ccc", "#3451b2", "rgba(100, 108, 255, 0.14)"],
  ["#fab10f", "#f39c12", "rgba(255, 213, 0, 0.14)"],
  ["#cc6699", "#be3f7f", "rgba(161, 54, 107, 0.14)"],
  ["#55aaee", "#2391e9", "rgba(21, 123, 206, 0.1333)"],
  ["#9933cc", "#aa56d5", "rgba(179, 102, 217, 0.2)"],
  ["#cc3366", "#d55680", "rgba(217, 102, 140, 0.2)"],
  ["#cc9933", "#be7f3f", "rgba(161, 107, 54, 0.2)"],
  ["#9966cc", "#7171b8", "rgba(83, 83, 167, 0.14)"],
  ["#66cccc", "#3fbebe", "rgba(54, 161, 161, 0.14)"],
  ["#3366cc", "#5680d5", "rgba(102, 140, 217, 0.14)"],
  ["#339999", "#41c0c0", "rgba(83, 198, 198, 0.2)"],
  ["#a6623b", "#c17950", "rgba(199, 134, 97, 0.2411)"],
  ["#8ecaef", "#55afe7", "rgba(42, 155, 225, 0.147)"]
];
var cache2 = {};
async function prepareArticleTagColors(app, localeOptions) {
  const start = performance.now();
  const blog = isPlainObject5(localeOptions.blog) ? localeOptions.blog : {};
  const { js, css } = genCode(app, blog.tagsTheme ?? "colored");
  await writeTemp(app, "internal/articleTagColors.css", css);
  await writeTemp(app, "internal/articleTagColors.js", js);
  if (app.env.isDebug) {
    logger.info(
      `Generate article tag colors: ${(performance.now() - start).toFixed(2)}ms`
    );
  }
}
function genCode(app, theme) {
  const articleTagColors = {};
  const tagList = /* @__PURE__ */ new Set();
  if (theme !== "colored") {
    return {
      js: resolveContent(app, {
        name: "articleTagColors",
        content: articleTagColors
      }),
      css: ""
    };
  }
  app.pages.forEach((page) => {
    const { frontmatter: { tags } } = page;
    if (tags) {
      toArray2(tags).forEach((tag) => {
        if (tag) {
          tagList.add(tag);
        }
      });
    }
  });
  tagList.forEach((tag) => {
    const code = getTagCode(tag);
    if (!cache2[code]) {
      cache2[code] = nanoid(4);
    }
    if (!articleTagColors[tag]) {
      articleTagColors[tag] = cache2[code];
    }
  });
  const js = resolveContent(app, {
    name: "articleTagColors",
    content: articleTagColors,
    before: `import './articleTagColors.css'`
  });
  const css = genCSS();
  return { js, css };
}
function getTagCode(tag) {
  tag = tag.toLowerCase();
  let code = 0;
  for (let i = 0; i < tag.length; i++) {
    code += tag.charCodeAt(i);
  }
  return code % PRESET.length;
}
function genCSS() {
  let css = "";
  for (const [code, className] of Object.entries(cache2)) {
    const index = Number(code);
    const [color, hoverColor, backgroundColor] = PRESET[index];
    css += `.vp-tag-${className} {
  --vp-tag-color: ${color};
  --vp-tag-hover-color: ${hoverColor};
  --vp-tag-bg: ${backgroundColor};
}
`;
  }
  return css;
}

// src/node/prepare/prepareBlogData.ts
import { removeLeadingSlash as removeLeadingSlash2 } from "@vuepress/helper";
import { createFilter as createFilter2 } from "create-filter";
import dayjs2 from "dayjs";

// src/node/prepare/prepareEncrypt.ts
import { isNumber, isString, random, toArray as toArray3 } from "@pengzhanbo/utils";
import { genSaltSync, hashSync } from "bcrypt-ts";
var isStringLike = (value) => isString(value) || isNumber(value);
var separator = ":";
var contentHash2 = "";
var fsCache = null;
async function prepareEncrypt(app, encrypt) {
  const start = performance.now();
  if (!fsCache && app.env.isDev) {
    fsCache = createFsCache(app, "encrypt");
    await fsCache.read();
  }
  contentHash2 = fsCache?.data?.[0] ?? "";
  let resolvedEncrypt = fsCache?.data?.[1];
  const currentHash = encrypt ? hash2(JSON.stringify(encrypt)) : "";
  if (!contentHash2 || contentHash2 !== currentHash || !resolvedEncrypt) {
    contentHash2 = currentHash;
    resolvedEncrypt = resolveEncrypt(encrypt);
  }
  await writeTemp(app, "internal/encrypt.js", resolveContent(app, {
    name: "encrypt",
    content: resolvedEncrypt
  }));
  fsCache?.write([currentHash, resolvedEncrypt]);
  if (app.env.isDebug) {
    logger.info(`Generate encrypt: ${(performance.now() - start).toFixed(2)}ms`);
  }
}
var salt = () => genSaltSync(random(8, 16));
function resolveEncrypt(encrypt) {
  const admin = encrypt?.admin ? toArray3(encrypt.admin).filter(isStringLike).map((item) => hashSync(String(item), salt())).join(separator) : "";
  const rules = {};
  const keys = Object.keys(encrypt?.rules ?? {});
  if (encrypt?.rules) {
    Object.keys(encrypt.rules).forEach((key) => {
      const index = keys.indexOf(key);
      rules[String(index)] = toArray3(encrypt.rules[key]).filter(isStringLike).map((item) => hashSync(String(item), salt())).join(separator);
    });
  }
  return [encrypt?.global ?? false, separator, admin, keys, rules];
}
function isEncryptPage(page, encrypt) {
  if (!encrypt)
    return false;
  const rules = encrypt.rules ?? {};
  return Object.keys(rules).some((match) => {
    const relativePath = page.data.filePathRelative || "";
    if (match[0] === "^") {
      const regex = new RegExp(match);
      return regex.test(page.path) || relativePath && regex.test(relativePath);
    }
    if (match.endsWith(".md"))
      return relativePath && relativePath.endsWith(match);
    return page.path.startsWith(match) || relativePath.startsWith(match);
  });
}

// src/node/prepare/prepareBlogData.ts
var HEADING_RE = /<h(\d)[^>]*>.*?<\/h\1>/gi;
var EXCERPT_SPLIT = "<!-- more -->";
function getTimestamp(time) {
  return new Date(time).getTime();
}
async function preparedBlogData(app, localeOptions, encrypt) {
  if (localeOptions.blog === false) {
    const content2 = resolveContent(app, { name: "blogPostData", content: [] });
    await writeTemp(app, "internal/blogData.js", content2);
    return;
  }
  const start = performance.now();
  const blog = localeOptions.blog || {};
  const notesList = resolveNotesOptions(localeOptions);
  const notesDirList = notesList.map((notes) => removeLeadingSlash2(normalizePath(`${notes.dir}/**`))).filter(Boolean);
  const filter = createFilter2(
    blog.include ?? ["**/*.md"],
    [
      "**/{README,readme,index}.md",
      "**/.vuepress/**",
      "**/node_modules/**",
      ...blog.exclude ?? [],
      ...notesDirList
    ].filter(Boolean),
    { resolve: false }
  );
  const pages = app.pages.filter(
    (page) => page.filePathRelative && filter(page.filePathRelative) && page.frontmatter.draft !== true
  ).sort(
    (prev, next) => getTimestamp(prev.frontmatter.createTime || prev.date) < getTimestamp(next.frontmatter.createTime || next.date) ? 1 : -1
  );
  const blogData = pages.map((page) => {
    const tags = page.frontmatter.tags;
    const data = {
      path: page.path,
      title: page.title,
      categoryList: page.data.categoryList,
      tags,
      sticky: page.frontmatter.sticky,
      createTime: dayjs2(new Date(page.data.frontmatter.createTime || page.date)).format("YYYY/MM/DD HH:mm:ss"),
      lang: page.lang,
      excerpt: "",
      cover: page.data.frontmatter.cover
    };
    if (isEncryptPage(page, encrypt)) {
      data.encrypt = true;
    }
    const fmExcerpt = page.frontmatter.excerpt;
    if (fmExcerpt !== false) {
      if (typeof fmExcerpt === "string") {
        data.excerpt = fmExcerpt;
      } else if (page.contentRendered.includes(EXCERPT_SPLIT)) {
        const contents = page.contentRendered.split(EXCERPT_SPLIT);
        let excerpt = contents[0];
        excerpt = excerpt.replace(HEADING_RE, "");
        data.excerpt = excerpt;
      }
    }
    return data;
  });
  const content = resolveContent(app, { name: "blogPostData", content: blogData });
  await writeTemp(app, "internal/blogData.js", content);
  if (app.env.isDebug)
    logger.info(`prepare blog data time spent: ${(performance.now() - start).toFixed(2)}ms`);
}

// src/node/prepare/prepareIcons.ts
import { getIconContentCSS, getIconData } from "@iconify/utils";
import { isArray as isArray2, uniq as uniq3 } from "@pengzhanbo/utils";
import { entries as entries5, isLinkAbsolute as isLinkAbsolute2, isLinkHttp, isPlainObject as isPlainObject6 } from "@vuepress/helper";
import { isPackageExists as isPackageExists2 } from "local-pkg";
import { fs as fs7 } from "vuepress/utils";
var ICON_REGEXP = /<(?:VP)?(Icon|Card|LinkCard)([^>]*)>/g;
var ICON_NAME_REGEXP = /(?:name|icon)="([^"]+)"/;
var URL_CONTENT_REGEXP = /(url\([\s\S]+\))/;
var ICONIFY_NAME = /^[\w-]+:[\w-]+$/;
var JS_FILENAME = "internal/iconify.js";
var CSS_FILENAME = "internal/iconify.css";
var isInstalled = isPackageExists2("@iconify/json");
var locate;
var fsCache2 = null;
var cache3 = {};
function isIconify(icon) {
  if (!icon || typeof icon !== "string" || isLinkAbsolute2(icon) || isLinkHttp(icon))
    return false;
  return icon[0] !== "{" && ICONIFY_NAME.test(icon);
}
async function prepareIcons(app, localeOptions) {
  const start = performance.now();
  if (!isInstalled) {
    await writeTemp(app, JS_FILENAME, resolveContent(app, { name: "icons", content: "{}" }));
    return;
  }
  if (!fsCache2 && app.env.isDev) {
    fsCache2 = createFsCache(app, "iconify");
    await fsCache2.read();
  }
  const iconList = [];
  app.pages.forEach((page) => iconList.push(...getIconsWithPage(page)));
  iconList.push(...getIconWithThemeConfig(localeOptions));
  const collectMap = {};
  uniq3(iconList).filter((icon) => {
    if (fsCache2?.data?.[icon] && !cache3[icon])
      cache3[icon] = fsCache2.data[icon];
    return !cache3[icon];
  }).forEach((iconName) => {
    const [collect, name] = iconName.split(":");
    if (!collectMap[collect])
      collectMap[collect] = [];
    collectMap[collect].push(name);
  });
  if (app.env.isDebug) {
    logger.info(`Generate icons with pages and theme config: ${(performance.now() - start).toFixed(2)}ms`);
  }
  const collectStart = performance.now();
  if (!locate) {
    const mod = await interopDefault(import("@iconify/json"));
    locate = mod.locate;
  }
  const unknownList = (await Promise.all(
    entries5(collectMap).map(([collect, names]) => resolveCollect(collect, names))
  )).flat();
  if (unknownList.length) {
    logger.warn(`[iconify] Unknown icons: ${unknownList.join(", ")}`);
  }
  if (app.env.isDebug) {
    logger.info(`Generate icons with iconify collect: ${(performance.now() - collectStart).toFixed(2)}ms`);
  }
  let cssCode = "";
  const map = {};
  for (const [iconName, { className, content, background }] of entries5(cache3)) {
    map[iconName] = `${className}${background ? " bg" : ""}`;
    cssCode += `.${className} {
  --icon: ${content};
}
`;
  }
  await Promise.all([
    writeTemp(app, CSS_FILENAME, cssCode),
    writeTemp(app, JS_FILENAME, resolveContent(app, {
      name: "icons",
      content: map,
      before: `import './iconify.css'`
    }))
  ]);
  fsCache2?.write(cache3);
  if (app.env.isDebug) {
    logger.info(`Generate icons total time: ${(performance.now() - start).toFixed(2)}ms`);
  }
}
function getIconsWithPage(page) {
  const list = page.contentRendered.match(ICON_REGEXP)?.map((match) => match.match(ICON_NAME_REGEXP)?.[1]).filter(isIconify) || [];
  const fm = page.frontmatter;
  if (fm.icon && isIconify(fm.icon)) {
    list.push(fm.icon);
  }
  if ((fm.home || fm.pageLayout === "home") && fm.config?.length) {
    for (const config of fm.config) {
      if (config.type === "features" && config.features.length) {
        for (const feature of config.features) {
          if (feature.icon && isIconify(feature.icon))
            list.push(feature.icon);
        }
      }
    }
  }
  return list;
}
function getIconWithThemeConfig(localeOptions) {
  const list = [];
  const locales = localeOptions.locales || {};
  entries5(locales).forEach(([, { navbar, sidebar, notes }]) => {
    if (navbar) {
      list.push(...getIconWithNavbar(navbar));
    }
    const sidebarList = Object.values(sidebar || {});
    if (notes) {
      notes.notes.forEach((note) => {
        if (note.sidebar)
          sidebarList.push(note.sidebar);
      });
    }
    sidebarList.forEach((sidebar2) => list.push(...getIconWithSidebar(sidebar2)));
  });
  return list.filter(isIconify);
}
function getIconWithNavbar(navbar) {
  const list = [];
  navbar.forEach((item) => {
    if (typeof item !== "string") {
      if (isIconify(item.icon))
        list.push(item.icon);
      if (item.items?.length)
        list.push(...getIconWithNavbar(item.items));
    }
  });
  return list;
}
function getIconWithSidebar(sidebar) {
  const list = [];
  if (isArray2(sidebar)) {
    sidebar.forEach((item) => {
      if (typeof item !== "string") {
        if (isIconify(item.icon))
          list.push(item.icon);
        if (item.items?.length)
          list.push(...getIconWithSidebar(item.items));
      }
    });
  } else if (isPlainObject6(sidebar)) {
    entries5(sidebar).forEach(([, item]) => {
      if (typeof item !== "string") {
        if (isArray2(item)) {
          list.push(...getIconWithSidebar(item));
        } else if (item.items?.length) {
          list.push(...getIconWithSidebar(item.items));
        }
      }
    });
  }
  return list;
}
async function resolveCollect(collect, names) {
  const filepath = locate(collect);
  const config = await readJSON(filepath);
  if (!config) {
    logger.warn(`[iconify] Can not find icon collect: ${collect}!`);
    return [];
  }
  const unknownList = [];
  for (const name of names) {
    const data = getIconData(config, name);
    const icon = `${collect}:${name}`;
    if (!data) {
      unknownList.push(icon);
    } else if (!cache3[icon]) {
      const content = getIconContentCSS(data, {
        height: data.height || 24
      });
      const matched = content.match(URL_CONTENT_REGEXP)?.[1] ?? "";
      const background = !data.body.includes("currentColor");
      cache3[icon] = {
        className: `vpi-${nanoid()}`,
        background,
        content: matched
      };
    }
  }
  return unknownList;
}
async function readJSON(filepath) {
  try {
    return await fs7.readJSON(filepath, "utf-8");
  } catch {
    return null;
  }
}

// src/node/prepare/prepareSidebar.ts
import {
  entries as entries6,
  isArray as isArray3,
  isPlainObject as isPlainObject7,
  removeLeadingSlash as removeLeadingSlash3
} from "@vuepress/helper";
async function prepareSidebar(app, localeOptions) {
  const start = performance.now();
  const sidebar = getAllSidebar(localeOptions);
  const { resolved, autoHome } = getSidebarData(app, sidebar);
  sidebar.__auto__ = resolved;
  sidebar.__home__ = autoHome;
  await writeTemp(app, "internal/sidebar.js", resolveContent(app, { name: "sidebar", content: sidebar }));
  if (app.env.isDebug) {
    logger.info(`Generate sidebar: ${(performance.now() - start).toFixed(2)}ms`);
  }
}
function getSidebarData(app, locales) {
  const autoDirList = [];
  const resolved = {};
  entries6(locales).forEach(([localePath, sidebar]) => {
    if (!sidebar)
      return;
    if (isArray3(sidebar)) {
      autoDirList.push(...findAutoDirList(sidebar));
    } else if (isPlainObject7(sidebar)) {
      entries6(sidebar).forEach(([dirname, config]) => {
        const prefix = normalizeLink(localePath, dirname);
        if (config === "auto") {
          autoDirList.push(prefix);
        } else if (isArray3(config)) {
          autoDirList.push(...findAutoDirList(config, prefix));
        } else if (config.items === "auto") {
          autoDirList.push(normalizeLink(prefix, config.prefix));
        } else {
          autoDirList.push(
            ...findAutoDirList(
              config.items || [],
              normalizeLink(prefix, config.prefix)
            )
          );
        }
      });
    } else if (sidebar === "auto") {
      autoDirList.push(localePath);
    }
  });
  const autoHome = {};
  autoDirList.forEach((localePath) => {
    const { link, sidebar } = getAutoDirSidebar(app, localePath);
    resolved[localePath] = sidebar;
    if (link) {
      autoHome[localePath] = link;
    }
  });
  return { resolved, autoHome };
}
var MD_RE = /\.md$/;
var NUMBER_RE = /^\d+\./;
function resolveTitle(dirname) {
  return dirname.replace(MD_RE, "").replace(NUMBER_RE, "");
}
function getAutoDirSidebar(app, localePath) {
  const locale = removeLeadingSlash3(localePath);
  let pages = app.pages.filter((page) => page.data.filePathRelative?.startsWith(locale)).map((page) => {
    return { ...page, splitPath: page.data.filePathRelative?.split("/") || [] };
  });
  const maxIndex = Math.max(...pages.map((page) => page.splitPath.length));
  let nowIndex = 0;
  while (nowIndex < maxIndex) {
    pages = pages.sort((prev, next) => {
      const pi = prev.splitPath?.[nowIndex]?.match(/(?:(\d+)\.)?(?=[^/]+$)/)?.[1];
      const ni = next.splitPath?.[nowIndex]?.match(/(?:(\d+)\.)?(?=[^/]+$)/)?.[1];
      if (!pi || !ni)
        return 0;
      return Number.parseFloat(pi) < Number.parseFloat(ni) ? -1 : 1;
    });
    nowIndex++;
  }
  const RE_INDEX = ["index.md", "README.md", "readme.md"];
  const sidebar = [];
  let rootLink = "";
  for (const page of pages) {
    const { data, title, path: path10, frontmatter } = page;
    const paths = (data.filePathRelative || "").slice(localePath.replace(/^\/|\/$/g, "").length + 1).split("/");
    let index = 0;
    let dir;
    let items = sidebar;
    let parent;
    while (dir = paths[index]) {
      const text = resolveTitle(dir);
      const isHome = RE_INDEX.includes(dir);
      let current = items.find((item) => item.text === text);
      if (!current) {
        current = { text, link: void 0, items: [] };
        if (!isHome) {
          items.push(current);
        }
      }
      if (dir.endsWith(".md")) {
        if (isHome) {
          if (parent) {
            parent.link = path10;
          } else {
            rootLink = path10;
          }
        } else {
          current.link = path10;
          current.text = title;
        }
      }
      if (frontmatter.icon) {
        current.icon = frontmatter.icon;
      }
      if (parent?.items?.length) {
        parent.collapsed = false;
      }
      parent = current;
      items = current.items;
      index++;
    }
  }
  return { link: rootLink, sidebar };
}
function findAutoDirList(sidebar, prefix = "") {
  const list = [];
  if (!sidebar.length)
    return list;
  sidebar.forEach((item) => {
    if (isPlainObject7(item)) {
      const nextPrefix = normalizeLink(prefix, item.prefix || item.dir);
      if (item.items === "auto") {
        list.push(nextPrefix);
      } else if (item.items?.length) {
        list.push(...findAutoDirList(item.items, nextPrefix));
      }
    }
  });
  return list;
}
function getAllSidebar(localeOptions) {
  const locales = {};
  for (const [locale, opt] of entries6(localeOptions.locales || {})) {
    const notes = locale === "/" ? opt.notes || localeOptions.notes : opt.notes;
    const sidebar = locale === "/" ? opt.sidebar || localeOptions.sidebar : opt.sidebar;
    locales[locale] = {};
    for (const [key, value] of entries6(sidebar || {})) {
      locales[locale][normalizeLink(key)] = value;
    }
    if (notes && notes.notes?.length) {
      const prefix = notes.link || "";
      for (const note of notes.notes) {
        if (note.sidebar) {
          locales[locale][normalizeLink(prefix, note.link || "/")] = {
            items: note.sidebar,
            prefix: normalizeLink(notes.dir, note.dir)
          };
        }
      }
    }
  }
  return locales;
}

// src/node/prepare/index.ts
async function prepareData(app) {
  const start = performance.now();
  const { localeOptions, encrypt } = getThemeConfig();
  await Promise.all([
    prepareArticleTagColors(app, localeOptions),
    preparedBlogData(app, localeOptions, encrypt),
    prepareSidebar(app, localeOptions),
    prepareEncrypt(app, encrypt),
    prepareIcons(app, localeOptions)
  ]);
  if (app.env.isDebug) {
    logger.info(`Prepare data: ${(performance.now() - start).toFixed(2)}ms`);
  }
}
function watchPrepare(app, watchers) {
  const pagesWatcher = watch2("pages/**/*.js", {
    cwd: app.dir.temp(),
    ignoreInitial: true
  });
  watchers.push(pagesWatcher);
  pagesWatcher.on("change", () => prepareData(app));
  pagesWatcher.on("add", () => prepareData(app));
  pagesWatcher.on("unlink", () => prepareData(app));
}

// src/node/prepare/prepareThemeData.ts
import fs8 from "node:fs/promises";
import process3 from "node:process";
import { watch as watch3 } from "chokidar";
import { hash as hash4 } from "vuepress/utils";
import { resolveImageSize } from "vuepress-plugin-md-power";
var bulletinFileWatcher = null;
var bulletinFiles = {};
process3.on("exit", () => bulletinFileWatcher?.close());
async function prepareThemeData(app, localeOptions, pluginOptions) {
  const start = performance.now();
  const resolvedThemeData = resolveThemeData(app, localeOptions);
  await resolveProfileImage(app, resolvedThemeData, pluginOptions);
  if (bulletinFileWatcher) {
    bulletinFileWatcher.close();
    bulletinFileWatcher = null;
  }
  await resolveBulletin(app, resolvedThemeData);
  await updateThemeData(app, resolvedThemeData);
  if (app.env.isDebug) {
    logger.info(`Generate theme data: ${(performance.now() - start).toFixed(2)}ms`);
  }
}
async function updateThemeData(app, themeData) {
  const content = resolveContent(app, { name: "themeData", content: themeData });
  await writeTemp(app, "internal/themePlumeData.js", content);
}
async function resolveBulletin(app, themeData) {
  if (themeData.bulletin === true)
    themeData.bulletin = {};
  if (themeData.bulletin)
    themeData.bulletin.id ||= hash4(themeData.bulletin);
  if (themeData.bulletin) {
    if (bulletinFiles.root || themeData.bulletin.contentFile) {
      bulletinFiles.root = themeData.bulletin.contentFile || bulletinFiles.root;
      delete themeData.bulletin.contentFile;
      themeData.bulletin.content = await readBulletinFile(app, bulletinFiles.root);
    } else if (themeData.bulletin.content) {
      const type = themeData.bulletin.contentType ?? "text";
      themeData.bulletin.content = type === "markdown" ? app.markdown.render(themeData.bulletin.content, {
        filepath: app.dir.source(`/_bulletin.md`),
        filePathRelative: `_bulletin.md`
      }) : themeData.bulletin.content;
    }
  }
  if (themeData.locales) {
    for (const locale of Object.keys(themeData.locales)) {
      if (themeData.locales[locale].bulletin === true)
        themeData.locales[locale].bulletin = {};
      if (themeData.locales[locale].bulletin)
        themeData.locales[locale].bulletin.id ||= hash4(themeData.locales[locale].bulletin);
      if (!themeData.locales[locale].bulletin)
        continue;
      if (bulletinFiles[locale] || themeData.locales[locale].bulletin.contentFile) {
        bulletinFiles[locale] = themeData.locales[locale].bulletin?.contentFile || bulletinFiles[locale];
        delete themeData.locales[locale].bulletin.contentFile;
        themeData.locales[locale].bulletin.content = await readBulletinFile(app, bulletinFiles[locale], locale);
      } else if (themeData.locales[locale].bulletin.content) {
        const type = themeData.locales[locale].bulletin.contentType ?? "text";
        themeData.locales[locale].bulletin.content = type === "markdown" ? app.markdown.render(themeData.locales[locale].bulletin.content, {
          filepath: app.dir.source(`${locale}_bulletin.md`),
          filePathRelative: `${locale.slice(1)}_bulletin.md`
        }) : themeData.locales[locale].bulletin.content;
      }
    }
  }
  const files = Array.from(new Set(Object.values(bulletinFiles)));
  if (app.env.isDev && files.length) {
    if (!bulletinFileWatcher) {
      bulletinFileWatcher = watch3(files, { ignoreInitial: true });
      bulletinFileWatcher.on("change", async () => {
        await resolveBulletin(app, themeData);
        await updateThemeData(app, themeData);
      });
    } else {
      files.forEach((file) => bulletinFileWatcher?.add(file));
    }
  }
}
async function readBulletinFile(app, filepath, locale = "/") {
  try {
    const content = await fs8.readFile(filepath, "utf-8");
    if (filepath.endsWith(".md")) {
      return app.markdown.render(content, {
        filepath: app.dir.source(`${locale}_bulletin.md`),
        filePathRelative: `${locale.slice(1)}_bulletin.md`
      });
    }
    return content;
  } catch {
  }
  return "";
}
async function resolveProfileImage(app, themeData, pluginOptions) {
  const imageSize = typeof pluginOptions.markdownPower === "boolean" ? false : pluginOptions.markdownPower?.imageSize;
  if (!app.env.isBuild || !imageSize)
    return;
  const remote = imageSize === "all";
  if (themeData.profile?.avatar) {
    const { width, height } = await resolveImageSize(app, themeData.profile.avatar, remote);
    if (width && height) {
      themeData.profile = {
        ...themeData.profile,
        originalWidth: width,
        originalHeight: height
      };
    }
  }
  if (themeData.locales) {
    for (const locale of Object.keys(themeData.locales)) {
      if (themeData.locales[locale].profile?.avatar) {
        const { width, height } = await resolveImageSize(app, themeData.locales[locale].profile.avatar, remote);
        if (width && height) {
          themeData.locales[locale].profile = {
            ...themeData.locales[locale].profile,
            originalWidth: width,
            originalHeight: height
          };
        }
      }
    }
  }
}

// src/node/theme.ts
function plumeTheme(options = {}) {
  const { localeOptions, pluginOptions, hostname, configFile, cache: cache4 } = resolveThemeOptions(options);
  return (app) => {
    initConfigLoader(app, localeOptions, {
      configFile,
      onChange: ({ localeOptions: localeOptions2, autoFrontmatter }) => {
        if (autoFrontmatter !== false)
          initAutoFrontmatter(localeOptions2, autoFrontmatter);
      }
    });
    return {
      name: THEME_NAME,
      define: resolveProvideData(app, pluginOptions),
      templateBuild: templates("build.html"),
      clientConfigFile: resolve("client/config.js"),
      alias: resolveAlias(),
      plugins: getPlugins({ app, pluginOptions, hostname, cache: cache4 }),
      extendsBundlerOptions,
      templateBuildRenderer: (template, context) => templateBuildRenderer(template, context, getThemeConfig().localeOptions),
      extendsMarkdown: async (_, app2) => {
        const { autoFrontmatter, localeOptions: localeOptions2 } = await waitForConfigLoaded();
        if (autoFrontmatter !== false) {
          initAutoFrontmatter(localeOptions2, autoFrontmatter);
          await generateAutoFrontmatter(app2);
          await sleep(100);
        }
      },
      extendsPage: async (page) => {
        extendsPageData(page, getThemeConfig().localeOptions);
      },
      onInitialized: async (app2) => {
        await createPages(app2, getThemeConfig().localeOptions);
      },
      onPrepared: async (app2) => {
        await prepareThemeData(app2, getThemeConfig().localeOptions, pluginOptions);
        await prepareData(app2);
      },
      onWatched: (app2, watchers) => {
        watchConfigFile(app2, watchers, async ({ localeOptions: localeOptions2 }) => {
          await prepareThemeData(app2, localeOptions2, pluginOptions);
          await prepareData(app2);
        });
        watchAutoFrontmatter(app2, watchers);
        watchPrepare(app2, watchers);
      }
    };
  };
}

// src/node/index.ts
export * from "../shared/index.js";

// src/node/defineConfig.ts
function defineThemeConfig(config) {
  return config;
}
function defineNavbarConfig(navbar) {
  return navbar;
}
function defineNotesConfig(notes) {
  return notes;
}
function defineNoteConfig(note) {
  return note;
}
function definePlumeNotesConfig(notes) {
  return notes;
}
function definePlumeNotesItemConfig(item) {
  return item;
}
function defineNavbar(navbar) {
  return navbar;
}

// src/node/index.ts
var node_default = plumeTheme;
export {
  node_default as default,
  defineNavbar,
  defineNavbarConfig,
  defineNoteConfig,
  defineNotesConfig,
  definePlumeNotesConfig,
  definePlumeNotesItemConfig,
  defineThemeConfig,
  plumeTheme
};
