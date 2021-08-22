//react-dom中的渲染方法（参数1：虚拟dom，参数2：真实dom容器）
function render(vnode, container) {
  container.appendChild(_render(vnode));
}

//抽离render方法
export function _render(vnode) {
  //为空直接退出
  if (vnode === null || vnode === undefined || typeof vnode === "boolean")
    vnode = "";
  //当节点是字符串或数字时直接插入到当前容器
  if (typeof vnode !== "object") {
    //通过插入文本节点来解决  {"      12   "}这种情况的渲染bug
    const text = document.createElement("text");
    text.innerHTML = vnode.toString();
    return text;
  }

  //如果tag是函数，则渲染组件
  if (typeof vnode["tag"] === "function") {
    //通过执行 函数组件 或 类组件的render方法 创建组件的dom
    return createComponentDom(vnode["tag"], vnode["attrs"]);
  }
  //否则直接创建真实dom
  return createRealDom(vnode);
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
    dom[key] = value || "";
    return;
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

//创建真实dom
function createRealDom(vnode) {
  const dom = document.createElement(vnode["tag"]);
  for (let attr in vnode["attrs"]) {
    //给真实dom设置所有属性值
    setAttribute(dom, attr, vnode["attrs"][attr]);
  }
  //遍历子元素进行渲染
  if (vnode["children"]) {
    vnode["children"].forEach((child) => {
      render(child, dom);
    });
  }
  //挂载到dom上一个容器上
  return dom;
}

//通过执行 函数组件 或 类组件的render方法 创建组件的dom
function createComponentDom(component, props) {
  let vnode, dom;
  if (component.prototype && component.prototype.render) {
    //如果是类定义的组件
    const ComInstace = new component(props);
    if (ComInstace.componentWillMount) {
      //将被挂载
      ComInstace.componentWillMount();
    }
    if (ComInstace.componentWillUpdate) {
      //将被更新
      ComInstace.componentWillUpdate();
    }
    //渲染虚拟dom
    vnode = ComInstace.render();
    //在实例上记录上一次渲染的节点和其容器
    if (vnode && ComInstace.componentDidMount) {
      //已经被挂载
      ComInstace.componentDidMount();
    }
    if (vnode && ComInstace.componentDidUpdate) {
      //已经被更新
      ComInstace.componentDidUpdate();
    }
    dom = createRealDom(vnode); //直接通过vnode创建真实dom
    ComInstace.lastDom = dom; //在组件实例上记录上一次的真实dom
  } else {
    //如果是函数定义的组件
    vnode = component(props);
    dom = createRealDom(vnode); //直接通过vnode创建真实dom
  }
  return dom;
}

export default { render };
