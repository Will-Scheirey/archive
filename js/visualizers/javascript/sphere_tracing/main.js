var x = 20;
var y = 20;

function len(point1, point2) {
    return Math.sqrt((point2[0]-point1[0])**2 + (point2[1]-point1[1])**2);
}

class Shape {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    draw() {
        draw_circle(this.x, this.y, this.r, [50, 100, 200, 0.75], false);
    }

    distance(x, y) {
        return len([this.x, this.y], [x, y]) - this.r;
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
}

var circles = [];

var shapes = [];

for (var i = 0; i < random_int(5, 10); i++) {
    shapes.push(new Shape(random_int(50, w), random_int(50, h), random_int(10, 100)));
}
var r;

var t = 90;
var length = 1000;
var speed = 0.05;

var distances = [];
var points = []

var loop = setInterval(function (){
    clear()
    draw_circle(x, y, 5, [100, 200, 100], true);
    circles = []
    distances = []
    shapes.forEach(shape => {
        distances.push(shape.distance(x, y));
    });
    r = Math.min(...distances);
    circles.push(new Circle(x, y, r));
    while(r > 1 && r < 1000 && r != Infinity && r!= -Infinity)  {
        var last = circles[circles.length-1];
        var distances = [];
        shapes.forEach(shape => {
            distances.push(shape.distance(last.x + last.r*Math.cos(t*Math.PI/180), last.y + last.r*Math.sin(t*Math.PI/180)));
        });
        r = Math.min(...distances);
        if (r > 1 && r < 1000) circles.push(new Circle(last.x + last.r*Math.cos(t*Math.PI/180), last.y + last.r*Math.sin(t*Math.PI/180), r));
    }
    var last = circles[circles.length-1];
    draw_line(x, y, last.x + last.r*Math.cos(t*Math.PI/180), last.y + last.r*Math.sin(t*Math.PI/180), [100, 255, 100]);
    circles.forEach(circle => {
        draw_circle(circle.x, circle.y, circle.r, [255, 255, 255, 0.1], true);
        draw_circle(circle.x, circle.y, circle.r, [255, 255, 255, 0.5], false);
        draw_circle(circle.x, circle.y, 5, [255, 255, 255, 0.3], true);
    });
    shapes.forEach(shape => {
        shape.draw();
    })

    points.push([last.x + last.r*Math.cos(t*Math.PI/180), last.y + last.r*Math.sin(t*Math.PI/180), [100, 255, 100]]);
    points.forEach(point => {
        draw_circle(point[0], point[1], 0.5, [255, 255, 255, 0.7]);
    });

    t -= speed;
    if (t > 90 || t < 0) speed *= -1;
}, 0)