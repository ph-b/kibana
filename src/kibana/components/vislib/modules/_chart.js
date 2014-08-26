define(function (require) {
  return function ChartBaseClass(d3, Private) {
    var _ = require('lodash');
    var $ = require('jquery');

    function Chart(vis, el, chartData) {
      this.vis = vis;
      this.chartEl = el;
      this.chartData = chartData;
      this._attr = _.defaults(vis.config || {}, {
        destroyFlag: false
      });
    }

    Chart.prototype.render = function () {
      return d3.select(this.chartEl).call(this.draw());
    };

    Chart.prototype.off = function (event) {
      return this._attr.dispatch.on(event, null);
    };

    Chart.prototype.validateHeightAndWidth = function ($el, width, height) {
      if (width <= 0 || height <= 0) {
        throw new Error($el.attr('class') + ' height is ' + height + ' and width is ' + width);
      }
      return;
    };

    Chart.prototype.removeAll = function (elem) {
      return d3.select(elem).selectAll('*').remove();
    };

    Chart.prototype.error = function (elem) {
      // Removes the legend container
      this.removeAll(elem);

      return d3.select(elem)
        .append('div')
        .attr('class', 'error-wrapper')
        .append('div')
        .attr('class', 'chart-error')
        .style('line-height', function () {
          return $(elem).height() + 'px';
        })
        .text('The container is too small for this chart.');
    };


    Chart.prototype.destroy = function () {
      this._attr.destroyFlag = true;

      // Removing chart and all elements associated with it
      d3.select(this.chartEl).selectAll('*').remove();

      // Cleaning up event listeners
      this.off('click');
      this.off('hover');
      this.off('brush');
      d3.select(window)
        .on('resize', null);
    };

    Chart.prototype.set = function (name, val) {
      this._attr[name] = val;
      this.render();
    };

    Chart.prototype.get = function (name) {
      return this._attr[name];
    };

    return Chart;
  };
});