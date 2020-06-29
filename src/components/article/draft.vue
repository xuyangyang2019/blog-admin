<template>
  <div class="draft">
    {{ articles }}
    <list :article_list="articles.drafts"></list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import list from "@/components/article/articleList"

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      articles: "axios/articles"
    })
  },
  methods: {
    ...mapActions({
      getArticles: "axios/GetArticles",
      getArticlesCount: "axios/GetArticlesCount"
    }),
    // 分页查询未发表的文章
    allArticles_admin: function() {
      let payload = {
        publish: false,
        page: 1
      }
      this.getArticles(payload)
    }
  },
  components: {
    list
  },
  created() {
    console.log("created")
    this.allArticles_admin()
  },
  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter")
    next(vm => {
      vm.getArticlesCount({ publish: false })
      document.title = "后台管理 -草稿箱"
    })
  }
}
</script>

<style lang="scss">
.draft {
  margin-top: 15px;
  border: solid red 1px;
  color: black;
}
</style>
