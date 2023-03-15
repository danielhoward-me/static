const ctx = canvas.getContext('2d');

let scale = 0.5;
let gridLineFrequency = 50;
const topLeftPoint = [
	scale * -canvas.width/2,
	scale * canvas.height/2
];

const normalGridLineColour = 'rgba(0, 0, 0, 0.2)';
const majorGridLineColour = 'rgba(0, 0, 0, 0.5)';

function drawFrame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const firstGridLineValueX = Math.ceil(topLeftPoint[0] / gridLineFrequency) * gridLineFrequency;
	for (let value = firstGridLineValueX; value < topLeftPoint[0] + (canvas.width * scale); value += gridLineFrequency) {
		ctx.beginPath();
		ctx.moveTo(...convertGraphPointToCanvasPoint([value, topLeftPoint[1]]));
		ctx.lineTo(...convertGraphPointToCanvasPoint([value, topLeftPoint[1] - (canvas.height * scale)]));

		if (value === 0) {
			ctx.strokeStyle = majorGridLineColour;
		} else {
			ctx.strokeStyle = normalGridLineColour;
		}

		ctx.stroke();
	}

	const firstGridLineValueY = Math.ceil(topLeftPoint[1] / gridLineFrequency) * gridLineFrequency;
	for (let value = firstGridLineValueY; value > topLeftPoint[1] - (canvas.height * scale); value -= gridLineFrequency) {
		ctx.beginPath();
		ctx.moveTo(...convertGraphPointToCanvasPoint([topLeftPoint[0], value]));
		ctx.lineTo(...convertGraphPointToCanvasPoint([topLeftPoint[0] + (canvas.width * scale), value]));

		if (value === 0) {
			ctx.strokeStyle = majorGridLineColour;
		} else {
			ctx.strokeStyle = normalGridLineColour;
		}

		ctx.stroke();
	}

	window.requestAnimationFrame(drawFrame);
}
window.requestAnimationFrame(drawFrame);

function convertGraphPointToCanvasPoint(graphPoint) {
	return [
		(graphPoint[0] - topLeftPoint[0])/scale,
		-(graphPoint[1] - topLeftPoint[1])/scale,
	];
}

let mousedown = false;
function handleMouseDrag(event) {
	if (!mousedown) return;

	topLeftPoint[0] -= event.movementX * scale;
	topLeftPoint[1] += event.movementY * scale;
}
window.addEventListener('mousemove', handleMouseDrag);
window.addEventListener('mousedown', () => mousedown = true);
window.addEventListener('mouseup', () => mousedown = false);

function handleTouchDrag(event) {
	if (event.touches.length !== 1) return;

	const touch = event.touches[0];
	const lastTouch = touch.target.lastTouch;

	if (lastTouch) {
		const movementX = touch.clientX - lastTouch.clientX;
		const movementY = touch.clientY - lastTouch.clientY;

		// The last touch could be from a touch from a while ago
		if (Math.abs(movementX) > 100 || Math.abs(movementY) > 100) {
			touch.target.lastTouch = touch;
			return;
		}

		topLeftPoint[0] -= (touch.clientX - lastTouch.clientX) * scale;
		topLeftPoint[1] += (touch.clientY - lastTouch.clientY) * scale;
	}

	touch.target.lastTouch = touch;
}
window.addEventListener('touchmove', handleTouchDrag);

function handleZoom(event) {
	event.preventDefault();

	scale *= 1 + (event.deltaY / 100);

	if (scale < 0.01) {
		scale = 0.01;
	} else if (scale > 10) {
		scale = 10;
	}
}
window.addEventListener('wheel', handleZoom, {passive: false});
