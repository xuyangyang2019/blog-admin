<template>
  <div class="page">
    <button :disabled="preDisabled" class="changebtn" @click="prePage">
      <i class="fa fa-angle-left"></i>
    </button>
    <button
      v-for="(page, index) in pageArray"
      :key="index"
      :disabled="page == currentPage"
      :class="{ 'btn-bg': index === currentPage - 1 }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>
    <button :disabled="nextDisabled" class="changebtn" @click="nextPage">
      <i class="fa fa-angle-right"></i>
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      currentPage: 1,
      preDisabled: true,
      nextDisabled: false
    }
  },
  computed: {
    ...mapState('admin', {
      pageArray: 'pageArray'
    })
  },
  watch: {
    currentPage() {
      const cpg = this.currentPage
      // 按钮锁定
      if (cpg === 1) {
        this.preDisabled = true
      } else if (cpg > 1) {
        this.preDisabled = false
      }
      // 后退按钮锁定
      if (cpg < this.pageArray.length) {
        this.nextDisabled = false
      } else if (cpg === this.pageArray.length) {
        this.nextDisabled = true
      }
    }
  },
  methods: {
    ...mapActions({
      search: 'admin/Search',
      getArticles: 'admin/GetArticles',
      getMsgBoard: 'admin/GetMsgBoard',
      getAdminComments: 'admin/GetAdminComments'
    }),
    // 上一页
    prePage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.changePage(this.currentPage)
      }
    },
    // 下一页
    nextPage() {
      if (this.currentPage < this.pageArray.length) {
        this.currentPage++
        this.changePage(this.currentPage)
      }
    },
    // 改变页数
    changePage(page) {
      // const payload = {}
      // const tag = ''
      this.currentPage = page
      switch (this.$route.name) {
        case 'allArticles':
          this.getArticles({
            publish: true,
            page: page,
            tag: false
          })
          break
        case 'eachTag':
          this.getArticles({
            publish: true,
            page: page,
            tag: this.$route.params.tag
          })
          break
        case 'draft':
          this.getArticles({
            publish: false,
            page: page
          })
          break
        case 'adminMsgBoard':
          this.getMsgBoard({ pageNum: page })
          break
        case 'comments':
          this.getAdminComments({ page: page })
          break
        case 'search':
          if (this.$route.params.base.indexOf('-') !== -1) {
            // eslint-disable-next-line no-useless-escape
            const timeArr = this.$route.params.base.match(/\d+\-\d+\-\d+/g)
            // utc时间0点起
            const startTime = new Date(Date.parse(timeArr[0])).getTime()
            // utc时间24点
            const endTime = new Date(Date.parse(timeArr[1])).getTime() + 1000 * 60 * 60 * 24
            this.search({
              publish: true,
              start: startTime,
              end: endTime,
              page: page
            })
          } else {
            this.search({
              publish: true,
              key: this.$route.params.base,
              according: 'key',
              page: page
            })
          }
      }
    }
  }
}
</script>

<style lang="scss">
.page {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 5px;
}
.page button {
  color: #1a1a1a;
  border: 1px solid #85b9c8;
  border-radius: 3px;
  cursor: pointer;
  background: #ffffff;
  display: inline-block;
  width: 30px;
  height: 28px;
  margin: 2px;
  vertical-align: center;
  outline: none;
}
.page button[disabled] {
  cursor: auto;
}
.page .btn-bg {
  background: #c6eaf5 !important;
}
.page .changebtn {
  width: 30px;
}
</style>
