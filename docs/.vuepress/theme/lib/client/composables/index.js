// src/client/composables/aside.ts
import { useMediaQuery as useMediaQuery2 } from "@vueuse/core";
import { computed as computed4 } from "vue";

// src/client/composables/sidebar.ts
import { sidebar as sidebarRaw } from "@internal/sidebar";
import {
  ensureLeadingSlash,
  isArray,
  isPlainObject,
  isString,
  removeLeadingSlash
} from "@vuepress/helper/client";
import { useMediaQuery } from "@vueuse/core";
import {
  computed as computed3,
  inject as inject4,
  onMounted,
  onUnmounted,
  provide as provide2,
  ref as ref4,
  watch,
  watchEffect
} from "vue";
import { resolveRouteFullPath, useRoute as useRoute2, useRouteLocale } from "vuepress/client";
import { isActive, normalizeLink, normalizePrefix, resolveNavLink } from "../utils/index.js";

// src/client/composables/data.ts
import {
  usePageData,
  usePageFrontmatter,
  usePageLang,
  useSiteLocaleData
} from "vuepress/client";

// src/client/composables/dark-mode.ts
import { useDark } from "@vueuse/core";
import { inject as inject2, ref as ref2 } from "vue";

// src/client/composables/theme-data.ts
import { themeData as themeDataRaw } from "@internal/themePlumeData";
import { computed, inject, ref } from "vue";
import { clientDataSymbol } from "vuepress/client";
var themeLocaleDataSymbol = Symbol(
  __VUEPRESS_DEV__ ? "themeLocaleData" : ""
);
var themeData = ref(themeDataRaw);
function useThemeData() {
  return themeData;
}
if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateThemeData = (data) => {
    themeData.value = data;
  };
}
function useThemeLocaleData() {
  const themeLocaleData = inject(themeLocaleDataSymbol);
  if (!themeLocaleData) {
    throw new Error("useThemeLocaleData() is called without provider.");
  }
  return themeLocaleData;
}
function resolveThemeLocaleData(theme, routeLocale) {
  const { locales, ...baseOptions } = theme;
  return {
    ...baseOptions,
    ...locales?.[routeLocale]
  };
}
function setupThemeData(app) {
  const themeData2 = useThemeData();
  const clientData = app._context.provides[clientDataSymbol];
  const themeLocaleData = computed(
    () => resolveThemeLocaleData(themeData2.value, clientData.routeLocale.value)
  );
  app.provide(themeLocaleDataSymbol, themeLocaleData);
  Object.defineProperties(app.config.globalProperties, {
    $theme: {
      get() {
        return themeData2.value;
      }
    },
    $themeLocale: {
      get() {
        return themeLocaleData.value;
      }
    }
  });
}

// src/client/composables/dark-mode.ts
var darkModeSymbol = Symbol(
  __VUEPRESS_DEV__ ? "darkMode" : ""
);
function setupDarkMode(app) {
  const theme = useThemeData();
  const transition = theme.value.transition;
  const disableTransition = typeof transition === "object" ? transition.appearance === false : transition === false;
  const appearance = theme.value.appearance;
  const isDark = appearance === "force-dark" ? ref2(true) : appearance ? useDark({
    storageKey: "vuepress-theme-appearance",
    attribute: "data-theme",
    valueLight: "light",
    valueDark: "dark",
    disableTransition,
    initialValue: () => typeof appearance === "string" ? appearance : "auto",
    ...typeof appearance === "object" ? appearance : {}
  }) : ref2(false);
  app.provide(darkModeSymbol, isDark);
  Object.defineProperty(app.config.globalProperties, "$isDark", {
    get: () => isDark
  });
}
function useDarkMode() {
  const isDarkMode = inject2(darkModeSymbol);
  if (!isDarkMode)
    throw new Error("useDarkMode() is called without provider.");
  return isDarkMode;
}

// src/client/composables/data.ts
function useData() {
  const theme = useThemeLocaleData();
  const page = usePageData();
  const frontmatter = usePageFrontmatter();
  const site = useSiteLocaleData();
  const isDark = useDarkMode();
  const lang = usePageLang();
  return { theme, page, frontmatter, lang, site, isDark };
}

// src/client/composables/encrypt.ts
import { hasOwn, useSessionStorage } from "@vueuse/core";
import { compare, genSaltSync } from "bcrypt-ts/browser";
import { computed as computed2, inject as inject3, provide } from "vue";
import { useRoute } from "vuepress/client";

// src/client/composables/encrypt-data.ts
import { encrypt as rawEncrypt } from "@internal/encrypt";
import { ref as ref3 } from "vue";
var encrypt = ref3(resolveEncryptData(rawEncrypt));
function useEncryptData() {
  return encrypt;
}
function resolveEncryptData([global, separator, admin, matches, rules]) {
  return {
    global,
    separator,
    matches,
    admins: admin.split(separator),
    ruleList: Object.keys(rules).map((key) => ({
      key,
      match: matches[key],
      rules: rules[key].split(separator)
    }))
  };
}
if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateEncrypt = (data) => {
    encrypt.value = resolveEncryptData(data);
  };
}

// src/client/composables/encrypt.ts
var EncryptSymbol = Symbol(
  __VUEPRESS_DEV__ ? "Encrypt" : ""
);
var storage = useSessionStorage("2a0a3d6afb2fdf1f", () => ({
  s: [genSaltSync(10), genSaltSync(10)],
  g: "",
  p: {}
}));
function mergeHash(hash) {
  const [left, right] = storage.value.s;
  return left + hash + right;
}
function splitHash(hash) {
  const [left, right] = storage.value.s;
  if (!hash.startsWith(left) || !hash.endsWith(right))
    return "";
  return hash.slice(left.length, hash.length - right.length);
}
var compareCache = /* @__PURE__ */ new Map();
async function compareDecrypt(content, hash, separator = ":") {
  const key = [content, hash].join(separator);
  if (compareCache.has(key))
    return compareCache.get(key);
  try {
    const result = await compare(content, hash);
    compareCache.set(key, result);
    return result;
  } catch {
    compareCache.set(key, false);
    return false;
  }
}
var matchCache = /* @__PURE__ */ new Map();
function createMatchRegex(match) {
  if (matchCache.has(match))
    return matchCache.get(match);
  const regex = new RegExp(match);
  matchCache.set(match, regex);
  return regex;
}
function toMatch(match, pagePath, filePathRelative) {
  const relativePath = filePathRelative || "";
  if (match[0] === "^") {
    const regex = createMatchRegex(match);
    return regex.test(pagePath) || relativePath && regex.test(relativePath);
  }
  if (match.endsWith(".md"))
    return relativePath && relativePath.endsWith(match);
  return pagePath.startsWith(match) || relativePath.startsWith(match);
}
function setupEncrypt() {
  const { page } = useData();
  const route = useRoute();
  const encrypt2 = useEncryptData();
  const hasPageEncrypt = computed2(() => {
    const pagePath = route.path;
    const filePathRelative = page.value.filePathRelative;
    return encrypt2.value.ruleList.length ? encrypt2.value.matches.some((match) => toMatch(match, pagePath, filePathRelative)) : false;
  });
  const isGlobalDecrypted = computed2(() => {
    if (!encrypt2.value.global)
      return true;
    const hash = splitHash(storage.value.g);
    return !!hash && encrypt2.value.admins.includes(hash);
  });
  const hashList = computed2(() => {
    const pagePath = route.path;
    const filePathRelative = page.value.filePathRelative;
    return encrypt2.value.ruleList.length ? encrypt2.value.ruleList.filter((item) => toMatch(item.match, pagePath, filePathRelative)) : [];
  });
  const isPageDecrypted = computed2(() => {
    if (!hasPageEncrypt.value)
      return true;
    const hash = splitHash(storage.value.p.__GLOBAL__ || "");
    if (hash && encrypt2.value.admins.includes(hash))
      return true;
    for (const { key, rules } of hashList.value) {
      if (hasOwn(storage.value.p, key)) {
        const hash2 = splitHash(storage.value.p[key]);
        if (hash2 && rules.includes(hash2))
          return true;
      }
    }
    return false;
  });
  provide(EncryptSymbol, {
    hasPageEncrypt,
    isGlobalDecrypted,
    isPageDecrypted,
    hashList
  });
}
function useEncrypt() {
  const result = inject3(EncryptSymbol);
  if (!result)
    throw new Error("useEncrypt() is called without setup");
  return result;
}
function useEncryptCompare() {
  const encrypt2 = useEncryptData();
  const { page } = useData();
  const route = useRoute();
  const { hashList } = useEncrypt();
  async function compareGlobal(password) {
    if (!password)
      return false;
    for (const admin of encrypt2.value.admins) {
      if (await compareDecrypt(password, admin, encrypt2.value.separator)) {
        storage.value.g = mergeHash(admin);
        return true;
      }
    }
    return false;
  }
  async function comparePage(password) {
    if (!password)
      return false;
    const pagePath = route.path;
    const filePathRelative = page.value.filePathRelative;
    let decrypted = false;
    for (const { match, key, rules } of hashList.value) {
      if (toMatch(match, pagePath, filePathRelative)) {
        for (const rule of rules) {
          if (await compareDecrypt(password, rule, encrypt2.value.separator)) {
            decrypted = true;
            storage.value.p = {
              ...storage.value.p,
              [key]: mergeHash(rule)
            };
            break;
          }
        }
        if (decrypted)
          break;
      }
    }
    if (!decrypted) {
      decrypted = await compareGlobal(password);
    }
    return decrypted;
  }
  return { compareGlobal, comparePage };
}

// src/client/composables/sidebar.ts
var { __auto__, __home__, ...items } = sidebarRaw;
var sidebarData = ref4(items);
var autoDirSidebar = ref4(__auto__);
var autoHomeData = ref4(__home__);
if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateSidebar = (data) => {
    const { __auto__: __auto__2, __home__: __home__2, ...items2 } = data;
    sidebarData.value = items2;
    autoDirSidebar.value = __auto__2;
    autoHomeData.value = __home__2;
  };
}
var sidebarSymbol = Symbol(
  __VUEPRESS_DEV__ ? "sidebar" : ""
);
function setupSidebar() {
  const { page, frontmatter } = useData();
  const routeLocale = useRouteLocale();
  const hasSidebar = computed3(() => {
    return frontmatter.value.pageLayout !== "home" && frontmatter.value.pageLayout !== "friends" && frontmatter.value.sidebar !== false && frontmatter.value.layout !== "NotFound";
  });
  const sidebarData2 = computed3(() => {
    return hasSidebar.value ? getSidebar(typeof frontmatter.value.sidebar === "string" ? frontmatter.value.sidebar : page.value.path, routeLocale.value) : [];
  });
  provide2(sidebarSymbol, sidebarData2);
}
function useSidebarData() {
  const sidebarData2 = inject4(sidebarSymbol);
  if (!sidebarData2) {
    throw new Error("useSidebarData() is called without provider.");
  }
  return sidebarData2;
}
function getSidebar(routePath, routeLocal) {
  const _sidebar = sidebarData.value[routeLocal];
  if (_sidebar === "auto") {
    return resolveSidebarItems(autoDirSidebar.value[routeLocal]);
  } else if (isArray(_sidebar)) {
    return resolveSidebarItems(_sidebar, routeLocal);
  } else if (isPlainObject(_sidebar)) {
    routePath = decodeURIComponent(routePath);
    const dir = Object.keys(_sidebar).sort((a, b) => b.split("/").length - a.split("/").length).find((dir2) => {
      return routePath.startsWith(`${routeLocal}${removeLeadingSlash(dir2)}`);
    }) || "";
    const sidebar = dir ? _sidebar[dir] : void 0;
    if (sidebar === "auto") {
      return resolveSidebarItems(
        dir ? autoDirSidebar.value[dir] : [],
        routeLocal
      );
    } else if (isArray(sidebar)) {
      return resolveSidebarItems(sidebar, dir);
    } else if (isPlainObject(sidebar)) {
      const prefix = normalizePrefix(dir, sidebar.prefix);
      return resolveSidebarItems(
        sidebar.items === "auto" ? autoDirSidebar.value[prefix] : sidebar.items,
        prefix
      );
    }
  }
  return [];
}
function resolveSidebarItems(sidebarItems, _prefix = "") {
  const resolved = [];
  sidebarItems.forEach((item) => {
    if (isString(item)) {
      resolved.push(resolveNavLink(normalizeLink(_prefix, item)));
    } else {
      const { link, items: items2, prefix, dir, ...args } = item;
      const navLink = { ...args };
      if (link) {
        navLink.link = normalizeLink(_prefix, link);
        const nav = resolveNavLink(navLink.link);
        navLink.icon = nav.icon;
      }
      const nextPrefix = normalizePrefix(_prefix, prefix || dir);
      if (items2 === "auto") {
        navLink.items = autoDirSidebar.value[nextPrefix];
        if (!navLink.link && autoHomeData.value[nextPrefix]) {
          navLink.link = normalizeLink(autoHomeData.value[nextPrefix]);
          const nav = resolveNavLink(navLink.link);
          navLink.icon = nav.icon;
        }
      } else {
        navLink.items = items2?.length ? resolveSidebarItems(items2, nextPrefix) : void 0;
      }
      resolved.push(navLink);
    }
  });
  return resolved;
}
function getSidebarGroups(sidebar) {
  const groups = [];
  let lastGroupIndex = 0;
  for (const index in sidebar) {
    const item = sidebar[index];
    if (item.items) {
      lastGroupIndex = groups.push(item);
      continue;
    }
    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] });
    }
    groups[lastGroupIndex].items.push(item);
  }
  return groups;
}
function hasActiveLink(path, items2) {
  if (Array.isArray(items2)) {
    return items2.some((item) => hasActiveLink(path, item));
  }
  return isActive(
    path,
    items2.link ? resolveRouteFullPath(items2.link) : void 0
  ) ? true : items2.items ? hasActiveLink(path, items2.items) : false;
}
var containsActiveLink = hasActiveLink;
function useSidebar() {
  const { theme, frontmatter, page } = useData();
  const routeLocal = useRouteLocale();
  const is960 = useMediaQuery("(min-width: 960px)");
  const { isPageDecrypted } = useEncrypt();
  const isOpen = ref4(false);
  const sidebarKey = computed3(() => {
    const _sidebar = sidebarData.value[routeLocal.value];
    if (!_sidebar || _sidebar === "auto" || isArray(_sidebar))
      return routeLocal.value;
    return Object.keys(_sidebar).sort((a, b) => b.split("/").length - a.split("/").length).find((dir) => {
      return page.value.path.startsWith(ensureLeadingSlash(dir));
    }) || "";
  });
  const sidebar = useSidebarData();
  const hasSidebar = computed3(() => {
    return frontmatter.value.sidebar !== false && sidebar.value.length > 0 && frontmatter.value.pageLayout !== "home";
  });
  const hasAside = computed3(() => {
    if (frontmatter.value.pageLayout === "home" || frontmatter.value.home)
      return false;
    if (frontmatter.value.pageLayout === "friends" || frontmatter.value.friends)
      return false;
    if (!isPageDecrypted.value)
      return false;
    if (frontmatter.value.aside != null)
      return !!frontmatter.value.aside;
    return theme.value.aside !== false;
  });
  const leftAside = computed3(() => {
    if (hasAside.value) {
      return frontmatter.value.aside == null ? theme.value.aside === "left" : frontmatter.value.aside === "left";
    }
    return false;
  });
  const isSidebarEnabled = computed3(() => hasSidebar.value && is960.value);
  const sidebarGroups = computed3(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : [];
  });
  const open = () => {
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };
  const toggle = () => {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  };
  return {
    isOpen,
    sidebar,
    sidebarKey,
    sidebarGroups,
    hasSidebar,
    hasAside,
    leftAside,
    isSidebarEnabled,
    open,
    close,
    toggle
  };
}
function useCloseSidebarOnEscape(isOpen, close) {
  let triggerElement;
  watchEffect(() => {
    triggerElement = isOpen.value ? document.activeElement : void 0;
  });
  onMounted(() => {
    window.addEventListener("keyup", onEscape);
  });
  onUnmounted(() => {
    window.removeEventListener("keyup", onEscape);
  });
  function onEscape(e) {
    if (e.key === "Escape" && isOpen.value) {
      close();
      triggerElement?.focus();
    }
  }
}
function useSidebarControl(item) {
  const { page } = useData();
  const route = useRoute2();
  const collapsed = ref4(false);
  const collapsible = computed3(() => {
    return item.value.collapsed != null;
  });
  const isLink = computed3(() => {
    return !!item.value.link;
  });
  const isActiveLink = ref4(false);
  const updateIsActiveLink = () => {
    isActiveLink.value = isActive(
      page.value.path,
      item.value.link ? resolveRouteFullPath(item.value.link) : void 0
    );
  };
  watch([() => page.value.path, item, () => route.hash], updateIsActiveLink);
  onMounted(updateIsActiveLink);
  const hasActiveLink2 = computed3(() => {
    if (isActiveLink.value) {
      return true;
    }
    return item.value.items ? containsActiveLink(page.value.path, item.value.items) : false;
  });
  const hasChildren = computed3(() => {
    return !!(item.value.items && item.value.items.length);
  });
  watchEffect(() => {
    collapsed.value = !!(collapsible.value && item.value.collapsed);
  });
  watch(() => [page.value.path, isActiveLink.value, hasActiveLink2.value], () => {
    if (isActiveLink.value || hasActiveLink2.value) {
      collapsed.value = false;
    }
  }, { immediate: true, flush: "post" });
  const toggle = () => {
    if (collapsible.value) {
      collapsed.value = !collapsed.value;
    }
  };
  return {
    collapsed,
    collapsible,
    isLink,
    isActiveLink,
    hasActiveLink: hasActiveLink2,
    hasChildren,
    toggle
  };
}
function getSidebarFirstLink(sidebar) {
  for (const item of sidebar) {
    if (item.link)
      return item.link;
    if (item.items)
      return getSidebarFirstLink(item.items);
  }
  return "";
}

// src/client/composables/aside.ts
function useAside() {
  const { hasSidebar } = useSidebar();
  const is960 = useMediaQuery2("(min-width: 960px)");
  const is1280 = useMediaQuery2("(min-width: 1280px)");
  const isAsideEnabled = computed4(() => {
    if (!is1280.value && !is960.value)
      return false;
    return hasSidebar.value ? is1280.value : is960.value;
  });
  return {
    isAsideEnabled
  };
}

// src/client/composables/blog-archives.ts
import { computed as computed6 } from "vue";

// src/client/composables/blog-data.ts
import {
  blogPostData as blogPostDataRaw
} from "@internal/blogData";
import { computed as computed5, ref as ref5 } from "vue";
import { usePageLang as usePageLang2 } from "vuepress/client";
var blogPostData = ref5(blogPostDataRaw);
function usePostList() {
  return blogPostData;
}
function useLocalePostList() {
  const locale = usePageLang2();
  return computed5(() => blogPostData.value.filter((item) => item.lang === locale.value));
}
if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateBlogPostData = (data) => {
    blogPostData.value = data;
  };
}

// src/client/composables/blog-archives.ts
function useArchives() {
  const list = useLocalePostList();
  const archives = computed6(() => {
    const archives2 = [];
    list.value.forEach((item) => {
      const createTime = item.createTime?.split(/\s|T/)[0] || "";
      const year = createTime.split("/")[0];
      let current = archives2.find((archive) => archive.label === year);
      if (!current) {
        current = { label: year, list: [] };
        archives2.push(current);
      }
      current.list.push({
        title: item.title,
        path: item.path,
        createTime: createTime.slice(year.length + 1).replace(/\//g, "-")
      });
    });
    return archives2;
  });
  return { archives };
}

// src/client/composables/blog-category.ts
import { computed as computed7 } from "vue";
function useBlogCategory() {
  const postList = useLocalePostList();
  const categories = computed7(() => {
    const list = [];
    postList.value.forEach((item) => {
      const categoryList = item.categoryList;
      if (!categoryList || categoryList.length === 0) {
        list.push({ type: "post", title: item.title, path: item.path });
      } else {
        let cate = list;
        let i = 0;
        while (i < categoryList.length) {
          const { id, name, sort } = categoryList[i];
          const current = cate.find((item2) => item2.type === "category" && item2.id === id);
          if (!current) {
            const items2 = [];
            cate.push({ type: "category", title: name, id, sort, items: items2 });
            cate = items2;
          } else {
            cate = current.items;
          }
          i++;
        }
        cate.push({ type: "post", title: item.title, path: item.path });
      }
    });
    return sortCategory(list);
  });
  return { categories };
}
function sortCategory(items2) {
  for (const item of items2) {
    if (item.type === "category" && item.items.length) {
      item.items = sortCategory(item.items);
    }
  }
  return items2.sort((a, b) => {
    if (a.type === "category" && b.type === "category") {
      return a.sort < b.sort ? -1 : 1;
    }
    if (a.type === "category" && b.type === "post") {
      return -1;
    }
    if (a.type === "post" && b.type === "category") {
      return 1;
    }
    return 0;
  });
}

// src/client/composables/blog-extract.ts
import { computed as computed10 } from "vue";

// src/client/composables/blog-tags.ts
import { computed as computed8 } from "vue";
import { toArray } from "../utils/index.js";

// src/client/composables/route-query.ts
import { tryOnScopeDispose } from "@vueuse/core";
import { customRef, nextTick, toValue, watch as watch2 } from "vue";
import { useRoute as useRoute3, useRouter } from "vuepress/client";
var _queue = /* @__PURE__ */ new WeakMap();
function useRouteQuery(name, defaultValue, options = {}) {
  const {
    mode = "replace",
    route = useRoute3(),
    router = useRouter(),
    transform = (value) => value
  } = options;
  if (!_queue.has(router))
    _queue.set(router, /* @__PURE__ */ new Map());
  const _queriesQueue = _queue.get(router);
  let query = route.query[name];
  tryOnScopeDispose(() => {
    query = void 0;
  });
  let _trigger;
  const proxy = customRef((track, trigger) => {
    _trigger = trigger;
    return {
      get() {
        track();
        return transform(query !== void 0 ? query : toValue(defaultValue));
      },
      set(v) {
        if (query === v)
          return;
        query = v;
        _queriesQueue.set(name, v);
        trigger();
        nextTick(() => {
          if (_queriesQueue.size === 0)
            return;
          const newQueries = Object.fromEntries(_queriesQueue.entries());
          _queriesQueue.clear();
          const { query: query2, hash, path } = route;
          router[toValue(mode)]({
            path,
            query: { ...query2, ...newQueries },
            hash
          });
        });
      }
    };
  });
  watch2(
    () => route.query[name],
    (v) => {
      query = v;
      _trigger();
    },
    { flush: "sync" }
  );
  return proxy;
}

// src/client/composables/tag-colors.ts
import { articleTagColors } from "@internal/articleTagColors";
import { ref as ref6 } from "vue";
var tagColorsRef = ref6(articleTagColors);
var useTagColors = () => tagColorsRef;
if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateArticleTagColors = (data) => {
    tagColorsRef.value = data;
  };
}

// src/client/composables/blog-tags.ts
function useTags() {
  const { theme } = useData();
  const list = useLocalePostList();
  const colors = useTagColors();
  const tags = computed8(() => {
    const blog = theme.value.blog || {};
    const tagTheme = blog.tagsTheme ?? "colored";
    const tagMap = {};
    list.value.forEach((item) => {
      if (item.tags) {
        toArray(item.tags).forEach((tag) => {
          if (tagMap[tag])
            tagMap[tag] += 1;
          else
            tagMap[tag] = 1;
        });
      }
    });
    return Object.keys(tagMap).map((tag) => ({
      name: tag,
      count: tagMap[tag] > 99 ? "99+" : tagMap[tag],
      className: colors.value[tag] ? `vp-tag-${colors.value[tag]}` : `tag-${tagTheme}`
    }));
  });
  const currentTag = useRouteQuery("tag");
  const postList = computed8(() => {
    if (!currentTag.value)
      return [];
    return list.value.filter((item) => {
      if (item.tags)
        return toArray(item.tags).includes(currentTag.value);
      return false;
    }).map((item) => ({
      title: item.title,
      path: item.path,
      createTime: item.createTime.split(" ")[0].replace(/\//g, "-")
    }));
  });
  const handleTagClick = (tag) => {
    currentTag.value = tag;
  };
  return {
    tags,
    currentTag,
    postList,
    handleTagClick
  };
}

// src/client/composables/internal-link.ts
import { computed as computed9 } from "vue";
import { useRouteLocale as useRouteLocale2 } from "vuepress/client";

// src/client/composables/preset-locales.ts
var presetLocales = __PLUME_PRESET_LOCALE__;
function getPresetLocaleData(locale, name) {
  return presetLocales[locale]?.[name] || presetLocales["/"][name];
}

// src/client/composables/internal-link.ts
function useInternalLink() {
  const { theme } = useData();
  const routeLocale = useRouteLocale2();
  function resolveLink(name, link) {
    return {
      link: (routeLocale.value + link).replace(/\/+/g, "/"),
      text: getPresetLocaleData(routeLocale.value, name)
    };
  }
  const blogData = computed9(() => theme.value.blog || {});
  const home = computed9(() => resolveLink("home", "/"));
  const blog = computed9(() => blogData.value.postList !== false ? resolveLink("blog", blogData.value.link || "blog/") : home.value);
  const tags = computed9(() => blogData.value.tags !== false ? resolveLink("tag", blogData.value.tagsLink || "blog/tags/") : void 0);
  const archive = computed9(() => blogData.value.archives !== false ? resolveLink("archive", blogData.value.archivesLink || "blog/archives/") : void 0);
  const categories = computed9(() => blogData.value.categories !== false ? resolveLink("category", blogData.value.categoriesLink || "blog/categories/") : void 0);
  return {
    home,
    blog,
    tags,
    archive,
    categories
  };
}

// src/client/composables/blog-extract.ts
function useBlogExtract() {
  const { theme } = useData();
  const postList = useLocalePostList();
  const { tags: tagsList } = useTags();
  const { categories: categoryList } = useBlogCategory();
  const blog = computed10(() => theme.value.blog || {});
  const links = useInternalLink();
  const hasBlogExtract = computed10(
    () => blog.value.archives !== false || blog.value.tags !== false || blog.value.categories !== false
  );
  const tags = computed10(() => ({
    link: links.tags.value?.link,
    text: links.tags.value?.text,
    total: tagsList.value.length
  }));
  const archives = computed10(() => ({
    link: links.archive.value?.link,
    text: links.archive.value?.text,
    total: postList.value.length
  }));
  const categories = computed10(() => ({
    link: links.categories.value?.link,
    text: links.categories.value?.text,
    total: getCategoriesTotal(categoryList.value)
  }));
  return {
    hasBlogExtract,
    tags,
    archives,
    categories
  };
}
function getCategoriesTotal(categories) {
  let total = 0;
  for (const category of categories) {
    if (category.type === "category") {
      total += 1;
      if (category.items.length) {
        total += getCategoriesTotal(category.items);
      }
    }
  }
  return total;
}

// src/client/composables/blog-post-list.ts
import { useMediaQuery as useMediaQuery3 } from "@vueuse/core";
import { computed as computed11 } from "vue";
var DEFAULT_PER_PAGE = 15;
function usePostListControl(homePage) {
  const { theme } = useData();
  const list = useLocalePostList();
  const blog = computed11(() => theme.value.blog || {});
  const is960 = useMediaQuery3("(max-width: 960px)");
  const postList = computed11(() => {
    const stickyList = list.value.filter(
      (item) => item.sticky === true || typeof item.sticky === "number"
    );
    const otherList = list.value.filter(
      (item) => item.sticky === void 0 || item.sticky === false
    );
    return [
      ...stickyList.sort((prev, next) => {
        if (next.sticky === true && prev.sticky === true)
          return 0;
        return next.sticky > prev.sticky ? 1 : -1;
      }),
      ...otherList
    ];
  });
  const page = useRouteQuery("p", 1, {
    mode: "push",
    transform(val) {
      const page2 = Number(val);
      if (!Number.isNaN(page2) && page2 > 0)
        return page2;
      return 1;
    }
  });
  const perPage = computed11(() => {
    if (blog.value.pagination === false)
      return 0;
    if (typeof blog.value.pagination === "number")
      return blog.value.pagination;
    return blog.value.pagination?.perPage || DEFAULT_PER_PAGE;
  });
  const totalPage = computed11(() => {
    if (blog.value.pagination === false)
      return 0;
    return Math.ceil(postList.value.length / perPage.value);
  });
  const isLastPage = computed11(() => page.value >= totalPage.value);
  const isFirstPage = computed11(() => page.value <= 1);
  const isPaginationEnabled = computed11(() => blog.value.pagination !== false && totalPage.value > 1);
  const finalList = computed11(() => {
    if (blog.value.pagination === false)
      return postList.value;
    if (postList.value.length <= perPage.value)
      return postList.value;
    return postList.value.slice(
      (page.value - 1) * perPage.value,
      page.value * perPage.value
    );
  });
  const pageRange = computed11(() => {
    let range = [];
    const total = totalPage.value;
    const _page = page.value;
    const per = is960.value ? 4 : 5;
    if (total <= 0)
      return range;
    if (total <= 10) {
      range = Array.from({ length: total }, (_, i) => ({ value: i + 1 }));
    } else {
      let i = 1;
      let hasMore = false;
      while (i <= total) {
        if (_page <= per && i <= per || _page >= total - (per - 1) && i >= total - (per - 1)) {
          hasMore = false;
          range.push({ value: i });
        } else if (i <= 2 || i >= total - 1) {
          hasMore = false;
          range.push({ value: i });
        } else if ((_page > per + 1 || _page < total - (per + 1)) && _page - i < per - 2 && i - _page < per - 2) {
          hasMore = false;
          range.push({ value: i });
        } else if (!hasMore) {
          hasMore = true;
          range.push({ value: i, more: true });
        }
        i++;
      }
    }
    return range;
  });
  const changePage = (current) => {
    if (page.value === current)
      return;
    page.value = current;
    setTimeout(() => {
      let top = 0;
      if (homePage.value) {
        top = document.querySelector(".vp-blog")?.getBoundingClientRect().top || 0;
        top += window.scrollY - 64;
      }
      window.scrollTo({ top, behavior: "instant" });
    }, 0);
  };
  return {
    postList: finalList,
    page,
    totalPage,
    pageRange,
    isLastPage,
    isFirstPage,
    isPaginationEnabled,
    changePage
  };
}

// src/client/composables/bulletin.ts
import { useLocalStorage, useSessionStorage as useSessionStorage2 } from "@vueuse/core";
import { computed as computed12, ref as ref7, watch as watch3 } from "vue";
var showBulletin = ref7(false);
function useBulletin() {
  const { theme } = useData();
  const bulletin = computed12(() => theme.value.bulletin === true ? {} : theme.value.bulletin);
  return bulletin;
}
function useBulletinControl() {
  const session = useSessionStorage2("plume:bulletin", "");
  const local = useLocalStorage("plume:bulletin", "");
  const { page } = useData();
  const bulletin = useBulletin();
  const enableBulletin = computed12(() => page.value.bulletin ?? true);
  watch3(() => bulletin.value?.lifetime, (lifetime) => {
    const id = bulletin.value?.id;
    if (lifetime === "session") {
      showBulletin.value = session.value !== id;
    } else if (lifetime === "once") {
      showBulletin.value = local.value !== id;
    } else {
      showBulletin.value = true;
    }
  }, { immediate: true });
  function close() {
    showBulletin.value = false;
    const lifetime = bulletin.value?.lifetime;
    const id = bulletin.value?.id;
    if (lifetime === "session") {
      session.value = id;
    } else if (lifetime === "once") {
      local.value = id;
    }
  }
  return {
    bulletin,
    enableBulletin,
    showBulletin,
    close
  };
}

// src/client/composables/contributors.ts
import { computed as computed13 } from "vue";
import { toArray as toArray2 } from "../utils/index.js";
function useContributors() {
  const { theme, page, frontmatter } = useData();
  return computed13(() => {
    const config = frontmatter.value.contributors ?? theme.value.contributors ?? true;
    if (config === false)
      return [];
    const contributors = config === true ? [] : toArray2(config);
    const gitContributors = (page.value.git?.contributors ?? []).map(({ name }) => name);
    return Array.from(/* @__PURE__ */ new Set([...gitContributors, ...contributors]));
  });
}

// src/client/composables/edit-link.ts
import { computed as computed14 } from "vue";
import { resolveEditLink } from "../utils/index.js";
function useEditLink() {
  const { theme, page, frontmatter } = useData();
  return computed14(() => {
    const showEditLink = frontmatter.value.editLink ?? theme.value.editLink ?? true;
    if (!showEditLink)
      return null;
    const {
      docsRepo,
      docsBranch = "main",
      docsDir = "",
      editLinkText
    } = theme.value;
    if (!docsRepo)
      return null;
    const editLink = resolveEditLink({
      docsRepo,
      docsBranch,
      docsDir,
      filePathRelative: page.value.filePathRelative,
      editLinkPattern: frontmatter.value.editLinkPattern ?? theme.value.editLinkPattern
    });
    if (!editLink)
      return null;
    return {
      text: editLinkText ?? "Edit this page",
      link: editLink
    };
  });
}

// src/client/composables/flyout.ts
import { onUnmounted as onUnmounted2, readonly, ref as ref8, watch as watch4 } from "vue";
import { inBrowser } from "../utils/index.js";
var focusedElement = ref8();
var active = false;
var listeners = 0;
function useFlyout(options) {
  const focus = ref8(false);
  if (inBrowser) {
    if (!active) {
      activateFocusTracking();
    }
    listeners++;
    const unwatch = watch4(focusedElement, (el) => {
      if (el === options.el.value || options.el.value?.contains(el)) {
        focus.value = true;
        options.onFocus?.();
      } else {
        focus.value = false;
        options.onBlur?.();
      }
    });
    onUnmounted2(() => {
      unwatch();
      listeners--;
      if (!listeners)
        deactivateFocusTracking();
    });
  }
  return readonly(focus);
}
function activateFocusTracking() {
  document.addEventListener("focusin", handleFocusIn);
  active = true;
  focusedElement.value = document.activeElement;
}
function deactivateFocusTracking() {
  document.removeEventListener("focusin", handleFocusIn);
}
function handleFocusIn() {
  focusedElement.value = document.activeElement;
}

// src/client/composables/home.ts
import { computed as computed15, onMounted as onMounted2, onUnmounted as onUnmounted3 } from "vue";
var lightTint = {
  r: { value: 200, offset: 36 },
  g: { value: 200, offset: 36 },
  b: { value: 200, offset: 36 }
};
var darkTint = {
  r: { value: 32, offset: 36 },
  g: { value: 32, offset: 36 },
  b: { value: 32, offset: 36 }
};
function useHomeHeroTintPlate(canvas, enable, tintPlate) {
  const isDark = useDarkMode();
  let ctx = null;
  let t = 0;
  let timer;
  const plate = computed15(() => {
    const defaultTint = isDark.value ? darkTint : lightTint;
    if (!tintPlate.value)
      return defaultTint;
    const plate2 = tintPlate.value;
    if (typeof plate2 === "string" || typeof plate2 === "number") {
      if (isDark.value)
        return darkTint;
      const values = toPlate(plate2);
      return values.length !== 3 ? lightTint : toTint(values);
    }
    if (typeof plate2 === "object") {
      if ("r" in plate2) {
        if (isDark.value)
          return darkTint;
        return toNumber({ ...lightTint, ...plate2 });
      }
      const key = isDark.value ? "dark" : "light";
      if (key in plate2) {
        const _plate = plate2[key];
        if (typeof _plate === "string" || typeof _plate === "number") {
          const values = toPlate(_plate);
          return values.length !== 3 ? lightTint : toTint(values);
        }
        return toNumber({ ...defaultTint, ...plate2 });
      }
    }
    return defaultTint;
  });
  onMounted2(() => {
    if (canvas.value && enable.value) {
      ctx = canvas.value.getContext("2d");
      if (timer) {
        window.cancelAnimationFrame(timer);
      }
      run();
    }
  });
  onUnmounted3(() => {
    if (timer) {
      window.cancelAnimationFrame(timer);
    }
  });
  function run() {
    for (let x = 0; x <= 35; x++) {
      for (let y = 0; y <= 35; y++)
        col(x, y, R(x, y, t), G(x, y, t), B(x, y, t));
    }
    t = t + 0.02;
    timer = window.requestAnimationFrame(run);
  }
  function col(x, y, r, g, b) {
    if (!ctx)
      return;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, 1, 1);
  }
  function R(x, y, t2) {
    const r = plate.value.r;
    return Math.floor(r.value + r.offset * Math.cos((x * x - y * y) / 300 + t2));
  }
  function G(x, y, t2) {
    const g = plate.value.g;
    return Math.floor(g.value + g.offset * Math.sin((x * x * Math.cos(t2 / 4) + y * y * Math.sin(t2 / 3)) / 300));
  }
  function B(x, y, t2) {
    const b = plate.value.b;
    return Math.floor(b.value + b.offset * Math.sin(5 * Math.sin(t2 / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100));
  }
}
function toPlate(plate) {
  return typeof plate === "number" || Number(plate) === Number.parseInt(plate) ? [plate, plate, plate].map((n) => Number(n)) : plate.includes(",") ? plate.replace(/\s/g, "").split(",").map((n) => Number(n)) : [];
}
function toTint([r, g, b]) {
  return { r: toColor(r), g: toColor(g), b: toColor(b) };
}
function toColor(num) {
  const offset = 256 - num;
  return { value: num, offset: offset > 64 ? 64 : offset };
}
function toNumber(tint) {
  Object.keys(tint).forEach((key) => {
    const p = tint[key];
    p.value = Number(p.value);
    p.offset = Number(p.offset);
  });
  return tint;
}

// src/client/composables/icons.ts
import { icons } from "@internal/iconify";
import { ref as ref9 } from "vue";
var iconsData = ref9(icons);
var useIconsData = () => iconsData;
if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateIcons = (data) => {
    iconsData.value = data;
  };
}

// src/client/composables/langs.ts
import { computed as computed17 } from "vue";
import { resolveRoute, useRouteLocale as useRouteLocale3, withBase } from "vuepress/client";
import { normalizeLink as normalizeLink2 } from "../utils/index.js";

// src/client/composables/page.ts
import { computed as computed16 } from "vue";
function useBlogPageData() {
  const { page } = useData();
  const postList = usePostList();
  const isBlogPost = computed16(() => {
    return postList.value.some((item) => item.path === page.value.path);
  });
  const isBlogLayout = computed16(() => {
    const type = page.value.type;
    return type === "blog" || type === "blog-archives" || type === "blog-tags" || type === "blog-categories";
  });
  return {
    isBlogPost,
    isBlogLayout
  };
}

// src/client/composables/langs.ts
function useLangs({
  removeCurrent = true
} = {}) {
  const theme = useThemeData();
  const { page } = useData();
  const routeLocale = useRouteLocale3();
  const { isBlogPost } = useBlogPageData();
  const currentLang = computed17(() => {
    const link = routeLocale.value;
    return {
      label: theme.value.locales?.[link]?.selectLanguageName,
      link
    };
  });
  const getPageLink = (locale) => {
    const filepath = page.value.filePathRelative ? `/${page.value.filePathRelative}` : page.value.path;
    const pagePath = filepath.slice(routeLocale.value.length);
    const targetPath = normalizeLink2(locale, pagePath);
    const { notFound, path } = resolveRoute(targetPath);
    if (!notFound)
      return path;
    const blog = theme.value.blog;
    if (isBlogPost.value && blog !== false)
      return withBase(blog?.link || normalizeLink2(locale, "blog/"));
    const home = withBase(theme.value.home || "/");
    const fallbackResolve = resolveRoute(withBase(locale));
    return fallbackResolve.notFound ? home : fallbackResolve.path;
  };
  const localeLinks = computed17(
    () => Object.entries(theme.value.locales || {}).flatMap(
      ([key, locale]) => removeCurrent && currentLang.value.label === locale.selectLanguageName ? [] : {
        text: locale.selectLanguageName,
        link: getPageLink(key)
      }
    )
  );
  return { localeLinks, currentLang };
}

// src/client/composables/latest-updated.ts
import { computed as computed18, onMounted as onMounted3, ref as ref10, watchEffect as watchEffect2 } from "vue";
import { usePageLang as usePageLang3 } from "vuepress/client";
function useLastUpdated() {
  const { theme, page, frontmatter } = useData();
  const lang = usePageLang3();
  const date = computed18(() => page.value.git?.updatedTime ? new Date(page.value.git.updatedTime) : null);
  const isoDatetime = computed18(() => date.value?.toISOString());
  const datetime = ref10("");
  const lastUpdatedText = computed18(() => {
    if (theme.value.lastUpdated === false)
      return;
    return theme.value.lastUpdated?.text || theme.value.lastUpdatedText || "Last updated";
  });
  onMounted3(() => {
    watchEffect2(() => {
      if (frontmatter.value.lastUpdated === false || theme.value.lastUpdated === false)
        return;
      datetime.value = date.value ? new Intl.DateTimeFormat(
        theme.value.lastUpdated?.formatOptions?.forceLocale ? lang.value : void 0,
        theme.value.lastUpdated?.formatOptions ?? {
          dateStyle: "short",
          timeStyle: "short"
        }
      ).format(date.value) : "";
    });
  });
  return {
    datetime,
    isoDatetime,
    lastUpdatedText
  };
}

// src/client/composables/link.ts
import { isLinkExternal } from "@vuepress/helper/client";
import { computed as computed19, toValue as toValue2 } from "vue";
import { resolveRouteFullPath as resolveRouteFullPath2, useRoute as useRoute4 } from "vuepress/client";
var SEARCH_RE = /\.md(?:(?:#|\?).*)?$/;
function useLink(href, target) {
  const route = useRoute4();
  const { page } = useData();
  const isExternal = computed19(
    () => {
      const link2 = toValue2(href);
      const rawTarget = toValue2(target);
      return link2 && isLinkExternal(link2) || rawTarget === "_blank";
    }
  );
  const link = computed19(() => {
    const link2 = toValue2(href);
    if (!link2)
      return void 0;
    if (isExternal.value)
      return link2;
    const currentPath = link2.startsWith("./") && SEARCH_RE.test(link2) ? `/${page.value.filePathRelative}` : route.path;
    const path = resolveRouteFullPath2(link2, currentPath);
    if (path.includes("#")) {
      if (path.slice(0, path.indexOf("#")) === route.path) {
        return path.slice(path.indexOf("#"));
      }
    }
    return path;
  });
  return { isExternal, link };
}

// src/client/composables/nav.ts
import { computed as computed20, ref as ref11, watch as watch5 } from "vue";
import { useRoute as useRoute5 } from "vuepress/client";
import { normalizeLink as normalizeLink3, resolveNavLink as resolveNavLink2 } from "../utils/index.js";
function useNavbarData() {
  const { theme } = useData();
  return computed20(() => resolveNavbar(theme.value.navbar || []));
}
function resolveNavbar(navbar, _prefix = "") {
  const resolved = [];
  navbar.forEach((item) => {
    if (typeof item === "string") {
      resolved.push(resolveNavLink2(normalizeLink3(_prefix, item)));
    } else {
      const { items: items2, prefix, ...args } = item;
      const res = { ...args };
      if ("link" in res) {
        res.link = normalizeLink3(_prefix, res.link);
      }
      if (items2?.length) {
        res.items = resolveNavbar(
          items2,
          normalizeLink3(_prefix, prefix)
        );
      }
      resolved.push(res);
    }
  });
  return resolved;
}
function useNav() {
  const isScreenOpen = ref11(false);
  function openScreen() {
    isScreenOpen.value = true;
    window.addEventListener("resize", closeScreenOnTabletWindow);
  }
  function closeScreen() {
    isScreenOpen.value = false;
    window.removeEventListener("resize", closeScreenOnTabletWindow);
  }
  function toggleScreen() {
    if (isScreenOpen.value) {
      closeScreen();
    } else {
      openScreen();
    }
  }
  function closeScreenOnTabletWindow() {
    if (window.outerWidth >= 768) {
      closeScreen();
    }
  }
  const route = useRoute5();
  watch5(() => route.path, closeScreen);
  return {
    isScreenOpen,
    openScreen,
    closeScreen,
    toggleScreen
  };
}

// src/client/composables/outline.ts
import { onContentUpdated } from "@vuepress-plume/plugin-content-update/client";
import { useThrottleFn, watchDebounced } from "@vueuse/core";
import { inject as inject5, onMounted as onMounted4, onUnmounted as onUnmounted4, onUpdated, provide as provide3, ref as ref12 } from "vue";
import { useRouter as useRouter2 } from "vuepress/client";
var resolvedHeaders = [];
var headersSymbol = Symbol(
  __VUEPRESS_DEV__ ? "headers" : ""
);
function setupHeaders() {
  const { frontmatter, theme } = useData();
  const headers = ref12([]);
  onContentUpdated(() => {
    headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline);
  });
  provide3(headersSymbol, headers);
  return headers;
}
function useHeaders() {
  const headers = inject5(headersSymbol);
  if (!headers) {
    throw new Error("useHeaders() is called without provider.");
  }
  return headers;
}
function getHeaders(range) {
  const headers = Array.from(
    document.querySelectorAll(".vp-doc :where(h1,h2,h3,h4,h5,h6)")
  ).filter((el) => el.id && el.hasChildNodes()).map((el) => {
    const level = Number(el.tagName[1]);
    return {
      element: el,
      title: serializeHeader(el),
      link: `#${el.id}`,
      level
    };
  });
  return resolveHeaders(headers, range);
}
function serializeHeader(h) {
  const anchor = h.firstChild;
  const el = anchor?.firstChild;
  let ret = "";
  for (const node of Array.from(el?.childNodes ?? [])) {
    if (node.nodeType === 1) {
      if (node.classList.contains("vp-badge") || node.classList.contains("ignore-header")) {
        continue;
      }
      ret += node.textContent;
    } else if (node.nodeType === 3) {
      ret += node.textContent;
    }
  }
  let next = anchor?.nextSibling;
  while (next) {
    if (next.nodeType === 1 || next.nodeType === 3)
      ret += next.textContent;
    next = next.nextSibling;
  }
  return ret.trim();
}
function resolveHeaders(headers, range) {
  if (range === false)
    return [];
  const levelsRange = range || 2;
  const [high, low] = typeof levelsRange === "number" ? [levelsRange, levelsRange] : levelsRange === "deep" ? [2, 6] : levelsRange;
  headers = headers.filter((h) => h.level >= high && h.level <= low);
  resolvedHeaders.length = 0;
  for (const { element, link } of headers)
    resolvedHeaders.push({ element, link });
  const ret = [];
  outer: for (let i = 0; i < headers.length; i++) {
    const cur = headers[i];
    if (i === 0) {
      ret.push(cur);
    } else {
      for (let j = i - 1; j >= 0; j--) {
        const prev = headers[j];
        if (prev.level < cur.level) {
          ;
          (prev.children || (prev.children = [])).push(cur);
          continue outer;
        }
      }
      ret.push(cur);
    }
  }
  return ret;
}
function useActiveAnchor(container, marker) {
  const { isAsideEnabled } = useAside();
  const router = useRouter2();
  const routeHash = ref12(router.currentRoute.value.hash);
  let prevActiveLink = null;
  const setActiveLink = () => {
    if (!isAsideEnabled.value)
      return;
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const offsetHeight = document.body.offsetHeight;
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;
    const headers = resolvedHeaders.map(({ element, link }) => ({
      link,
      top: getAbsoluteTop(element)
    })).filter(({ top }) => !Number.isNaN(top)).sort((a, b) => a.top - b.top);
    if (!headers.length) {
      activateLink(null);
      return;
    }
    if (scrollY < 1) {
      activateLink(null);
      return;
    }
    if (isBottom) {
      activateLink(headers[headers.length - 1].link);
      return;
    }
    let activeLink = null;
    for (const { link, top } of headers) {
      if (top > scrollY + 88)
        break;
      activeLink = link;
    }
    activateLink(activeLink);
  };
  function activateLink(hash) {
    routeHash.value = hash || "";
    if (prevActiveLink)
      prevActiveLink.classList.remove("active");
    if (hash == null) {
      prevActiveLink = null;
    } else {
      prevActiveLink = container.value?.querySelector(
        `a[href="${decodeURIComponent(hash)}"]`
      ) ?? null;
    }
    const activeLink = prevActiveLink;
    if (activeLink) {
      activeLink.classList.add("active");
      if (marker.value) {
        marker.value.style.top = `${activeLink.offsetTop + 39}px`;
        marker.value.style.opacity = "1";
      }
    } else {
      if (marker.value) {
        marker.value.style.top = "33px";
        marker.value.style.opacity = "0";
      }
    }
  }
  const onScroll = useThrottleFn(setActiveLink, 100);
  watchDebounced(routeHash, () => {
    updateHash(router, routeHash.value);
  }, { debounce: 500 });
  onMounted4(() => {
    requestAnimationFrame(setActiveLink);
    window.addEventListener("scroll", onScroll);
  });
  onUpdated(() => {
    activateLink(location.hash);
  });
  onUnmounted4(() => {
    window.removeEventListener("scroll", onScroll);
  });
}
function getAbsoluteTop(element) {
  let offsetTop = 0;
  while (element !== document.body) {
    if (element === null) {
      return Number.NaN;
    }
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}
async function updateHash(router, hash) {
  const { path, query } = router.currentRoute.value;
  const { scrollBehavior } = router.options;
  router.options.scrollBehavior = void 0;
  await router.replace({ path, query, hash });
  router.options.scrollBehavior = scrollBehavior;
}

// src/client/composables/prev-next.ts
import { computed as computed21 } from "vue";
import { resolveRouteFullPath as resolveRouteFullPath3, usePageLang as usePageLang4, useRoute as useRoute6 } from "vuepress/client";
import { isPlainObject as isPlainObject2, isString as isString2 } from "vuepress/shared";
import { resolveNavLink as resolveNavLink3 } from "../utils/index.js";
function usePrevNext() {
  const route = useRoute6();
  const { frontmatter, theme } = useData();
  const { sidebar } = useSidebar();
  const postList = usePostList();
  const locale = usePageLang4();
  const { isBlogPost } = useBlogPageData();
  const prevNavList = computed21(() => {
    if (theme.value.prevPage === false)
      return null;
    const prevConfig = resolveFromFrontmatterConfig(frontmatter.value.prev);
    if (prevConfig !== false)
      return prevConfig;
    if (isBlogPost.value) {
      return resolveFromBlogPostData(
        postList.value.filter((item) => item.lang === locale.value),
        route.path,
        -1
      );
    } else {
      return resolveFromSidebarItems(flatSidebar(sidebar.value), route.path, -1);
    }
  });
  const nextNavList = computed21(() => {
    if (theme.value.nextPage === false)
      return null;
    const nextConfig = resolveFromFrontmatterConfig(frontmatter.value.next);
    if (nextConfig !== false)
      return nextConfig;
    if (isBlogPost.value) {
      return resolveFromBlogPostData(
        postList.value.filter((item) => item.lang === locale.value),
        route.path,
        1
      );
    } else {
      return resolveFromSidebarItems(flatSidebar(sidebar.value), route.path, 1);
    }
  });
  return {
    prev: prevNavList,
    next: nextNavList
  };
}
function resolveFromFrontmatterConfig(conf) {
  if (conf === false)
    return null;
  if (isString2(conf))
    return resolveNavLink3(conf);
  if (isPlainObject2(conf))
    return conf;
  return false;
}
function flatSidebar(sidebar, res = []) {
  for (const item of sidebar) {
    if (item.link)
      res.push({ link: item.link, text: item.text || item.dir || "" });
    if (Array.isArray(item.items) && item.items.length)
      flatSidebar(item.items, res);
  }
  return res;
}
function resolveFromSidebarItems(sidebarItems, currentPath, offset) {
  const index = sidebarItems.findIndex((item) => resolveRouteFullPath3(item.link) === currentPath);
  if (index !== -1) {
    const targetItem = sidebarItems[index + offset];
    if (targetItem?.link) {
      return {
        link: targetItem.link,
        text: targetItem.text
      };
    }
  }
  return null;
}
function resolveFromBlogPostData(postList, currentPath, offset) {
  const index = postList.findIndex((item) => item.path === currentPath);
  if (index !== -1) {
    const targetItem = postList[index + offset];
    if (!targetItem?.path)
      return null;
    return {
      link: targetItem.path,
      text: targetItem.title
    };
  }
  return null;
}

// src/client/composables/scroll-behavior.ts
import { nextTick as nextTick2 } from "vue";
import { inBrowser as inBrowser2 } from "../utils/index.js";

// src/client/composables/scroll-promise.ts
var promise = null;
var promiseResolve = null;
var scrollPromise = {
  wait: () => promise,
  pending: () => {
    promise = new Promise((resolve) => promiseResolve = resolve);
  },
  resolve: () => {
    promiseResolve?.();
    promise = null;
    promiseResolve = null;
  }
};
var useScrollPromise = () => scrollPromise;

// src/client/composables/scroll-behavior.ts
function enhanceScrollBehavior(router) {
  router.options.scrollBehavior = async (to, from, savedPosition) => {
    await useScrollPromise().wait();
    if (savedPosition)
      return savedPosition;
    if (to.hash)
      return { el: to.hash, top: 64 };
    return { top: 0 };
  };
  router.beforeEach(() => {
    if (inBrowser2) {
      document.documentElement.classList.remove("smooth");
    }
  });
  router.afterEach(() => nextTick2(() => {
    if (inBrowser2) {
      document.documentElement.classList.add("smooth");
    }
  }));
}

// src/client/composables/watermark.ts
import { defineWatermarkConfig } from "@vuepress/plugin-watermark/client";
import { computed as computed22 } from "vue";
var FP = __PLUME_WM_FP__;
function setupWatermark() {
  const { frontmatter } = useData();
  defineWatermarkConfig(computed22(() => {
    const disableFullPage = typeof frontmatter.value.watermark === "object" && frontmatter.value.watermark.fullPage === false;
    return {
      parent: !FP || disableFullPage ? ".vp-doc" : "body"
    };
  }));
}
export {
  EncryptSymbol,
  blogPostData,
  darkModeSymbol,
  encrypt,
  enhanceScrollBehavior,
  focusedElement,
  getHeaders,
  getPresetLocaleData,
  getSidebar,
  getSidebarFirstLink,
  getSidebarGroups,
  hasActiveLink,
  headersSymbol,
  presetLocales,
  resolveHeaders,
  setupDarkMode,
  setupEncrypt,
  setupHeaders,
  setupSidebar,
  setupThemeData,
  setupWatermark,
  themeData,
  themeLocaleDataSymbol,
  useActiveAnchor,
  useArchives,
  useAside,
  useBlogCategory,
  useBlogExtract,
  useBlogPageData,
  useBulletin,
  useBulletinControl,
  useCloseSidebarOnEscape,
  useContributors,
  useDarkMode,
  useData,
  useEditLink,
  useEncrypt,
  useEncryptCompare,
  useEncryptData,
  useFlyout,
  useHeaders,
  useHomeHeroTintPlate,
  useIconsData,
  useInternalLink,
  useLangs,
  useLastUpdated,
  useLink,
  useLocalePostList,
  useNav,
  useNavbarData,
  usePostList,
  usePostListControl,
  usePrevNext,
  useRouteQuery,
  useScrollPromise,
  useSidebar,
  useSidebarControl,
  useSidebarData,
  useTagColors,
  useTags,
  useThemeData,
  useThemeLocaleData
};
