var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = "30px Arial";
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
var scale = 1;
var x_offset = 0;
var y_offset = 0;


var speed = 3;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function pause() {
    update_bodies = !update_bodies
    if (update_bodies) {
        document.getElementById("pause").innerHTML = "Pause"
    }
    else {
        document.getElementById("pause").innerHTML = "Resume"
    }
}

function trails() {
    show_trails = !show_trails;
}

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
        draw_circle(center_w + (this.x)*scale + x_offset, center_h + (this.y)*scale + y_offset, this.r*scale, this.c, true)
    }

    update(dist_scale) {
        this.x -= this.vel_x / 50 / dist_scale;
        this.y -= this.vel_y / 50 / dist_scale;
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

var num = 3;

for (var i = 0; i < num; i++) {
    var x = random_int(-w, w);
    var y = random_int(-h, h);
    var x_vel = random_int(-10e+4, 10e+4);
    var y_vel = random_int(-10e+4, 10e+4);
    var m = random_int(1e+23, 5e+24);
    var r = 3+ m/(1e+23);

    bodies.push(new Body(x, y, x_vel, y_vel, r, m, [255/3, (255 - (255/num*i))/3, (255/num*i)/3]));
}

console.log(bodies);

for (body_num in bodies) {
    bodies[body_num].draw();
}

function randomize() {
    console.log(bodies);
    let i = 0;
    bodies.forEach(body => {
        var x = random_int(-w, w);
        var y = random_int(-h, h);
        var x_vel = random_int(-10e+4, 10e+4);
        var y_vel = random_int(-10e+4, 10e+4);
        var m = random_int(1e+23, 5e+24);
        var r = 3+ m/(1e+23);
        body.x = x;
        body.y = y;
        body.x_vel = x_vel;
        body.y_vel = y_vel;
        body.m = m;
        body.r = r;
        body.c = [255/3, (255 - (255/num*i))/3, (255/num*i)/3];
        i++;
    })
    if (bodies.length < num) {
        var x = random_int(w/-2, w/2);
        var y = random_int(h/-2, h/2);
        var x_vel = random_int(-10e+4, 10e+4);
        var y_vel = random_int(-10e+4, 10e+4);
        var m = random_int(1e+23, 5e+24);
        var r = 3+ m/(1e+23);
        bodies.push(new Body(x, y, x_vel, y_vel, r, m, [255/3, (255 - (255/num*i))/3, (255/num*i)/3]));
    }
    else if (bodies.length > num) {
        bodies.pop();
    }
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
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function calc_vel() {
    bodies.forEach (body => {
        body.calc_vel(bodies, dist_scale);
    })
}


function update(trajectory) {
    bodies.forEach (body => {
        body.update(dist_scale);
    })
}


function draw_trails() {
    for (body_num in bodies) {
        body = bodies[body_num];
        var sub = Math.min(body.points.length * 0.2, 5000)
        for (var i = body.points.length - sub; i < body.points.length - 5; i += body.points.length/(i/2)) {
            point = body.points[Math.round(i)];
            ctx.fillStyle = "rgb(" + body.c[0]*2 + "," + body.c[1]*2 + "," + body.c[2]*2 + ")";
            ctx.fillRect(center_w + point[0]*scale - 0.5 + x_offset, center_h + point[1]*scale - 0.5 + y_offset, 1, 1);
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
    x_offset = 0;
    y_offset = 0;
}

document.addEventListener("keydown", event => {
    if (event.keyCode == 38) {
      speed += 2;
    }
    if (event.keyCode == 40 && speed > 2) {
        speed -= 2;
    }
  });


var max_space = 5;
var max_zoom = 0.5;
function main_loop() {
    clearInterval(calc);
    reset();
    update_bodies = true;
    document.getElementById("show-trails").checked = true;
    loop = setInterval(function () {
        if (update_bodies) {
            clear();
            for (let i = 0; i < Math.max(w, h); i+= 30) {
                draw_line(i, 0, i, h, [200, 200, 255]);
                draw_line(0, i, w, i, [200, 200, 255]);
            }
                       
            for (var i = 0; i < speed; i++) {
                update(false);
                calc_vel();
            }
                           
                var x_distances = [];
                var y_distances = [];
                var xs = [];
                var ys = [];
                //console.log("-----")
                //console.log({max_x: max_space*w, max_y: max_space*h});
                //console.log({x_offset: x_offset, y_offset: y_offset});
                for (body in bodies) {
                    var add_x = false;
                    var add_y = false;
                    var deviation_x = Math.abs(bodies[body].x + x_offset) + 50;
                    var deviation_y = Math.abs(bodies[body].y + y_offset) + 50;
                    
                    //console.log({body: body, x: bodies[body].x, y: bodies[body].y, deviation: {x: deviation_x, y: deviation_y}, x_maxed: deviation_x > max_space*w, y_maxed: deviation_y > max_space*h});
                    var max_vel = 2.5e+5;
                    if ((deviation_x < max_space*5*w && deviation_y < max_space*5*h) && Math.abs(bodies[body].vel_x) < max_vel && Math.abs(bodies[body].vel_y) < max_vel) {
                        for (body1 in bodies) {
                            if (bodies[body1] != bodies[body]){
                                var x_distance = Math.abs(bodies[body].x - bodies[body1].x);
                                if (x_distance < w*max_space) add_x = true;
                                var y_distance = Math.abs(bodies[body].y - bodies[body1].y);
                                if (y_distance < h*max_space) add_y = true;
                                if (x_distance < w*max_space && y_distance < h*max_space){
                                    x_distances.push(x_distance);
                                    y_distances.push(y_distance);
                                }
                            }
                        }
                        if(add_x && add_y) {
                            xs.push(bodies[body].x*scale);
                            ys.push(bodies[body].y*scale);
                        }
                    }
                }
                            
                var max_x_distance = Math.max(...x_distances);
                var max_y_distance = Math.max(...y_distances);

                var max_distance = Math.max(max_y_distance, max_x_distance);
                var n = [max_x_distance, max_y_distance].indexOf(max_distance);
                if (max_x_distance > w) n = 0;
                if (max_y_distance > h) n = 1;

                if (n == 0) {
                    scale = w/max_distance * 0.8;
                }
                else {
                    scale = h/max_distance * 0.8;
                }
                
                scale = Math.min(max_zoom, scale);

                var x_average = (Math.max(...xs) + Math.min(...xs))/2 + center_w;
                var y_average = (Math.max(...ys) + Math.min(...ys))/2 + center_h;

                x_offset =  center_w - x_average;
                y_offset = center_h - y_average;

            bodies.forEach (body => {
                body.draw();
            })
            if (show_trails) draw_trails();
            if (xs.length == 0 || Number.isNaN(y_offset)) {
                //alert("The bodies are too far away for their gravities to interact. Reload the page.");
                
                //location.reload();
            }
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText("n-bodies: " + num, 5, 150);
            ctx.fillText("speed: " + parseFloat(speed).toFixed(2) + "x", 5, 190);
            ctx.font = "20px Arial";
            ctx.fillText("max render dist: " + max_space, 5, 230);
            ctx.fillText("max zoom: " + parseFloat(max_zoom).toFixed(1), 5, 260);
            ctx.font = "20px Arial";
            ctx.fillText("x-offset: " + parseFloat(x_offset).toFixed(0), 5, 300);
            ctx.fillText("y-offset: " + parseFloat(y_offset).toFixed(0), 5, 320);
            ctx.fillText("zoom: " + parseFloat(scale).toFixed(5) + "x", 5, 350);
        }
    }, 0)
}

main_loop();


