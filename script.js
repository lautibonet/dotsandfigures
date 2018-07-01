var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext('2d');

var startX;
var startY;
var dots = [];
var fourthDot = {};
const arcDiameter = 11;
var selectedDot = -1;

function init() {
    
    canvas.width = document.body.clientWidth; 
    canvas.height = document.body.clientHeight; 
    canvasW = canvas.width;
    canvasH = canvas.height;

   //  ctx.textBaseline = 'middle';
  	// ctx.textAlign = "center";

    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseout", onMouseOut);
    canvas.addEventListener("mousemove", onMouseMove);
	canvas.addEventListener("mouseover", onMouseOver);
}

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearDots(){
	dots = [];
	clearCanvas();
}

function drawDot(x, y){
	ctx.strokeStyle="#FF0000";

	ctx.beginPath();
	ctx.arc(x,y, arcDiameter/2, 0, 2*Math.PI);
	ctx.stroke();

	// PRINT COORDINATES
	ctx.fillText("x:"+x+"; y:"+y, x+(arcDiameter/2), y);
}

function redrawDots(){
	clearCanvas();
	for(let i = 0; i<dots.length;i++){
		drawDot(dots[i].x, dots[i].y);
	}
	if(dots.length == 3){
		drawFigures();
	}
}

function dotHitTest(x, y, dotIndex) {
    var dot = dots[dotIndex];
    return (x >= (dot.x - arcDiameter/2) && x <= (dot.x + arcDiameter/2) && y >= (dot.y - arcDiameter/2) && y <= (dot.y + arcDiameter/2));
}

function onMouseDown(e) {
	e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;

    for (var i = 0; i < dots.length; i++) {
        if (dotHitTest(startX, startY, i)) {
            selectedDot = i;
            return;
        }
    }

    dots.push({x: e.clientX, y: e.clientY});

	if(dots.length <= 3){
		drawDot(e.clientX, e.clientY);
		if(dots.length == 3){
			drawFigures();
		}
	} else {
		dots.shift();
		redrawDots();
	}
}

function onMouseOut(e) {
    e.preventDefault();
    selectedDot = -1;
    redrawDots();
}

function onMouseUp(e){
	e.preventDefault();
    selectedDot = -1;
    redrawDots();
}

function onMouseMove(e) {
    if (selectedDot < 0) {
        return;
    }
    
    mouseX = e.clientX;
    mouseY = e.clientY;

    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;

    var dot = dots[selectedDot];
    dot.x += dx;
    dot.y += dy;
    dots[selectedDot] = dot;
    redrawDots();
}

function onMouseOver(e){
	e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
    for (var i = 0; i < dots.length; i++) {
        if (dotHitTest(startX, startY, i)) {
            canvas.style.cursor = "pointer;"
            return;
        }
    }
}

function drawFigures(){
	drawParallelogram();
	drawCircle();
}

function drawParallelogram(){

	fourthDot.x = dots[0].x + (dots[2].x - dots[1].x);
	fourthDot.y = dots[0].y + (dots[2].y - dots[1].y);

	ctx.strokeStyle="#0000FF";

	ctx.beginPath();
	ctx.moveTo(dots[0].x, dots[0].y);
	ctx.lineTo(dots[1].x, dots[1].y);
	ctx.stroke();

	ctx.moveTo(dots[1].x, dots[1].y);
	ctx.lineTo(dots[2].x, dots[2].y);
	ctx.stroke();

	ctx.moveTo(dots[2].x, dots[2].y);
	ctx.lineTo(fourthDot.x, fourthDot.y);
	ctx.stroke();

	ctx.moveTo(fourthDot.x, fourthDot.y);
	ctx.lineTo(dots[0].x, dots[0].y);
	ctx.stroke();

}

function drawCircle(){

	var centerX = Math.abs((dots[2].x - dots[0].x)/2) + Math.min(dots[0].x, dots[2].x);
	var centerY = Math.abs((dots[2].y - dots[0].y)/2) + Math.min(dots[0].y, dots[2].y);

	var a = (dots[2].y - dots[1].y)/(dots[2].x - dots[1].x);
	var b = -1;
	var c = -((a*dots[2].x) - dots[2].y);

	var h = Math.abs(a*dots[0].x + b * dots[0].y + c)/(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
	var B = Math.sqrt(Math.pow(dots[1].y - dots[2].y, 2) + Math.pow(dots[1].x - dots[2].x, 2));

	var area = h * B;

	ctx.strokeStyle="#FFFF00";

	ctx.beginPath();
	ctx.arc(centerX,centerY, Math.sqrt(area/Math.PI), 0, 2*Math.PI);
	ctx.stroke();


	// PRINT AREA
	var areaText = "Area = "+Math.floor(area)+"px";
	var textWidth = ctx.measureText(areaText).width;
	ctx.fillText(areaText, centerX-(textWidth/2), centerY);

}


init();


/* ABOUT FUNCTIONS */
var modal = document.getElementById('modal');
var btnAbount = document.getElementById("aboutBtn");
var close = document.getElementById("close");

btnAbount.onclick = function() {
    modal.style.display = "block";
}

close.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
