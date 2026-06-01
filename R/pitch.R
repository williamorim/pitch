#' Create an interactive soccer pitch visualization
#'
#' Creates an HTML widget that renders an interactive soccer pitch
#' using the Apache ECharts JavaScript library.
#'
#' @param width Width of the widget (in CSS units or pixels).
#' @param height Height of the widget (in CSS units or pixels).
#' @param elementId Optional HTML element ID for the widget.
#'
#' @return An HTML widget object.
#'
#' @import htmlwidgets
#'
#' @export
#'
#' @examples
#' pitch()
pitch <- function(width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x <- list()

  # create widget
  htmlwidgets::createWidget(
    name = 'pitch',
    x,
    width = width,
    height = height,
    package = 'pitch',
    elementId = elementId,
    dependencies = list(echarts_dependency())
  )
}

#' ECharts HTML dependency
#'
#' Returns an \code{htmlDependency} for Apache ECharts 5.
#'
#' @keywords internal
echarts_dependency <- function() {
  htmltools::htmlDependency(
    name    = 'echarts',
    version = '5.4.3',
    src     = c(href = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/'),
    script  = 'echarts.min.js'
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
pitchOutput <- function(outputId, width = '100%', height = '400px') {
  htmlwidgets::shinyWidgetOutput(outputId, 'pitch', width, height, package = 'pitch')
}

#' @rdname pitch-shiny
#' @export
renderPitch <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) {
    expr <- substitute(expr)
  }
  htmlwidgets::shinyRenderWidget(expr, pitchOutput, env, quoted = TRUE)
}
