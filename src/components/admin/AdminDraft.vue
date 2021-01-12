<template>
  <div class="draft">
    <list :articleList="draftsArticles"></list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticleList } from '../../api/admin'

import list from '@/components/common/ArticleList'

export default {
  components: {
    list
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('admin', {
      draftsArticles: 'draftsArticles'
    })
  },
  created() {
    // 查询未发表的文章
    this.queryDraftsArticles()
  },
  methods: {
    // 分页查询未发表的文章
    queryDraftsArticles() {
      getArticleList(1, 10, 0, '').then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.SET_DRAFTS_ARTICLES = res.data.list
          this.PAGE_ARRAY = res.data.count
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
