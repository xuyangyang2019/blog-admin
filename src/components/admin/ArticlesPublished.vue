<template>
  <div class="articles-published">
    <!-- 搜索 -->
    <div class="search-box">
      <el-input
        v-model="keyword"
        style="width: 200px; margin-right: 10px"
        placeholder="请输入关键词"
        size="small"
        clearable
        maxlength="10"
        show-word-limit
      ></el-input>
      <el-date-picker
        v-model="searchTime"
        style="width: 300px; margin-right: 10px"
        type="daterange"
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" size="small" @click="searchArticle(1, 10)">搜索</el-button>
    </div>
    <!-- 数据展示 -->
    <ArticleList :articleList="articlesPublished" />
    <!-- 分页 -->
    <el-pagination
      style="padding: 5px 0"
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
import { getArticlesList, getArticlesCount, searchArticles } from '../../api/admin'

export default {
  name: 'ArticlesPublished',
  components: {
    ArticleList
  },
  data() {
    return {
      keyword: '', // 关键词
      searchTime: '',
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
    // 搜索文章
    searchArticle(page, size) {
      this.currentPage = 1
      let startTime = null
      let endTime = null
      if (this.searchTime instanceof Array) {
        startTime = this.searchTime[0]
        endTime = this.searchTime[1]
      }
      searchArticles(this.keyword, startTime, endTime, page, size).then((res) => {
        if (res.code === 200) {
          this.articlesPublished = res.data.docs
          this.articlesCount = res.data.count
        }
      })
      // this.$router.push({ name: 'search', params: { keyword: this.keyword, searchTime: this.searchTime } })
    },
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
      if (this.keyword || this.searchTime instanceof Array) {
        this.searchArticle(this.currentPage, this.pageSize)
      } else {
        this.queryArticlesList()
      }
    },
    // page改变
    handleCurrentChange(val) {
      this.currentPage = val
      if (this.keyword || this.searchTime instanceof Array) {
        this.searchArticle(this.currentPage, this.pageSize)
      } else {
        this.queryArticlesList()
      }
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

<style lang="scss" scoped>
.articles-published {
  height: 100%;
  display: flex;
  flex-direction: column;
  .search-box {
    display: flex;
    padding: 5px 0;
  }
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
