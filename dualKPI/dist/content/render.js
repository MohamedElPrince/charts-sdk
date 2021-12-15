var React  = window.React;

var Tile = function Tile(_ref) {
  var coinId = _ref.dim,
      price = _ref.measure1,
      priceChange = _ref.measure2;

  // TODO: Make the overall tile narrower and or responsive
  var renderCoinData = function renderCoinData() {
    return Response ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "coinName"
    }, coinId), /*#__PURE__*/React.createElement("div", {
      className: "price"
    }, price), /*#__PURE__*/React.createElement("div", {
      className: "separator"
    }), !priceChange.startsWith('-') ? /*#__PURE__*/React.createElement("div", {
      className: "arrowUp"
    }, " \u25B2 ") : /*#__PURE__*/React.createElement("div", {
      className: "arrowDown"
    }, " \u25BC "), !priceChange.startsWith('-') ? /*#__PURE__*/React.createElement("div", {
      className: "priceChangeUp"
    }, !priceChange.startsWith('-') ? priceChange : priceChange.substr(1)) : /*#__PURE__*/React.createElement("div", {
      className: "priceChangeDown"
    }, !priceChange.startsWith('-') ? priceChange : priceChange.substr(1))) : '';
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "boundingBox"
  }, renderCoinData());
};

// @ts-nocheck

var SimpleKPI = function SimpleKPI(_ref) {
  var data = _ref.response,
      context = _ref.context;
  var formattedMeasures = data.data.map(function (col, index) {
    var _context$component$se;

    var dim = col[0],
        measure1 = col[1],
        measure2 = col[2];
    return {
      row: dim.value,
      value: String(measure1.formatted),
      value2: String(measure2.formatted),
      iconURL: (_context$component$se = context.component.settings) == null ? void 0 : _context$component$se.iconURL
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

export { SimpleKPI as default };
//# sourceMappingURL=render.modern.js.map
