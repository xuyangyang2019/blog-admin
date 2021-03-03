<template>
  <div class="article-review">
    <!-- 文章标题 -->
    <div class="review-title">
      <h2>{{ article.title }}</h2>
    </div>
    <!-- 标签 -->
    <div class="review-tags">
      <h4 class="review-article-h4">标签：</h4>
      <span v-for="(t, index1) in article.tag" :key="'tab' + index1" class="review-article-span" v-text="t"></span>
    </div>
    <!-- 前言 -->
    <div class="review-abstract">
      <h4 class="review-article-h4">前言：</h4>
      <span class="review-article-span" v-text="article.abstract"></span>
    </div>
    <!-- 发表时间 -->
    <div class="review-date">
      <h4 class="review-article-h4">发表时间：</h4>
      <span class="review-article-span" v-text="$options.filters.reviseTime(article.date)"></span>
    </div>
    <!-- 文章内容 -->
    <div class="review-content" v-html="article.content"></div>
  </div>
</template>

<script>
import Prism from 'prismjs'
import { mapState } from 'vuex'
import { getArticle } from '../../api/admin'

export default {
  data() {
    return {
      article: {}
    }
  },
  // 离开之前清空预览
  beforeRouteLeave(to, from, next) {
    this.$store.commit('admin/ClearOnly')
    next()
  },
  computed: {
    ...mapState('admin', {
      // article: 'article'
    })
  },
  watch: {
    $route() {
      if (this.$route.name === 'review') {
        this.getOnlyArticle()
      }
    }
  },
  // 页面创建之前获取文章
  created() {
    this.getOnlyArticle()
    document.title = '后台管理 -文章预览'
  },
  methods: {
    // 精准获取文章
    getOnlyArticle() {
      getArticle(this.$route.params.articleId).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.article = res.data
          //   const _tag = data[0].tag[0]
          //   let forLocation = []
          //   if (data[0].publish) {
          //     forLocation = [
          //       { pathName: 'allArticles', showName: '已发表文章' },
          //       { pathName: 'eachTag', showName: _tag, params: { tag: _tag } },
          //       {
          //         pathName: 'review',
          //         showName: data[0].title,
          //         params: { eTag: _tag, articleId: data[0].articleId }
          //       }
          //     ]
          //   } else {
          //     forLocation = [
          //       { pathName: 'draft', showName: '草稿' },
          //       {
          //         pathName: 'review',
          //         showName: data[0].title,
          //         params: { eTag: _tag, articleId: data[0].articleId }
          //       }
          //     ]
          //   }
          //   commit('SET_FOR_LOCATION', forLocation)
        }
        this.$nextTick(() => {
          // 代码高亮
          Prism.highlightAll()
        })
      })
    }
  }
}
</script>

<style lang="scss">
.article-review {
  width: 80%;
  height: 100%;
  color: #404040;
  margin: 0 auto;
  padding: 0 20px;
  border-radius: 2px;
  // border: solid 1px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  // overflow: auto;
  // @include scroll;

  .review-title {
    text-align: center;
  }

  .review-tags,
  .review-abstract,
  .review-date {
    text-align: start;
    .review-article-h4 {
      display: inline-block;
    }
    .review-article-span {
      display: inline-block;
      padding: 5px;
    }
  }

  .review-content {
    text-align: start;
    word-wrap: break-word;
    overflow: auto;
    @include scroll;

    // li {
    //   margin-left: 15px;
    //   border: solid red 1px;
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

@media screen and(max-width: 767px) {
  .article-review {
    margin-top: 10px;
    padding: 10px;
    width: 100%;
    pre {
      box-sizing: border-box;
    }
  }
}
</style>
