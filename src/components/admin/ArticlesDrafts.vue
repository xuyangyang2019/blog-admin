<template>
  <div class="draft">
    <article-list :articleList="drafts"></article-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticlesList } from '../../api/admin'

import ArticleList from '../common/ArticleList.vue'

export default {
  name: 'ArticleDrafts',
  components: {
    ArticleList
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('admin', {
      drafts: 'drafts'
    })
  },
  created() {
    // 查询未发表的文章
    // this.queryDraftsArticles()
  },
  methods: {
    // 分页查询未发表的文章
    queryDraftsArticles() {
      getArticlesList(1, 10, 0, '').then((res) => {
        if (res.code === 200) {
          this.$store.commit('admin/SET_DRAFTS', res.data.list)
          this.$store.commit('admin/SET_PAGE_ARRAY', res.data.count)
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.queryDraftsArticles({ publish: false })
      document.title = '后台管理 -草稿箱'
    })
  }
}
</script>

<style lang="scss">
.draft {
  margin-top: 15px;
  color: black;
}
</style>
