// Interaction delays (in milliseconds)
const SECTION_COOLDOWN_MS = 1500;
let section1LastTime = -1500;
let section2LastTime = -1500;
let section3LastTime = -1500;
let section4LastTime = -1500;

// Interaction execution values
let section1Sensitivity = -30;
let section2Sensitivity = 85;
let section3Sensitivity = -85;
let section4Sensitivity = 10;

// Do not edit from here on ----------------------------------------------------
let serialValues = [];
let img;
let canvas;
let section1Progress = 0;
let section2Progress = 0;
let section3Progress = 0;
let section4Progress = 0;
let section1Active = false;
let section2Active = false;
let section3Active = false;
let section4Active = false;

const SECTION_COLOR = [158, 17, 23];

function preload() {
  img = loadImage("./assets/hand.png");
}

function setup() {
  noStroke();
  angleMode(DEGREES);

  const parent = document.getElementById("p5-canvas");
  const w = parent.offsetWidth;
  const h = parent.offsetHeight;

  canvas = createCanvas(w, h);
  canvas.parent("p5-canvas");
  setupArduino();
  img.resize(w, h);
}

function windowResized() {
  const parent = document.getElementById("p5-canvas");
  const w = parent.offsetWidth;
  const h = parent.offsetHeight;
  resizeCanvas(w, h);
  img.resize(w, h);
}

function draw() {
  // Parsing serial data
  if (typeof port !== "undefined" && port.opened()) {
    let data = port.readUntil("\n");
    if (data) {
      let values = data.trim().split(",").map(Number);
      if (values.length >= 1) {
        serialValues = values;
      }
    }
  }

  // Hand image
  image(img, 0, 0, width, height);

  // Time tracking
  let now = millis();

  // Section 1
  let canTrigger1 = now - section1LastTime > SECTION_COOLDOWN_MS;
  if (
    canTrigger1 &&
    serialValues[0] > section1Sensitivity &&
    !section1Active &&
    section1Progress === 0
  ) {
    section1Active = true;
    section1LastTime = now;
  }
  section1Progress = drawSection(
    {
      x1: width * 0.345,
      x2: width * 0.395,
      y1: height * 0.465,
      y2: height * 0.6,
      cx: width * 0.345,
      w: width * 0.05,
    },
    height * 0.465,
    0,
    height * 0.05,
    height * 0.12,
    section1Progress,
    section1Active
  );
  if (section1Active && section1Progress >= 1) section1Active = false;

  // Section 2
  let canTrigger2 = now - section2LastTime > SECTION_COOLDOWN_MS;
  if (
    canTrigger2 &&
    serialValues[1] > section2Sensitivity &&
    !section2Active &&
    section2Progress === 0
  ) {
    section2Active = true;
    section2LastTime = now;
  }
  section2Progress = drawSection(
    {
      x1: width * 0.425,
      x2: width * 0.475,
      y1: height * 0.5,
      y2: height * 0.7,
      cx: width * 0.425,
      w: width * 0.05,
    },
    height * 0.47,
    3,
    height * 0.05,
    height * 0.12,
    section2Progress,
    section2Active
  );
  if (section2Active && section2Progress >= 1) section2Active = false;

  // Section 3
  let canTrigger3 = now - section3LastTime > SECTION_COOLDOWN_MS;
  if (
    canTrigger3 &&
    serialValues[2] > section3Sensitivity &&
    !section3Active &&
    section3Progress === 0
  ) {
    section3Active = true;
    section3LastTime = now;
  }
  section3Progress = drawSection(
    {
      x1: width * 0.545,
      x2: width * 0.595,
      y1: height * 0.5,
      y2: height * 0.7,
      cx: width * 0.545,
      w: width * 0.05,
    },
    height * 0.5,
    14,
    height * 0.05,
    height * 0.13,
    section3Progress,
    section3Active
  );
  if (section3Active && section3Progress >= 1) section3Active = false;

  // Section 4
  let canTrigger4 = now - section4LastTime > SECTION_COOLDOWN_MS;
  if (
    canTrigger4 &&
    serialValues[3] > section4Sensitivity &&
    !section4Active &&
    section4Progress === 0
  ) {
    section4Active = true;
    section4LastTime = now;
  }
  section4Progress = drawSection(
    {
      x1: width * 0.665,
      x2: width * 0.715,
      y1: height * 0.56,
      y2: height * 0.74,
      cx: width * 0.665,
      w: width * 0.05,
    },
    height * 0.56,
    24,
    height * 0.05,
    height * 0.13,
    section4Progress,
    section4Active
  );
  if (section4Active && section4Progress >= 1) section4Active = false;
}

function sensingResult() {
  if (serialValues[0] < 50) {
    fill(158, 17, 23);
    circle(width / 2, height / 2, width / 20);
  }
}

function drawSection(region, topY, rotation, minH, maxH, progress, isActive) {
  let inRegion =
    region.x1 < mouseX &&
    mouseX < region.x2 &&
    region.y1 < mouseY &&
    mouseY < region.y2;

  if (inRegion || isActive) {
    progress += 0.05;
    let rectHeight = lerp(minH, maxH, progress);
    let cx = region.cx + region.w / 2;
    push();
    translate(cx, topY);
    rotate(rotation);
    gradientRectRounded(
      -region.w / 2,
      0,
      region.w,
      rectHeight,
      ...SECTION_COLOR,
      region.w / 2
    );
    pop();
  } else {
    progress = 0;
  }
  return constrain(progress, 0, 1);
}

function gradientRectRounded(x, y, w, h, r, g, b, radius) {
  let pg = createGraphics(w, h);
  pg.noStroke();
  for (let i = 0; i < h; i++) {
    let alpha = map(i, 0, h - 1, 0, 255);
    pg.fill(r, g, b, alpha);
    pg.rect(0, i, w, 1);
  }

  let maskG = createGraphics(w, h);
  maskG.noStroke();
  maskG.fill(255);
  maskG.rect(0, 0, w, h, radius);
  let maskImg = maskG.get();
  let gradImg = pg.get();
  gradImg.mask(maskImg);

  image(gradImg, x, y);
}
