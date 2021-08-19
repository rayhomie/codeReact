const ReactDOM = {
  render,
};

//react-dom中的渲染方法（参数1：虚拟dom，参数2：真实dom容器）
function render(vnode, container) {
  if (!vnode) return;
  //如果传入的虚拟dom就是字符串直接挂载
  if (typeof vnode === "string") {
    const textNode = document.createTextNode(vnode);
    return container.appendChild(textNode);
  }
  function visit(vnode) {
    return Object.keys(vnode).reduce(
      (pre, key) => {
        if (key === "children") {
        }
        if (key === "attrs") {
        }
        if (key === "tag") {
          document.childElement(vnode[key]);
        }
        return pre;
      },
      Array.isArray(vnode) ? [] : {}
    );
  }
  console.log(vnode);

  // const dom = document.childElement(tag);
}

export default ReactDOM;
