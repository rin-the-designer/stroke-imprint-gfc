let serialValues = [];
let img;
let canvas;
let section1a;
let section2a;
let section3a;
let section4a;
let section1h = 0.05;
let section2h = 0.05;
let section3h = 0.05;
let section4h = 0.05;
let section1Progress = 0;
let section2Progress = 0;
let section3Progress = 0;
let section4Progress = 0;

function preload() {
  img = loadImage("/assets/hand.png");
}

function setup() {
  noStroke();
  angleMode(DEGREES);

  // Get parent size
  const parent = document.getElementById("p5-canvas");
  const w = parent.offsetWidth;
  const h = parent.offsetHeight;

  canvas = createCanvas(w, h);
  canvas.parent("p5-canvas");
  setupArduino();
  img.resize(w, h); // resize after image is loaded
}

function windowResized() {
  const parent = document.getElementById("p5-canvas");
  const w = parent.offsetWidth;
  const h = parent.offsetHeight;
  resizeCanvas(w, h);
  img.resize(w, h);
}

function draw() {
  if (typeof port !== "undefined" && port.opened()) {
    let data = port.readUntil("\n");
    if (data) {
      // Expecting something like "204,179,236,84"
      let values = data.trim().split(",").map(Number);
      if (values.length >= 1) {
        serialValues = values;
      }
    }
  }
  image(img, 0, 0, width, height); // This will scale the image to fit the canvas smoothly
  //sensingResult();

  drawSection1();
  drawSection2();
  drawSection3();
  drawSection4();
  // circle(width * 0.37, height * 0.48, width * 0.05);
  // circle(width * 0.45, height * 0.5, width * 0.05);
  // circle(width * 0.56, height * 0.53, width * 0.05);
  // circle(width * 0.67, height * 0.57, width * 0.05);
}

function sensingResult() {
  if (serialValues[0] < 50) {
    fill(158, 17, 23);
    circle(width / 2, height / 2, width / 20);
  }
}

function drawSection1() {
  let inRegion =
    width * 0.345 < mouseX &&
    mouseX < width * 0.395 &&
    height * 0.465 < mouseY &&
    mouseY < height * 0.6;

  if (inRegion) {
    section1Progress += 0.05;
    let rectHeight = lerp(height * 0.05, height * 0.12, section1Progress);
    gradientRectRounded(
      width * 0.345,
      height * 0.465,
      width * 0.05,
      rectHeight,
      158,
      17,
      23,
      width * 0.025
    );
  } else {
    section1Progress = 0;
  }
  section1Progress = constrain(section1Progress, 0, 1);
}

function drawSection2() {
  let inRegion =
    width * 0.425 < mouseX &&
    mouseX < width * 0.475 &&
    height * 0.5 < mouseY &&
    mouseY < height * 0.7;

  if (inRegion) {
    section2Progress += 0.05;
    let rectHeight = lerp(height * 0.05, height * 0.12, section2Progress);
    let cx = width * 0.425 + (width * 0.05) / 2;
    let topY = height * 0.47;
    push();
    translate(cx, topY);
    rotate(3);
    gradientRectRounded(
      (-width * 0.05) / 2,
      0,
      width * 0.05,
      rectHeight,
      158,
      17,
      23,
      width * 0.025
    );
    pop();
  } else {
    section2Progress = 0;
  }
  section2Progress = constrain(section2Progress, 0, 1);
}

function drawSection3() {
  let inRegion =
    width * 0.535 < mouseX &&
    mouseX < width * 0.585 &&
    height * 0.5 < mouseY &&
    mouseY < height * 0.7;

  if (inRegion) {
    section3Progress += 0.05;
    let rectHeight = lerp(height * 0.05, height * 0.13, section3Progress);
    let cx = width * 0.545 + (width * 0.05) / 2;
    let topY = height * 0.5;
    push();
    translate(cx, topY);
    rotate(14);
    gradientRectRounded(
      (-width * 0.05) / 2,
      0,
      width * 0.05,
      rectHeight,
      158,
      17,
      23,
      width * 0.025
    );
    pop();
  } else {
    section3Progress = 0;
  }
  section3Progress = constrain(section3Progress, 0, 1);
}

function drawSection4() {
  let inRegion =
    width * 0.645 < mouseX &&
    mouseX < width * 0.695 &&
    height * 0.54 < mouseY &&
    mouseY < height * 0.74;

  if (inRegion) {
    section4Progress += 0.05;
    let rectHeight = lerp(height * 0.05, height * 0.13, section4Progress);
    let cx = width * 0.665 + (width * 0.05) / 2;
    let topY = height * 0.56;
    push();
    translate(cx, topY);
    rotate(24);
    gradientRectRounded(
      (-width * 0.05) / 2,
      0,
      width * 0.05,
      rectHeight,
      158,
      17,
      23,
      width * 0.025
    );
    pop();
  } else {
    section4Progress = 0;
  }
  section4Progress = constrain(section4Progress, 0, 1);
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
