import { defineThemeConfig } from 'vuepress-theme-plume';
import navbar from './navbar';

export default defineThemeConfig({
    logo: '/logo.png',
    docsRepo: 'https://github.com/WentUrc/vuepress-starter',
    docsBranch:'docs',
    docsDir: 'docs',

    profile: {
        avatar: '/logo-O2.jpg',
        name: 'WentUrc Docs',
        description: '兰花草，梅花桩',
    },

    navbar,

    footer: {
        message: `
            Palimpsested by
                <span style="
                    font-size: 16px;
                    display: inline-block;
                    background: linear-gradient(to right, #4facfe, #00f2fe, #f77062, #fe5196);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    transition: background-position 0.5s ease-in-out;
                    background-size: 400%; /* 扩大背景尺寸 */
                    background-position: 0% 50%; /* 初始位置 */
                " 
                onmouseover="this.style.backgroundPosition='100% 50%';" 
                onmouseout="this.style.backgroundPosition='0% 50%';">
                    Ice Glycoside Crystal
                </span>
        `,
        copyright: `
            <span style="
                display: inline-flex; 
                align-items: center; 
                justify-content: center;
                gap: 8px;">
                <a aria-label="Homepage" title="WentUrc Documents" href="https://docs.wenturc.com" style="display: inline-flex;">
                    <img src="/logo.svg" width="20" height="20" />
                </a>
                <span>© 2024 - present 
                    <span style="
                        font-size: 16px;
                        display: inline-block;
                        background: linear-gradient(to right, #4facfe, #00f2fe, #f77062, #fe5196);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        transition: background-position 0.5s ease-in-out;
                        background-size: 400%; /* 扩大背景尺寸 */
                        background-position: 0% 50%; /* 初始位置 */
                    " 
                    onmouseover="this.style.backgroundPosition='100% 50%';" 
                    onmouseout="this.style.backgroundPosition='0% 50%';">
                        冰苷晶 Cabinina
                    </span>
                </span>
            </span>
        `,
    },
});