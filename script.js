var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext('2d');
var mainTitle = document.getElementById("mainTitle");

var _startX;
var _startY;
var _dots = [];
var _selectedDot = -1;
const _arcDiameter = 11;

// allows dot shifting if the user continues clicking the canvas after the shapes have been drawn.
// The systems redraws the shapes with the new point.
const _allowDotShifting = false;

function init() {

	// inits the canvas with the height and width of the client
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	canvasW = canvas.width;
	canvasH = canvas.height;

	canvas.addEventListener("mouseup", onMouseUp);
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mouseout", onMouseOut);
	canvas.addEventListener("mousemove", onMouseMove);
	window.addEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	canvasW = canvas.width;
	canvasH = canvas.height;
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearDots() {
	resetCoordsTextBox();
	_dots = [];
	clearCanvas();
	mainTitle.style.display = "block";
}

function drawDot(x, y, index) {
	ctx.strokeStyle = "#FF0000";

	ctx.beginPath();
	ctx.arc(x, y, _arcDiameter / 2, 0, 2 * Math.PI);
	ctx.stroke();

	// PRINT COORDINATES
	updateCoordsTextBox();
	ctx.font = "20px Lora";
	ctx.fillText("P" + index, x + _arcDiameter, y);
}

function updateCoordsTextBox() {
	let element;
	for (let i = 0; i < _dots.length; i++) {
		element = document.getElementById('point-' + i);
		element.getElementsByClassName("x-coord")[0].textContent = parseInt(_dots[i].x);
		element.getElementsByClassName("y-coord")[0].textContent = parseInt(_dots[i].y);
		element.classList.add('active');
	}
}

function resetCoordsTextBox() {
	let element;
	for (let i = 0; i < _dots.length; i++) {
		element = document.getElementById('point-' + i);
		element.classList.remove('active');
	}
}

function redrawDots() {
	clearCanvas();
	for (let i = 0; i < _dots.length; i++) {
		drawDot(_dots[i].x, _dots[i].y, i);
	}
	if (_dots.length == 3) {
		drawFigures();
	}
}

// checks if the user hit a dot when he clicked the canvas
function dotHitTest(x, y, dotIndex) {
	var dot = _dots[dotIndex];
	return (x >= (dot.x - _arcDiameter) && x <= (dot.x + _arcDiameter) && y >= (dot.y - _arcDiameter) && y <= (dot.y + _arcDiameter));
}

function drawFigures() {
	drawParallelogram();
	drawCircle();
}

function drawParallelogram() {

	if (_dots.length < 3) return;

	// calclulates the fourth point of the parallelogram
	let fourthDot = {};
	fourthDot.x = _dots[0].x + (_dots[2].x - _dots[1].x);
	fourthDot.y = _dots[0].y + (_dots[2].y - _dots[1].y);

	ctx.strokeStyle = "#0000FF";

	ctx.beginPath();
	ctx.moveTo(_dots[0].x, _dots[0].y);
	ctx.lineTo(_dots[1].x, _dots[1].y);
	ctx.stroke();

	ctx.moveTo(_dots[1].x, _dots[1].y);
	ctx.lineTo(_dots[2].x, _dots[2].y);
	ctx.stroke();

	ctx.moveTo(_dots[2].x, _dots[2].y);
	ctx.lineTo(fourthDot.x, fourthDot.y);
	ctx.stroke();

	ctx.moveTo(fourthDot.x, fourthDot.y);
	ctx.lineTo(_dots[0].x, _dots[0].y);
	ctx.stroke();

}

function drawCircle() {

	// CENTER OF MASS
	var centerX = Math.abs((_dots[2].x - _dots[0].x) / 2) + Math.min(_dots[0].x, _dots[2].x);
	var centerY = Math.abs((_dots[2].y - _dots[0].y) / 2) + Math.min(_dots[0].y, _dots[2].y);

	var area = calculateArea(_dots[0], _dots[1], _dots[2]);

	ctx.strokeStyle = "#FFFF00";
	ctx.beginPath();
	ctx.arc(centerX, centerY, Math.sqrt(area / Math.PI), 0, 2 * Math.PI);
	ctx.stroke();

	// PRINT AREA
	var areaText = "Area = " + Math.floor(area) + "px";
	var textWidth = ctx.measureText(areaText).width;
	ctx.fillText(areaText, centerX - (textWidth / 2), centerY);

}

function calculateArea(p, v, w) {
	// AVOIDING DIVIDING BY ZERO
	if (w.x == v.x) {
		var aux = w;
		w = p;
		p = aux;
	}

	/* 
	a, b, c: 
	COEFFICIENTS OF THE GENERAL FORM OF A LINE EQUATION
	OBTAINED FROM THE CANONICAL EQUATION
	*/
	var a = (w.y - v.y) / (w.x - v.x);
	var b = -1;
	var c = -((a * w.x) - w.y);

	var h = Math.abs(a * p.x + b * p.y + c) / (Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
	var B = Math.sqrt(Math.pow(v.y - w.y, 2) + Math.pow(v.x - w.x, 2));

	return (h * B);
}

function getMousePosInCanvas(e) {
	var b = canvas.getBoundingClientRect();
	return {
		x: e.clientX - b.left,
		y: e.clientY - b.top
	}
}

/* 
EVENT FUNCTIONS 
*/
function onMouseDown(e) {
	e.preventDefault();

	let pos = getMousePosInCanvas(e);
	_startX = pos.x;
	_startY = pos.y;

	for (var i = 0; i < _dots.length; i++) {
		if (dotHitTest(_startX, _startY, i)) {
			_selectedDot = i;
			return;
		}
	}

	mainTitle.style.display = "none";

	if (_dots.length < 3) {
		_dots.push({ x: _startX, y: _startY });
		drawDot(_startX, _startY, _dots.length - 1);
		if (_dots.length == 3) {
			drawFigures();
		}
	}
	else {
		if (_allowDotShifting) {
			_dots.push({ x: _startX, y: _startY });
			_dots.shift();
			redrawDots();
		}
	}
}

function onMouseOut(e) {
	e.preventDefault();
	_selectedDot = -1;
	redrawDots();
}

function onMouseUp(e) {
	e.preventDefault();
	_selectedDot = -1;
	redrawDots();
}

function onMouseMove(e) {
	// POINTER CURSOR
	var pos = getMousePosInCanvas(e);
	for (let i = 0; i < _dots.length; i++) {
		if (dotHitTest(pos.x, pos.y, i)) {
			canvas.style.cursor = "pointer";
			break;
		} else {
			canvas.style.cursor = "auto";
		}
	}

	if (_selectedDot == -1) {
		return;
	}

	var dx = pos.x - _startX;
	var dy = pos.y - _startY;
	_startX = pos.x;
	_startY = pos.y;

	var dot = _dots[_selectedDot];
	dot.x += dx;
	dot.y += dy;
	_dots[_selectedDot] = dot;
	redrawDots();
}

/* 
APP INITIALIZATION 
*/
init();


/* 
APP INFO
*/
var _menuShown = false;
var aboutBtn = document.getElementById("aboutBtn");
var appInfo = document.getElementById("app-info");
var closeAppInfo = document.getElementById("close-app-info");
var container = document.getElementById("container");

appInfo.style.transform = 'translateX(-' + appInfo.offsetWidth + 'px)';
container.style.transform = 'translateX(-' + appInfo.offsetWidth + 'px)';

aboutBtn.onclick = toggleAppInfo;
closeAppInfo.onclick = toggleAppInfo;

function toggleAppInfo() {
	if (_menuShown) {
		appInfo.style.transform = 'translateX(-' + appInfo.offsetWidth + 'px)';
		container.style.transform = 'translateX(-' + appInfo.offsetWidth + 'px)';
	} else {
		appInfo.style.transform = 'translateX(0)';
		container.style.transform = 'translateX(0)';
	}
	_menuShown = !_menuShown;
}

