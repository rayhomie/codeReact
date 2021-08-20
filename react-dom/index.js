const ReactDOM = {
  render,
};

//react-dom中的渲染方法（参数1：虚拟dom，参数2：真实dom容器）
function render(vnode, container) {
  if (!vnode) return;

  function visit(node, container) {
    //当节点是字符串或数字时直接插入到当前容器
    if (typeof node !== "object") {
      container.innerHTML = node.toString();
    }
    const currentContainer = document.createElement(node["tag"]);
    for (let attr in node["attrs"]) {
      currentContainer.setAttribute(attr, node["attrs"][attr]);
    }
    container.appendChild(currentContainer);
    for (let child in node["children"]) {
      visit(node?.["children"][child], currentContainer);
    }
  }
  visit(vnode, container);
}

export default ReactDOM;
