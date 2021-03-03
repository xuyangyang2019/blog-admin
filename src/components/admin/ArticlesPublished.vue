<template>
  <div class="admin-articles">
    <article-list :articleList="articles"></article-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticleList } from '../../api/admin'

import ArticleList from '../common/ArticleList.vue'

export default {
  name: 'ArticlesPublished',
  components: {
    ArticleList
  },
  computed: {
    ...mapState('admin', {
      articles: 'articles'
    })
  },
  created() {
    // 分页获取文章
    // this.queryArticles()
  },
  methods: {
    // 查询已发表的文章列表
    queryArticles() {
      getArticleList(1, 10, true, '').then((res) => {
        if (res.code === 200) {
          this.$store.commit('admin/SET_ARTICLES', res.data.list)
          this.$store.commit('admin/SET_PAGE_ARRAY', res.data.count)
        }
      })
    }
  },
  // 组件缓存后，为了让每个模块显示正确的页码，故重新计算页码数
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.queryArticles()
      document.title = '后台管理 -已发表文章'
    })
  }
}
</script>

<style lang="scss">
.admin-articles {
  margin-top: 15px;
}
</style>
