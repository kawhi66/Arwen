function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      // todo 如果 params 是空数组，接收到的会是 undefined
      // 把broadcast方法放到child上执行 all和apply的作用就是切换函数的对象上下文,借用别人的函数，或者借用别人的上下文环境。
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      // 调用一个对象的一个方法，以另一个对象替换当前对象。
      // 如果没有提供 thisObj 参数，那么 Global 对象被用作 thisObj。  
      broadcast.call(this, componentName, eventName, params);
    }
  }
};