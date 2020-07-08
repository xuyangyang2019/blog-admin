<template>
  <div class="publish-article">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    ></quill-editor>
    <!--  -->
    <button @click="publishArticle">发布</button>
  </div>
</template>

<script>
// import { mapActions } from "vuex"
import Quill from "quill"
//  import { someModule } from '../yourModulePath/someQuillModule.js'
// Quill.register('modules/someModule', someModule)

// 调用富文本编辑器
import { quillEditor } from "vue-quill-editor"
// 富文本编辑器外部引用样式  三种样式三选一引入即可
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"

export default {
  data() {
    return {
      content: "<h2>I am Example</h2>",
      editorOption: {
        // some quill options
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  components: {
    quillEditor
  },
  methods: {
    onEditorBlur(quill) {
      console.log("editor blur!", quill)
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill)
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill)
    },
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text)
      this.content = html
    },
    publishArticle() {
      console.log(this.content)
    }
  },
  mounted() {
    // this.editor = this.$refs.myQuillEditor.quill
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

@media screen and(max-width: 767px) {
  .input-warning-box {
    width: 80%;
    flex-shrink: 1;
  }
  .adminset-mask-box {
    width: 80%;
  }
}
</style>
