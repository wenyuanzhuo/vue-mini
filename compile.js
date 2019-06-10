function Compile(el, vm) {
  this.vm = vm
  this.el = document.querySelector(el)
  this.fragment = null
  this.init()
}
Compile.prototype = {
  init: function() {
    if (!this.el) {
      console.log('Dom元素不存在');
      return
    }
    this.fragment = this.nodeToFragment(this.el)
    this.compileElement(this.fragment)
    this.el.appendChild(this.fragment)
  },
  nodeToFragment: function(el) {
    const fragment = document.createDocumentFragment()
    let child = el.firstChild
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  },
  compileElement: function(el) {
    const childNodes = Array.prototype.slice.call(el.childNodes)
    console.log('==childNodes====', childNodes)
    const self = this
    childNodes.forEach(function(node) {
      const reg = /\{\{(.*)\}\}/;  // () 用来标记一个子表达式的开始和结束位置
      const text = node.textContent;
      if (self.isElementNode(node)) {  
        self.compile(node);
        // 如果是文本节点
      } else if(self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, reg.exec(text)[1]);
      }
      // 递归
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node);
      }
    })
  },
  compile: function(node) {
    var nodeAttrs = node.attributes;
    var self = this;
    Array.prototype.forEach.call(nodeAttrs, function(attr) {
        // console.log(attr); 例如这里输出 v-on:click="clickme"
        // console.log(attr.name); 例如这里输出 v-on:click
        var attrName = attr.name;
        if (self.isDirective(attrName)) {
            var exp = attr.value;
            var dir = attrName.substring(2);
            if (self.isEventDirective(dir)) {  // 事件指令
                self.compileEvent(node, self.vm, exp, dir);
            } else {  // v-model 指令
                self.compileModel(node, self.vm, exp, dir);
            }
            node.removeAttribute(attrName);
        }
    });
  },
  compileText: function(node, exp) {
    const self = this
    // 初始化挂载
    let initText = this.vm[exp]
    this.updateText(node, initText)
    // 添加订阅者 且绑定监听函数
    new Watcher(this.vm, exp, function(value) {
      self.updateText(node, value)
    }) 
  },
  compileEvent: function (node, vm, exp, dir) {
    var eventType = dir.split(':')[1];
    var cb = vm.methods && vm.methods[exp];

    if (eventType && cb) {
        node.addEventListener(eventType, cb.bind(vm), false);
    }
  },
  compileModel: function (node, vm, exp) {
    var self = this;
    var val = this.vm[exp];
    this.modelUpdater(node, val);  // 完成挂载，{{ }}中的值被渲染为data中的值
    new Watcher(this.vm, exp, function (value) {
      self.modelUpdater(node, value);
    });

    node.addEventListener('input', function(e) {
      var newValue = e.target.value;
      if (val === newValue) {
          return;
      }
      self.vm[exp] = newValue;
      val = newValue;
    });
  },
  updateText: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : node.textContent.replace( /\{\{(.*)\}\}/, value);
  },
  modelUpdater: function(node, value) {
      node.value = typeof value == 'undefined' ? '' : value;
  },
  isDirective: function(attr) {
      return attr.indexOf('v-') == 0;
  },
  isEventDirective: function(dir) {
      return dir.indexOf('on:') === 0;
  },
  isElementNode: function (node) {
      return node.nodeType == 1;
  },
  isTextNode: function(node) {
      return node.nodeType == 3;
  }
}