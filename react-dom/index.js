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
