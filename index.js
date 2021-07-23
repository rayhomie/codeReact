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
