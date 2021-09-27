var React  = window.React;

var NewComponent = function NewComponent(props) {
  console.log(props.insight.data.data[0][0]);
  return /*#__PURE__*/React.createElement("div", {
    className: "test"
  }, /*#__PURE__*/React.createElement("h1", null, props.insight.data.data[0][0].value));
};

export { NewComponent as default };
//# sourceMappingURL=render.modern.js.map
