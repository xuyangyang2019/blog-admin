<template>
  <div class="msgboard-comments">
    <table class="msgboard-comments-table">
      <!-- 表格头部 -->
      <thead class="table-thead">
        <tr>
          <th>
            <input type="checkbox" id="checkAll" @click="allChecked" v-model="allChoose" />
            <label for="checkAll">全选</label>
          </th>
          <th v-for="(th, index) in initTable.th" :key="index" v-text="th"></th>
          <th>操作</th>
        </tr>
      </thead>
      <!-- 表格主体 -->
      <tbody class="table-tbody">
        <tr
          v-for="(item, index) in mcList"
          :key="'item' + index"
          :class="{ 'tr-bg': itemToDel.indexOf(item._id) !== -1 }"
          class="parent-tr"
        >
          <td>
            <input type="checkbox" :value="item._id" @click="singleChecked()" v-model="itemToDel" />
            <span style="visibility:hidden;">单选</span>
          </td>
          <td v-text="index + 1"></td>
          <td v-if="item.title" :title="item.title" v-text="item.title"></td>
          <td v-text="item.name"></td>
          <td v-html="item.content"></td>
          <td v-text="$options.filters.reviseTime(item.date)"></td>
          <td class="some-handle">
            <button @click="reviewBoard(index)">
              <i class="fa fa-eye fa-lg" aria-hidden="true" title="预览"></i>
            </button>
            <button @click="replyBoard(index, item.name)">
              <i class="fa fa-commenting-o" aria-hidden="true" title="回复"></i>
            </button>
            <button @click="sureDelete(item._id, -1, index, -1)">
              <i class="fa fa-trash-o fa-lg" aria-hidden="true" title="删除"></i>
            </button>
          </td>
        </tr>
        <!-- 查看回复内容 -->
        <!-- <transition name="review">
            <tr class="msg-review" v-if="current.review.indexOf(index) > -1">
              <td :colspan="$route.name === 'comments' ? 7 : 6">
                <div class="msg-review-details">
                  <span class="arrow icon-keyboard_arrow_right" title="收起" @click="exitReview(index)"></span>
                  <div class="msg-content">
                    <ul>
                      <li v-if="$route.name === 'comments'">
                        <span>文章标题：</span>
                        {{ item.title }}
                      </li>
                      <li>
                        <span>昵称：</span>
                        {{ item.name }}
                      </li>
                      <li>
                        <span v-if="$route.name === 'adminMsgBoard'">留言：</span>
                        <span v-if="$route.name === 'comments'">评论：</span>
                        <span v-html="item.content">{{ item.content }}</span>
                      </li>
                      <li>
                        <span>时间：</span>
                        {{ item.date | reviseTime }}
                      </li>
                      <li>
                        <div>
                          <span>本条回复：</span>
                          <span v-if="!item.reply.length">暂无</span>
                        </div>
                        <table class="admin-reply">
                          <tbody>
                            <tr v-for="(rep, _index) in item.reply" :key="'rep' + _index">
                              <td :class="{ 'admin-color': rep.name === 'admin（管理员）' }">
                                {{ rep.name }} @ {{ rep.aite }}：
                              </td>
                              <td class>
                                <pre v-html="rep.content">{{ rep.content }}</pre>
                              </td>
                              <td class="reply-time">{{ rep.date | reviseTime }}</td>
                              <td>
                                <span
                                  class="icon-commenting-o icon-commenting-o-mc"
                                  @click="replyBoard(index, rep.name)"
                                ></span>
                                <span
                                  class="icon-bin icon-bin-mc"
                                  @click="sureDelete(item._id, rep._id, index, _index)"
                                ></span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
        </transition>-->

        <!-- 管理员回复 -->
        <!-- <transition name="review">
            <tr v-if="current.reply === index" class="msg-reply" :key="'msg' + index">
              <td :colspan="$route.name === 'comments' ? 7 : 6">
                <textarea
                  placeholder="输入回复内容"
                  @focus="emptyWarning = false"
                  v-model="replyContent"
                  :class="{ 'empty-warning': emptyWarning }"
                ></textarea>
                <div class="reply-aite-btn">
                  <span>@ {{ aite }}</span>
                  <div>
                    <button @click="postReply(item._id)">回复</button>
                    <button @click="current.reply = -1">取消</button>
                  </div>
                </div>
              </td>
            </tr>
        </transition>-->
      </tbody>
    </table>

    <!-- 删除（multi）按钮 -->
    <div class="remove-all" v-show="itemToDel.length">
      <button @click="sureDelete(-1)">删除选中项</button>
    </div>

    <!-- 分页 -->
    <transition name="fade" mode="out-in">
      <page v-show="pageArray.length > 1"></page>
    </transition>

    <!-- 确认删除 -->
    <transition name="fade">
      <div class="validate-mask" v-show="!!sureInfo.type.length">
        <div class="validate-bin">
          <div class="exit-validate">
            <span @click="sureInfo.type = ''">X</span>
          </div>
          <div class="sure-deleteInfo">
            <h3>{{ sureInfo.warning }}</h3>
            <button @click="remove">确定</button>
            <button @click="sureInfo.type = ''">取消</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex"
import page from "@/components/base/page"

export default {
  data() {
    return {
      allChoose: false, // 全选
      itemToDel: [],
      aite: "",
      deleteInfo: { oneLevelId: -1, twoLevelId: -1, oneIndex: -1, twoIndex: -1 },
      sureInfo: { warning: "", type: "" },
      current: { review: [], reply: -1 },
      replyContent: "",
      emptyWarning: false
    }
  },
  computed: {
    ...mapGetters({
      pageArray: "axios/pageArray",
      page: "axios/page"
    })
  },
  components: {
    page
  },
  props: {
    mcList: {
      type: Array
    },
    initTable: {
      type: Object
    }
  },
  watch: {
    //换页后清除所有状态
    mcList() {
      this.allChoose = false
      this.itemToDel = []
      this.currentIndex = -1
    }
  },
  methods: {
    ...mapMutations({
      reduceArr: "axios/REDUCE_ARR",
      reduceArr_all: "axios/REDUCE_ARR_ALL",
      addLocalWord: "axios/ADD_LOCAL_WORD",
      addLocalComment: "axios/ADD_LOCAL_COMMENT"
    }),
    ...mapActions({
      addBoardReply: "axios/AddBoardReply",
      addCommentsReply: "axios/AddCommentsReply",
      removeLeavewords: "axios/RemoveLeavewords",
      removeComments: "axios/RemoveComments",
      reduceLeavewords: "axios/ReduceLeavewords",
      reduceComments: "axios/ReduceComments"
    }),
    // 单选
    singleChecked: function() {
      //加定时器是因为先触发click事件，此时articleItem
      //还没有被推入新的值，因此将此事件推入事件队列，先让articleItem插值完成
      setTimeout(() => {
        if (this.itemToDel.length === this.mcList.length) {
          this.allChoose = true
        } else {
          this.allChoose = false
        }
      }, 0)
    },
    // 全选
    allChecked: function() {
      if (this.itemToDel.length !== this.mcList.length) {
        let _arr = []
        this.mcList.forEach((item, index, arr) => {
          _arr.push(item._id)
        })
        this.itemToDel = _arr
      } else {
        this.itemToDel = []
      }
    },
    // 预览
    reviewBoard: function(index, aite) {
      this.current.review.push(index)
    },
    // 退出预览
    exitReview: function(index) {
      this.current.review.splice(this.current.review.indexOf(index), 1)
    },
    // 回复
    replyBoard: function(index, aite) {
      this.current.reply = index
      this.aite = aite
    },
    // 提交回复
    postReply: function(id) {
      let that = this
      if (!this.replyContent.length) {
        this.emptyWarning = true
        return
      }
      //留言回复
      if (this.$route.name === "adminMsgBoard") {
        this.addBoardReply({
          id: id,
          name: "admin（管理员）",
          aite: this.aite,
          imgUrl: "/img/logo.png",
          content: this.replyContent,
          date: new Date()
        }).then(data => {
          if (data._id) {
            that.addLocalWord(data)
            that.replyContent = ""
          }
        })
      }
      //评论回复
      if (this.$route.name === "comments") {
        this.addCommentsReply({
          _id: id,
          name: "admin（管理员）",
          aite: this.aite,
          imgUrl: "/img/logo.png",
          content: this.replyContent,
          like: 0,
          email: "",
          date: new Date()
        }).then(data => {
          if (data._id) {
            that.addLocalComment(data)
            that.replyContent = ""
          }
        })
      }
    },
    // 是否删除
    sureDelete: function(mainId, secondId, oneIndex, twoIndex) {
      //选中删除操作
      if (mainId === -1) {
        let w = this.$route.name === "comments" ? "条评论么？" : "条留言么？"
        this.sureInfo.type = "all"
        this.sureInfo.warning = "确定删除选中的" + this.itemToDel.length + w
      } else {
        let w = this.$route.name === "comments" ? "评论么？" : "留言么？"
        let info = this.deleteInfo
        this.sureInfo = {
          type: "single",
          warning: "确定删除此条" + w
        }
        this.deleteInfo = {
          oneLevelId: mainId,
          twoLevelId: secondId,
          oneIndex: oneIndex,
          twoIndex: twoIndex
        }
      }
    },
    // 删除
    remove: function() {
      if (this.sureInfo.type === "single") {
        this.removeSingle()
      } else {
        this.removeAll()
      }
    },
    //删除单项留言
    removeSingle: function() {
      let ol = this.deleteInfo.oneLevelId,
        tl = this.deleteInfo.twoLevelId,
        oi = this.deleteInfo.oneIndex,
        ti = this.deleteInfo.twoIndex,
        that = this
      if (this.$route.name === "adminMsgBoard") {
        //删除一级留言
        if (ol !== -1 && tl == -1) {
          this.removeLeavewords({ id: [ol] }).then(data => {
            if (data.deleteCode === 200) {
              that.reduceArr({ name: "adminMsgBoard", oneIndex: oi, twoIndex: ti })
              that.sureInfo.type = ""
            }
          })
        }
        //删除二级留言
        if (ol !== -1 && tl !== -1) {
          this.reduceLeavewords({ mainId: ol, secondId: tl }).then(data => {
            if (data.deleteCode === 200) {
              that.reduceArr({ name: "adminMsgBoard", oneIndex: oi, twoIndex: ti })
              that.sureInfo.type = ""
            }
          })
        }
      }
      //删除文章评论
      if (this.$route.name === "comments") {
        //删除一级评论
        if (ol !== -1 && tl === -1) {
          this.removeComments({ id: [ol] }).then(data => {
            if (data.deleteCode === 200) {
              that.reduceArr({ name: "comments", oneIndex: oi, twoIndex: ti })
              that.sureInfo.type = ""
            }
          })
        }
        //删除二级评论
        if (ol !== -1 && tl !== -1) {
          this.reduceComments({ mainId: ol, secondId: tl }).then(data => {
            if (data.deleteCode === 200) {
              that.reduceArr({ name: "comments", oneIndex: oi, twoIndex: ti })
              that.sureInfo.type = ""
            }
          })
        }
      }
    },
    //删除选中一级留言
    removeAll: function() {
      let that = this
      if (this.$route.name === "adminMsgBoard") {
        this.removeLeavewords({ id: this.itemToDel }).then(data => {
          if (data.deleteCode === 200) {
            that.reduceArr_all({ name: "adminMsgBoard", removeArr: that.itemToDel })
            that.sureInfo.type = ""
          }
        })
      }
      if (this.$route.name === "comments") {
        this.removeComments({ id: this.itemToDel }).then(data => {
          if (data.deleteCode === 200) {
            that.reduceArr_all({ name: "comments", removeArr: that.itemToDel })
            that.sureInfo.type = ""
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.msgboard-comments {
  margin-top: 25px;
  color: #606266;
}

.msgboard-comments-table {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;

  .table-thead tr {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  .table-tbody {
    border: solid red 1px;
  }

  .tr-bg {
    background: #fff38f !important;
  }

  .parent-tr {
    color: #606266;
    border-bottom: 1px solid #ccc;
  }
  .msg-review {
    border-bottom: 1px solid #ccc;
  }

  tbody tr:nth-child(odd) {
    background: #f5f7fa;
  }
  th {
    color: #333;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    padding: 5px;
  }
  .parent-tr td {
    padding: 5px;
  }
  .parent-tr td:not(:first-child),
  th:not(:first-child) {
    text-align: center;
  }
  .parent-tr td:not(:last-child) {
    /*border: 1px solid #aaa;*/
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  input[type="checkbox"],
  label {
    vertical-align: middle;
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
}

.msg-reply textarea {
  outline: none;
  border: 1px solid #6aa7fc;
  border-radius: 4px;
  width: 100%;
  height: 50px;
  padding: 5px;
  box-sizing: border-box;
  resize: none;
}
.empty-warning {
  border: 1px solid red !important;
}
.msg-reply td {
  padding: 8px 1px;
}
.reply-aite-btn {
  display: flex;
  justify-content: space-between;
  span {
    margin-left: 5px;
  }
  button {
    background: #5bc0de;
    color: #fff;
    padding: 3px 10px;
    margin-left: 5px;
    border: 1px solid #46b8da;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }
  button:hover {
    background: #46afcb;
  }
}
.msg-review {
  color: #444 !important;
  background: #ffffff !important;
}
.msg-content {
  margin-left: 30px;
  li {
    list-style: none;
    padding: 5px;
    span:first-child {
      color: orange;
    }
  }
}
.msg-review-details {
  position: relative;
}
.arrow {
  font-size: 26px;
  color: #444;
  display: inline-block;
  margin-bottom: -5px;
  transform: rotate(-90deg);
  position: absolute;
  top: 50%;
  left: -4px;
  margin-top: -13px;
  cursor: pointer;
}

.admin-reply {
  width: 100%;
  box-sizing: border-box;
  border-collapse: collapse;
  /*table-layout: fixed;*/
  .reply-time {
    text-align: center;
  }
  td {
    padding: 5px 0;
    background: #ffffff;
  }
  td:nth-child(1) {
    width: 20%;
  }
  td:nth-child(2) {
    width: 55%;
  }
  td:nth-child(3) {
    width: 10%;
  }
  td:nth-child(4) {
    width: 15%;
    text-align: center;
    span {
      color: #606266;
      margin: 0;
      border: none;
    }
    span.icon-commenting-o:hover {
      color: #ffffff;
    }
    span.icon-bin:hover {
      color: red;
    }
  }
}
.admin-color {
  color: orange;
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
.validate-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  .validate-bin {
    margin: 50px auto 0;
    border-radius: 5px;
    width: 30%;
    height: 200px;
    background: #ffffff;
    .exit-validate {
      border-radius: 5px 5px 0 0;
      background: #f7f7f7;
      text-align: right;
      padding: 5px 10px 5px 0;
      span {
        cursor: pointer;
      }
    }
    .sure-deleteInfo {
      text-align: center;
      color: #e6a23c;
      h3 {
        margin-top: 60px;
      }
      button {
        outline: none;
        color: #fff;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        padding: 5px 8px;
        background: #409eff;
        margin: 50px 10px;
      }
      button:hover {
        opacity: 0.8;
      }
    }
  }
}
@media screen and(min-width: 768px) {
  .icon-commenting-o-mc,
  .icon-eye-mc,
  .icon-bin-mc {
    margin-left: -5px;
  }
}
@media screen and(max-width: 767px) {
  .validate-bin {
    width: 80%;
  }
}
</style>
