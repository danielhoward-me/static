const $ = (id) => document.getElementById(id);

/** @type {HTMLCanvasElement} */
const canvas = $('canvas');

function resizeCanvas() {
  canvas.width = screen.width;
  canvas.height = screen.height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
