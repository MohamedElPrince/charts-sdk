import React, { useEffect, useRef } from 'react';
import { ComponentProps } from '@incorta-org/component-sdk';
import './styles.less';
import * as d3 from 'd3';

const LiquidFill = (props: ComponentProps) => {
  const insightData = props.insight.data.data;
  const [aggregationData] = insightData;

  const formattedMeasures = props.insight.context.insight.bindings.measure.map((col, index) => {
    const data = aggregationData[index];
    return {
      id: col.id,
      min: col.settings.min ?? 0,
      max: col.settings.max ?? 10 ** Math.ceil(Math.log10(data.value)),
      isPercent: col.settings.isPercent,
      value: +data.value
    };
  });


  return (
    <div className="LiquidFill__wrapper">
      {formattedMeasures.map(measure => {
        return (
          <LiquidFillComponent
            key={measure.id}
            currentValue={measure.value}
            minValue={measure.min}
            maxValue={measure.max}
            isPercent={measure.isPercent}
          />
        );
      })}
    </div>
  );
};

export default LiquidFill;

//copied code from http://jsfiddle.net/f975pnta/

function LiquidFillComponent({
  currentValue = 50,
  minValue = 0,
  maxValue = 100,
  isPercent = true
}) {
  const ref = useRef();

  const chartMinValue = isPercent ? 0 : minValue;
  const chartMaxValue = isPercent ? 100 : maxValue;
  const chartValue = isPercent
    ? ((currentValue - minValue) / (maxValue - minValue)) * 100
    : currentValue;

  useEffect(() => {
    ref.current.innerHTML = '';

    function uuid() {
      var buf = new Uint32Array(4);
      window.crypto.getRandomValues(buf);
      var idx = -1;
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        idx++;
        var r = (buf[idx >> 3] >> ((idx % 8) * 4)) & 15;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

  function liquidFillDefaultSettings() {
    return {
      minValue: chartMinValue, // The gauge minimum value.
      maxValue: chartMaxValue, // The gauge maximum value.
      circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
      circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
      circleColor: '#178BCA', // The color of the outer circle.
      waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
      waveCount: 1, // The number of full waves per width of the wave circle.
      waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
      waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
      waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
      waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
      waveAnimate: true, // Controls if the wave scrolls or is static.
      waveColor: '#178BCA', // The color of the fill wave.
      waveOpacity: 1,
      waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
      textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
      textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
      valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
      displayPercent: true, // If true, a % symbol is displayed after the value.
      textColor: '#045681', // The color of the value text when the wave does not overlap it.
      waveTextColor: '#A4DBf8' // The color of the value text when the wave overlaps it.
    };
  }

  var $this = ref.current;

  var chartpaddingleft = 0;
  var circlebordercolor = '#ee6b25';
  var circleborderthickness = 7;
  var circlecolor = 'transparent';
  var circlethickness = 0.12;
  var displaypercent = isPercent;
  var displaytext = true;
  var numbercurrent = chartValue;
  var numbermax = 100;
  var radius = 70;
  var textcolor = 'black';
  var texthorzposition = 0;
  var textvertposition = 0.5;
  var waveanimatetime = 1000;
  var wavecolor = '#ee6b25';
  var waveheightscaling = true;
  var waveopacity = 0.3;
  var wavetextcolor = 'red';
  var height = 150;
  var width = 150;

  const numberCurrent = numbercurrent;
  const numberMax = numbermax;

  var options = {
    displayPercent: displaypercent,
    displayText: displaytext,
    circleColor: circlecolor,
    textColor: textcolor,
    waveTextColor: wavetextcolor,
    waveColor: wavecolor,
    waveOpacity: waveopacity,
    circleThickness: circlethickness,
    textVertPosition: textvertposition,
    textHorzPosition: texthorzposition,
    waveAnimateTime: waveanimatetime,
    chartPaddingLeft: chartpaddingleft,
    waveHeightScaling: waveheightscaling,
    circleBorderThickness: circleborderthickness,
    circleBorderColor: circlebordercolor
  };

  var defaults = liquidFillDefaultSettings();
  var config = Object.assign(defaults, options);

    var svg = d3
      .select($this)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('class', 'liquidchart')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  var liquid = svg.append('g').attr('class', 'liquid');

  var base = liquid.append('g').attr('class', 'base');

  var circle = base
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', radius)
    .attr('fill', config.circleColor)
    .style('stroke', config.circleBorderColor)
    .attr('stroke-width', config.circleBorderThickness);

  var value = (numberCurrent / numberMax) * 100;

  var textValue = numberCurrent;

  if (config.displayPercent) {
    textValue = (numberCurrent / numberMax) * 100;
  }

  const elementId = uuid();

  var gauge = liquid.append('g').attr('class', 'gauge');

  var locationX = -radius;
  var locationY = -radius;

  var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

  var waveHeightScale;
  if (config.waveHeightScaling) {
    waveHeightScale = d3.scaleLinear().range([0, config.waveHeight, 0]).domain([0, 50, 100]);
  } else {
    waveHeightScale = d3
      .scaleLinear()
      .range([config.waveHeight, config.waveHeight])
      .domain([0, 100]);
  }

  var textPixels = (config.textSize * radius) / 2;
  var textFinalValue = parseFloat(textValue).toFixed(2);
  var textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
  var percentText = config.displayPercent ? '%' : '';
  var circleThickness = config.circleThickness * radius;
  var circleFillGap = config.circleFillGap * radius;
  var fillCircleMargin = circleThickness + circleFillGap;
  var fillCircleRadius = radius - fillCircleMargin;
  var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

  var waveLength = (fillCircleRadius * 2) / config.waveCount;
  var waveClipCount = 1 + config.waveCount;
  var waveClipWidth = waveLength * waveClipCount;

  // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
  var textRounder = function (value) {
    return Math.round(value);
  };

  if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
    textRounder = function (value) {
      return parseFloat(value).toFixed(1);
    };
  }

  if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
    textRounder = function (value) {
      return parseFloat(value).toFixed(2);
    };
  }

  // Data for building the clip wave area.
  var data = [];
  for (var i = 0; i <= 40 * waveClipCount; i++) {
    data.push({ x: i / (40 * waveClipCount), y: i / 40 });
  }

  // Scales for drawing the outer circle.
  var gaugeCircleX = d3
    .scaleLinear()
    .range([0, 2 * Math.PI])
    .domain([0, 1]);
  var gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

  // Scales for controlling the size of the clipping path.
  var waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  var waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);

  // Scales for controlling the position of the clipping path.
  var waveRiseScale = d3
    .scaleLinear()
    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.
    .range([fillCircleMargin + fillCircleRadius * 2 + waveHeight, fillCircleMargin - waveHeight])
    .domain([0, 1]);

  var waveAnimateScale = d3
    .scaleLinear()
    .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
    .domain([0, 1]);

  // Scale for controlling the position of the text within the gauge.
  var textRiseScaleY = d3
    .scaleLinear()
    .range([fillCircleMargin + fillCircleRadius * 2, fillCircleMargin + textPixels * 0.7])
    .domain([0, 1]);

  // Center the gauge within the parent SVG.
  var gaugeGroup = gauge
    .append('g')
    .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

  // Draw the outer circle.
  var gaugeCircleArc = d3
    .arc()
    .startAngle(gaugeCircleX(0))
    .endAngle(gaugeCircleX(1))
    .outerRadius(gaugeCircleY(radius))
    .innerRadius(gaugeCircleY(radius - circleThickness));

  gaugeGroup
    .append('path')
    .attr('d', gaugeCircleArc)
    .style('fill', config.circleColor)
    .attr('transform', 'translate(' + radius + ',' + radius + ')');

  var textLeftPlacement = parseInt(radius + config.textHorzPosition, 10);

  if (config.displayText) {
    // Text where the wave does not overlap.
    var text1 = gaugeGroup
      .append('text')
      .text(textRounder(textStartValue) + percentText)
      .attr('class', 'liquidFillText')
      .attr('text-anchor', 'middle')
      .attr('font-size', textPixels + 'px')
      .style('fill', config.textColor)
      .attr(
        'transform',
        'translate(' + textLeftPlacement + ',' + textRiseScaleY(config.textVertPosition) + ')'
      );
  }

  // The clipping wave area.
  var clipArea = d3
    .area()
    .x(function (d) {
      return waveScaleX(d.x);
    })
    .y0(function (d) {
      return waveScaleY(
        Math.sin(
          Math.PI * 2 * config.waveOffset * -1 +
            Math.PI * 2 * (1 - config.waveCount) +
            d.y * 2 * Math.PI
        )
      );
    })
    .y1(function (d) {
      return fillCircleRadius * 2 + waveHeight;
    });

  var waveGroup = gaugeGroup
    .append('defs')
    .append('clipPath')
    .attr('id', 'clipWave' + elementId);

  var wave = waveGroup.append('path').datum(data).attr('d', clipArea).attr('T', 0);

  // The inner circle with the clipping wave attached.
  var fillCircleGroup = gaugeGroup
  .append('g')
  .attr('clip-path', 'url(#clipWave' + elementId + ')');

  fillCircleGroup
    .append('circle')
    .attr('cx', radius)
    .attr('cy', radius)
    .attr('r', fillCircleRadius)
    .style('fill', config.waveColor)
    .style('opacity', config.waveOpacity);

  if (config.displayText) {
    // Text where the wave does overlap.
    var text2 = fillCircleGroup
      .append('text')
      .text(textRounder(textStartValue) + percentText)
      .attr('class', 'liquidFillText')
      .attr('text-anchor', 'middle')
      .attr('font-size', textPixels + 'px')
      .style('fill', config.waveTextColor)
      .attr(
        'transform',
        'translate(' + textLeftPlacement + ',' + textRiseScaleY(config.textVertPosition) + ')'
      );
  }

  let textInterpolatorValue = textStartValue;

  // Make the value count up.
  if (config.valueCountUp) {
    var textTween = function () {
      const i = d3.interpolateNumber(textInterpolatorValue, textFinalValue);
      return function (t) {
        textInterpolatorValue = textRounder(i(t));
        // Set the gauge's text with the new value and append the % sign
        // to the end
        text1.text(textInterpolatorValue + percentText);
        text2.text(textInterpolatorValue + percentText);
      };
    };

    if (config.displayText) {
      text1.transition().duration(config.waveRiseTime).tween('text', textTween);

      text2.transition().duration(config.waveRiseTime).tween('text', textTween);
    }
  }

  // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
  var waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
  if (config.waveRise) {
    waveGroup
      .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')')
      .transition()
      .duration(config.waveRiseTime)
      .attr(
        'transform',
        'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')'
      );
    // .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
  } else {
    waveGroup.attr(
      'transform',
      'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')'
    );
  }

  if (config.waveAnimate) {
    animateWave();
  }

  function animateWave() {
    wave.attr('transform', 'translate(' + waveAnimateScale(wave.attr('T')) + ',0)');
    wave
      .transition()
      .duration(config.waveAnimateTime * (1 - wave.attr('T')))
      .ease(d3.easeLinear)
      .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
      .attr('T', 1)
      .on('end', function () {
        wave.attr('T', 0);
        animateWave(config.waveAnimateTime);
      });
  }
}, [chartValue, chartMaxValue, chartMinValue, isPercent]);

return (
   <div className="LiquidFillComponent">
     <div ref={ref} />
     <div className="LiquidFillComponent__info">
       
     </div>
   </div>
   );
  }
