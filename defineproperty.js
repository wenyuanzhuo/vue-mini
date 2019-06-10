
let data = {
  name: 'Aaron'
}
class Dep {
  constructor(){
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  notify() {
    this.subs.forEach(function(sub) {
      sub.update()
    })
  }
}

Dep.target = null

function define(data, key, child) {
  const dep = new Dep()
  let childObj = observe(child) //递归 子属性 直到最后一层
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      //谁是订阅者 否则不知道通知谁 watcher
      Dep.target && dep.addSub(Dep.target)
    
      console.log('has fire success', child)
      return child;
    },
    set: (newVal) => {
      if(child === newVal) {
        return
      }
      console.log(`${child}改变成了${newVal}，绑定成功`)
      child = newVal
      childObj = observe(newVal) 
      //(将队列内容 通知给订阅者)
      dep.notify()
    }
  })
}

function observe(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  Object.keys(data).forEach(function (key) {
    define(data, key, data[key])
  })
}

function Watcher(vm, exp, cb) {
  this.cb = cb
  this.exp = exp // node节点 对应 v-model v-on 例 v-model="name"，exp就是"name"
  this.vm = vm // data 中的一个属性（对象）
  this.value = this.get() // 触发订阅 也就是getter 
}
Watcher.prototype = {
  get: function() {
    Dep.target = this
    const value = this.vm.data[this.exp]
    Dep.target = null
    return value
  },
  update: function() {
    this.run()
    // compile更新函数
  },
  run: function() {
    const newValue = this.vm.data[this.exp]
    const oldValue = this.value
    console.log('watch has be emitted ', newValue)
    if (newValue !== oldValue) {
      this.value = newValue
      // call cb
      this.cb.call(this.vm, newValue);
    }
  }
}
// observe(data)
// new watcher(data, 'name') // compile 的工作  （第三个参数就是compile更新函数）
// data.name = '113' // 例 input -> compile addEventListener('input) ->  this.vm[this.exp] == xx -> watcher update -> compile node update



// 赋值操作 遍历对象 深度递归 object.defineProperty set捕获赋值 get捕获引用
// get中添加订阅者 什么时候订阅（谁触发的）? ————compile
// compile第一次初始化的时候 new Watcher时候触发
// observer中的object.defineproperty getter 将全局变量 指向 订阅者watch 同时调用 dep.addsub 添加订阅者

// minding 
// compile 初始化 v-bind -> new Watcher （有些未bind的属性也会在更新队列中但不会触发） compile 更新视图的方法