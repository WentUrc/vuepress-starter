import comp from "C:/Users/27493/Documents/GitHub/vuepress-starter/docs/.vuepress/.temp/pages/tech/index.html.vue"
const data = JSON.parse("{\"path\":\"/tech/\",\"title\":\"专门用于存放技术文档\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[],\"git\":{\"updatedTime\":1727188073000,\"contributors\":[{\"name\":\"Larch4\",\"email\":\"114554982+Larch4@users.noreply.github.com\",\"commits\":1}]},\"filePathRelative\":\"tech/README.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}