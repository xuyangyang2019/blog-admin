<template>
  <div class="admin-articles">
    <list :articleList="allArticls"></list>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getArticleList } from '../../api/admin'

import list from '@/components/common/ArticleList'

export default {
  components: {
    list
  },
  computed: {
    ...mapState('admin', {
      allArticls: 'allArticls'
    })
  },
  created() {
    // 分页获取文章
    this.queryArticles()
  },
  methods: {
    ...mapMutations({
      SET_ALL_ARTICLES: 'admin/SET_ALL_ARTICLES',
      PAGE_ARRAY: 'admin/PAGE_ARRAY'
    }),
    // 查询已发表的文章列表
    queryArticles() {
      getArticleList(1, 10, 1, '').then((res) => {
        if (res.code === 200) {
          this.SET_ALL_ARTICLES = res.data.list
          this.PAGE_ARRAY = res.data.count
        }
      })
    }
  },
  // 组件缓存后，为了让每个模块显示正确的页码，故重新计算页码数
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter')
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
