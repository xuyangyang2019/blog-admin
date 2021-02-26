<template>
  <div id="app">
    <Layout>
      <router-view name="layOut" />
    </Layout>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view />
  </div>
</template>

<script>
import Layout from '@/layouts'
export default {
  name: 'App',
  components: {
    Layout
  }
}
</script>

<style lang="scss">
// 自定义的reset
@import './styles/reset.css';
// 排版样式
// @import './styles/typo.css';
// 适应不同浏览器
// @import './styles/normalize.css';

// 公共的css
@import './styles/common.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;

  height: 100%;
  overflow: hidden;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
