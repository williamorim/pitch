#' Standard soccer pitch dimensions
#'
#' Named lists holding every dimension needed to draw a pitch. Pass one of these
#' (or a list with the same names) to the \code{pitch_dimensions} argument of
#' \code{\link{pitch}}. \code{pitch_meters} holds the metric dimensions
#' (the default) and \code{pitch_yards} the equivalent imperial dimensions.
#'
#' Each list contains:
#' \describe{
#'   \item{length}{Length of the pitch (goal line to goal line).}
#'   \item{width}{Width of the pitch (touchline to touchline).}
#'   \item{penalty_area_depth}{Depth of the penalty area, from the goal line.}
#'   \item{penalty_area_width}{Width of the penalty area.}
#'   \item{goal_area_depth}{Depth of the goal area (the small box).}
#'   \item{goal_area_width}{Width of the goal area.}
#'   \item{penalty_spot_dist}{Distance of the penalty spot from the goal line.}
#'   \item{penalty_arc_radius}{Radius of the penalty arc (the "D").}
#'   \item{centre_circle_radius}{Radius of the centre circle.}
#'   \item{corner_arc_radius}{Radius of the corner arcs.}
#'   \item{goal_width}{Width of the goal mouth.}
#'   \item{goal_depth}{Depth the goal mouth extends behind the goal line.}
#' }
#'
#' @format A named list of length 12.
#'
#' @export
pitch_meters <- list(
  length = 105,
  width = 68,
  penalty_area_depth = 16.5,
  penalty_area_width = 40.32,
  goal_area_depth = 5.5,
  goal_area_width = 18.32,
  penalty_spot_dist = 11,
  penalty_arc_radius = 9.15,
  centre_circle_radius = 9.15,
  corner_arc_radius = 1,
  goal_width = 7.32,
  goal_depth = 2.44
)

#' @rdname pitch_meters
#' @export
pitch_yards <- list(
  length = 115,
  width = 74,
  penalty_area_depth = 18,
  penalty_area_width = 44,
  goal_area_depth = 6,
  goal_area_width = 20,
  penalty_spot_dist = 12,
  penalty_arc_radius = 10,
  centre_circle_radius = 10,
  corner_arc_radius = 1,
  goal_width = 8,
  goal_depth = 2.69
)

#' Create an interactive soccer pitch visualization
#'
#' Creates an HTML widget that renders an interactive soccer pitch
#' using the Apache ECharts JavaScript library. \code{football_pitch} is an
#' alias for \code{soccer_pitch}.
#'
#' @param width Width of the widget (in CSS units or pixels).
#' @param height Height of the widget (in CSS units or pixels).
#' @param pitch_margin Size, in pixels, of the green margin drawn outside the
#'   pitch boundary so the outer white lines are visible. Defaults to 5.
#' @param pitch_dimensions A named list with the dimensions used to build every
#'   pitch element. See \code{\link{pitch_meters}} (the default) and
#'   \code{\link{pitch_yards}} for the expected structure.
#' @param pitch_color Fill color of the pitch (and its outer margin). Any valid
#'   CSS color string. Defaults to \code{"#4a7c3f"}.
#' @param lines_color Color of the pitch markings (lines, circles, spots). Any
#'   valid CSS color string. Defaults to \code{"#ffffff"}.
#' @param elementId Optional HTML element ID for the widget.
#'
#' @return An HTML widget object.
#'
#' @import htmlwidgets
#'
#' @export
#'
#' @examples
#' soccer_pitch()
#' soccer_pitch(pitch_dimensions = pitch_yards)
#' soccer_pitch(pitch_color = "#1b5e20", lines_color = "#ffeb3b")
soccer_pitch <- function(width = NULL, height = NULL, pitch_margin = 25,
                         pitch_dimensions = pitch_meters, pitch_color = "#4a7c3f",
                         lines_color = "#ffffff", elementId = NULL) {
  # forward options using x
  x <- list(
    pitch_margin = pitch_margin,
    pitch_dimensions = pitch_dimensions,
    pitch_color = pitch_color,
    lines_color = lines_color
  )

  # create widget
  htmlwidgets::createWidget(
    name = "pitch",
    x,
    width = width,
    height = height,
    package = "pitch",
    elementId = elementId,
    dependencies = list(echarts_dependency())
  )
}

#' @rdname soccer_pitch
#' @export
football_pitch <- soccer_pitch

#' ECharts HTML dependency
#'
#' Returns an \code{htmlDependency} for Apache ECharts 5.
#'
#' @keywords internal
echarts_dependency <- function() {
  htmltools::htmlDependency(
    name    = "echarts",
    version = "5.4.3",
    src     = c(href = "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/"),
    script  = "echarts.min.js"
  )
}

#' Shiny bindings for pitch
#'
#' Output and render functions for using pitch within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId Output variable to refer to this output.
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a pitch widget.
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})?
#'   This is useful if you want to save an expression in a variable.
#'
#' @name pitch-shiny
#'
#' @export
pitchOutput <- function(outputId, width = "100%", height = "400px") {
  htmlwidgets::shinyWidgetOutput(outputId, "pitch", width, height, package = "pitch")
}

#' @rdname pitch-shiny
#' @export
renderPitch <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) {
    expr <- substitute(expr)
  }
  htmlwidgets::shinyRenderWidget(expr, pitchOutput, env, quoted = TRUE)
}
