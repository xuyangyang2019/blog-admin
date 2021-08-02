<template>
  <msbdAndCmsList :mcList="comments" :initTable="tableTitle"></msbdAndCmsList>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getCommentsList, getCommentsCount } from '../../api/admin'

import msbdAndCmsList from '@/components/common/MsbdAndCmsList'

export default {
  components: {
    msbdAndCmsList
  },
  data() {
    return {
      tableTitle: { th: ['序号', '文章标题', '昵称', '评论', '时间'] }
    }
  },
  computed: {
    ...mapState('admin', {
      comments: 'comments'
    })
  },
  created() {
    // 获取评论
    // this.queryCommentsList()
  },
  methods: {
    ...mapMutations({
      SET_COMMENTS: 'admin/SET_COMMENTS',
      SET_PAGE_ARRAY: 'admin/SET_PAGE_ARRAY'
    }),
    queryCommentsList() {
      getCommentsList(1, 10).then((res) => {
        if (res.code === 200) {
          this.SET_COMMENTS(res.data)
        }
      })
      getCommentsCount(1, 10).then((res) => {
        if (res.code === 200) {
          this.SET_PAGE_ARRAY(res.data.count)
        }
      })
    }
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 获取评论数
      vm.queryCommentsList()
      document.title = '后台管理 -文章评论'
    })
  }
}
</script>
