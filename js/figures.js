
export class Point {
    constructor(_x, _y, _diameter = 0) {
        this.x = _x;
        this.y = _y;
        this.diameter = _diameter
    }
}

export class PointsArray {
    constructor() {
        this.points = [];
    }

    add(point) {
        this.points.push(point);
    }

    get(index) {
        return this.points[index];
    }

    getAll() {
        return this.points;
    }

    size() {
        return this.points.length;
    }

    contains(point) {
        return this.points.find(p => p.x == point.x && p.y == point.y) !== undefined;
    }

    getIndex(point) {
        for (const [i, p] of this.points.entries()) {
            if (p.x == point.x && p.y == point.y) return i;
        }
        return null;
    }

    getByCoords(x, y) {
        if (!this.points) return null;

        for (const p of this.points) {
            if (
                x >= (p.x - p.diameter) &&
                x <= (p.x + p.diameter) &&
                y >= (p.y - p.diameter) &&
                y <= (p.y + p.diameter)
            ) {
                return p;
            }
        }

        return null;
    }
}

export class Parallelogram {
    constructor(_p0, _p1, _p2, _color) {
        this.p0 = _p0;
        this.p1 = _p1;
        this.p2 = _p2;
        this.color = _color;
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;

        let fourthPoint = new Point();
        fourthPoint.x = this.p0.x + (this.p2.x - this.p1.x);
        fourthPoint.y = this.p0.y + (this.p2.y - this.p1.y);

        ctx.beginPath();
        ctx.moveTo(this.p0.x, this.p0.y);
        ctx.lineTo(this.p1.x, this.p1.y);
        ctx.stroke();

        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();

        ctx.moveTo(this.p2.x, this.p2.y);
        ctx.lineTo(fourthPoint.x, fourthPoint.y);
        ctx.stroke();

        ctx.moveTo(fourthPoint.x, fourthPoint.y);
        ctx.lineTo(this.p0.x, this.p0.y);
        ctx.stroke();
    }

    calculateArea() {
        let p = this.p0;
        let v = this.p1;
        let w = this.p2;

        // AVOIDING DIVIDING BY ZERO
        if (w.x == v.x) {
            let aux = w;
            w = p;
            p = aux;
        }

        /* 
        a, b, c: 
        COEFFICIENTS OF THE GENERAL FORM OF A LINE EQUATION
        OBTAINED FROM THE CANONICAL EQUATION
        */
        let a = (w.y - v.y) / (w.x - v.x);
        let b = -1;
        let c = -((a * w.x) - w.y);

        let h = Math.abs(a * p.x + b * p.y + c) / (Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
        let B = Math.sqrt(Math.pow(v.y - w.y, 2) + Math.pow(v.x - w.x, 2));

        return (h * B);
    }

    GetCenterOfMass() {
        const centerX = Math.abs((this.p2.x - this.p0.x) / 2) + Math.min(this.p0.x, this.p2.x);
        const centerY = Math.abs((this.p2.y - this.p0.y) / 2) + Math.min(this.p0.y, this.p2.y);
        return new Point(centerX, centerY);
    }
}

export class Circle {
    constructor(_p, _r, _color) {
        this.x = _p.x;
        this.y = _p.y;
        this.r = _r;
        this.color = _color;
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
    }
}