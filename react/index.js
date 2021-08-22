import { _render } from "../react-dom";
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
    this.lastDom;
  }
  setState(stateChange) {
    //拷贝对象
    Object.assign(this.state, stateChange);
    //节点替换
    const newDom = _render(this.render()); //通过新的组件状态重新渲染真实dom
    this.lastDom.parentNode.replaceChild(newDom, this.lastDom); //新旧dom的替换
    this.lastDom = newDom; //记录下当前最新的dom
  }
  render() {}
}

export default { createElement, Component };
