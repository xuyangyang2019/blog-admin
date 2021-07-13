<template>
  <msbdAndCmsList :mcList="msgBoard" :initTable="tableTitle"></msbdAndCmsList>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getMsgBoard } from '../../api/admin'

import msbdAndCmsList from '@/components/common/MsbdAndCmsList.vue'

export default {
  components: {
    msbdAndCmsList
  },
  data() {
    return {
      tableTitle: { th: ['序号', '用户名', '留言', '时间'] }
    }
  },
  computed: {
    ...mapState('admin', {
      msgBoard: 'msgBoard'
    })
  },
  created() {
    // this.queryMsgBoard()
  },
  methods: {
    ...mapMutations({
      SET_MSG_BOARD: 'admin/SET_MSG_BOARD',
      SET_PAGE_ARRAY: 'admin/SET_PAGE_ARRAY'
    }),
    queryMsgBoard() {
      getMsgBoard(1, 10).then((res) => {
        if (res.code === 200) {
          this.SET_MSG_BOARD(res.data.list)
          this.SET_PAGE_ARRAY(res.data.count)
        }
      })
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
