var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;
var w = canvas.width;
var h = canvas.height;
var center_w = w / 2;
var center_h = h / 2;
var ctx = canvas.getContext("2d");
var G = 6.674e-11;
var dist_scale = 10000;
var calc;
var loop;
var stop = false;
var adding_body = false;
var update_bodies;
var show_trails = true;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Body {
    constructor(x, y, vel_x, vel_y, r, m, c) {
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
        this.selected = false;
        this.points = [];
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgb(" + this.c[0] + "," + this.c[1] + "," + this.c[2] + ")";
        ctx.stroke();
        if (this.selected) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            ctx.fillRect(this.x - this.r - 1, this.y - this.r - 1, this.r * 2 + 2, this.r * 2 + 2);

            if (!adding_body) {
                ctx.font = "15px Roboto";
                ctx.fillStyle = "rgb(" + this.c[0] + "," + this.c[1] + "," + this.c[2] + ")";
                ctx.fillText("x: " + Math.round(this.x), 5, 15);
                ctx.fillText("y: " + Math.round(this.y), 5, 30);
                ctx.fillText("x velocity: " + Math.round(this.vel_x), 5, 45);
                ctx.fillText("y velocity: " + Math.round(this.vel_y), 5, 60);
                ctx.fillText("radius: " + Math.round(this.r), 5, 75);
                ctx.fillText("mass: " + Math.round(this.m), 5, 90);


            }
        }
    }

    update(dist_scale) {
        this.x -= this.vel_x / 100 / dist_scale;
        this.y -= this.vel_y / 100 / dist_scale;
        this.points.push([this.x, this.y]);
    }

    calc_vel(bodies, dist_scale) {
        for (body_num in bodies) {
            var body = bodies[body_num];
            var x_distance = (this.x - body.x) * dist_scale;
            var y_distance = (this.y - body.y) * dist_scale;
            var distance = Math.sqrt(x_distance ** 2 + y_distance ** 2);
            if (distance) {
                var f_grav = G * (this.m * body.m) / distance ** 2;
                var acceleration = f_grav / this.m;

                var i = acceleration / distance;

                this.vel_x += x_distance * i;
                this.vel_y += y_distance * i;
            }
        }
    }
}

bodies = [];

bodies.push(new Body(center_w, center_h, 0, 0, 20, 10e+23, [255, 255, 255]))
bodies.push(new Body(center_w + 50, center_h + 50, 0, 0, 5, 10e+23, [255, 0, 0]));
bodies.push(new Body(center_w + 60, center_h + 40, 0, 0, 5, 10e+23, [0, 255, 0]))

set_orbit(bodies[0], bodies[1]);
set_orbit(bodies[1], bodies[2]);

for (body_num in bodies) {
    bodies[body_num].draw();
}


function set_orbit(body1, body2) {
    dir = 1
    var distance_x = (body1.x - body2.x) * dist_scale;
    var distance_y = (body1.y - body2.y) * dist_scale;
    var r = Math.sqrt(distance_x ** 2 + distance_y ** 2);

    var vel = Math.sqrt((G * body1.m) / r);

    var i = vel / r;

    body2.vel_x += distance_x * i * -10 * dir + body1.vel_x;
    body2.vel_y += distance_y * i * 10 * dir + body1.vel_y;

    body2.initial_vel_x = body2.vel_x;
    body2.initial_vel_y = body2.vel_y;

}


function clear() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function calc_vel() {
    for (body_num in bodies) {
        body = bodies[body_num];
        body.calc_vel(bodies, dist_scale);
    }
}


function update(trajectory) {
    for (body_num in bodies) {
        body = bodies[body_num];
        body.update(dist_scale);
        if (!trajectory) {
            body.draw();
        }
    }
}


function draw_trails() {
    for (body_num in bodies) {
        body = bodies[body_num];
        for (var i = 0.2 * body.points.length; i < body.points.length - 5; i += body.points.length/(i/2)) {
            point = body.points[Math.round(i)];
            ctx.fillStyle = "rgb(" + body.c[0] + "," + body.c[1] + "," + body.c[2] + ")";
            ctx.fillRect(point[0] - 0.5, point[1] - 0.5, 1, 1);
        }
    }
}


function calc_trajectory(instantaneous) {
    reset();
    clear();
    for (body_num in bodies) {
        bodies[body_num].draw();
    }
    calculating_trajectory = true;
    var i = 0;
    if (!instantaneous) {
        calc = setInterval(function () {
            update(true);
            calc_vel();
            for (body_num in bodies) {
                body = bodies[body_num]
                point = body.points[body.points.length - 1]

                ctx.fillStyle = "rgb(" + body.c[0] + "," + body.c[1] + "," + body.c[2] + ")";
                ctx.fillRect(point[0] - 0.5, point[1] - 0.5, 1, 1);
            }
            i++;
            if (i > 10000) {
                clearInterval(calc);
                calculating_trajectory = false;
            }
        }, 0);
    }
    else {
        for (var i = 0; i < 9999; i++) {
            update(true);
            calc_vel();
            for (body_num in bodies) {
                body = bodies[body_num]
                point = body.points[body.points.length - 1]

                ctx.fillStyle = "rgb(" + body.c[0] + "," + body.c[1] + "," + body.c[2] + ")";
                ctx.fillRect(point[0] - 0.5, point[1] - 0.5, 1, 1);
            }
        }
    }
    reset();
}

function reset() {
    for (body_num in bodies) {
        body = bodies[body_num];
        body.x = body.initial_x;
        body.y = body.initial_y;
        body.vel_x = body.initial_vel_x;
        body.vel_y = body.initial_vel_y;
        body.points = []
    }
}


function main_loop() {
    clearInterval(calc);
    reset();
    update_bodies = true;
    document.getElementById("add_body").style = "display: none;";
    document.getElementById("trajectory").style = "display: none;";
    document.getElementById("run").style = "display: none;";
    document.getElementById("pause").style = "display: block;";
    document.getElementById("stop").style = "display: block;";
    document.getElementsByClassName("show-trails-container")[0].style = "";
    document.getElementById("show-trails").checked = true;
    loop = setInterval(function () {
        if (update_bodies) {
            clear();
            update(false);
            calc_vel();
            if (show_trails) draw_trails();
        }
    }, 10)
}


