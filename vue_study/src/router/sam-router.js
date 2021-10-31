/**
 * Author：Sam
 * Date: 21.7.10
 * Description: 简单的vue router实现
 */

let Vue;

// 声明插件VueRouter
class VueRouter {
  constructor(options) {
    // 1.保存路由选项
    this.$options = options;

    // current一个初始值
    // 如何使current成为一个响应式数据
    // 此方法可以给一个对象指定一个响应式属性
    // 为什么current变了，用到他的方法都会重新执行一下呢，这个依赖关系是如何产生的，用到他的地方都订阅了他的变动
    // 路由变动视图更新的核心
    // 用Vue.set不行的原因，set对参数要求其本身已经是响应式对象
    // Vue.util应该是Vue内部的方法
    Vue.util.defineReactive(
      this,
      "current",
      window.location.hash.slice(1) || "/"
    );

    // 2.监控hash变化
    window.addEventListener("hashchange", () => {
      // hash: #/about
      this.current = window.location.hash.slice(1);
    });
  }
}

// 文档有说，调用install方法时，会传入Vue构造函数
VueRouter.install = function(_Vue) {
  // 传入构造函数，是不是就能对其进行扩展呀
  Vue = _Vue;

  // 最简单的拍脑袋的做法就是，把router的实例放到Vue的原型上
  // Vue.prototype = router
  // 但问题在于install方法在执行的时候，router还未实例化
  // 所以无法在install方法执行时将router实例挂载到Vue原型上
  // 即，要将挂载到原型上的操作延迟执行，延迟到router和vue都实例化完毕之后


  // 1.注册$router,让所有组件实例都可以访问它
  // 混入：Vue.mixin({})
  // 选用Vue.mixin配合beforeCreate实现router注册的逻辑
  // install方法有要求，需要在new Vue之前调用
  // 那么这就意味着，从时机上来说，use的时候，你无法直接拿到VueRouter的实例，你甚至也拿不到自己写的路由表
  // 我们为什么要拿到VueRouter的实例，按照现在官方实现，不管在哪一个组件实例中，你都可以直接使用 this.$router.push 这些方法
  // 那么，这就要求我们必须得把VueRouter 的实例挂载到Vue的构造函数中，这样无论是哪一个组件实例都可以直接用上VueRouter实例中的方法和属性
  Vue.mixin({
    beforeCreate() {
      // 延迟执行：延迟到router实例和vue实例都创建完毕
      if (this.$options.router) {
        // 如果存在说明是根实例，在根实例还是构造函数？放一份，
        // 就可以通过原型拿到了
        Vue.prototype.$router = this.$options.router;
      }
    },
  });

  // 注册两个全局组件，使得我们可以直接在template里使用 router-link router-view
  // <router-link to="/home">home</router-link>
  // - // 注册组件，传入一个选项对象 (自动调用 Vue.extend)
  // - Vue.component('my-component', { /* ... */ }) // 常用
  // router-link功能的本质就是路由跳转，但这里实现的hash 模式的
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      // <a href="#/home">xxx</a>
      // h是render函数调用时，框架传入的createElement
      // 等同于react中createElement，返回vdom
      // return <a href={'#'+this.to}>{this.$slots.default}</a>
      return h(
        "a",
        {
          attrs: {
            href: "#" + this.to,
          },
        },
        this.$slots.default//存放不具名插槽的数据
      );
    },
  });
  // router-view功能的本质就是渲染路由对应的组件
  Vue.component("router-view", {
    render(h) {
      let component = null;
      // 1.获取当前url的hash部分
      // 2.根据hash部分从路由表中获取对应的组件
      // 下一行的this是啥，是router-view组件的实例
      const route = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current
      );
      if (route) {
        component = route.component;
      }
      return h(component);
    },
  })
};

export default VueRouter;
