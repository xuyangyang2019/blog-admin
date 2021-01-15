<template>
  <div class="search-articles">
    <div class="search-info">以下是为您搜索到的内容：</div>

    <div v-if="!articles.search.length" class="search-empty">啊哦~~空空如也</div>
    <list v-if="articles.search && articles.search.length" :article_list="articles.search"></list>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import list from '@/components/common/ArticleList'

export default {
  components: {
    list
  },
  computed: {
    ...mapState('admin', {
      articles: 'articles'
    })
  },
  created() {
    this.getSearch(this.$route)
  },
  methods: {
    ...mapActions({
      searchArticles: 'admin/SearchAdminArticles',
      getArticlesCount: 'admin/GetArticlesCount'
    }),
    getSearch(route) {
      // 时间范围搜索
      if (route.params.base.indexOf('-') !== -1) {
        // eslint-disable-next-line no-useless-escape
        const timeArr = route.params.base.match(/\d+\-\d+\-\d+/g)
        // utc时间0点起
        const startTime = new Date(Date.parse(timeArr[0])).getTime()
        // utc时间24点
        const endTime = new Date(Date.parse(timeArr[1])).getTime() + 1000 * 60 * 60 * 24
        this.searchArticles({
          publish: true,
          start: startTime,
          end: endTime,
          page: 1
        })
        this.getArticlesCount({
          publish: true,
          start: startTime,
          end: endTime
        })
        // 关键词搜索
      } else {
        this.searchArticles({
          publish: true,
          key: route.params.base,
          according: 'key',
          page: 1
        })
        this.getArticlesCount({
          publish: true,
          key: route.params.base
        })
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    document.title = '后台管理 -文章搜索'
    next((vm) => {
      if (from.name !== 'search') {
        vm.getSearch(to)
      }
    })
  },

  beforeRouteUpdate(to, from, next) {
    this.getSearch(to)
    next()
  }
}
</script>
<style lang="scss">
.search-articles {
  margin-top: 15px;
}
.search-info {
  padding: 5px;
  color: orange;
}
.search-empty {
  text-align: center;
  font-size: 28px;
  margin-top: 20px;
}
</style>
