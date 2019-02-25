'use strict'

// A demo of convex hull using pts.js. We are using webpack to bundle this demo into "dist/bundle.js".
// Source code licensed under Apache License 2.0.
// Copyright © 2017 William Ngan. (https://github.com/williamngan/pts)

import { CanvasSpace, Create, Geom, Line, Pt, Polygon, Rectangle, Mat } from 'pts'

import { createStateMachine } from './state-machine'


// Initiate Space and Form
const space = new CanvasSpace('#pts')
  .setup({ bgcolor: '#fff', resize: true, retina: true })
const form = space.getForm()
form.fill(false)

console.log('test')

const colour = '#42e'

const lines = []

const lineBetweenPoints = (start, end) => {
  const startToEnd = end.$subtract(start).$abs()
  let midpoint
  if (startToEnd.x < startToEnd.y) {
    const sign = Math.sign(end.y - start.y)
    const curveStart = Math.tan(sign * Math.PI / 4) * Math.abs(end.x - start.x)
    midpoint = new Pt(start.x, end.y - curveStart)
  }
  else {
    const sign = Math.sign(end.x - start.x)
    const curveStart = Math.tan(sign * Math.PI / 4) * Math.abs(end.y - start.y)
    midpoint = new Pt(end.x - curveStart, start.y)
  }

  return [start, midpoint, end]
}

const drawLine = (colour, points) => form.stroke(colour, 5).line(points)

/**
 * Check if a point is within range of a line.
 * Works by checking that the point is within distance of the line and also that
 * the nearest point on the line perpendicular to the point is within the bounds
 * of the line so that we exlucde values beyond the start or the end of the line.
 * @param {*} point Point to check
 * @param {*} line The line we are checking against
 * @param {*} tolerance How close the point must be before we consider it touching the line
 */
const isPointNearLine = (point, line, tolerance) => {
  const perpendicular = Line.perpendicularFromPt(line, point)
  return Rectangle.withinBound(line, perpendicular) &&
    Line.distanceFromPt(line, point) < tolerance
}

const isPointNearRoute = (point, route, tolerance) => Polygon.lines(route, false)
  .reduce((acc, curr) => acc || isPointNearLine(point, curr, tolerance), false)

const getRouteAtPosition = (point, routes) => routes.reduce(
  (acc, curr) => isPointNearRoute(point, curr.points, 3) ? curr : acc,
  null
)

const rootState = {
  action: (type, px, py, evt) => {
    if (type === 'down') {
      const clickedRoute = getRouteAtPosition([px, py], lines)
      if (clickedRoute) {
        const index = lines.indexOf(clickedRoute)
        console.log('deleting route ' + index)
        lines.splice(index, 1)
      }
      else {
        stateMachine.push(createLineState)
      }
    }
  },

  update: () => {
    for (const route of lines) {
      route.colour = colour
    }

    const routeUnderCursor = getRouteAtPosition(space.pointer, lines)
    if (routeUnderCursor) {
      routeUnderCursor.colour = '#f00'
    }

    for (const line of lines) {
      drawLine(line.colour, line.points)
    }
  }
}

let newLineStart

const createLineState = {
  enter: () => {
    newLineStart = space.pointer
  },

  update: () => {
    drawLine('#eee', lineBetweenPoints(newLineStart, space.pointer))
  },

  exit: () => {
    lines.push({
      colour: '#42e',
      points: lineBetweenPoints(newLineStart, space.pointer)
    })
  },

  action: (type, px, py, evt) => {
    if (type === 'up') {
      stateMachine.pop()
    }
  }
}

const stateMachine = createStateMachine(rootState)

space.add({
  action: (type, px, py, evt) => {
    stateMachine.action(type, px, py, evt)
  },

  start: (bound) => {
  },

  animate: (time, ftime) => {
    stateMachine.update()
  },
})


// bind mouse events and play animation
space.bindMouse().bindTouch().play()
