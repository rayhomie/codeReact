import React from "../react";
import ReactDOM from "../react-dom";
import "./index.css";

//类组件
class ClassCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { num: 0 };
  }

  componentWillMount() {
    console.log("组件将挂载");
  }

  componentWillReceiveProps(props) {
    console.log("props:", props);
  }

  componentDidMount() {
    console.log("组件已经挂载");
  }

  componentWillUpdate() {
    console.log("组件将更新");
  }

  componentDidUpdate() {
    console.log("组件已经更新");
  }

  handleClick() {
    this.setState({
      num: this.state.num + 1,
    });
  }

  render() {
    return (
      <span
      className='classComponent'
        style={{ color: this.props.color }}
        onClick={this.handleClick.bind(this)}
      >
        类组件{this.state.num}
      </span>
    );
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
