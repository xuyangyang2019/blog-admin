<template>
  <div>
    <msbdAndCmsList :mcList="msgBoard" :initTable="tableTitle"></msbdAndCmsList>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="msgCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getMsgBoard, getMsgCount } from '../../api/admin'

import msbdAndCmsList from '@/components/common/MsbdAndCmsList.vue'

export default {
  components: {
    msbdAndCmsList
  },
  data() {
    return {
      tableTitle: { th: ['序号', '用户名', '留言', '时间'] },
      msgBoard: [], // 已发表的文章
      currentPage: 1, // 当前页
      pageSize: 10, // 每页文章数
      msgCount: 0 // 文章总数
    }
  },
  created() {
    // this.queryMsgBoard()
  },
  methods: {
    // 查询已发表的文章列表和文章数量
    queryMsgBoard() {
      this.queryMessagesList()
      // 查询文章数量
      getMsgCount().then((res) => {
        if (res.code === 200) {
          this.msgCount = res.data.count
        }
      })
    },
    // 查询文章列表
    queryMessagesList() {
      getMsgBoard(this.currentPage, this.pageSize)
        .then((res) => {
          if (res.code === 200) {
            this.msgBoard = res.data
          } else {
            this.msgBoard = []
          }
        })
        .catch((err) => {
          console.log(err)
          this.msgBoard = []
        })
    },
    // pageSize改变
    handleSizeChange(val) {
      this.pageSize = val
      this.queryMessagesList()
    },
    // page改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.queryMessagesList()
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.queryMsgBoard()
      document.title = '后台管理 -留言管理'
    })
  }
}
</script>
