<template>
  <div class="admin-articles-tag">
    <list :article_list="articles.tags"></list>
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
    ...mapState(['articles'])
  },
  watch: {
    $route: function () {
      this.getAdminArticles()
      document.title = '后台管理--' + this.$route.params.tag
    }
  },
  created() {
    this.getAdminArticles()
    document.title = '后台管理--' + this.$route.params.tag + '文章'
  },
  methods: {
    ...mapActions(['getArticles', 'getArticlesCount']),
    getAdminArticles: function () {
      const payload = {
        publish: true,
        tag: this.$route.params.tag,
        page: 1
      }
      this.getArticles(payload)
      this.getArticlesCount(payload)
    }
  }
}
</script>
<style lang="scss">
.admin-articles-tag {
  margin-top: 15px;
}
</style>
