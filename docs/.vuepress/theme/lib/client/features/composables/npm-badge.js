// src/client/features/composables/npm-badge.ts
import { computed, inject, provide, ref, toValue } from "vue";
var DEFAULT_COLOR = "#32A9C3";
var DEFAULT_LABEL_COLOR = "#1B3C4A";
var BADGE_URL = "https://img.shields.io";
var GITHUB_URL = "https://github.com";
var NPM_URL = "https://www.npmjs.com/package";
var NpmBadgeSymbol = Symbol(__VUEPRESS_DEV__ ? "NpmBadge" : "");
function useNpmBadge(opt) {
  const parentOpt = inject(NpmBadgeSymbol, ref({}));
  return computed(() => {
    const po = toValue(parentOpt);
    const o = toValue(opt);
    const res = {
      name: o.name || po.name,
      repo: o.repo || po.repo,
      branch: o.branch || po.branch,
      dir: o.dir || po.dir,
      type: o.type,
      color: o.color || po.color,
      label: o.label,
      labelColor: o.labelColor || po.labelColor,
      theme: o.theme || po.theme
    };
    return resolveNpmBadgeOptions(res);
  });
}
function useNpmBadgeGroup(opt) {
  const baseOptions = computed(() => {
    const o = toValue(opt);
    return {
      name: o.name,
      repo: o.repo,
      branch: o.branch,
      dir: o.dir,
      color: o.color,
      labelColor: o.labelColor,
      theme: o.theme
    };
  });
  provide(NpmBadgeSymbol, baseOptions);
}
function resolveNpmBadgeOptions(options) {
  let { name = "", repo = "", branch = "main", dir = "", type, color, label, labelColor, theme = "" } = options;
  name = name || repo.split("/")?.[1] || "";
  const normalizeName = encodeURIComponent(name);
  const githubLink = repo ? `${GITHUB_URL}/${repo}${dir ? `/tree/${branch}/${dir}` : ""}` : "";
  const npmLink = `${NPM_URL}/${name}`;
  const params = new URLSearchParams();
  if (type !== "source" && type !== "stars" && type !== "forks") {
    params.append("style", theme || "flat");
    params.append("color", color || DEFAULT_COLOR);
    params.append("labelColor", labelColor || DEFAULT_LABEL_COLOR);
  }
  switch (type) {
    case "source": {
      params.append("logo", "github");
      params.append("color", labelColor || DEFAULT_LABEL_COLOR);
      return {
        badgeUrl: `${BADGE_URL}/badge/source-a?${params.toString()}`,
        link: githubLink,
        alt: "github source"
      };
    }
    case "stars":
    case "forks": {
      params.append("style", theme || "social");
      return {
        badgeUrl: `${BADGE_URL}/github/${type}/${repo}?${params.toString()}`,
        link: githubLink,
        alt: `github ${type}`
      };
    }
    case "license":
      return {
        badgeUrl: `${BADGE_URL}/github/license/${repo}?${params.toString()}`,
        link: githubLink,
        alt: "license"
      };
    case "version": {
      params.append("label", label || name || "npm");
      return {
        badgeUrl: `${BADGE_URL}/npm/v/${normalizeName}?${params.toString()}`,
        link: npmLink,
        alt: "npm version"
      };
    }
    case "dt":
    case "d18m": {
      params.append("label", label || "downloads");
      return {
        badgeUrl: `${BADGE_URL}/npm/d18m/${normalizeName}?${params.toString()}`,
        link: npmLink,
        alt: "npm downloads"
      };
    }
    case "dm":
    case "dy":
    case "dw": {
      params.append("label", label || "downloads");
      return {
        badgeUrl: `${BADGE_URL}/npm/${type}/${normalizeName}?${params.toString()}`,
        link: npmLink,
        alt: "npm downloads"
      };
    }
    default:
      return {
        badgeUrl: `${BADGE_URL}/badge/unknown?${params.toString()}`,
        alt: "unknown"
      };
  }
}
export {
  useNpmBadge,
  useNpmBadgeGroup
};
