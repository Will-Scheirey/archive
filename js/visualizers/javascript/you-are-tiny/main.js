var scale = 3;
var dist_scale = 5000;
function draw_pill(x,y, size) {
    draw_pie(x, y-size, size, [255, 255, 255], 180, 180, true);

    draw_rect(x-size, y-size, size*2, size*2+1, [255, 255, 255], true);

    draw_pie(x, y+size, size, [255, 255, 255], 180, 0, true);
}

class Body {
    constructor(x, y, vel_x, vel_y, r, m, c, type) {
        this.x = x;
        this.y = y;
        this.initial_x = x;
        this.initial_y = y;
        this.vel_x = vel_x;
        this.vel_y = vel_y;
        this.initial_vel_x = vel_x;
        this.initial_vel_y = vel_y;
        this.r = r;
        this.m = m;
        this.c = c;
        this.points = [];
        this.type = type;
    }

    draw() {
        if (this.type == "circle") {
            draw_circle(center_w + this.x*scale, center_h + this.y*scale, this.r * scale, this.c, true);
        }
        else if (this.type == "pill") {
            draw_pill(center_w + this.x*scale, center_h + this.y*scale, this.r * scale)
        }
        
    }

    update() {
        this.x -= this.vel_x / dist_scale;
        this.y -= this.vel_y / dist_scale;
        this.points.push([this.x, this.y]);
    }

    calc_vel(bodies) {
        for (var body_num in bodies) {
            var body = bodies[body_num];
            var x_distance = (this.x - body.x) * dist_scale;
            var y_distance = (this.y - body.y) * dist_scale;
            var distance = Math.sqrt(x_distance ** 2 + y_distance ** 2);
            if (distance) {
                var f_grav = (this.m * body.m) / distance ** 2;
                var acceleration = f_grav / this.m;

                var i = acceleration / distance;

                this.vel_x += x_distance * i;
                this.vel_y += y_distance * i;
            }
            if (this.type == "pill" && body.type == "circle") {
                if (distance - body.r*dist_scale - this.r*dist_scale*2<= -0) {
                    this.vel_y *= -0.5;
                }
            }
        }
    }
}

var update = true;

document.body.onkeydown = function(e){
    if(e.keyCode == 32){
        update = !update;
    }
}
clear();

var bodies = [];
bodies.push(new Body(0, 0, 0, 2*dist_scale, 6, 100, [255, 255, 255], "pill"));
bodies.push(new Body(0, 40000090, 0, 0, 40000000, 5.972e+24, [20, 150, 50], "circle"));
bodies.push(new Body(-1 * 432690e+4 - 40000090*3, 0, 0, 0, 432690e+4, 0.0001, [255, 255, 0], "circle"));
bodies.push(new Body(-1 * 432690e+4*1700 -  432690e+4*3 - 40000090*3, 0, 0, 0, 432690e+4 * 1700, 0.0001, [255, 0, 0], "circle"));

function do_update() {
    clear();
    bodies.forEach(body => {
        body.calc_vel(bodies);
    })
    bodies.forEach(body => {
        body.update();
        body.draw();
    })
    scale *= 0.995;
    document.getElementById("scale").innerHTML = "scale: " + scale;
}

var loop = setInterval(function (){
    do_update();
}, 0);
