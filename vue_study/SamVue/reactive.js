/**
 * Author：Sam
 * Date: 21.7.11
 * Description: 对数据响应式探索的一点demo
 */

// 1.实现响应式
// vue2：Object.defineProperty(obj, key, desc)
// vue3: new Proxy()

// 说了那么多的响应式，到底是什么是响应式，我的理解是对于一个操作需要有相应的反应
// 具体表现为，我在js逻辑中设置跟页面有关的操作，页面自动就有了变化，而不用我来手动更新到页面中

// 设置obj的key，拦截它，初始值val
// 只对对象中的单个值进行处理
// 用defineProperty就是为了知道进行数据设置操作，以给我们时机进行拦截
// 比如obj.name = 'sam'，我们都知道这是为obj对象设置了一个值为sam的name属性
// 但是要拦截这个设置，确是需要defineProperty的加持才能做到
function defineReactive(obj, key, val) {
  // 如果val本身还是对象，则需要递归处理
  observe(val)

  Object.defineProperty(obj, key, {
    get() {
      console.log("get", key);
      return val;
    },
    set(v) {
      // 相同就不重复设置
      if (v !== val) {
        // 如果传入v是一个对象，则仍然需要做响应式处理
        observe(v)
        // obj.baz.b = {
        //  age: 2
        // }

        val = v;
        console.log("set", key);
        // update()
      }
    },
  });
}


// 但是又不想写这么多的defineReactive，就通过遍历实现对所有key的响应式
function observe(obj) {
  // 判断obj的值，必须是object
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
}

// 解决用户在设置data之后添加新key但无法响应式的问题，但又不应该直接暴露底层api给用户
function set(obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = {
  foo: "foo",
  bar: "bar",
  baz: {
    a: 1
  },
  arr: [1,2,3]
};

// 对obj做响应式处理
// defineReactive(obj, 'foo', 'foooo')
// defineReactive(obj, 'bar', 'foooo')

observe(obj);

// obj.foo; // get foo
// obj.foo = "fooooooo";
// obj.bar;
// obj.bar = "barrrr";
// obj.baz
// obj.baz.a
// obj.baz = {
//   a: 10
// }
// obj.baz.a

// obj.dong = 'dong'
// obj.dong

set(obj, 'dong', 'dong')
obj.dong

// 数组：覆盖数组中7个变更方法，push、pop、shift、unshift、splice、sort、reverse
// obj.arr.push()

