
export default class CanvasDisplay {
    constructor(_elementId) {
        this.canvas = document.getElementById(_elementId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawFigure(figure) {
        figure.draw(this.ctx);
    }

    write(text, font, x, y) {
        this.ctx.font = font;
        this.ctx.fillText(text, x + 11, y);
    }

    getMouseCoords(e, eventType) {
        let eventRoot = (eventType.indexOf('mouse') != -1) ? 'mouse' : 'touch';
        let b = this.canvas.getBoundingClientRect();
        switch (eventRoot) {
            case 'mouse':
                return {
                    x: e.clientX - b.left,
                    y: e.clientY - b.top
                }
            case 'touch':
                return {
                    x: (e.targetTouches[0] ? e.targetTouches[0].pageX : e.changedTouches[e.changedTouches.length - 1].pageX) - b.left,
                    y: (e.targetTouches[0] ? e.targetTouches[0].pageY : e.changedTouches[e.changedTouches.length - 1].pageY) - b.top
                }
        }
    }

    addListener(event, callback) {
        this.canvas.addEventListener(event, callback);
    }

    setCursor(type) {
        this.canvas.style.cursor = type;
    }

}