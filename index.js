import React from "./react";
import ReactDOM from "./react-dom";

//1.执行jsx语法糖生成虚拟dom
const ele = (
  <div className="active" title="123">
    hello,<span>react</span>
    <div style="background-color:red">我牛逼啊</div>
  </div>
);

//2.将虚拟dom挂载到真实容器上
ReactDOM.render(ele, document.getElementById("app"));
