<template>
  <msbdAndCmsList :mcList="msgBoard" :initTable="_initTable"></msbdAndCmsList>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"

import msbdAndCmsList from "@/components/c-m-list/msbdAndCmsList.vue"

export default {
  data() {
    return {
      init: { th: ["序号", "用户名", "留言", "时间"] }
    }
  },
  components: {
    msbdAndCmsList
  },
  computed: {
    // ...mapState(["msgBoard"]),
    ...mapGetters({
      msgBoard: "axios/msgBoard"
    }),
    _initTable() {
      return this.init
    }
  },
  methods: {
    // ...mapActions(["getMsgBoard", "getMsgCount"])
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
