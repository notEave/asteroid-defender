// jshint esversion:6

// TODO move all functions from global scope to objects

function ByID($domId) {
  return document.getElementById($domId);
}
function ByClass($className, $index = 0) {
  return document.getElementsByClassName($className)[$index];
}

const page = {
  width: window.innerWidth,
  height: window.innerHeight,
  Update: function() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
};
const MathC = {
  TAU: Math.PI * 2,
  angle: {
    Radians: function($degrees) {
      return $degrees * Math.PI / 180;
    },
    Degrees: function($radians) {
      return $radians * 180 / Math.PI;
    },
  },
  Random: function($seed = Math.random()) {
    // random number generation with seed
    return Math.sin($seed) * 10000 - Math.floor(Math.sin($seed) * 10000);
  },
  RandomRange: function($min = 0, $max = 1000, $seed = Math.random()) {
    // returns an integer between and including $min and $max
    return Math.floor(MathC.Random($seed) * ($max - $min + 1) + $min);
  },
  Round: function($number, $precision = 0) {
    // returns rounded number of $number with precision of $precision
    return Math.round($number * Math.pow(10, $precision)) / Math.pow(10, $precision);
  },
  Floor: function($number, $precision = 0) {
    // returns rounded down $number of precision $precision
    return Math.floor($number * Math.pow(10, $precision)) / Math.pow(10, $precision);
  },
  Ceil: function($number, $precision = 0) {
    // returns rounded up $number of precision $precision
    return Math.ceil($number * Math.pow(10, $precision)) / Math.pow(10, $precision);
  },
  Average: function($array = []) {
    // returns a float average of all array's elements
    let total = 0;
    for ( let i = 0; i < $array.length; i++ ) {
      total += $array[i];
    }
    return total / $array.length;
  },
  algorithm: {
    // bresenham's line takes two vertices and
    // returns an array containing every point inbetween
    Bresenham: function($vertices = { start: { x: null, y: null }, end: { x: null, y: null } }) {
      let pointArray = [];
      let start = { x: $vertices.start.x, y: $vertices.start.y },
        end = { x: $vertices.end.x, y: $vertices.end.y },
        iterated = { x: start.x, y: start.y };
      let difference = {
        x: Math.abs(end.x - start.x),
        y: Math.abs(end.y - start.y)
      };
      let direction = {
        x: (start.x < end.x) ? 1 : -1,
        y: (start.y < end.y) ? 1 : -1
      };
      let ratio = { base: difference.x - difference.y, bitShift: null};
      pointArray.push({x: start.x, y: start.y});

      while(!((iterated.x == end.x) && (iterated.y == end.y))) {
        // shift ratio.base 1 bit to the left, leaving 0 as the first bit(rate.base*2)
        ratio.bitShift = ratio.base << 1;
        if(ratio.bitShift > -difference.y) {
          ratio.base -= difference.y;
          iterated.x += direction.x;
        }
        if(ratio.bitShift < difference.x) {
          ratio.base += difference.x;
          iterated.y += direction.y;
        }
        pointArray.push({x: iterated.x, y: iterated.y});
      }
      return pointArray;
    },
  }
};

const sort = {
  Bubble: function($array) {
    let swapped, n;
    do {
      swapped = false;
      for(n = 0; n < $array.length - 1; n++) {
        if($array[n] > $array[n+1]) {
          [$array[n], $array[n+1]] = [$array[n+1], $array[n]];
          swapped = true;
        }
      }
    } while(swapped);
    return $array;
  },
  Brick: function($array) {
    let swapped, n, i;
    do {
      swapped = false;
      for(n = 1; n < $array.length - 1; n += 2) {
        if($array[n] > $array[n+1]) {
          [$array[n], $array[n+1]] = [$array[n+1], $array[n]];
          swapped = true;
        }
      }
      for(i = 0; i < $array.length - 1; i += 2) {
        if($array[i] > $array[i+1]) {
          [$array[i], $array[i+1]] = [$array[i+1], $array[i]];
          swapped = true;
        }
      }
    } while(swapped);
    return $array;
  },
};

const canvas = {
  element: ByClass('canv'),
  content: ByClass('canv').getContext('2d'),
  Clear: function() {
    this.content.clearRect(0, 0, page.width, page.height);
  },
  Maximize: function() {
    page.Update();
    this.element.width = page.width;
    this.element.height = page.height;
  },
};

const hid = {
  mouse: {
    Click: function(event) {
    },
    Down: function(event) {
      if(event.button === 0) {
        hid.mouse.down = true;
      }
    },
    Up: function(event) {
      if(event.button === 0) {
        hid.mouse.down = false;
      }
    },
    Move: function(event) {
      hid.mouse.x = event.clientX;
      hid.mouse.y = event.clientY;
    },
    x: null, y: null,
    down: false,
  },
  keyboard: {
    KeyDown: function(event) {
    }
  },
};

const time = {
  pageLoad: performance.now(),
  frame: {
    start: null,
    end: null,
    delta: null,
    current: 0,
    physics: {
      start: null,
      end: null,
    },
    draw: {
      start: null,
      end: null,
    },
    fps: {
      current: null,
      array: [],
      average: null,
      Average: function() {
        this.array.push(this.current);
        while ( this.array.length > 2048) {
            this.array.shift();
        }
        this.average = MathC.Average(this.array);
      }
    },
  },
  Physics: function() {
    return this.frame.physics.end - this.frame.physics.start;
  },
  Draw: function() {
    return this.frame.draw.end - this.frame.draw.start;
  },
  Frame: function() {
    return this.frame.end - this.frame.start;
  },
  Delta: function() {},
  Iterate: function() {
    this.frame.delta = performance.now() - this.frame.start;
    this.frame.fps.current = 1000 / this.frame.delta;
    this.frame.fps.Average();
    this.frame.current++;
  }
};

function Start() {
  document.addEventListener('keydown', hid.keyboard.KeyDown, false);
  document.addEventListener('click', hid.mouse.Click, false);
  document.addEventListener('mousedown', hid.mouse.Down, false);
  document.addEventListener('mouseup', hid.mouse.Up, false);
  document.addEventListener('mousemove', hid.mouse.Move, false);
  canvas.Maximize();
}

function Resize() {
  canvas.Maximize();
}

function Frame() {
  time.Iterate();
  time.frame.start = performance.now();

  Physics();
  Draw();

  time.frame.end = performance.now();
  requestAnimationFrame(Frame);
}

function Physics() {
  time.frame.physics.start = performance.now();

  game.Physics();

  time.frame.physics.end = performance.now();
}

function Draw() {
  time.frame.draw.start = performance.now();

  canvas.Clear();
  // NOTE test here
  game.Draw();
  time.frame.draw.end = performance.now();
  // NOTE fps averaging needs to be kept outside of draw.start
  // and draw.end in order to get accurate results
}

let game = new Game();
requestAnimationFrame(Frame);
