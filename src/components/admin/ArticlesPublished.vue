<template>
  <div class="admin-articles">
    <ArticleList :articleList="articlesPublished" />
    <!-- 分页 -->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="articlesCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <!-- <transition name="fade" mode="out-in"></transition> -->
  </div>
</template>

<script>
import ArticleList from '../common/ArticleList.vue'
import { getArticlesList, getArticlesCount } from '../../api/admin'

export default {
  name: 'ArticlesPublished',
  components: {
    ArticleList
  },
  data() {
    return {
      articlesPublished: [], // 已发表的文章
      currentPage: 1, // 当前页
      pageSize: 10, // 每页文章数
      articlesCount: 0 // 文章总数
    }
  },
  // created() {
  //   this.queryArticles()
  // },
  methods: {
    // 查询已发表的文章列表和文章数量
    queryArticles() {
      this.queryArticlesList()
      // 查询文章数量
      getArticlesCount(true, '').then((res) => {
        if (res.code === 200) {
          this.articlesCount = res.data.count
        }
      })
    },
    // 查询文章列表
    queryArticlesList() {
      getArticlesList(this.currentPage, this.pageSize, true, '')
        .then((res) => {
          if (res.code === 200) {
            this.articlesPublished = res.data
          } else {
            this.articlesPublished = []
          }
        })
        .catch((err) => {
          console.log(err)
          this.articlesPublished = []
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
  // .fade-enter-active,
  // .fade-leave-active {
  //   transition: opacity 0.3s;
  // }
  // .fade-enter,
  // .fade-leave-to {
  //   opacity: 0;
  // }
}
</style>
