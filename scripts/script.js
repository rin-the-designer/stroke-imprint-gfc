let port;
let connectBtn;

// function loadWebSerial() {
//   const script = document.createElement("script");
//   script.src = "/libs/p5.webserial.js";
//   script.onload = () => {
//     setupArduino();
//   };
//   document.head.appendChild(script);
// }

function setupArduino() {
  port = createSerial();
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 115200);
  }
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open("MicroPython", 115200);
  } else {
    port.close();
  }
}

function keyPressed() {
  if (key === "c" || key === "C") {
    connectBtnClick();
  }
}

loadWebSerial();
