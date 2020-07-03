<template>
  <msbdAndCmsList :mcList="msgBoard" :initTable="tableTitle"></msbdAndCmsList>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import msbdAndCmsList from "@/components/common/MsbdAndCmsList.vue"

export default {
  data() {
    return {
      tableTitle: { th: ["序号", "用户名", "留言", "时间"] }
    }
  },
  components: {
    msbdAndCmsList
  },
  computed: {
    ...mapGetters({
      msgBoard: "axios/msgBoard"
    })
  },
  methods: {
    ...mapActions({
      getMsgBoard: "axios/GetMsgBoard",
      getMsgCount: "axios/GetMsgCount"
    })
  },
  created() {
    this.getMsgBoard({ page: 1 })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getMsgCount()
      document.title = "后台管理 -留言管理"
    })
  }
}
</script>
