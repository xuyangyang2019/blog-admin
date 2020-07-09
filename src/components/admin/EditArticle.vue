<template>
  <div class="publish-article">
    <!-- <div id="toolbar" slot="toolbar">
      <button class="ql-bold" title="加粗">Bold</button>
      <select class="ql-header" title="段落格式">
        <option selected>正文</option>
        <option value="2">标题1</option>
        <option value="3">标题2</option>
        <option value="4">标题3</option>
      </select>
      <button class="ql-list" value="ordered" title="有序列表"></button>
      <button class="ql-list" value="bullet" title="无序列表"></button>
      <select class="ql-color" value="color" title="字体颜色"></select>
      <span class="icon-pic custom-icon" title="图片" @click="insertImgClick($event)"></span>
      <span class="icon-video custom-icon" title="视频" @click="insertImgClick($event)"></span>
    </div>-->
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    ></quill-editor>
    <!--  -->
    <!-- <button @click="publishArticle">发布</button> -->
  </div>
</template>

<script>
// import { mapActions } from "vuex"
// import { someModule } from '../yourModulePath/someQuillModule.js'
// Quill.register('modules/someModule', someModule)
import Quill from "quill"
// 调用富文本编辑器
import { quillEditor } from "vue-quill-editor"
// 富文本编辑器外部引用样式  三种样式三选一引入即可
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
// 调整图片大小
import ImageResize from "quill-image-resize-module"
Quill.register("modules/imageResize", ImageResize)

export default {
  data() {
    return {
      editor: null,
      content: "<h2>I am Example</h2>",
      editorOption: {
        // some quill options
        modules: {
          // toolbar: "#toolbar"
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
            ["blockquote", "code-block"], //引用，代码块
            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: "ordered" }, { list: "bullet" }], //列表
            [{ script: "sub" }, { script: "super" }], // 上下标
            [{ indent: "-1" }, { indent: "+1" }], // 缩进
            [{ direction: "rtl" }], // 文本方向
            [{ size: ["small", false, "large", "huge"] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            [{ font: [] }], //字体
            [{ align: [] }], //对齐方式
            ["clean"], //清除字体样式
            ["image", "video"] //上传图片、上传视频
          ],
          // 调整图片大小
          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          }
        }
      }
    }
  },
  components: {
    quillEditor
  },
  methods: {
    // 富文本编辑器 失去焦点事件
    onEditorBlur(quill) {
      console.log("editor blur!", quill)
    },
    // 富文本编辑器 获得焦点事件
    onEditorFocus(quill) {
      console.log("editor focus!", quill)
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      console.log("editor ready!", quill)
    },
    // 富文本编辑器 内容改变事件
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text)
      this.content = html
    },
    publishArticle() {
      console.log(this.content)
    }
  },
  mounted() {
    this.editor = this.$refs.myQuillEditor.quill
    // console.log("this is current quill instance object", this.editor)
  },
  beforeDestroy() {
    this.editor = null
    delete this.editor
  },
  beforeRouteEnter(to, from, next) {
    document.title = "后台管理 -账户设置"
    next()
  }
}
</script>

<style lang="scss" scoped>
.publish-article {
  color: black;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: solid red 1px;
}

// @media screen and(max-width: 767px) {
//   .input-warning-box {
//     width: 80%;
//     flex-shrink: 1;
//   }
//   .adminset-mask-box {
//     width: 80%;
//   }
// }
</style>
