import Template from "./index.vue"

let instance
let id = 0

// 全局配置
const globalOptions = {
  show: true,
  // cssClass: {},
  // style: {},
  // position: "middle",
  duration: 3000
}

// 移除toast
const moveToast = (toasts) => {
  let length = toasts.length
  toasts.forEach((item, idx) => {
    let value
    value = `translateY(-${(length - 1 - idx) * 100}%);`
    item.style["transform"] = value
  })
}

// toast
const Toast = (message, options = {}) => {
  if (!message) {
    console.error("[vue-toast]: message is empty, please input your message.")
    return
  }
  // options.cssClass &&
  //   (globalOptions.cssClass[options.cssClass] = true) &&
  //   (options.cssClass = {
  //     ...globalOptions.cssClass
  //   })

  options = {
    id: id++,
    content: message,
    ...globalOptions,
    ...options,
    onRemove: () => {
      let i = instance.$data.messages.findIndex((item) => {
        return item.id === options.id
      })
      i >= 0 && (options.show = false)
      i >= 0 && instance.$data.messages.splice(i, 1)
    }
  }

  moveToast(instance.$data.messages)

  instance.$data.messages.push(options)

  if (instance.$data.messages.length > 6) {
    setTimeout(() => {
      clearTimeout(instance.$data.messages[0].timer)
      instance.$data.messages[0].onRemove()
    })
  }
  // console.log(instance.$data.messages)

  options.timer = setTimeout(() => {
    options.onRemove()
  }, options.duration)
}

export default {
  install(Vue) {
    let Tpl = Vue.extend(Template)
    instance = new Tpl()
    document.body.appendChild(instance.$mount().$el)
    Vue.prototype.$Toast = Toast
  }
}
