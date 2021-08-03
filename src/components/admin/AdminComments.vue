<template>
  <div>
    <msbdAndCmsList :mcList="commentsList" :initTable="tableTitle"></msbdAndCmsList>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="commentsCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getCommentsList, getCommentsCount } from '../../api/admin'

import msbdAndCmsList from '@/components/common/MsbdAndCmsList'

export default {
  components: {
    msbdAndCmsList
  },
  data() {
    return {
      tableTitle: { th: ['序号', '文章标题', '昵称', '评论', '时间'] },
      commentsList: [], // 已发表的文章
      currentPage: 1, // 当前页
      pageSize: 10, // 每页文章数
      commentsCount: 0 // 文章总数
    }
  },
  created() {
    // 获取评论
    // this.queryCommentsList()
  },
  methods: {
    // 查询已发表的文章列表和文章数量
    queryComments() {
      this.queryCommentsList()
      // 查询文章数量
      getCommentsCount().then((res) => {
        if (res.code === 200) {
          this.commentsCount = res.data.count
        }
      })
    },
    // 查询文章列表
    queryCommentsList() {
      getCommentsList(1, 10)
        .then((res) => {
          if (res.code === 200) {
            this.commentsList = res.data
          } else {
            this.commentsList = []
          }
        })
        .catch((err) => {
          console.log(err)
          this.commentsList = []
        })
    },
    // pageSize改变
    handleSizeChange(val) {
      this.pageSize = val
      this.queryCommentsList()
    },
    // page改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.queryCommentsList()
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 获取评论数
      vm.queryComments()
      document.title = '后台管理 -文章评论'
    })
  }
}
</script>
