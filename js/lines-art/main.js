function clear() {
    draw_rect(0, 0, w, h, [0, 0, 0], true);
}

clear();


class Circle {
    constructor(x, y, r, c, delay) {
        this.x = x;
        this.y = y;
        this.r = r * parseInt(document.getElementById("size-scale").value);
        this.c = c;
        this.speed = random_int(1, 100)/100;
        this.change = parseInt(document.getElementById("terminal-size-change").value)/500*r;
        this.t = -delay;
        this.t_change = 0.01;
        this.delay = delay;
    }

    update() {
        var x_dir = this.speed * Math.cos(this.t);
        var y_dir = this.speed * Math.sin(this.t);
 
        if (this.t+this.delay < 2*Math.PI) {
            if (this.t+this.delay > Math.PI-0.1) {
                this.r -= this.change;
            }
            this.t += this.t_change;
            this.x += x_dir;
            this.y += y_dir;
        }
    }
    
    draw() {
        if (this.r > 0.25) {
            draw_circle(this.x, this.y, this.r, this.c, true);
            draw_circle(this.x, this.y, this.r, [this.c[0], this.c[1], this.c[2], 0.2], false);
        }
    }
}

var loop;
var circles;
var colors;
const transparency = 0.1;

function generate() {
    if (displayMenu) toggleMenu();
    clearInterval(loop);
    clear();
    colors = [];
    for (let i = 0; i < 10000; i++) {
        colors.push([
            random_int(parseInt(document.getElementById("r-lower-limit").value), parseInt(document.getElementById("r-upper-limit").value)),
            random_int(parseInt(document.getElementById("g-lower-limit").value), parseInt(document.getElementById("g-upper-limit").value)),
            random_int(parseInt(document.getElementById("b-lower-limit").value), parseInt(document.getElementById("b-upper-limit").value)),
            transparency
        ])
    }
    
    circles = [];
    var variation = parseInt(document.getElementById("variation-slider").value);
    for (let i = 0; i < 1000; i++) {
        var r = random_int(parseInt(document.getElementById("size-lower-limit").value), parseInt(document.getElementById("size-upper-limit").value));
        c = colors[random_int(0, colors.length-1)];
        var x = random_int(center_w-random_int(-variation, variation), center_w+random_int(-variation, variation));
        var y = random_int(center_h-random_int(-variation, variation), center_h+random_int(-variation, variation));
        circles.push(new Circle(x, y, r, c, i));
    }
    
    var cont = true;
    var loop = setInterval(function (){
        //clear();
        for(var i = 0; i < 1; i++) {
            cont = false;
            circles.forEach(circle => {
                circle.update();
                circle.draw();
                if (circle.t+circle.delay < 2*Math.PI) cont = true;
                
            })
            if (!cont){
                clearInterval(loop);
            }
        }
        
    }, 0)
}



