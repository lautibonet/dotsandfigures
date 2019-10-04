import CanvasDisplay from './js/canvas-display.js';
import { Point, PointsArray, Parallelogram, Circle } from './js/figures.js';
import { AppInfo } from './js/info.js';

const CONFIG = {
    canvasFont: "20px Lora",
    pointDiameter: 11,
    pointColor: "#FF0000",
    circleColor: "#FFFF00",
    parallelogramColor: "#0000FF"
};
const OPEN_APP_INFO = document.getElementById("aboutBtn");
const CLOSE_APP_INFO = document.getElementById("close-app-info");
const CANVAS_DISPLAY = new CanvasDisplay('mainCanvas');
const APP_INFO = new AppInfo();
var POINTS = new PointsArray();
var SELECTED_POINT;
var PARALLELOGRAM;
var CIRCLE;


function drawPoint(point) {
    let pointCircle = new Circle(point, CONFIG.pointDiameter / 2, CONFIG.pointColor);

    CANVAS_DISPLAY.drawFigure(pointCircle);
    CANVAS_DISPLAY.write("P" + POINTS.getIndex(point), CONFIG.canvasFont, point.x, point.y);
}

function drawFigures() {
    PARALLELOGRAM = new Parallelogram(POINTS.get(0), POINTS.get(1), POINTS.get(2), CONFIG.parallelogramColor);
    // PARALLELOGRAM AREA
    let area = PARALLELOGRAM.calculateArea();
    // PARALLELOGRAM CENTER OF MASS
    let center = PARALLELOGRAM.GetCenterOfMass();

    CIRCLE = new Circle(center, Math.sqrt(area / Math.PI), CONFIG.circleColor);

    CANVAS_DISPLAY.drawFigure(PARALLELOGRAM);
    CANVAS_DISPLAY.drawFigure(CIRCLE);
}

function redrawCanvas() {
    CANVAS_DISPLAY.clear();
    for (const p of POINTS.getAll()) {
        drawPoint(p);
    }
    drawFigures();
    updateCoordsTextBox();
}

function resizeCanvas() {
    CANVAS_DISPLAY.canvas.width = document.body.clientWidth;
    CANVAS_DISPLAY.canvas.height = document.body.clientHeight;
    // resize containers
    APP_INFO.updateResize();
    redrawCanvas();
}



/* ===================== 
    EVENT CALLBACKS 
*/

function onMouseDown(e, eventType) {
    e.preventDefault();
    let mouseCoords = CANVAS_DISPLAY.getMouseCoords(e, eventType);

    SELECTED_POINT = POINTS.getByCoords(mouseCoords.x, mouseCoords.y);

    if (SELECTED_POINT) return;

    mainTitle.style.display = "none";

    if (POINTS.size() < 3) {
        let point = new Point(mouseCoords.x, mouseCoords.y, CONFIG.pointDiameter);
        POINTS.add(point);

        drawPoint(point);
        if (POINTS.size() == 3) drawFigures();
        updateCoordsTextBox();
    }
}

function onMouseMove(e, eventType) {
    // POINTER CURSOR
    let mouseCoords = CANVAS_DISPLAY.getMouseCoords(e, eventType);

    if (POINTS.getByCoords(mouseCoords.x, mouseCoords.y)) {
        CANVAS_DISPLAY.setCursor("pointer");
    } else {
        CANVAS_DISPLAY.setCursor("auto");
    }

    if (!SELECTED_POINT) {
        return;
    }

    SELECTED_POINT.x += (mouseCoords.x - SELECTED_POINT.x);
    SELECTED_POINT.y += (mouseCoords.y - SELECTED_POINT.y);

    redrawCanvas();
}

function onMouseOut(e) {
    e.preventDefault();
    SELECTED_POINT = null;
}

function onMouseUp(e) {
    e.preventDefault();
    SELECTED_POINT = null;
}


/* =====================
    COORDS TEXT BOXES
*/

function updateCoordsTextBox() {
    let element;
    // update coords
    for (const [i, p] of POINTS.getAll().entries()) {
        element = document.getElementById('point-' + i);
        element.getElementsByClassName("x-coord")[0].textContent = parseInt(p.x);
        element.getElementsByClassName("y-coord")[0].textContent = parseInt(p.y);
        element.classList.add('active');
    }

    // update area
    if (POINTS.size() < 3 || !PARALLELOGRAM) return;
    element = document.getElementById("area-info");
    element.getElementsByClassName("area")[0].textContent = Math.floor(PARALLELOGRAM.calculateArea()) + "px";
    element.classList.add('active');
}

function resetCoordsTextBox() {
    let element;
    // reset coords
    for (let i = 0; i < 3; i++) {
        element = document.getElementById('point-' + i);
        element.classList.remove('active');
    }
    // reset area
    element = document.getElementById("area-info");
    element.classList.remove('active');
}



/* =====================
    DECLARE EVENT LISTENERS
*/

CANVAS_DISPLAY.addListener("mousedown", function (e) { onMouseDown(e, "mousedown"); });
CANVAS_DISPLAY.addListener("touchstart", function (e) { onMouseDown(e, "touchstart"); });
CANVAS_DISPLAY.addListener("mousemove", function (e) { onMouseMove(e, "mousemove"); });
CANVAS_DISPLAY.addListener("touchmove", function (e) { onMouseMove(e, "touchmove"); });
CANVAS_DISPLAY.addListener("mouseout", onMouseOut);
CANVAS_DISPLAY.addListener("mouseup", onMouseUp);
CANVAS_DISPLAY.addListener("touchend", onMouseUp);

OPEN_APP_INFO.addEventListener("click", () => APP_INFO.toggleAppInfo());
CLOSE_APP_INFO.addEventListener("click", () => APP_INFO.toggleAppInfo());

document.getElementById("resetBtn").addEventListener("click", () => {
    POINTS = new PointsArray();
    CANVAS_DISPLAY.clear();
    resetCoordsTextBox();
    mainTitle.style.display = "block";
});

window.addEventListener("resize", resizeCanvas);