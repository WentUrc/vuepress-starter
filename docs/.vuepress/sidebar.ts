import { SidebarMulti } from "vuepress-theme-plume";

export default {
    '/learn/': [
        {
            text: '这算新的开始吧',
            collapsed: false, // VuePress 2.x 中的 `collapsable` 替换为 `collapsed`
            items: [
            '/learn/',  // README.md 对应路径
            '/learn/1.md', 
            ],
        },
    ],
} as SidebarMulti;
