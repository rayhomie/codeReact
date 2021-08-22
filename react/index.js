import Component from "./component";
const React = {
  createElement,
  Component,
};

//将执行jsx语法糖 转换成 虚拟DOM
function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children,
  };
}

export default React;
