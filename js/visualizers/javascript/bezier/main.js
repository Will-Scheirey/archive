var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var w = canvas.width;
var h = canvas.height;
var center_w = w / 2;
var center_h = h / 2;
var ctx = canvas.getContext("2d");

function draw_circle(x, y, r, c, filled) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (filled) {
        ctx.fillStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
        ctx.fill();
    }
    else {
        ctx.strokeStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
        ctx.stroke();
    }
}

function draw_line(x, y, x1, y1, c) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
    ctx.stroke();
}

function clear() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function random_int(min, max) {
    return Math.round(Math.random() * (max-min) + min);
}

class Point {
    constructor(speed, direction, c, parent1, parent2, last) {
        this.speed = speed;
        this.direction = direction;        
        if (this.direction == 1){
            this.parent1 = parent1;
            this.parent2 = parent2;
        }
        else {
            this.parent1 = parent2;
            this.parent2 = parent1;
        }
        this.c = c;
        this.points = [];
        this.i = 0;
        this.last = last;
    }

    draw() {
        draw_line(this.start_x, this.start_y, this.end_x, this.end_y, [this.c[0]/5, this.c[1]/5, this.c[2]/5]);

        if (this.parent1) {
            var x_distance = this.end_x - this.start_x;
            var y_distance = this.end_y - this.start_y;

            var x = this.start_x + x_distance * this.i;
            var y = this.start_y + y_distance * this.i;
        }
        else {
            var x = this.start_x + this.i * this.l_x;
            var y = this.start_y + this.i * this.l_y;
        }        

        this.points.push([x,y]);
        this.x = x;
        this.y = y;
        draw_circle(x, y, 4, this.c, 1);

        if (this.last) {
            for (var point = 5; point < this.points.length; point += 5) {
                draw_circle(this.points[point][0], this.points[point][1], 1, this.c, 1);
            }
        }
    }

    update() {
        this.i += this.speed;
        if (this.parent1) {
            this.start_x = this.parent1.x;
            this.end_x = this.parent2.x;

            this.start_y = this.parent1.y;
            this.end_y = this.parent2.y;
        }
        if(this.i > 1) {
            this.i = 0;
            this.points = [];
        }
    }
}

class StaticPoint {
    constructor(start_x, start_y, end_x, end_y, x_direction, y_direction, speed, c) {
        this.start_x = start_x;
        this.start_y = start_y;
        this.end_x = end_x;
        this.end_y = end_y;
        this.l_x = end_x - start_x;
        this.l_y = end_y - start_y;
        this.speed = speed;
        if (x_direction == -1) {
            this.start_x = end_x;
            this.end_x = start_x;
        }
        if (y_direction == -1) {
            this.start_y = end_y;
            this.end_y = start_y;
        }
        this.x_direction = x_direction;
        this.y_direction = y_direction;
        this.c = c;
        this.points = [];
        this.i = 0;
    }

    draw() {
        draw_line(this.start_x, this.start_y, this.end_x, this.end_y, [this.c[0]/5, this.c[1]/5, this.c[2]/5]);
        var x = this.start_x + (this.i * this.l_x) * this.x_direction;
        var y = this.start_y + (this.i * this.l_y) * this.y_direction;

        this.points.push([x,y]);
        this.x = x;
        this.y = y;
        draw_circle(x, y, 4, this.c, 1);
    }

    update() {
        this.i += this.speed;
        if (this.parent1) {
            this.start_x = this.parent1.x;
            this.end_x = this.parent2.x;

            this.start_y = this.parent1.y;
            this.end_y = this.parent2.y;
        }
        if(this.i > 1) {
            this.i = 0;
            this.points = [];
        }
    }
}

speed = 0.001;
var i = 0;
l1 = 400;
l2 = 100;
//pairs = [];
//pairs.push( new Control_Pair(200, 200, center_w, center_h, 0.003));

points = [];

colors = [[255, 0, 0], [255, 70, 0], [255, 255, 0], [0, 255, 60], [150, 200, 255], [20, 20, 150], [175, 0, 255]];


static_length = random_int(10, 50);
if (static_length % 2) static_length++;


function add(len, min_i, max_i, first, iter) {
    if (first)
    {
        var limits = [4, 8, 16, 32, 64, 128, 512, 1024, 2048];
        limit = limits[random_int(0, 8)];
    }
    else {
        var limit = len/2;
    }

    if (limit <= 1) {
        var dir = Math.random() < 0.5 ? -1 : 1;
        points.push(new Point(speed, dir, [255, 255, 255], points[points.length-2], points[points.length-1], true));
        return;
    }

    for (var i = min_i; i < max_i; i++) {
        var dir = Math.random() < 0.5 ? -1 : 1;
        points.push(new Point(speed, dir, colors[iter], points[i - 1], points[i], false));
    }
    add(limit/2, max_i + 2, max_i + limit/2, false, iter + 1);
}
for (var i = 0; i < static_length; i++) {
    var x_dir = Math.random() < 0.5 ? -1 : 1;
    var y_dir = Math.random() < 0.5 ? -1 : 1;
    points.push(new StaticPoint(random_int(0, w), random_int(0, h), random_int(0, w), random_int(0, h), x_dir, y_dir, speed, [255, 0, 0]));
}

add(points.length, 1, points.length, true, 1);




/*
points.push(new Point(center_w + 100, center_h + 100, center_w - 100, center_h + 100, speed, -1, 1, [255, 100, 100], false, true));

points.push(new Point(center_w + 100, center_h - 100, center_w + 100, center_h + 100, speed, 1, -1, [255, 100, 100], false, true));

points.push(new Point(center_w - 100, center_h - 100, center_w - 100, center_h + 100, speed, 1, 1, [255, 100, 100], false, true));


points.push(new Point(0, 0, 0, 0, speed, 1, -1, [0, 60, 255], true, false, points[0], points[1]));
points.push(new Point(0, 0, 0, 0, speed, 1, -1, [0, 60, 255], true, false, points[0], points[2]));

points.push(new Point(0, 0, 0, 0, speed, 1, -1, [0, 255, 60], true, false, points[4], points[3], true));
*/

/*
//STATIC
points.push(new StaticPoint(center_w + 100, center_h + 100, center_w - 100, center_h + 100, 1, 1, speed, [255, 100, 100])); // BOTTOM

points.push(new StaticPoint(center_w + 100, center_h - 100, center_w + 100, center_h + 100, 1, -1, speed, [255, 100, 100])); // RIGHT VERTICAL

points.push(new StaticPoint(center_w - 100, center_h - 100, center_w - 100, center_h + 100, 1, 1, speed, [255, 100, 100])); // LEFT VERTICAL

points.push(new StaticPoint(center_w - 100, center_h - 100, center_w - 200, center_h + 200, 1, 1, speed, [255, 100, 100])); // LEFT DIAGONAL

points.push(new StaticPoint(center_w - 200, center_h + 200, center_w + 200, center_h + 100, 1, 1, speed, [255, 100, 100])); // BOTTOM DIAGONAL

points.push(new StaticPoint(center_w + 100, center_h - 100, center_w + 200, center_h + 200, 1, 1, speed, [255, 100, 100])); // RIGHT DIAGONAL

//BLUE
points.push(new Point(speed, -1, [0, 60, 255], points[0], points[3]));
points.push(new Point(speed, 1, [0, 60, 255], points[2], points[3]));

points.push(new Point(speed, 1, [0, 60, 255], points[0], points[1]));
points.push(new Point(speed, -1, [0, 60, 255], points[0], points[2]));

points.push(new Point(speed, 1, [0, 60, 255], points[0], points[4]));
points.push(new Point(speed, 1, [0, 60, 255], points[1], points[4]));

points.push(new Point(speed, 1, [0, 60, 255], points[4], points[5]));
points.push(new Point(speed, -1, [0, 60, 255], points[1], points[5]));

//GREEN
points.push(new Point(speed, -1, [0, 255, 60], points[6], points[7]));
points.push(new Point(speed, 1, [0, 255, 60], points[8], points[9]));

points.push(new Point(speed, 1, [0, 255, 60], points[10], points[11]));
points.push(new Point(speed, 1, [0, 255, 60], points[12], points[13]));

//YELLOW
points.push(new Point(speed, -1, [255, 255, 60], points[14], points[15]));
points.push(new Point(speed, 1, [255, 255, 60], points[16], points[17]));

//WHITE
points.push(new Point(speed, 1, [255, 255, 255], points[18], points[19], true));
*/


/*
var encoder = new GIFEncoder();
encoder.setRepeat(1/speed);
encoder.setDelay(1);
encoder.start();
*/

var i = 0;
var loop = setInterval(function() {
    clear();

    for (point in points) {
        points[point].update();
        points[point].draw();
    }
    i += speed;

    //encoder.addFrame(ctx);
    if (i > 1) {
        //encoder.finish();
        //encoder.download("download.gif");
    }
}, 1);


