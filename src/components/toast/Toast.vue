<template>
  <transition name="fade">
    <div class="m-toast" v-show="show">
      <span v-if="type === 'success'">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-success" />
        </svg>
        {{ message }}成功
      </span>
      <span v-else-if="type === 'warning'">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-warning" />
        </svg>
        {{ message }}
      </span>
      <span v-else-if="type === 'error'">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-error" />
        </svg>
        {{ message }}
      </span>
      <span v-else>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-info" />
        </svg>
        {{ message }}
      </span>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: "",
      type: ""
    }
  }
}
</script>

<style lang="scss" scoped>
.m-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2001;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 10px 20px;
  border-radius: 5px;
  color: #fff;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.8);
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s ease-out;
}

.fade-enter {
  opacity: 0;
}

.fade-leave-active {
  opacity: 0;
}
</style>
