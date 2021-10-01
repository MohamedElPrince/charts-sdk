var React  = window.React;

var Tile = function Tile(_ref) {
  var coinId = _ref.dim,
      aggPosition = _ref.measure1,
      price = _ref.measure2,
      iconURL = _ref.iconURL;

  // TODO: Make the overall tile narrower and or responsive
  var renderCoinData = function renderCoinData() {
    // TODO: Need to allow for different currencies and locales
    var iso_4217_code = 'USD';
    return Response ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "coinName"
    }, coinId), /*#__PURE__*/React.createElement("div", {
      className: "percentChange"
    }, price, "%"), /*#__PURE__*/React.createElement("img", {
      className: "icon",
      src: iconURL
    }), /*#__PURE__*/React.createElement("div", {
      className: "price"
    }, price, /*#__PURE__*/React.createElement("span", {
      className: "currency"
    }, iso_4217_code)), /*#__PURE__*/React.createElement("div", {
      className: "priceChange"
    }, aggPosition), /*#__PURE__*/React.createElement("div", {
      className: "value"
    }, "Mkt Value:", ' ', price)) : '';
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "boundingBox"
  }, renderCoinData());
};

//// @ts-nocheck

var SimpleKPI = function SimpleKPI(_ref) {
  var _context$insight$sett;

  var _ref$insight = _ref.insight,
      data = _ref$insight.data,
      context = _ref$insight.context;
  console.log((_context$insight$sett = context.insight.settings) == null ? void 0 : _context$insight$sett.iconURL);
  var formattedMeasures = data.data.map(function (col, index) {
    var _context$insight$sett2;

    var dim = col[0],
        measure1 = col[1],
        measure2 = col[2];
    return {
      row: dim.value,
      value: String(measure1.formatted),
      value2: String(measure2.formatted),
      iconURL: (_context$insight$sett2 = context.insight.settings) == null ? void 0 : _context$insight$sett2.iconURL
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "SimpleKPI__wrapper"
  }, formattedMeasures.map(function (response) {
    return /*#__PURE__*/React.createElement(Tile, {
      dim: response.row,
      measure1: response.value,
      measure2: response.value2,
      iconURL: response.iconURL
    });
  }));
};
//   return (
//     <>
//       {SimpleKPI.map(SimpleKPI => (
//         <Card row = {dim.value},
//         value = {measure1.formatted},
//         value2 = {measure2.formatted} />
//       ))}
//     </>
//   )
// }

export { SimpleKPI as default };
//# sourceMappingURL=render.modern.js.map
