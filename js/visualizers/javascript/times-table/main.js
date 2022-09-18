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
        var x = this.start_x + (this.i * this.l_x) * this.x_direction;
        var y = this.start_y + (this.i * this.l_y) * this.y_direction;

        this.points.push([x,y]);
        this.x = x;
        this.y = y;
        draw_circle(x, y, 1, this.c, 1);
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

var speed = 0.001;

points = [];

colors = [[255, 0, 0], [255, 70, 0], [255, 255, 0], [0, 255, 60], [150, 200, 255], [20, 20, 150], [175, 0, 255]];

var update = false;
var increment = false;
var decrement = false;
var times;

document.addEventListener("keydown", event => {
    if (event.keyCode == 32) update = !update;
    if (event.keyCode == 39) increment = true;
    if (event.keyCode == 38) times++;
    if (event.keyCode == 37) decrement = true;
    if (event.keyCode == 40) times--;
});

document.addEventListener("keyup", event => {
    if (event.keyCode == 39) increment = false;
    if (event.keyCode == 37) decrement = false;
});

r = Math.min(...[w, h])/2 - 75;

num_dots = Math.min(...[8 * r, 2000]);
dots = [];

p = (Math.PI * 2)/num_dots;

for (var i = 0; i < num_dots; i++) {
    if (w > h){
        dots.push([center_w - r * Math.cos(p*i) - 1.1*r, center_h + r * Math.sin(p * i)]);
    }
    else {
        dots.push([center_w - r * Math.cos(p*i), center_h + r * Math.sin(p * i) - 1.1*r]);
    }
}

times = 2;

var lines= []

function draw() {
    for (var i = 0; i < lines.length; i+=6){
        if (w>h) {
            draw_line(lines[i][0][0] + 2.2*r, lines[i][0][1], lines[i][1][0] + 2.2*r, lines[i][1][1], [255, 255, 255])
        }
        else {
            draw_line(lines[i][0][0], lines[i][0][1] + 2.2*r, lines[i][1][0], lines[i][1][1] + 2.2*r, [255, 255, 255])
        }
    }
}

function gen () {
    last = dots[0];
    lines = [];
    points = [];
    
    for (var j = 0; j < num_dots; j++){
        var dot;
        for (var i = 0; i < num_dots; i++) {
            if (i == j * times % num_dots) {
                dot = dots[i];
            }
        }
        // draw_line(last[0], last[1], dot[0], dot[1], [255, 255, 255]);
        lines.push([last, dot]);
        last = dots[j % num_dots];
    }
    for (var i = 0; i < lines.length; i ++) {
        points.push(new StaticPoint(lines[i][0][0], lines[i][0][1], lines[i][1][0], lines[i][1][1], 1, 1, speed, [255, Math.abs((255/lines.length)*i - 127.5), Math.abs(127.5 - (255/lines.length)*i)]));
    }
}

gen()



var i = 0;
var loop = setInterval(function() {
    clear();

    for (point in points) {
        points[point].update();
        points[point].draw();
    }
    i += speed;
    draw();

    if (i > 1) {
        i = 0;
        times++;
        gen();
    }
}, 1);