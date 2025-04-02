import { SidebarMulti } from "vuepress-theme-plume";

export default {
    '/beta/': [
        {
            text: 'beta',
            collapsed: false, // VuePress 2.x 中的 `collapsable` 替换为 `collapsed`
            items: [
            '/beta/',  // README.md 对应路径
            '/beta/1.md',
            '/beta/2.md',
            '/beta/3.md',
            '/beta/4.md',
            '/beta/5.md',
            '/beta/6.md',
            '/beta/7.md',
            '/beta/8.md',
            ],
        },
    ],

    '/tech/': [
        {
            text: 'tech',
            collapsed: false,
            items: [
            '1.md',
            '2.md',
            '3.md',
            '4.md',
            '5.md',
            '6.md',
            '7.md',
            '8.md',
            '9.md',
            '10.md',
            '11.md',
            '12.md',
            '13.md',
            '14.md',
            '15.md',
            '16.md',
            '17.md',
            '18.md'
            ],  // 同样这里也可以增加其他子页面
        },
    ],
    
    '/learn/': [
            //Group1
        {
            text: 'Learn',
            items: [
                {
                    text: '工程力学',
                    collapsed: false,
                    items: [
                        '/learn/工程力学/复习资料1.md',
                        '/learn/工程力学/题目1的解答.md',
                        '/learn/工程力学/题目解答2.md'
                    ],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '建筑结构',
                    collapsed: false,
                    items: [
                        '/learn/建筑结构/复习资料1.md',
                        '/learn/建筑结构/复习资料2.md',
                    ],
                },
                {
                    text: '管理学',
                    collapsed: false,
                    items: [
                        '/learn/管理学/绪论.md',
                        '/learn/管理学/第一章.md',
                        '/learn/管理学/第二章.md', 
                        '/learn/管理学/复习资料.md'
                    ],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '经济学',
                    collapsed: false,
                    items: [
                        '/learn/经济学/经济学期末考-复习1.md',
                        '/learn/经济学/经济学期末考-复习2.md'
                    ],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '英语',
                    collapsed: false,
                    items: 
                    [
                        '/learn/英语/期末资料 .md',
                        '/learn/英语/期末资料2.md',
                            {
                                text: '四级复习',
                                collapsed: true,
                                items: [
                                    '/learn/英语/CET-4/README.md',
                                    '/learn/英语/CET-4/0.md',
                                    '/learn/英语/CET-4/1.md',
                                    '/learn/英语/CET-4/2.md'
                                ]
                            },
                            {
                                text: '六级复习',
                                collapsed: true,
                                items: [
                                    '/learn/英语/CET-6/README.md',
                                    '/learn/英语/CET-6/1.md',
                                ]
                            },
                    ],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '近代史',
                    collapsed: false,
                    items: [
                        '/learn/近代史/期末资料 .md',
                    ],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '毛泽东概论',
                    collapsed: false,
                    items: [
                        '/learn/毛概/导论.md', 
                        '/learn/毛概/第一章.md', 
                        '/learn/毛概/第二章.md',
                    ]
                },
            ],
        },
    ],
} as SidebarMulti;
