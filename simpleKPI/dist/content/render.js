var React  = window.React;

//// @ts-nocheck

var SimpleKPI = function SimpleKPI(_ref) {
  var _ref$insight = _ref.insight,
      data = _ref$insight.data;
  console.log(data.data);
  var formattedMeasures = data.data.map(function (col, index) {
    console.log(col);
    var dim = col[0],
        hamada = col[1];
    return {
      row: dim.value,
      value: +hamada.value
    };
  });
  console.log("formatted measure", formattedMeasures);
  return /*#__PURE__*/React.createElement("div", {
    className: "SimpleKPI__wrapper"
  }, formattedMeasures.map(function (response) {
    return /*#__PURE__*/React.createElement("div", null, " ", /*#__PURE__*/React.createElement("strong", null, response.row, ":"), " ", response.value);
  }));
};

export { SimpleKPI as default };
//# sourceMappingURL=render.modern.js.map
