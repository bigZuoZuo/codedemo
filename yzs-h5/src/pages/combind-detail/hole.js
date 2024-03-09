var collapse = false, // 旋转
  expanse = false // 折叠爆炸
const blackHole = function (element, starNumber) {
  const ele = document.getElementById(element)
  var h = ele?.offsetHeight,
    w = ele?.offsetWidth,
    cw = w,
    ch = h,
    maxorbit = 255, // distance from center
    centery = ch / 2,
    centerx = cw / 2

  var startTime = new Date().getTime()
  var currentTime = 0

  var stars = []

  var canvas = document.createElement('canvas')
  canvas.setAttribute('width', cw)
  canvas.setAttribute('height', ch)
  ele.appendChild(canvas)
  var context = canvas.getContext('2d')

  // var canvas = $('<canvas/>').attr({width: cw, height: ch}).appendTo(element),
  //     context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.globalCompositeOperation = 'multiply'

  function setDPI(canvas, dpi) {
    // Set up CSS size if it's not set up already
    if (!canvas.style.width) canvas.style.width = canvas.width + 'px'
    if (!canvas.style.height) canvas.style.height = canvas.height + 'px'

    var scaleFactor = dpi / 96
    canvas.width = Math.ceil(canvas.width * scaleFactor)
    canvas.height = Math.ceil(canvas.height * scaleFactor)
    var ctx = canvas.getContext('2d')
    ctx.scale(scaleFactor, scaleFactor)
  }

  function rotate(cx, cy, x, y, angle) {
    var radians = angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = cos * (x - cx) + sin * (y - cy) + cx,
      ny = cos * (y - cy) - sin * (x - cx) + cy
    return [nx, ny]
  }

  setDPI(canvas, 192)

  var star = function () {
    // Get a weighted random number, so that the majority of stars will form in the center of the orbit
    var rands = []
    rands.push(Math.random() * (maxorbit / 2) + 1)
    rands.push(Math.random() * (maxorbit / 2) + maxorbit)

    this.orbital =
      rands.reduce(function (p, c) {
        return p + c
      }, 0) / rands.length
    // Done getting that random number, it's stored in this.orbital

    this.x = centerx // All of these stars are at the center x position at all times
    this.y = centery + this.orbital // Set Y position starting at the center y + the position in the orbit

    this.yOrigin = centery + this.orbital // this is used to track the particles origin

    this.speed = ((Math.floor(Math.random() * 2.5) + 1.5) * Math.PI) / 180 // The rate at which this star will orbit
    this.rotation = 0 // current Rotation
    this.startRotation = ((Math.floor(Math.random() * 360) + 1) * Math.PI) / 180 // Starting rotation.  If not random, all stars will be generated in a single line.

    this.id = stars.length // This will be used when expansion takes place.

    this.collapseBonus = this.orbital - maxorbit * 0.7 // This "bonus" is used to randomly place some stars outside of the blackhole on hover
    if (this.collapseBonus < 0) {
      // if the collapse "bonus" is negative
      this.collapseBonus = 0 // set it to 0, this way no stars will go inside the blackhole
    }

    stars.push(this)
    this.color = 'rgba(255, 255, 255,' + (1 - this.orbital / 255) + ')' // Color the star white, but make it more transparent the further out it is generated

    this.hoverPos = centery + maxorbit / 2 + this.collapseBonus // Where the star will go on hover of the blackhole
    this.expansePos = centery + (this.id % 100) * -10 + (Math.floor(Math.random() * 20) + 1) // Where the star will go when expansion takes place

    this.prevR = this.startRotation
    this.prevX = this.x
    this.prevY = this.y

    // The reason why I have yOrigin, hoverPos and expansePos is so that I don't have to do math on each animation frame.  Trying to reduce lag.
  }
  star.prototype.draw = function () {
    // the stars are not actually moving on the X axis in my code.  I'm simply rotating the canvas context for each star individually so that they all get rotated with the use of less complex math in each frame.

    if (!expanse) {
      this.rotation = this.startRotation + currentTime * this.speed
      if (!collapse) {
        // not hovered
        if (this.y > this.yOrigin) {
          this.y -= 2.5
        }
        if (this.y < this.yOrigin - 4) {
          this.y += (this.yOrigin - this.y) / 10
        }
      } else {
        // on hover
        this.trail = 1
        if (this.y > this.hoverPos) {
          this.y -= (this.hoverPos - this.y) / -5
        }
        if (this.y < this.hoverPos - 4) {
          this.y += 2.5
        }
      }
    } else {
      this.rotation = this.startRotation + currentTime * (this.speed / 2)
      if (this.y > this.expansePos) {
        this.y -= Math.floor(this.expansePos - this.y) / -140
      }
    }

    context.save()
    context.strokeStyle = this.color
    context.beginPath()
    var oldPos = rotate(centerx, centery, this.prevX, this.prevY, -this.prevR)
    context.moveTo(oldPos[0], oldPos[1])
    context.translate(centerx, centery)
    context.rotate(this.rotation)
    context.translate(-centerx, -centery)
    context.lineTo(this.x, this.y)
    context.stroke()
    context.restore()

    this.prevR = this.rotation
    this.prevX = this.x
    this.prevY = this.y
  }

  window.requestFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60)
      }
    )
  })()

  function loop() {
    var now = new Date().getTime()
    currentTime = (now - startTime) / 50

    context.fillStyle = 'rgba(245, 180, 0,0.9)' // somewhat clear the context, this way there will be trails behind the stars
    context.fillRect(0, 0, cw, ch)
    // 背景透明
    context.clearRect(0, 0, cw, ch)

    for (var i = 0; i < stars.length; i++) {
      // For each star
      if (stars[i] != stars) {
        stars[i].draw() // Draw it
      }
    }

    requestFrame(loop)
  }

  function init(time) {
    context.fillStyle = 'rgba(255,255,255,0)' // Initial clear of the canvas, to avoid an issue where it all gets too dark
    context.fillRect(0, 0, cw, ch)
    for (var i = 0; i < (starNumber || 2500); i++) {
      // create 2500 stars
      new star()
    }
    loop()
    document.getElementsByTagName('canvas')[0].style.display = 'none'
  }
  init()
}

const tryHole = function (close) {
  collapse = false
  expanse = false
  if (close) {
    document.getElementsByTagName('canvas')[0].style.display = 'none'
  } else {
    document.getElementsByTagName('canvas')[0].style.display = 'block'
    setTimeout(() => {
      collapse = true
    }, 500)
    setTimeout(() => {
      collapse = false
      expanse = true
    }, 1200)
  }
  // setTimeout(() => {
  // 	expanse = false
  // }, 5000)
}

export default {
  blackHole,
  tryHole,
  collapse,
  expanse,
}
