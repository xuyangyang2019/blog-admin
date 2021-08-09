<template>
  <div class="admin-article-list-box">
    <table class="admin-table-articles">
      <!-- 表格头部 -->
      <thead>
        <tr>
          <th>
            <input id="checkAll" v-model="allChecked" type="checkbox" @click="allChoose" />
            <label for="checkAll">全选</label>
          </th>
          <th>ID</th>
          <th>标题</th>
          <th>标签</th>
          <th>浏览</th>
          <th>喜欢</th>
          <th>评论</th>
          <th>发表时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <!-- 表格主题 -->
      <tbody class="tbody-list">
        <tr v-for="(item, index) in articleList" :key="index" :class="{ bg: articles2Del.indexOf(item._id) !== -1 }">
          <!-- 选中框 -->
          <td>
            <input v-model="articles2Del" type="checkbox" :value="item._id" @click="singleChecked()" />
            <span style="visibility: hidden">单选</span>
          </td>
          <!-- 序号 -->
          <td>{{ index + 1 }}</td>
          <!-- 文章名 -->
          <td :title="item.title">{{ item.title }}</td>
          <!-- 标签 -->
          <td>
            <span v-for="(tag, index2) in item.tag" :key="'tag' + index2" ref="listTag" class="tbody-list-tag">
              {{ tag | changeLife }}
            </span>
          </td>
          <!-- 浏览 -->
          <td v-text="item.pv"></td>
          <!-- 点赞 -->
          <td v-text="item.likeNum"></td>
          <!-- 评论 -->
          <td v-text="item.commentNum"></td>
          <!-- 日期 -->
          <td v-text="$options.filters.reviseTime(item.updateTime)"></td>
          <!-- 操作 -->
          <td class="some-handle">
            <!-- 浏览 -->
            <button class="operation-btn" @click="reviewArticle(item)">
              <i class="fa fa-eye fa-lg" aria-hidden="true" title="预览"></i>
            </button>
            <!-- 修改 -->
            <button class="operation-btn" :class="{ waiting: updateInfo.wait }" @click="modifyArticle(item)">
              <i class="fa fa-pencil-square-o fa-lg" aria-hidden="true" title="修改"></i>
            </button>
            <!-- 删除 -->
            <button class="operation-btn" @click="removeArticle(item._id, index)">
              <i class="fa fa-trash-o fa-lg" aria-hidden="true" title="删除"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 批量删除按钮 -->
    <div v-show="articles2Del.length" class="remove-all">
      <button @click="removeArticles()">删除选中项</button>
    </div>

    <!-- 过度窗口 -->
    <transition name="fade">
      <div v-show="updateInfo.show" class="validate-mask">
        <div class="update-warning">
          <h3>数据抓取超时，请稍后再试...</h3>
          <button @click="updateInfo = { show: false, wait: false }">确定</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { deleteArticles } from '../../api/admin'
import { getArticle } from '../../api/admin'

export default {
  // 定义过滤器，将life标签替换为“生活”
  filters: {
    changeLife: function (value) {
      if (value === 'life') {
        value = '生活'
        return value
      } else {
        return value
      }
    }
  },
  props: {
    articleList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      allChecked: false, // 全选
      articles2Del: [], // 选中的文章的id的集合
      updateInfo: { show: false, wait: false },
      // 标签背景颜色
      color: [
        '#FF9933',
        '#663300',
        '#CC6600',
        '#99CC33',
        '#9933FF',
        '#009966',
        '#FFCC99',
        '#336666',
        '#CC6699',
        '#CCCC00'
      ]
    }
  },
  watch: {
    articleList() {
      this.allChecked = false
      this.articles2Del = []
      this.$nextTick(() => {
        if (this.articleList.length) {
          this.initBackground()
        }
      })
    }
  },
  mounted() {
    if (this.articleList.length) {
      this.$nextTick(() => {
        this.initBackground()
      })
    }
  },
  methods: {
    ...mapMutations({
      REDUCE_ARR: 'admin/REDUCE_ARR',
      REDUCE_ARR_ALL: 'admin/REDUCE_ARR_ALL'
    }),
    // 随机生成标签的背景色 ok
    initBackground() {
      // 随机生成标签的背景色
      // this.$refs.listTag.forEach((item, index, arr) => {
      //   item.style.background = "#" + Math.floor(Math.random() * 0xffffff).toString(16)
      // })
      // 随机选中颜色
      this.$refs.listTag.forEach((item) => {
        item.style.background = this.color[Math.floor(Math.random() * 10)]
      })
    },
    // 单选 ok
    singleChecked() {
      // 加定时器是因为先触发click事件，此时articleItem
      // 还没有被推入新的值，因此将此事件推入事件队列，先让articleItem插值完成
      setTimeout(() => {
        if (this.articles2Del.length === this.articleList.length) {
          this.allChecked = true
        } else {
          this.allChecked = false
        }
      }, 0)
    },
    // 全选 ok
    allChoose() {
      if (this.articles2Del.length !== this.articleList.length) {
        const choseArr = []
        this.articleList.forEach((item) => {
          choseArr.push(item._id)
        })
        this.articles2Del = choseArr
      } else {
        this.articles2Del = []
      }
    },
    // 预览文章 ok
    reviewArticle(item) {
      this.$router.push({
        name: 'review',
        params: { eTag: item.tag[0], articleId: item._id }
      })
    },
    // 修改文章 ok
    modifyArticle(item) {
      this.updateInfo = { show: false, wait: true }
      getArticle(item._id).then((res) => {
        if (res.code === 200) {
          this.updateInfo = { show: false, wait: false }
          this.$store.commit('admin/SET_ARTICLE', res.data)
          // 如果当前是草稿箱 跳转到draftrevise
          if (this.$route.path === '/draft') {
            this.$router.push({
              name: 'draftrevise',
              params: { articleId: item._id }
            })
          } else {
            this.$router.push({
              name: 'update',
              params: { articleId: item._id }
            })
          }
        } else {
          this.updateInfo = { show: true, wait: false }
        }
      })
    },
    // 删除单篇文章 ok
    removeArticle(_id, index) {
      this.$confirm('确认删除该文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteArticles([_id]).then((res) => {
            // 如果删除成功 删除缓存中的数据
            if (res.code === 200) {
              this.REDUCE_ARR({
                name: this.$route.name,
                index: index
              })
            }
            // 给出提示
            this.$message({
              type: res.code === 200 ? 'success' : 'warning',
              message: res.code === 200 ? '删除成功!' : '删除失败'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          })
        })
    },
    // 删除多篇文章 ok
    removeArticles() {
      this.$confirm('确认删除选中的文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteArticles(this.articles2Del).then((res) => {
            // 如果删除成功 删除缓存中的数据
            if (res.code === 200) {
              this.REDUCE_ARR_ALL({
                name: this.$route.name,
                removeArr: this.articles2Del
              })
            }
            // 提示
            this.$message({
              type: res.code === 200 ? 'success' : 'warning',
              message: res.code === 200 ? '删除成功!' : '删除失败'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          })
        })
    }
  }
}
</script>

<style lang="scss">
.bg {
  background: #fff38f !important;
}
.admin-article-list-box{
  flex: 1 1 auto;
}
.admin-table-articles {
  width: 100%;
  color: #606266;
  table-layout: fixed;
  border-collapse: collapse;
  tr {
    border-bottom: 1px solid #ccc;
    text-align: center;
  }
  th {
    color: #333;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border: 1px solid #ccc;
    padding: 5px;
  }
  td {
    border: 1px solid #ccc;
    padding: 5px;
  }
  td:not(:last-child) {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .some-handle {
    .operation-btn {
      cursor: pointer;
      border: solid #ccc 1px;
      color: #606266;
      background: inherit;
      padding: 2px;
      margin: 0 5px;
      border-radius: 2px;
      &:hover {
        background: #409eff;
        .fa-trash-o {
          color: red;
        }
      }
    }
  }

  input[type='checkbox'],
  label {
    vertical-align: middle;
  }
  .tbody-list tr:nth-child(odd) {
    background: #f5f7fa;
  }
  .tbody-list-tag {
    display: inline-block;
    margin: 0 2px;
    padding: 2px 5px;
    border-radius: 3px;
    color: #ffffff;
  }
}

.validate-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.validate-bin,
.update-warning {
  margin: 50px auto 0;
  border-radius: 5px;
  width: 30%;
  height: 200px;
  background: #ffffff;
  overflow: hidden;
}
.exit-validate {
  border-radius: 5px 5px 0 0;
  background: #f7f7f7;
  text-align: right;
  padding: 5px 10px 5px 0;
  span {
    cursor: pointer;
  }
}
.sure-delete,
.update-warning {
  text-align: center;
  color: #e6a23c;
  h3 {
    margin-top: 50px;
  }
  button:hover {
    opacity: 0.8;
  }
}
.update-warning h3 {
  margin-top: 70px;
}
.sure-delete button,
.update-warning button {
  outline: none;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  padding: 5px 8px;
  background: #409eff;
  margin: 50px 10px 0;
}
.remove-all {
  display: flex;
  button {
    outline: none;
    color: #fff;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    background: #e6a23c;
    margin: 5px 5px 0 0;
  }
  button:hover {
    opacity: 0.9;
  }
}
.waiting,
.waiting span {
  cursor: wait !important;
}

.icon-crop-a,
.icon-eye-a,
.icon-bin-a {
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  font-size: 16px;
  display: inline-block;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 2px;
}
.icon-crop-a:hover,
.icon-eye-a:hover {
  color: #ffffff;
  background: #409eff;
}
.icon-bin-a:hover {
  color: red;
  background: #409eff;
}
@media screen and(min-width: 768px) {
  .icon-crop-a,
  .icon-eye-a,
  .icon-bin-a {
    margin-left: -5px;
  }
  .icon-eye-a {
    margin-left: -4px;
  }
}
@media screen and(max-width: 767px) {
  .validate-bin {
    width: 80%;
  }
}
</style>
