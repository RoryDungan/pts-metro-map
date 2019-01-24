// A demo of convex hull using pts.js. We are using webpack to bundle this demo into "dist/bundle.js".
// Source code licensed under Apache License 2.0.
// Copyright © 2017 William Ngan. (https://github.com/williamngan/pts)

import {CanvasSpace, Create, Pt, Polygon} from 'pts'


// Initiate Space and Form
const space = new CanvasSpace('#pts')
  .setup({ bgcolor: '#fff', resize: true, retina: true })
const form = space.getForm()

console.log('test')

const colour = '#42e'

space.add({

  start: (bound) => {
  },

  animate: (time, ftime) => {
    const startPoint = space.center
    const endPoint = space.pointer

    const sign = Math.sign(endPoint.y - startPoint.y)

    const curveStart = Math.tan(sign * Math.PI / 4) * Math.abs(endPoint.x - startPoint.x)

    // console.log(curveStart)

    const midpoint = new Pt(startPoint.x, endPoint.y - curveStart)
    form.stroke(colour, 5).line([startPoint, midpoint])
    form.stroke(colour, 5).line([midpoint, endPoint])
  },
})


// bind mouse events and play animation
space.bindMouse().bindTouch().play()
