import Topiary from '@walsh9/topiary';

const HEIGHT = 0;
const THICKNESS = 1;
const HUE = 2;
const SATURATION = 3;
const LIGHTNESS = 4;
const LEFT_ANGLE = 5;
const RIGHT_ANGLE = 6;
const HEIGHT_CHANGE = 7;
const THICKNESS_CHANGE = 8;

const PHASE_INHALE = 1;
const PHASE_HOLD_IN = 2;
const PHASE_EXHALE = 3;
const PHASE_HOLD_OUT = 4;

var deterministicTree = function(canvas, treeArray, limitArray) {
  var treeOptions = {
    canvas: canvas,
    startPoint: Topiary.Vector2d.new(canvas.width / 2 , canvas.height),
    color: Topiary.Color.new(Math.floor(treeArray[HUE] * 360 + 70), 20, 20),
    height:    treeArray[HEIGHT] * 100 + 20,
    thickness: treeArray[THICKNESS] * 8 + 2,
    depth: 12,
    rainbow: false,
    colorShiftRate: 0,
    delay: 0,
  };
  var mutationOptions = {
    minLeftAngle: treeArray[LEFT_ANGLE] * limitArray[LEFT_ANGLE],
    maxLeftAngle: treeArray[LEFT_ANGLE] * limitArray[LEFT_ANGLE],
    minRightAngle: treeArray[RIGHT_ANGLE] * limitArray[RIGHT_ANGLE],
    maxRightAngle: treeArray[RIGHT_ANGLE] * limitArray[RIGHT_ANGLE],
    minHeightChange: treeArray[HEIGHT_CHANGE] * 0.1 + 0.7,
    maxHeightChange: treeArray[HEIGHT_CHANGE] * 0.1 + 0.7,
    minThicknessChange: treeArray[THICKNESS_CHANGE] * 0.1 + 0.7,
    maxThicknessChange: treeArray[THICKNESS_CHANGE] * 0.1 + 0.7,
  };
  return Topiary.new(treeOptions, mutationOptions);
};

var clamp = function(n, min, max) {
  if (min === undefined) {min = 0;}
  if (max === undefined) {max = 1;}
  if (n < min) {return min;}
  if (n > max) {return max;}
  return n;
};

let getBreathPoint = function(time, breathCycle) {
  const b = breathCycle;
  const BREATH = b.inhale + b.holdIn + b.exhale + b.holdOut;
  const t = time % BREATH;

  let breath = {};
  if (t <= b.inhale) {
    breath.phase = PHASE_INHALE;
    breath.value = t / b.inhale;
  } else if (t <= b.inhale + b.holdIn) {
    breath.phase = PHASE_HOLD_IN;
    breath.value = 1;
  } else if (t <= b.inhale + b.holdIn + b.exhale) {
    breath.phase = PHASE_EXHALE;
    breath.value = 1 - ((t - (b.inhale + b.holdIn)) / b.exhale);
  } else {
    breath.phase = PHASE_HOLD_OUT;
    breath.value = 0;
  }
  return breath;
};

let limitArray = [];
limitArray[LEFT_ANGLE] = Math.random() * 55 + 10;
limitArray[RIGHT_ANGLE] = Math.random() * 55 + 10;

var arrayOfRandomFloats = function(num) {
  var floats = [];
  for (let i = 0; i < num; i++) {
    floats[i] = Math.random();
  }
  return floats;
};

var change = function(array, runtime, breathCycle) {
  for (let i = 0; i < array.length; i++) {
    array[i] = getBreathPoint(runtime, breathCycle).value;
  }
  return array;
};

let updatePrompt = function(prompt, breathPoint) {
  let message;
  switch(breathPoint.phase) {
  case PHASE_INHALE:
    message = 'INHALE';
    break;
  case PHASE_HOLD_IN:
    message = 'HOLD';
    break;
  case PHASE_EXHALE:
    message = 'EXHALE';
    break;
  case PHASE_HOLD_OUT:
    message = 'HOLD';
    break;
  }
  prompt.innerText = message;
};

var seed = arrayOfRandomFloats(9);
    
var fitCanvasToWindow = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener('resize', fitCanvasToWindow);

let breathCycle = {};
breathCycle.inhale = 4000;
breathCycle.holdIn = 0;
breathCycle.exhale = 3200;
breathCycle.holdOut = 0;

let runtime = 0;
let interval = 50;

let canvas = document.getElementById("canvas");
let prompt = document.getElementById('prompt');
let ctx = canvas.getContext("2d");

let skyGradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
skyGradient.addColorStop(0, "#00ffff");
skyGradient.addColorStop(1, "#0066ff");


var draw = function () {
  runtime += interval;
  let breathPoint = getBreathPoint(runtime, breathCycle);
  let tree = deterministicTree(canvas, change(seed, runtime, breathCycle), limitArray);
  updatePrompt(prompt, breathPoint);


  ctx.fillStyle = skyGradient;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  tree.draw();
};

fitCanvasToWindow();
setInterval(draw, interval);
