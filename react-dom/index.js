const ReactDOM = {
  render,
};

//react-dom中的渲染方法（参数1：虚拟dom，参数2：真实dom容器）
function render(vnode, container) {
  console.log(vnode);
  //为空直接退出
  if (!vnode) return;
  //当节点是字符串或数字时直接插入到当前容器
  if (typeof vnode !== "object") {
    const text = document.createElement("text");
    text.innerHTML = vnode.toString();
    container.appendChild(text);
    return;
  }
  //否则创建真实dom
  const dom = document.createElement(vnode["tag"]);
  for (let attr in vnode["attrs"]) {
    //设置所以属性值
    setAttribute(dom, attr, vnode["attrs"][attr]);
  }
  //挂载到dom上一个容器上
  container.appendChild(dom);
  vnode["children"].forEach((child) => {
    render(child, dom);
  });
}

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

export default ReactDOM;
