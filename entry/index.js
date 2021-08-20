import React from "../react";
import ReactDOM from "../react-dom";
import "./index.css";

//1.执行jsx语法糖生成虚拟dom
const ele = (
  <div className="active" title="123">
    hello,<span>react</span>
    {"      12   "}
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
  </div>
);

//2.将虚拟dom挂载到真实容器上
ReactDOM.render(ele, document.getElementById("app"));
