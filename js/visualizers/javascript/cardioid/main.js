class Point {
    constructor(speed, direction, c, parent1, parent2) {
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
    }

    draw() {
        var div = 3;
        draw_line(this.start_x, this.start_y, this.end_x, this.end_y, [this.c[0]/div, this.c[1]/div, this.c[2]/div]);

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

        if (this.last) {
            draw_circle(x, y, 4, this.c, 1);
            //for (var point = 5; point < this.points.length; point++) {
            //    draw_circle(this.points[point][0], this.points[point][1], 1, this.c, 1);
            //}
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
            //this.points = [];
        }
    }
}

class Dot {
    constructor(t, r, speed, center_x, center_y) {
        this.t = t;
        this.r = r;
        this.center_x = center_x;
        this.center_y = center_y;
        this.x = center_x - this.r * Math.cos(this.t);
        this.y = center_y - this.r * Math.sin(this.t);
        this.speed = speed;
    }

    draw() {
        draw_circle(this.x, this.y, 3, [0, 255, 100], true);
    }

    update(speed) {
        this.t += this.speed;
        
        this.x = this.center_x - this.r * Math.cos(this.t);
        this.y = this.center_y - this.r * Math.sin(this.t);
    }
}

//points.push(new StaticPoint(lines[i][0][0], lines[i][0][1], lines[i][1][0], lines[i][1][1], 1, 1, speed, [255, Math.abs((255/lines.length)*i - 127.5), Math.abs(127.5 - (255/lines.length)*i)]));


r = Math.min(...[w, h])/2 - 75;

num_dots = 1000;

var points = [];
var dots = [];
var points1 = [];
var dots1 = [];
var update = true;
var update1 = true;
var power = 2;
var power1 = 1;

function reset(num) {
    if  (!isNaN(power)){
        var p = (Math.PI * 2)/num_dots;
        var center_x, center_y;
        center_x = center_w;
        if (num == 0) {
            dots = [];
            points = [];
            center_y = center_h;
            for (var i = 0; i < num_dots; i++) {
                var speed = (power >= 2) ? (i*(0.0001 + (0.00005*(power-2))**0.9)) : (i*(0.0001 - (0.000105*(power))))*-1;
                dots.push(new Dot(p*i, r, speed**power, center_x, center_y));
            }
            
            for (var i = 0; i < num_dots/2; i++) {
                points.push(new Point(0.01, 1, [255, 255, 255], dots[i], dots[i + num_dots/2]));
            }
            update = true;
        }
    }
    if(num != 0) {
        dots1 = [];
        points1 = [];
        center_y = h + center_h;
        for (var i = 0; i < num_dots; i++) {
            var speed = (power1 >= 2) ? (i*(0.0001 + (0.00005*(power1-2))**0.9)) : (i*(0.0001 - (0.000105*(power1))))*-1;
            dots1.push(new Dot(p*i, r, speed**power1, center_x, center_y));
        }
            
        for (var i = 0; i < num_dots/2; i++) {
            points1.push(new Point(0.01, 1, [255, 255, 255], dots1[i], dots1[i + num_dots/2]));
        }
    }
}

document.addEventListener("keydown", event => {
    if (event.keyCode == 80){
        update = !update;
        update1 = !update1;
    }
});

var stop = true;
var status = "running";
var resume = document.getElementById("resume");
document.getElementById("power").value = 2;
document.getElementsByClassName("power")[0].style = "top: " + (center_h + r + 20) + "px";

canvas.height *= 2;

var i = 100;

reset(0);
var loop = setInterval(function (){
    clear()
    if(update){
        //draw_circle(center_w, center_h, r, [50, 100, 255]);
        for (dot in dots) {
            dots[dot].update();
        }
        for (point in points) {
            points[point].update();
            points[point].draw();
        }

        status = "running";
        var close = Math.round(dots[dots.length/2-1].x) == Math.round(dots[0].x) && Math.round(dots[dots.length/2-1].y) == Math.round(dots[0].y);
        if (close && stop) {
            update = false;
            stop = false;
            resume.style = "display: block";
            status = "paused after full revolution"
        }
        else if (!close && !stop) {
            stop = true;
            resume.style = "display: none";
        }
    }

    if (update1) {
        power1 = i/100;
        reset(1);
        var iterations = Math.PI / dots1[dots1.length/2+1].speed
        for (dot in dots1) {
            dots1[dot].t += dots1[dot].speed*(iterations-1);
            dots1[dot].update();
        }
        for (point in points1) {
            points1[point].update();
        }
        if (i < 500) i+=0.01;
    }

    for (point in points1) {
        points1[point].draw()
        points[point].draw();
    }

    dots[dots.length/2+1].draw();

    ctx.font = "20px Roboto";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText("status: " + status, 10, 20);

    ctx.fillText("power: " + power1.toFixed(4), 10, h+40);
}, 5);
