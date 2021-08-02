<template>
  <div class="draft">
    <ArticleList :articleList="drafts" />
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="articlesCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getArticlesList, getArticlesCount } from '../../api/admin'

import ArticleList from '../common/ArticleList.vue'

export default {
  name: 'ArticleDrafts',
  components: {
    ArticleList
  },
  data() {
    return {
      drafts: [], // 未发表的文章
      currentPage: 1, // 当前页
      pageSize: 10, // 每页文章数
      articlesCount: 0 // 文章总数
    }
  },
  // created() {
  //   // 查询未发表的文章
  //   // this.queryDraftsArticles()
  // },
  methods: {
    // 查询已发表的文章列表和文章数量
    queryArticles() {
      this.queryArticlesList()
      // 查询文章数量
      getArticlesCount(false, '').then((res) => {
        if (res.code === 200) {
          this.articlesCount = res.data.count
        }
      })
    },
    // 查询文章列表
    queryArticlesList() {
      getArticlesList(this.currentPage, this.pageSize, false, '')
        .then((res) => {
          if (res.code === 200) {
            this.drafts = res.data
          } else {
            this.drafts = []
          }
        })
        .catch((err) => {
          console.log(err)
          this.drafts = []
        })
    },
    // pageSize改变
    handleSizeChange(val) {
      this.pageSize = val
      this.queryArticlesList()
    },
    // page改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.queryArticlesList()
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.queryArticles()
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
