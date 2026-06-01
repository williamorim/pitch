HTMLWidgets.widget({

  name: 'pitch',

  type: 'output',

  factory: function(el, width, height) {

    var chart = null;

    return {

      renderValue: function(x) {

        // Initialize ECharts instance
        if (chart) {
          chart.dispose();
        }
        chart = echarts.init(el);

        // Soccer pitch dimensions (in metres, scaled)
        var pitchLength = 105;
        var pitchWidth = 68;

        var option = {
          backgroundColor: '#4a7c3f',
          xAxis: {
            min: 0,
            max: pitchLength,
            show: false
          },
          yAxis: {
            min: 0,
            max: pitchWidth,
            show: false
          },
          series: [
            // Pitch outline
            {
              type: 'custom',
              coordinateSystem: 'cartesian2d',
              renderItem: function(params, api) {
                return {
                  type: 'group',
                  children: [
                    // Outer boundary
                    {
                      type: 'rect',
                      shape: {
                        x: api.coord([0, pitchWidth])[0],
                        y: api.coord([0, pitchWidth])[1],
                        width: api.coord([pitchLength, 0])[0] - api.coord([0, 0])[0],
                        height: api.coord([0, 0])[1] - api.coord([0, pitchWidth])[1]
                      },
                      style: {
                        fill: 'none',
                        stroke: '#ffffff',
                        lineWidth: 2
                      }
                    },
                    // Centre line
                    {
                      type: 'line',
                      shape: {
                        x1: api.coord([pitchLength / 2, 0])[0],
                        y1: api.coord([pitchLength / 2, 0])[1],
                        x2: api.coord([pitchLength / 2, pitchWidth])[0],
                        y2: api.coord([pitchLength / 2, pitchWidth])[1]
                      },
                      style: {
                        stroke: '#ffffff',
                        lineWidth: 2
                      }
                    },
                    // Centre circle (approximation via arc)
                    {
                      type: 'circle',
                      shape: {
                        cx: api.coord([pitchLength / 2, pitchWidth / 2])[0],
                        cy: api.coord([pitchLength / 2, pitchWidth / 2])[1],
                        r: Math.abs(api.coord([pitchLength / 2 + 9.15, pitchWidth / 2])[0] -
                                    api.coord([pitchLength / 2, pitchWidth / 2])[0])
                      },
                      style: {
                        fill: 'none',
                        stroke: '#ffffff',
                        lineWidth: 2
                      }
                    },
                    // Centre spot
                    {
                      type: 'circle',
                      shape: {
                        cx: api.coord([pitchLength / 2, pitchWidth / 2])[0],
                        cy: api.coord([pitchLength / 2, pitchWidth / 2])[1],
                        r: 3
                      },
                      style: {
                        fill: '#ffffff'
                      }
                    }
                  ]
                };
              },
              data: [[0, 0]]
            }
          ]
        };

        chart.setOption(option);
      },

      resize: function(width, height) {
        if (chart) {
          chart.resize();
        }
      }

    };
  }
});
