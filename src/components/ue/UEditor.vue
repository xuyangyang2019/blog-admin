<template>
  <div class="my-ue">
    <!-- 类型|标题|标签|前言 -->
    <div class="article-details">
      <!-- 类型 -->
      <div class="article-details-type">
        <div class="item-title">类 型 ：</div>
        <div class="item-content">
          <input id="originalId" v-model="articleInfo.original" type="radio" name="original" value="true" />
          <label class="itme-label" for="originalId">原创</label>
          <input id="reprintId" v-model="articleInfo.original" type="radio" name="original" value="false" />
          <label class="itme-label" for="reprintId">转载</label>
        </div>
      </div>
      <!-- 标题 -->
      <div class="article-details-item">
        <div class="item-title">标 题 ：</div>
        <div class="item-content">
          <input v-model="articleInfo.title" type="text" class="item-input" placeholder="请输入文章标题" />
        </div>
      </div>
      <!-- 标签 -->
      <div class="article-details-tags">
        <div class="item-title">标 签 ：</div>
        <div class="item-content" @mousedown="canHide = false" @click="getFocus">
          <!-- 已经选择的标签 -->
          <div class="has-chosed">
            <span v-for="(tag, index) in articleInfo.tags" :key="'tag' + index" class="first-floor-span">
              {{ tag }}
              <span class="remove" @click="removeTag(tag, index)">x</span>
            </span>
          </div>

          <!-- 推荐标签 -->
          <div class="input-box-move">
            <input
              ref="ipt"
              v-model="createTag"
              type="text"
              class="item-input"
              placeholder="请输入标签(最多四个)"
              @keyup="tagIndex($event)"
              @compositionstart="start"
              @compositionend="end"
              @focus="getFocus"
              @blur="blurChange"
            />
            <!--  componsitionstart和componsitionend为中文输入法下，在input框中预输入的英文字符触发的事件，
            ..start在预输入的第一个字符时触发一次，输入完成时（回车输入中文字符或者删除全部字符），
            ..end事件触发，然后触发input绑定的keyup事件-->
            <!-- 增加@focus事件解决页面切换回来导致标签索引不显示-->

            <div v-show="tagFlag.recommend" ref="tagChart" class="tag-chart">
              <!-- 推荐的标签的nav -->
              <div class="tag-nav">
                <span
                  v-for="(tag, index) in recommendTags"
                  :key="index"
                  :class="{ 'nav-bg': currentTagNav === index }"
                  @click="currentTagNav = index"
                  v-text="tag.name"
                ></span>
              </div>
              <!-- 推荐的标签的nav的数据 -->
              <div class="tag-content">
                <span
                  v-for="(tag, index) in recommendTags[currentTagNav].data"
                  :key="'tag' + index"
                  @click="choseRecommend(tag)"
                  v-text="tag"
                ></span>
              </div>
            </div>
            <!-- 筛选|创建 标签 -->
            <div v-show="tagFlag.filter" ref="recommend" class="diy-tag">
              <li v-for="(recom, index) in screenTags" :key="'recom' + index" @click="choseOrCreateTag(recom)">
                {{ recom }}
              </li>
              <li @click="choseOrCreateTag(createTag)">创建标签 {{ createTag }}</li>
            </div>
          </div>
        </div>
      </div>
      <!-- 前言 -->
      <div class="article-details-item">
        <div class="item-title">前 言 ：</div>
        <div class="item-content">
          <input v-model="articleInfo.abstract" type="text" class="item-input" placeholder="请输入文章前言" />
        </div>
      </div>
    </div>

    <!-- 百度富文本编辑器 | 预览 -->
    <div class="editor-container">
      <!-- 百度富文本编辑器 -->
      <div class="editor-write">
        <div id="editor" type="text/plain" style="width: 100%; height: 100%"></div>
      </div>
      <!-- 预览 -->
      <!-- <div class="preview">
        <div v-html="articleInfo.content"></div>
      </div> -->
    </div>

    <!-- 对文章的一系列操作: 1.文章发表 2.存为草稿 3.已发表文章的更新 4.草稿的更新 5.草稿发表 -->
    <div class="article-handle">
      <!-- {{ article }} -->
      <el-button type="primary" size="small" @click="publishArticle">发布文章</el-button>
      <el-button v-if="!article.publish" type="plain" size="small" @click="draftArticle">保存草稿</el-button>
      <el-button v-else type="plain" size="small" @click="draftArticle">存为草稿</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Prism from 'prismjs'
// ue相关的文件
import '@/../public/UE/ueditor.config.js'
import '@/../public/UE/ueditor.all.min.js'
import '@/../public/UE/lang/zh-cn/zh-cn'
// 下面注释的文件会报错
import '@/../public/UE/themes/default/css/ueditor.css'

import { addArticle, getArticle, updateArticle } from '../../api/admin'

export default {
  props: {
    config: {
      type: Object
    }
  },
  data() {
    return {
      editor: null, // ueditor
      // 文章信息
      articleInfo: {
        original: 'true', // 原创
        title: '', // 标题
        tags: [], // 标签
        abstract: '', // 前言
        content: '', // 内容
        publish: true // 默认发表
      },
      currentTagNav: 'languages', // 当前的标签nav
      // 标签库
      recommendTags: {
        languages: {
          name: '开发语言',
          data: [
            'html',
            'css',
            'javascript',
            'nodejs',
            'less',
            'sass',
            'php',
            'pythen',
            'typescript',
            'ruby',
            'objective-c',
            'asp.net',
            'perl',
            'java',
            'c',
            'c++'
          ]
        },
        plants: {
          name: '平台框架',
          data: [
            'vue',
            'angular',
            'react',
            'express',
            'jQuery',
            'axios',
            'Dojo',
            'prototype',
            'Yui-ext',
            'laravel',
            'spring',
            'koa',
            'ruby-on-rails',
            'struts'
          ]
        },
        servers: {
          name: '服务器',
          data: ['nginx', 'apache', 'tomcat', 'linux', 'windows', 'ubuntu', 'centos', 'unix', 'docker']
        },
        dbs: {
          name: '数据库和缓存',
          data: ['mysql', 'mongodb', 'nosql', 'oracle', 'redis', 'sql']
        },
        tools: {
          name: '开发工具',
          data: ['git', 'github', 'chrome', 'sublime-text', 'eclipse', 'ide', 'xcode', 'vue-tools', 'visual-studio']
        },
        browsers: {
          name: '浏览器',
          data: ['chrome', 'firefox', 'ie', 'opera', 'safari', 'android', 'ios', 'windows', 'linux']
        }
      },
      canHide: true, // 能隐藏标签页面
      createTag: '', // 创建标签
      screenTags: [], // 标签搜索结果
      inputFlag: true, // 中文输入法下预输入触发事件的标志位
      tagFlag: {
        recommend: false, // 显示推荐标签
        filter: false // 显示过滤的标签
        // delete: false // 删除标签
      },
      // showBtn: false, // 显示按钮
      // dialog: { show: false, info: '' }, // 对话框
      wating: {
        disabled: false,
        info: { p: '发表文章', sd: '存为草稿', su: '更新' }
      }
    }
  },
  computed: {
    ...mapState('admin', {
      article: 'article'
    }),
    // 所有标签集合
    filterArray() {
      let filter_arr = []
      for (const key in this.recommendTags) {
        if (this.recommendTags.hasOwnProperty(key)) {
          const tags = this.recommendTags[key].data
          filter_arr = filter_arr.concat(tags)
        }
      }
      return filter_arr
    }
  },
  mounted() {
    this.initUeditor()
    this.initUeditorContent()
    // 这句话的意思是点击其他区域关闭（也可以根据自己需求写触发事件）
    // document.addEventListener("click", (e) => {
    //   if (!this.$el.contains(e.target)) {
    //     this.show = false
    //   }
    // })
  },
  destroyed() {
    // 离开页面，销毁
    if (this.editor !== null) {
      this.editor.destroy()
    }
    // 数据还原
    this.resetArticleForm()
    // 清除当前的文章
    this.$store.commit('admin/SET_ARTICLE', {})
  },
  methods: {
    // 标签框获取焦点
    getFocus() {
      this.canHide = true
      // 获取输入框的焦点
      this.$refs.ipt.focus()
      // 显示推荐标签页面
      if (!this.tagFlag.filter) {
        this.tagFlag.recommend = true
      }
    },
    /* 标签框input只要获得焦点，此标志位和tagFlag.recommend均为true，点击其他位置
     *时触发blur事件，tagFlag.recommend为设为false,标签推荐页隐藏。点击标签框中的
     *div时，首先触发mousedown事件（先于blur事件），标志位flag赋值false,此时标签框input
     *失焦点，blur事件触发，this.itSelf为false,没有反应。这样就避免了标签推荐
     *页由于input的得失焦点而产生的“闪烁”问题
     */
    blurChange() {
      if (this.canHide) {
        this.tagFlag.recommend = false
        this.tagFlag.filter = false
        this.createTag = ''
      }
    },
    // 选择标签
    choseRecommend(tag) {
      const tags = this.articleInfo.tags
      // this.tagFlag.delete = true
      if (tags.indexOf(tag) === -1 && tags.length < 4) {
        this.articleInfo.tags.push(tag)
      } else if (tags.length === 4) {
        this.$toast({
          message: '最多只能设置4个标签！',
          type: 'warning',
          duration: 2000
        })
      }
    },
    // 移除标签
    removeTag(tag, index) {
      // 如果文章类型是生活
      this.articleInfo.tags.splice(index, 1)
      // 选中科技文章 这里已经去掉了
      // this.$refs.a.checked = true
    },
    // 中文环境输入开始
    start() {
      // this.tagFlag.delete = false
      this.inputFlag = false
    },
    // 中文环境输入结束
    end() {
      this.inputFlag = true
    },
    // 自动匹配标签
    tagIndex() {
      // 如果输入结束
      if (this.inputFlag) {
        this.createTag = this.createTag.trim()
        // 如果没有创建标签
        if (this.createTag === '') {
          // if (
          //   this.tagFlag.delete &&
          //   event.keyCode === 8 &&
          //   this.articleInfo.tags.indexOf("life") === -1
          // ) {
          //   this.articleInfo.tags.pop()
          // }
          this.tagFlag = {
            filter: false,
            recommend: true
            // delete: true
          }
        } else {
          this.tagFlag = {
            filter: true,
            recommend: false
            // delete: false
          }
          const tag = this.createTag
          const pattern = new RegExp('^' + tag, 'gi')
          this.screenTags = this.filterArray.filter((item) => {
            return pattern.test(item)
          })
        }
      }
    },
    // 选择或创建标签
    choseOrCreateTag(tag) {
      const tags = this.articleInfo.tags
      if (tags.indexOf(tag) === -1 && tags.length < 4) {
        this.articleInfo.tags.push(tag)
      } else if (tags.length === 4) {
        this.$toast({
          message: '最多只能设置4个标签！',
          type: 'warning',
          duration: 2000
        })
      }
      this.tagFlag.filter = false
      this.createTag = ''
      setTimeout(() => {
        this.tagFlag.recommend = false // 先让getFocus触发
      }, 0)
    },
    // 表单验证验证
    validate() {
      if (this.articleInfo.title === '') {
        this.$alert('请填写文章标题', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return false
      }
      if (this.articleInfo.tags.length === 0) {
        this.$alert('请填写文章标签', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return false
      }
      if (this.articleInfo.abstract === '') {
        this.$alert('请填写文章前言', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return false
      }
      if (this.articleInfo.content.length === 0) {
        this.$alert('内容不能为空', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 发表文章或存为草稿，通过设置isPublish来区别
    publishArticle() {
      // 如果验证通过
      if (this.validate()) {
        this.articleInfo.publish = true
        // 发表之前二次确认
        this.$confirm('即将发布文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (this.article._id) {
              this.updateAlreadyArticle()
            } else {
              this.addNewArticle()
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发布'
            })
          })
      }
    },
    // 新文章存为草稿或已有的文章改为草稿
    draftArticle() {
      this.articleInfo.publish = false
      if (this.article._id) {
        this.updateAlreadyArticle()
      } else {
        this.addNewArticle()
      }
    },
    // 保存文章
    addNewArticle() {
      console.log('保存文章')
      // 保存文章
      const { title, abstract, content, tags, publish, original } = this.articleInfo
      addArticle(title, abstract, content, tags, publish, original === 'true').then((res) => {
        if (res.code === 200) {
          // 清空编辑器
          this.editor.setContent('')
          // 提示
          this.$message({
            type: 'success',
            message: publish ? '文章发表成功!' : '保存草稿成功!'
          })
          // 重置表单
          this.resetArticleForm()
        }
      })
    },
    // 更新已有文章
    updateAlreadyArticle() {
      console.log('更新已有文章', this.articleInfo)
      // 保存文章
      const { title, abstract, content, tags, publish, original } = this.articleInfo
      updateArticle(this.article._id, title, abstract, content, tags, publish, original === 'true').then((res) => {
        console.log(res)
        if (res.code === 200) {
          // 清空编辑器
          this.editor.setContent('')
          console.log(this.articleInfo)
          // 提示
          let msgStr = '更新文章成功!'
          if ((publish && this.article.publish) || (!publish && !this.article.publish)) {
            msgStr = '更新文章成功!'
          } else if (publish && !this.article.publish) {
            msgStr = '文章设为草稿成功!'
          } else if (!publish && this.article.publish) {
            msgStr = '文章发表成功!'
          }
          this.$message({
            type: 'success',
            message: msgStr
          })
          // 重置表单
          this.resetArticleForm()
        }
      })
    },
    // 获取ue内容
    getUEContent() {
      return this.editor.getContent()
    },
    // 转化内容
    transformStr() {
      const dom = document.createElement('div')
      dom.innerHTML = this.getUEContent()
      const strArr = dom.getElementsByTagName('pre')
      for (let i = 0; i < strArr.length; i++) {
        const el = strArr[i]
        const preContent = el.innerHTML
        const code = document.createElement('code')
        const cls = 'language-' + el.className.substring(6, el.className.indexOf(';'))
        const tempCls = el.className
        el.className = tempCls + ' ' + 'line-numbers'
        code.className = cls
        code.innerHTML = preContent
        const str = code.outerHTML
        el.innerHTML = str
      }
      // 文章内容
      this.articleInfo.content = dom.innerHTML
      // 重新渲染
      this.$nextTick(() => {
        Prism.highlightAll()
      })
    },
    // 重置表单
    resetArticleForm() {
      this.articleInfo = {
        original: 'true',
        title: '',
        tags: [],
        content: '',
        abstract: '',
        publish: true
      }
    },
    // 初始化编辑器
    initUeditor() {
      // eslint-disable-next-line no-undef
      this.editor = UE.getEditor('editor', this.config) // 初始化UE
      // editor内容变化监听事件
      this.editor.addListener('contentChange', () => {
        console.log('ue contentChange')
        // if (!this.showBtn) {
        //   this.showBtn = true
        // }
        this.transformStr()
      })
      // ue加载完成
      this.editor.addListener('ready', () => {
        console.log('ue ready')
        if (JSON.stringify(this.article) !== '{}') {
          this.editor.setContent(this.articleInfo.content)
        }
      })
    },
    // 初始化编辑器内容
    initUeditorContent() {
      console.log('initUeditorContent初始化编辑器内容')
      // 如果有文章
      if (this.$route.path !== '/publish') {
        // 如果有数据
        if (JSON.stringify(this.article) !== '{}') {
          // 标题 | 标签 | 前言
          if (this.$route.path !== '/publish') {
            this.articleInfo = {
              original: this.article.original === 'true' ? 'true' : 'false',
              title: this.article.title,
              tags: this.article.tag,
              abstract: this.article.abstract,
              content: this.article.content,
              publish: this.article.publish
            }
          }
          // // 技术文章 | 生活感悟
          // if (this.articleInfo.tags[0] === "life") {
          //   this.$refs.typeOfLife.checked = true
          // }
        } else {
          console.log('获取数据')
          getArticle(this.$route.params.articleId).then((res) => {
            if (res.code === 200) {
              console.log(res)
              const atc = res.data
              this.articleInfo = {
                original: atc.original === 'true' ? 'true' : 'false',
                title: atc.title,
                tags: atc.tag,
                abstract: atc.abstract,
                content: atc.content,
                publish: atc.publish
              }
              // this.editor.setContent(atc.content)
            }
          })
        }
      }
    }
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

  .article-details {
    color: #fff;
    padding: 15px;
    .article-details-item {
      display: flex;
      align-items: center;
      text-align: start;
      padding: 5px;
      .item-title {
        width: 70px;
        font-weight: 600;
      }
      .item-content {
        width: 100%;
        border-radius: 5px;
        background: #ffffff;
        display: flex;
        align-items: center;
        padding: 2px;
        height: 28px;
        .item-input {
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
      .item-content {
        // color: black;
        font-size: 16px;
        background-color: inherit;
        #original {
          margin-right: 5px;
        }
        #reprint {
          margin: 0 5px 0 20px;
        }
        .itme-label {
          cursor: pointer;
          @include can-not-select;
        }
      }
    }

    .article-details-tags {
      @extend .article-details-item;
      .item-content {
        cursor: text;
      }

      .has-chosed {
        display: inline-block;
        .first-floor-span {
          display: inline-block;
          padding: 6px;
          margin-right: 2px;
          border-radius: 4px;
          background: #94d1f5;
          .remove {
            padding: 6px 0 6px 4px;
            cursor: pointer;
          }
        }
      }

      .input-box-move {
        display: inline-block;
        position: relative;
        input:disabled {
          background: #ccc;
        }
        .tag-chart,
        .diy-tag {
          position: absolute;
          top: 28px;
          width: 500px;
          z-index: 1000;
          color: #017e66;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          padding: 15px;
          border-radius: 5px;
          li {
            list-style: none;
          }

          .tag-nav {
            display: flex;
            flex-wrap: wrap;
            span {
              cursor: pointer;
              padding: 5px;
              border-radius: 5px;
            }
            .nav-bg {
              background: #009a61;
              color: #ffffff;
            }
          }
          .tag-content {
            // li {
            display: flex;
            flex-wrap: wrap;
            span {
              cursor: pointer;
              background: #94d1f5;
              padding: 5px;
              margin: 3px;
              border-radius: 2px;
            }
            // }
          }
        }
        .diy-tag li {
          margin-top: 2px;
          cursor: pointer;
        }
      }
    }
  }

  .editor-container {
    flex: 1 1 auto;
    margin: 0 20px;
    .editor-write {
      height: 100%;
      height: 100%;
      #editor {
        height: 100%;
        .edui-editor {
          height: 100%;
          display: flex;
          flex-direction: column;
          border: solid red 1px;
          // .edui-editor-toolbarboxouter {
          //   border: solid blue 1px;
          // }
          .edui-editor-iframeholder {
            flex: auto 1 1;
            border: solid blue 1px;
          }
        }
      }
    }

    // .preview {
    //   width: 49%;
    //   padding: 5px;
    //   text-align: start;
    //   font-size: 14px;
    //   border-radius: 2px;
    //   line-height: 1.5;
    //   overflow-y: scroll;
    //   background-color: #fff;
    //   border: solid red 1px;
    // }
  }

  .article-handle {
    margin: 0 20px;
    min-height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

@media screen and(max-width: 767px) {
  .input-box-move {
    width: 100% !important;
  }
  .has-chosed {
    display: block;
  }
  .article-details-title label,
  .article-details-tag label,
  .article-details-abstract label {
    display: none;
  }
}
</style>
