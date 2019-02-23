'use strict'

// A demo of convex hull using pts.js. We are using webpack to bundle this demo into "dist/bundle.js".
// Source code licensed under Apache License 2.0.
// Copyright © 2017 William Ngan. (https://github.com/williamngan/pts)

import {CanvasSpace, Create, Pt, Polygon} from 'pts'

import { createStateMachine } from './state-machine'


// Initiate Space and Form
const space = new CanvasSpace('#pts')
  .setup({ bgcolor: '#fff', resize: true, retina: true })
const form = space.getForm()
form.fill(false)

console.log('test')

const colour = '#42e'

const lines = [{
  colour,
  points: []
}]

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

const rootState = {
  update: () => {
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
  }
}

const stateMachine = createStateMachine(rootState)

space.add({
  action: (type, px, py, evt) => {
    if (type === 'down') {
      stateMachine.push(createLineState)
    }
    else if (type === 'up') {
      stateMachine.pop()
    }
  },

  start: (bound) => {
  },

  animate: (time, ftime) => {
    stateMachine.update()
  },
})


// bind mouse events and play animation
space.bindMouse().bindTouch().play()
