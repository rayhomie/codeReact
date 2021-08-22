# codeReact

react 简易版实现
## [基本认识](https://zhuanlan.zhihu.com/p/266892192)

react 负责描述特性，提供 React API。

react-dom 负责实现特性。react-dom、react-native 称为渲染器，负责在不同的宿主载体上实现特性，达到与描述相对应的真实效果。比如在浏览器上，渲染出 DOM 树、响应点击事件等。

### 在 react-dom 的源码中，我们经常见到 react-reconciler，他们两者的关系是？

- react-reconciler 负责协调：生成 Fiber 树（React 中的虚拟 DOM）、协调和调度、产生操作指令。（可以用于实现自定义渲染器）
- react-dom 负责渲染：调用 DOM API，将操作指令实施到 DOM 树上，可以将 react-dom 类比为 react-reconciler 和 DOM 之间的翻译器。

### ReactDOM.render 的输入 —— ReactElement 是什么？

下面是一段常见的 React 代码。在项目的入口，人为显式地调用`ReactDOM.render`，`ReactDOM.render` 接受 “根组件实例”和“挂载节点”，然后进行内部逻辑转换，最终将 DOM 树渲染到“挂载节点”上。

```jsx
import React from "react";
import ReactDOM from "./ReactDOM";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

我们一般会用 JSX 来描述组件结构，JSX 本质上是一种语法扩展，通过 Babel 编译最终生成下面的语句：（也就是**虚拟 dom**）

```js
React.createElement(type, [props], [...children]);
```

`React.createElement`接受`type`、`props`、`children`，然后进行一些操作：

- 处理`props`，从`props`中提取出`key`和`ref`
- 处理`children`，将`children`以单体或者数组的形式附加到`props`上
- 返回一个符合 **ReactElement** 数据结构的对象

如果用 TypeScript 简单描述 **ReactElement** 数据结构，它长这样

```ts
interface ReactElement {
  $$typeof: Symbol | number; // 标识该对象是React元素，REACT_ELEMENT_TYPE = symbolFor('react.element') || 0xeac7，用Symbol获得一个全局唯一值
  type: string | ReactComponent | ReactFragment;
  key: string | null;
  ref: null | string | object;
  props: {
    [propsName: string]: any;
    children?: ReactElement | Array<ReactElement>;
  };
  _owner: {
    current: null | Fiber;
  };
}
```

## JSX 转 React.createElement

使用打包工具时需要使用 babel 支持：（下面是.babelrc 文件）

```js
{
  "presets": ["env"],
  "plugins": [
    [
      "transform-react-jsx",
      {
        "prama": "React.createElement"
      }
    ]
  ]
}
```

但我们在需要被打包的 js 文件中使用 jsx 语法糖就都会被 babel 转换成 React.creactElement 的函数调用语法：

```jsx
<div className="active" title="123">
  hello,<span>react</span>
</div>;
//=======转换语法========
React.createElement(
  "div",
  {
    className: "active",
    title: "123",
  },
  "hello,",
  /*#__PURE__*/ React.createElement("span", null, "react")
);
```

所以我们需要在 jsx 文件模块头部导入 React（`import React from 'react'`）

```jsx
class React {
  static createElement(tag, attrs, ...children) {
    return {
      tag,
      attrs,
      children,
    };
  }
}

const ele = (
  <div className="active" title="123">
    hello,<span>react</span>
  </div>
);
console.log(ele);
/*
{
  tag: "div",
  attrs: { className: "active", title: "123" },
  children: ["hello,", { tag: "span", attrs: null, children: ["react"] }],
};
*/
```

## 手写 react 渲染器

index.tsx

```jsx
import React from "../react";
import ReactDOM from "../react-dom";
import "./index.css";

//类组件
class ClassCom extends React.Component {
  render() {
    return <span style={{ color: this.props.color }}>类组件</span>;
  }
}
//函数组件
function FuncCom({ fontSize }) {
  return <div style={{ fontSize }}>函数组件</div>;
}

//1.执行jsx语法糖生成虚拟dom
const ele = (
  <div className="active" title="123">
    hello,<span>react</span>
    {"      12   "}
    {true}
    {undefined}
    {null}
    <a style disabled={false} href="http://www.baidu.com">
      百度
    </a>
    <div
      style="color:red"
      onClick={() => {
        console.log("被点击了");
      }}
    >
      i'm fine
    </div>
    <input
      onFocus={function () {
        console.log("聚焦");
      }}
      onBlur={function () {
        console.log("失焦");
      }}
      style={{ width: 300, marginTop: "100px" }}
    />
    <ClassCom color="blue"></ClassCom>
    <FuncCom fontSize={20} />
  </div>
);

//2.将虚拟dom挂载到真实容器上
ReactDOM.render(ele, document.getElementById("app"));
```

react.js

```js
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
```

react-dom.js

```js
//react-dom中的渲染方法（参数1：虚拟dom，参数2：真实dom容器）
function render(vnode, container) {
  container.appendChild(_render(vnode));
}

//抽离render方法
function _render(vnode) {
  //为空直接退出
  if (!vnode || typeof vnode === "boolean") vnode = "";
  //当节点是字符串或数字时直接插入到当前容器
  if (typeof vnode !== "object") {
    //通过插入文本节点来解决  {"      12   "}这种情况的渲染bug
    const text = document.createElement("text");
    text.innerHTML = vnode.toString();
    return text;
  }

  //如果tag是函数，则渲染组件
  if (typeof vnode["tag"] === "function") {
    //通过执行 函数组件 或 类组件的render方法 创建组件的vnode
    vnode = createComponentVnode(vnode["tag"], vnode["attrs"]);
  }

  //（如果当前节点是不是react组件）否则创建真实dom
  const dom = document.createElement(vnode["tag"]);
  for (let attr in vnode["attrs"]) {
    //给真实dom设置所有属性值
    setAttribute(dom, attr, vnode["attrs"][attr]);
  }
  //遍历子元素进行渲染
  vnode["children"].forEach((child) => {
    render(child, dom);
  });
  //挂载到dom上一个容器上
  return dom;
}

//给真实dom设置属性
function setAttribute(dom, key, value) {
  //className转换成class
  if (key === "className") {
    key = "class";
  }
  //如果是事件onClick等
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    //处理元素事件函数
    value = `(${value})()`;
  }
  //style是个对象则插入行内样式
  if (key === "style" && value && typeof value === "object") {
    Object.keys(value).forEach((item) => {
      dom.style[item] =
        //如果是css属性值为数字，则加单位px
        typeof value[item] === "number" ? value[item] + "px" : value[item];
    });
    return;
  }
  //设置其他的属性（style已经别单独处理return掉）
  dom.setAttribute(key, value);
}

//通过执行 函数组件 或 类组件的render方法 创建组件的vnode
function createComponentVnode(component, props) {
  if (component.prototype && component.prototype.render) {
    //如果是类定义的组件
    console.log("类组件");
    const ComInstace = new component(props);
    return ComInstace.render();
  } else {
    //如果是函数定义的组件
    console.log("函数组件");
    return component(props);
  }
}

export default { render };
```

学习途径：https://www.bilibili.com/video/BV1cE411B7by ，这个老师的代码分析有些是错 ❌ 的，我对它进行了优化和改写
