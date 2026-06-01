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

        // Pitch dimensions, supplied from R via pitch_dimensions
        var dim = x.pitch_dimensions || {};

        var pitchLength = dim.length;
        var pitchWidth = dim.width;

        // Green margin (in pixels) drawn outside the pitch boundary
        var pitchMargin = (x.pitch_margin != null) ? x.pitch_margin : 5;

        // Colors
        var pitchColor = x.pitch_color || '#4a7c3f';
        var linesColor = x.lines_color || '#ffffff';

        // Penalty area dimensions
        var penaltyAreaDepth = dim.penalty_area_depth;
        var penaltyAreaWidth = dim.penalty_area_width;
        var penaltyAreaTop = pitchWidth / 2 + penaltyAreaWidth / 2;
        var penaltyAreaBottom = pitchWidth / 2 - penaltyAreaWidth / 2;

        // Goal area (small box) dimensions
        var goalAreaDepth = dim.goal_area_depth;
        var goalAreaWidth = dim.goal_area_width;
        var goalAreaTop = pitchWidth / 2 + goalAreaWidth / 2;
        var goalAreaBottom = pitchWidth / 2 - goalAreaWidth / 2;

        // Penalty spot, penalty arc and centre circle
        var penaltySpotDist = dim.penalty_spot_dist;
        var penaltyArcRadius = dim.penalty_arc_radius;
        var centreCircleRadius = dim.centre_circle_radius;
        // Angle (radians) at which the arc meets the penalty area edge
        var arcAngle = Math.acos((penaltyAreaDepth - penaltySpotDist) / penaltyArcRadius);

        // Corner arcs and goal mouths
        var cornerArcRadius = dim.corner_arc_radius;
        var goalWidth = dim.goal_width;
        var goalDepth = dim.goal_depth;
        var goalTop = pitchWidth / 2 + goalWidth / 2;
        var goalBottom = pitchWidth / 2 - goalWidth / 2;

        var option = {
          backgroundColor: 'transparent',
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
                // Pixel length of a horizontal segment of `metres` metres
                function pxLen(metres) {
                  return Math.abs(api.coord([metres, 0])[0] - api.coord([0, 0])[0]);
                }
                return {
                  type: 'group',
                  children: [
                    // Green margin: extends pitchMargin px beyond the pitch so the outer white lines sit on green
                    {
                      type: 'rect',
                      shape: {
                        x: api.coord([0, pitchWidth])[0] - pitchMargin,
                        y: api.coord([0, pitchWidth])[1] - pitchMargin,
                        width: api.coord([pitchLength, 0])[0] - api.coord([0, 0])[0] + 2 * pitchMargin,
                        height: api.coord([0, 0])[1] - api.coord([0, pitchWidth])[1] + 2 * pitchMargin
                      },
                      style: {
                        fill: pitchColor
                      }
                    },
                    // Outer boundary (filled green so only the pitch is coloured)
                    {
                      type: 'rect',
                      shape: {
                        x: api.coord([0, pitchWidth])[0],
                        y: api.coord([0, pitchWidth])[1],
                        width: api.coord([pitchLength, 0])[0] - api.coord([0, 0])[0],
                        height: api.coord([0, 0])[1] - api.coord([0, pitchWidth])[1]
                      },
                      style: {
                        fill: pitchColor,
                        stroke: linesColor,
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
                        stroke: linesColor,
                        lineWidth: 2
                      }
                    },
                    // Centre circle (approximation via arc)
                    {
                      type: 'circle',
                      shape: {
                        cx: api.coord([pitchLength / 2, pitchWidth / 2])[0],
                        cy: api.coord([pitchLength / 2, pitchWidth / 2])[1],
                        r: Math.abs(api.coord([pitchLength / 2 + centreCircleRadius, pitchWidth / 2])[0] -
                                    api.coord([pitchLength / 2, pitchWidth / 2])[0])
                      },
                      style: {
                        fill: 'none',
                        stroke: linesColor,
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
                        fill: linesColor
                      }
                    },
                    // Left penalty area
                    {
                      type: 'rect',
                      shape: {
                        x: api.coord([0, penaltyAreaTop])[0],
                        y: api.coord([0, penaltyAreaTop])[1],
                        width: api.coord([penaltyAreaDepth, 0])[0] - api.coord([0, 0])[0],
                        height: api.coord([0, penaltyAreaBottom])[1] - api.coord([0, penaltyAreaTop])[1]
                      },
                      style: {
                        fill: 'none',
                        stroke: linesColor,
                        lineWidth: 2
                      }
                    },
                    // Right penalty area
                    {
                      type: 'rect',
                      shape: {
                        x: api.coord([pitchLength - penaltyAreaDepth, penaltyAreaTop])[0],
                        y: api.coord([pitchLength - penaltyAreaDepth, penaltyAreaTop])[1],
                        width: api.coord([pitchLength, 0])[0] - api.coord([pitchLength - penaltyAreaDepth, 0])[0],
                        height: api.coord([0, penaltyAreaBottom])[1] - api.coord([0, penaltyAreaTop])[1]
                      },
                      style: {
                        fill: 'none',
                        stroke: linesColor,
                        lineWidth: 2
                      }
                    },
                    // Left goal area (small box)
                    {
                      type: 'rect',
                      shape: {
                        x: api.coord([0, goalAreaTop])[0],
                        y: api.coord([0, goalAreaTop])[1],
                        width: api.coord([goalAreaDepth, 0])[0] - api.coord([0, 0])[0],
                        height: api.coord([0, goalAreaBottom])[1] - api.coord([0, goalAreaTop])[1]
                      },
                      style: {
                        fill: 'none',
                        stroke: linesColor,
                        lineWidth: 2
                      }
                    },
                    // Right goal area (small box)
                    {
                      type: 'rect',
                      shape: {
                        x: api.coord([pitchLength - goalAreaDepth, goalAreaTop])[0],
                        y: api.coord([pitchLength - goalAreaDepth, goalAreaTop])[1],
                        width: api.coord([pitchLength, 0])[0] - api.coord([pitchLength - goalAreaDepth, 0])[0],
                        height: api.coord([0, goalAreaBottom])[1] - api.coord([0, goalAreaTop])[1]
                      },
                      style: {
                        fill: 'none',
                        stroke: linesColor,
                        lineWidth: 2
                      }
                    },
                    // Left penalty spot
                    {
                      type: 'circle',
                      shape: {
                        cx: api.coord([penaltySpotDist, pitchWidth / 2])[0],
                        cy: api.coord([penaltySpotDist, pitchWidth / 2])[1],
                        r: 3
                      },
                      style: {
                        fill: linesColor
                      }
                    },
                    // Right penalty spot
                    {
                      type: 'circle',
                      shape: {
                        cx: api.coord([pitchLength - penaltySpotDist, pitchWidth / 2])[0],
                        cy: api.coord([pitchLength - penaltySpotDist, pitchWidth / 2])[1],
                        r: 3
                      },
                      style: {
                        fill: linesColor
                      }
                    },
                    // Left penalty arc (the "D")
                    {
                      type: 'arc',
                      shape: {
                        cx: api.coord([penaltySpotDist, pitchWidth / 2])[0],
                        cy: api.coord([penaltySpotDist, pitchWidth / 2])[1],
                        r: Math.abs(api.coord([penaltySpotDist + penaltyArcRadius, pitchWidth / 2])[0] -
                                    api.coord([penaltySpotDist, pitchWidth / 2])[0]),
                        startAngle: -arcAngle,
                        endAngle: arcAngle
                      },
                      style: {
                        fill: 'none',
                        stroke: linesColor,
                        lineWidth: 2
                      }
                    },
                    // Right penalty arc (the "D")
                    {
                      type: 'arc',
                      shape: {
                        cx: api.coord([pitchLength - penaltySpotDist, pitchWidth / 2])[0],
                        cy: api.coord([pitchLength - penaltySpotDist, pitchWidth / 2])[1],
                        r: Math.abs(api.coord([pitchLength - penaltySpotDist + penaltyArcRadius, pitchWidth / 2])[0] -
                                    api.coord([pitchLength - penaltySpotDist, pitchWidth / 2])[0]),
                        startAngle: Math.PI - arcAngle,
                        endAngle: Math.PI + arcAngle
                      },
                      style: {
                        fill: 'none',
                        stroke: linesColor,
                        lineWidth: 2
                      }
                    },
                    // Bottom-left corner arc
                    {
                      type: 'arc',
                      shape: {
                        cx: api.coord([0, 0])[0],
                        cy: api.coord([0, 0])[1],
                        r: pxLen(cornerArcRadius),
                        startAngle: -Math.PI / 2,
                        endAngle: 0
                      },
                      style: { fill: 'none', stroke: linesColor, lineWidth: 2 }
                    },
                    // Top-left corner arc
                    {
                      type: 'arc',
                      shape: {
                        cx: api.coord([0, pitchWidth])[0],
                        cy: api.coord([0, pitchWidth])[1],
                        r: pxLen(cornerArcRadius),
                        startAngle: 0,
                        endAngle: Math.PI / 2
                      },
                      style: { fill: 'none', stroke: linesColor, lineWidth: 2 }
                    },
                    // Bottom-right corner arc
                    {
                      type: 'arc',
                      shape: {
                        cx: api.coord([pitchLength, 0])[0],
                        cy: api.coord([pitchLength, 0])[1],
                        r: pxLen(cornerArcRadius),
                        startAngle: Math.PI,
                        endAngle: 3 * Math.PI / 2
                      },
                      style: { fill: 'none', stroke: linesColor, lineWidth: 2 }
                    },
                    // Top-right corner arc
                    {
                      type: 'arc',
                      shape: {
                        cx: api.coord([pitchLength, pitchWidth])[0],
                        cy: api.coord([pitchLength, pitchWidth])[1],
                        r: pxLen(cornerArcRadius),
                        startAngle: Math.PI / 2,
                        endAngle: Math.PI
                      },
                      style: { fill: 'none', stroke: linesColor, lineWidth: 2 }
                    },
                    // Left goal mouth (extends behind the goal line)
                    {
                      type: 'rect',
                      shape: {
                        x: api.coord([0, goalTop])[0] - pxLen(goalDepth),
                        y: api.coord([0, goalTop])[1],
                        width: pxLen(goalDepth),
                        height: api.coord([0, goalBottom])[1] - api.coord([0, goalTop])[1]
                      },
                      style: { fill: 'none', stroke: linesColor, lineWidth: 2 }
                    },
                    // Right goal mouth (extends behind the goal line)
                    {
                      type: 'rect',
                      shape: {
                        x: api.coord([pitchLength, goalTop])[0],
                        y: api.coord([pitchLength, goalTop])[1],
                        width: pxLen(goalDepth),
                        height: api.coord([0, goalBottom])[1] - api.coord([0, goalTop])[1]
                      },
                      style: { fill: 'none', stroke: linesColor, lineWidth: 2 }
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
