<template>
  <div class="my-ue">
    <!-- 返回|退出 -->
    <div class="back">
      <i
        class="fa fa-home fa-2x"
        aria-hidden="true"
        @click="backHome"
        title="回到管理首页"
      ></i>
      <span class="client-greet">{{ greet }}好，admin！</span>
      <span class="phone-greet">{{ greet }}好，admin！</span>
      <i
        class="fa fa-sign-out"
        aria-hidden="true"
        title="退出管理界面"
        @click="exit"
      ></i>
    </div>

    <!-- 类型|标题|标签|前言 -->
    <div class="article-details">
      <!-- 类型 -->
      <div class="article-details-type">
        <div class="item-title">类 型 ：</div>
        <input
          ref="a"
          @click="onlyTech"
          checked
          id="tech"
          type="radio"
          name="rt"
        />
        <label for="tech">技术文章</label>
        <input ref="l" id="life" @click="onlyLife" type="radio" name="rt" />
        <label for="life">生活感悟</label>
        &nbsp;|&nbsp;
        <input
          type="radio"
          name="original"
          value="true"
          v-model="articleInfo.original"
        />
        <label for>原创</label>
        <input
          type="radio"
          name="original"
          value="false"
          v-model="articleInfo.original"
        />
        <label for>转载</label>
      </div>
      <!-- 标题 -->
      <div class="article-details-item">
        <div class="item-title">标 题 ：</div>
        <div class="ueditor-input-box">
          <input
            type="text"
            class="item-input"
            placeholder="请输入文章标题"
            v-model="articleInfo.title"
          />
        </div>
      </div>
      <!-- 标签 -->
      <div class="article-details-item">
        <div class="item-title">标 签 ：</div>
        <div
          class="ueditor-input-box"
          @mousedown="flag = false"
          @click="getFocus"
        >
          <div class="hasChosed">
            <span
              v-for="(tag, index) in articleInfo.tags"
              :key="'tag' + index"
              class="first-floor-span"
            >
              {{ tag | changeLife }}
              <span class="remove" @click="removeTag(tag, index)">x</span>
            </span>
          </div>
          <div class="input-box-move">
            <input
              type="text"
              placeholder="请输入标签(最多四个)"
              v-model="createTag"
              @keyup="tagIndex($event)"
              @compositionstart="start"
              @compositionend="end"
              @focus="getFocus"
              @blur="blurChange"
              ref="ipt"
            />
            <!--  componsitionstart和componsitionend为中文输入法下，在input框中预输入的英文字符触发的
            事件，..start在预输入的第一个字符时触发一次，输入完成时（回车输入中文字符或者删除全部字符），..end事件触发，然后触发input绑定的keyup事件-->
            <!-- 增加@focus事件解决页面切换回来导致标签索引不显示-->
            <div class="tag-chart" v-show="tagFlag.recommend" ref="tagChart">
              <div class="tag-nav">
                <span
                  v-for="(item, index) in recommend.nav"
                  :key="'nav' + index"
                  :class="{ 'nav-bg': recommend.list[index].active }"
                  @click="changeNav(index)"
                  v-text="item"
                ></span>
              </div>
              <ul class="tag-content">
                <li
                  v-for="(item, index) in recommend.list"
                  :key="'il' + index"
                  v-show="item.active"
                >
                  <span
                    v-for="(tag, index) in item.data"
                    :key="'tag' + index"
                    @click="choseRecommend(tag)"
                    v-text="tag"
                  ></span>
                </li>
              </ul>
            </div>
            <!-- 筛选标签 -->
            <div class="diy-tag" ref="recommend" v-show="tagFlag.filter">
              <li
                v-for="(recom, index) in recommendTag"
                :key="'recom' + index"
                @click="choseFilter(recom)"
              >
                {{ recom }}
              </li>
              <li @click="choseFilter(createTag)">创建标签 {{ createTag }}</li>
            </div>
          </div>
        </div>
      </div>
      <!-- 前言 -->
      <div class="article-details-item">
        <div class="item-title">前 言 ：</div>
        <div class="ueditor-input-box">
          <input
            type="text"
            placeholder="请输入文章前言"
            v-model="articleInfo.abstract"
          />
        </div>
      </div>
    </div>

    <!-- 百度富文本编辑器 | 预览 -->
    <div class="editor-container">
      <!-- 百度富文本编辑器 -->
      <div class="editor-write">
        <div
          id="editor"
          type="text/plain"
          style="width:100%;height:350px;"
        ></div>
      </div>
      <!-- 预览 -->
      <!-- <div class="preview">
        <div v-html="articleInfo.content"></div>
      </div>-->
    </div>

    <!-- 对文章的一系列操作: 1.文章发表 2.存为草稿 3.已发表文章的更新 4.草稿的更新 5.草稿发表 -->
    <!-- 操作 -->
    <div class="article-handle">
      <!-- 创建文章的按钮 -->
      <div class="publish" v-if="this.$route.path === '/admin/publish'">
        <button
          :disabled="wating.disabled"
          class="true-publish"
          @click="publish($event)"
        >
          {{ wating.info.p }}
        </button>
        <button
          :disabled="wating.disabled"
          class="false-publish"
          @click="publish($event)"
        >
          {{ wating.info.sd }}
        </button>
      </div>
      <!-- 已发表的文章 按钮 -->
      <div class="publish" v-if="this.$route.path === '/admin/update'">
        <button
          v-show="showBtn"
          :disabled="wating.disabled"
          class="published-update"
          @click="update_draftPublish($event)"
        >
          {{ wating.info.su }}
        </button>
      </div>
      <!-- 草稿箱的按钮 -->
      <div class="publish" v-if="this.$route.path === '/admin/draftrevise'">
        <button
          v-show="showBtn"
          :disabled="wating.disabled"
          class="draft-update"
          @click="update_draftPublish($event)"
        >
          {{ wating.info.su }}
        </button>
        <button
          :disabled="wating.disabled"
          class="draft-publish"
          @click="update_draftPublish($event)"
        >
          {{ wating.info.p }}
        </button>
      </div>
    </div>

    <transition name="publish">
      <div class="publish-mask" v-show="dialog.show">
        <div class="mask-box">
          <h3>{{ dialog.info }}</h3>
          <button @click="dialog = { show: false, info: '' }">确认</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

// 高亮的css
// import "@/../public/UE/prism.css"
// 代码高亮的js
// import Prism from "@/../public/UE/prism.js"
import Prism from "prismjs"
// 标签
import { recommendTag } from "./recommendTag"
//
import "@/../public/UE/ueditor.config.js"
import "@/../public/UE/ueditor.all.min.js"
import "@/../public/UE/lang/zh-cn/zh-cn"
// import "@/../public/UE/ueditor.parse.min.js"
import "@/../public/UE/themes/default/css/ueditor.css"

export default {
  props: {
    config: {
      type: Object
    }
  },
  data() {
    return {
      editor: null, // ueditor
      articleInfo: {
        original: "true",
        title: "",
        tags: [],
        abstract: "",
        content: ""
      }, // 文章信息
      createTag: "", // 创建标签
      dialog: { show: false, info: "" }, // 对话框
      recommendTag: [], // 回显标签
      flag: true,
      showBtn: false, // 显示按钮
      inputFlag: true, //中文输入法下预输入触发事件的标志位
      tagFlag: { recommend: false, filter: false, delete: false },
      wating: {
        disabled: false,
        info: { p: "发表文章", sd: "存为草稿", su: "更新" }
      },
      recommend: recommendTag
    }
  },
  filters: {
    changeLife: function(value) {
      if (value === "life") {
        value = "生活"
        return value
      } else {
        return value
      }
    }
  },
  computed: {
    ...mapGetters({
      articles: "admin/articles"
    }),
    filterArray: function() {
      let filter_arr = []
      this.recommend.list.forEach((item, index, arr) => {
        item.data.forEach((_item, _index, _arr) => {
          filter_arr.push(_item)
        })
      })
      return filter_arr
    },
    // eslint-disable-next-line vue/return-in-computed-property
    greet() {
      let hour = new Date().getHours()
      if (hour >= 0 && hour < 6) {
        return "凌晨"
      }
      if (hour >= 6 && hour < 11) {
        return "上午"
      }
      if (hour >= 11 && hour < 14) {
        return "中午"
      }
      if (hour >= 14 && hour < 18) {
        return "下午"
      }
      if (hour >= 18 && hour < 24) {
        return "晚上"
      }
    }
  },
  methods: {
    ...mapActions(["saveArticle", "updateArticle"]),
    // 返回首页
    backHome: function() {
      this.$router.push({ name: "admin" })
    },
    // 退出
    exit: function() {
      localStorage.removeItem("map_blog_token_info_item_name")
      localStorage.removeItem("userName")
      localStorage.removeItem("lastLogin")
      this.$router.push({ name: "login" })
    },
    // 获取焦点
    getFocus() {
      this.flag = true
      this.$refs.ipt.focus()
      if (!this.tagFlag.filter) {
        this.tagFlag.recommend = true
      }
    },
    /*标签框input只要获得焦点，此标志位和tagFlag.recommend均为true，点击其他位置
     *时触发blur事件，tagFlag.recommend为设为false,标签推荐页隐藏。点击标签框中的
     *div时，首先触发mousedown事件（先于blur事件），标志位flag赋值false,此时标签框input
     *失焦点，blur事件触发，this.itSelf为false,没有反应。这样就避免了标签推荐
     *页由于input的得失焦点而产生的“闪烁”问题
     */
    blurChange: function() {
      if (this.flag) {
        this.tagFlag.recommend = false
        this.tagFlag.filter = false
        this.createTag = ""
      }
    },
    // 标签
    tagIndex: function(event) {
      if (this.inputFlag) {
        if (this.createTag === "") {
          if (
            this.tagFlag.delete &&
            event.keyCode === 8 &&
            this.articleInfo.tags.indexOf("life") === -1
          ) {
            this.articleInfo.tags.pop()
          }
          this.tagFlag = {
            filter: false,
            recommend: true,
            delete: true
          }
        } else {
          this.tagFlag = {
            filter: true,
            recommend: false,
            delete: false
          }
          let tag = this.createTag
          let pattern = new RegExp("^" + tag, "gi")
          this.recommendTag = this.filterArray.filter((item, index, arr) => {
            return pattern.test(item)
          })
        }
      }
    },
    // 过滤器
    choseFilter: function(tag) {
      let tags = this.articleInfo.tags
      if (tag === "life") {
        this.$refs.l.checked = true
        this.articleInfo.tags = ["life"]
      }
      if (tags.indexOf("life") === -1) {
        if (
          tags.indexOf(tag) === -1 &&
          tags.indexOf("life") === -1 &&
          tags.length < 4
        ) {
          this.articleInfo.tags.push(tag)
        }
        this.tagFlag.filter = false
        this.tagFlag.delete = true
        this.createTag = ""
        setTimeout(() => {
          this.tagFlag.recommend = false //先让getFocus触发
        }, 0)
      }
    },
    //
    choseRecommend: function(tag) {
      let tags = this.articleInfo.tags
      this.tagFlag.delete = true
      if (
        tags.indexOf(tag) === -1 &&
        tags.indexOf("life") === -1 &&
        tags.length < 4
      ) {
        this.articleInfo.tags.push(tag)
      }
    },
    //
    removeTag: function(tag, index) {
      if (tag === "life") {
        alert("请更换文章类型")
      } else {
        this.articleInfo.tags.splice(index, 1)
        this.$refs.a.checked = true
      }
    },
    //
    changeNav: function(index) {
      this.recommend.list.forEach((item, currentIndex, arr) => {
        if (currentIndex === index) {
          item.active = true
        } else {
          item.active = false
        }
      })
    },
    //
    onlyLife: function() {
      this.articleInfo.tags = ["life"]
    },
    //
    onlyTech: function() {
      this.articleInfo.tags.splice(this.articleInfo.tags.indexOf("life"), 1)
    },
    //
    start: function() {
      this.tagFlag.delete = false
      this.inputFlag = false
    },
    //
    end: function() {
      this.inputFlag = true
    },
    //发表文章或存为草稿，通过设置isPublish来区别
    publish: function(event) {
      if (this.validate()) {
        let isPublish,
          _title = this.articleInfo.title,
          _tags = this.articleInfo.tags,
          _abstract = this.articleInfo.abstract,
          _content = this.articleInfo.content,
          that = this,
          _original = this.articleInfo.original === "true" ? true : false
        if (event.target.className === "true-publish") {
          isPublish = true
          this.wating = {
            disabled: true,
            info: { p: "发表中...", sd: "存为草稿", su: "更新" }
          }
        } else {
          isPublish = false
          this.wating = {
            disabled: true,
            info: { p: "发表文章", sd: "保存中...", su: "更新" }
          }
        }
        this.saveArticle({
          articleId: 0,
          title: _title,
          abstract: _abstract,
          content: _content,
          tag: _tags,
          publish: isPublish,
          original: _original,
          pv: 0,
          date: Date.now()
        }).then((data) => {
          if (data.code === 200) {
            that.editor.setContent("") //清空编辑器
            that.wating = {
              disabled: false,
              info: { p: "发表文章", sd: "存为草稿", su: "更新" }
            }
            that.articleInfo = {
              original: "true",
              title: "",
              tags: [],
              content: "",
              abstract: ""
            }
            if (isPublish) {
              that.dialog = { show: true, info: "文章发表成功！" }
            } else {
              that.dialog = { show: true, info: "草稿保存成功！" }
            }
          }
        })
      }
    },
    //update_draftPublish三个作用  ---> 已发表文章的更新 + 草稿的更新 + 草稿文章的发表
    update_draftPublish: function(event) {
      if (this.validate()) {
        let isPublish,
          a = this.articles.only[0],
          that = this,
          _original = this.articleInfo.original === "true" ? true : false
        if (event.target.className === "draft-update") {
          isPublish = false
          this.wating = {
            disabled: true,
            info: { p: "发表文章", sd: "存为草稿", su: "更新中..." }
          }
          this.dialog.info = "更新成功！"
        }
        if (event.target.className === "published-update") {
          isPublish = true
          this.wating = {
            disabled: true,
            info: { p: "发表文章", sd: "存为草稿", su: "更新中..." }
          }
          this.dialog.info = "更新成功！"
        }
        if (event.target.className === "draft-publish") {
          isPublish = true
          this.wating = {
            disabled: true,
            info: { p: "发表中...", sd: "存为草稿", su: "更新" }
          }
          this.dialog.info = "发表成功！"
        }
        this.updateArticle({
          articleId: a.articleId,
          original: _original,
          title: this.articleInfo.title,
          abstract: this.articleInfo.abstract,
          content: this.articleInfo.content,
          tag: this.articleInfo.tags,
          publish: isPublish
        }).then((data) => {
          that.editor.setContent("") //清空编辑器
          that.articleInfo = {
            original: "true",
            title: "",
            tags: [],
            content: "",
            abstract: ""
          }
          that.wating = {
            disabled: false,
            info: { p: "发表文章", sd: "存为草稿", su: "更新" }
          }
          that.dialog.show = true
        })
      }
    },
    //
    getUEContent() {
      // 获取内容方法
      return this.editor.getContent()
    },
    //
    validate: function() {
      let _title = this.articleInfo.title,
        _tags = this.articleInfo.tags,
        _abstract = this.articleInfo.abstract,
        _content = this.articleInfo.content
      if (_title === "") {
        this.dialog = { show: true, info: "请填写文章标题" }
        return false
      }
      if (_tags.length === 0) {
        this.dialog = { show: true, info: "请填写文章标签" }
        return false
      }
      if (_abstract === "") {
        this.dialog = { show: true, info: "请填写文章前言" }
        return false
      }
      if (_content.length === 0) {
        this.dialog = { show: true, info: "内容不能为空" }
        return false
      }
      if (!this.dialog.info) {
        return true
      }
    },
    // 转化内容
    transformStr() {
      let dom = document.createElement("div")
      dom.innerHTML = this.getUEContent()
      let strArr = dom.getElementsByTagName("pre")
      for (let i = 0; i < strArr.length; i++) {
        let el = strArr[i],
          preContent = el.innerHTML,
          code = document.createElement("code"),
          cls =
            "language-" + el.className.substring(6, el.className.indexOf(";"))
        let tempCls = el.className
        el.className = tempCls + " " + "line-numbers"
        code.className = cls
        code.innerHTML = preContent
        let str = code.outerHTML
        el.innerHTML = str
      }
      this.articleInfo.content = dom.innerHTML
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    },
    // 初始化编辑器
    initUeditor() {
      console.log("初始化编辑器")
      // eslint-disable-next-line no-undef
      this.editor = UE.getEditor("editor", this.config) // 初始化UE
      console.log(this.editor)
      //editor内容变化监听事件
      this.editor.addListener("contentChange", () => {
        if (!this.showBtn) {
          this.showBtn = true
        }
        this.transformStr()
      })
      this.editor.addListener("ready", () => {
        if (this.articles.only.length) {
          this.editor.setContent(this.articles.only[0].content)
        }
      })
    },
    // 初始化编辑器内容
    initUeditorContent() {
      if (this.articles.only.length) {
        let atc = this.articles.only[0]
        // 标题 | 标签 | 前言
        if (this.$route.path !== "/admin/publish") {
          let _original = atc.original === true ? "true" : "false"
          this.articleInfo = {
            original: _original,
            title: atc.title,
            tags: atc.tag,
            abstract: atc.abstract,
            content: atc.content
          }
        }
        // 技术文章 | 生活感悟
        if (this.articleInfo.tags[0] === "life") {
          this.$refs.l.checked = true
        }
      }
    }
  },
  mounted() {
    this.initUeditor()
    this.initUeditorContent()
  },
  destroyed() {
    console.log("离开页面，销毁")
    console.log(this.editor)
    if (this.editor !== null) {
      this.editor.destroy()
    }

    this.articleInfo = {
      title: "",
      tags: [],
      abstract: "",
      content: ""
    }
    this.$store.commit("admin/ClearOnly")
  }
}
</script>

<style lang="scss">
.my-ue {
  color: #000;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .back {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ccc;
    border-bottom: 1px solid #ccc;
    .fa {
      font-size: 26px;
      cursor: pointer;
    }
  }

  .article-details {
    color: #fff;
    padding: 15px;
    .article-details-item {
      display: flex;
      align-items: center;
      text-align: start;
      // border: solid red 1px;
      padding: 5px;
      .item-title {
        width: 70px;
        font-weight: 600;
      }
      .ueditor-input-box {
        width: 100%;
        border-radius: 5px;
        background: #ffffff;
        display: flex;
        padding: 2px;
        // border: solid red 1px;
        // cursor: text;
        .remove {
          cursor: pointer;
        }
        input {
          box-sizing: border-box;
          font-size: 16px;
          flex: 1 1 auto;
          border: none;
          outline: none;
        }
      }
    }
    .article-details-type {
      @extend .article-details-item;
      // border: solid red 1px;
      input {
        margin-left: 10px;
      }
    }
  }

  .editor-container {
    flex: 1 1 auto;
    margin: 0 20px;
    overflow-y: scroll;
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    ::v-deep .editor-write {
      overflow-y: scroll;
      border: solid red 1px;
      .edui-default .edui-editor-toolbarboxouter {
        border: solid red 1px;
      }
    }

    .preview {
      width: 49%;
      padding: 5px;
      text-align: start;
      font-size: 14px;
      border-radius: 2px;
      line-height: 1.5;
      overflow-y: scroll;
      background-color: #fff;
      border: solid red 1px;

      // li {
      //   margin-left: 15px;
      // }
      // hr {
      //   margin: 15px 0;
      //   height: 0;
      //   border: 0;
      //   border-top: 1px solid #ccc;
      // }
      // img {
      //   max-width: 100%;
      // }
    }
  }

  .article-handle {
    // border: solid red 1px;
    margin: 0 20px;
    button {
      border: 1px solid #409eff;
      border-radius: 5px;
      padding: 5px 10px;
      background: #409eff;
      cursor: pointer;
      color: #ffffff;
    }
    button:hover {
      opacity: 0.9;
    }
    button[disabled] {
      cursor: wait;
    }
    .publish {
      padding: 10px 0;
      text-align: right;
    }
  }

  .publish-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .mask-box {
      background: #ffffff;
      border-radius: 5px;
      margin: 150px auto;
      width: 30%;
      text-align: center;
      overflow: hidden; /*消除对父元素的margin-top绑架*/
      h3 {
        margin-top: 50px;
        color: #e6a23c;
      }
      button {
        padding: 5px 10px;
        border: 1px solid #5bc0de;
        background: #5bc0de;
        margin: 50px 0 20px;
        color: #ffffff;
        border-radius: 5px;
        cursor: pointer;
      }
      button:hover {
        opacity: 0.9;
      }
    }
  }
}

.hasChosed {
  display: inline-block;
  .first-floor-span {
    display: inline-block;
    padding: 6px;
    margin-right: 2px;
    border-radius: 4px;
    background: #94d1f5;
    span {
      padding: 6px 0 6px 4px;
    }
  }
}
.input-box-move {
  display: inline-block;
  position: relative;
  width: 30%;
  input:disabled {
    background: #ccc;
  }
}
// .article-type {
//   input {
//     margin: 10px 5px 10px 5px;
//   }
// }
// .article-details-tag,
// .article-details-abstract {
//   margin-top: 10px;
// }
.tag-chart,
.diy-tag {
  position: absolute;
  top: 40px;
  width: 270px;
  z-index: 1000;
  color: #017e66;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 15px;
  border-radius: 5px;
  li {
    list-style: none;
  }
}
.diy-tag li {
  margin-top: 2px;
  cursor: pointer;
}
.tag-nav {
  display: flex;
  flex-wrap: wrap;
  span {
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
  }
}
.tag-content {
  li {
    display: flex;
    flex-wrap: wrap;
    span {
      cursor: pointer;
      background: #94d1f5;
      padding: 5px;
      margin: 3px;
      border-radius: 2px;
    }
  }
}
.nav-bg {
  background: #009a61;
  color: #ffffff;
}
.publish-enter-active,
.publish-leave-active {
  transition: all ease 0.5s;
}
.publish-enter,
.publish-leave-to {
  opacity: 0;
}
.phone-greet {
  display: none;
}

@media screen and(max-width: 767px) {
  .phone-greet {
    display: inline-block;
  }
  .client-greet {
    display: none;
  }
  .mask-box {
    width: 80%;
  }
  .input-box-move {
    width: 100% !important;
  }
  .hasChosed {
    display: block;
  }
  .preview {
    display: none;
  }
  .editor-write {
    width: 100% !important;
  }
  .article-details-title label,
  .article-details-tag label,
  .article-details-abstract label {
    display: none;
  }
}
</style>
