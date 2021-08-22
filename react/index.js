//将执行jsx语法糖 转换成 虚拟DOM
function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children,
  };
}

//类组件的实现
class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }
  render() {}
}

export default { createElement, Component };
