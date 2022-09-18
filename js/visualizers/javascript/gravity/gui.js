var calculating_trajectory = true;
var selected_body;
var editing_planet_loop

var adding_body_loop;
var mouse;

var editing_planet;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function add_body() {
    document.getElementById("show-trajectory").checked = true;
    clearInterval(calc);
    clearInterval(loop);
    clear();
    reset();
    adding_body = true;
    calculating_trajectory = true;
    document.getElementById("x").value = window.innerWidth / 2;
    document.getElementById("y").value = window.innerHeight / 2;
    document.getElementById("x_vel").value = 0;
    document.getElementById("y_vel").value = 0;
    document.getElementById("radius").value = 20;
    document.getElementById("mass").value = 10;
    document.getElementById("r").value = 255;
    document.getElementById("g").value = 255;
    document.getElementById("b").value = 255;

    document.getElementsByClassName("add_body")[0].style = "display: flex;";

    var x = parseInt(document.getElementById("x").value);
    var y = parseInt(document.getElementById("y").value);
    var vel_x = parseInt(document.getElementById("x_vel").value);
    var vel_y = parseInt(document.getElementById("y_vel").value);
    var radius = parseInt(document.getElementById("radius").value);
    var mass = parseInt(document.getElementById("mass").value);
    var c = [document.getElementById("r").value, document.getElementById("g").value, document.getElementById("b").value]
    var last = [x, y, vel_x, vel_y, mass, radius, c, document.getElementById("show-trajectory").checked];

    bodies.push(new Body(x, y, vel_x, vel_y, radius, mass, c));

    adding_body_loop = setInterval(function () {
        x = document.getElementById("x").value;
        y = document.getElementById("y").value;
        vel_x = document.getElementById("x_vel").value;
        vel_y = document.getElementById("y_vel").value;
        radius = document.getElementById("radius").value;
        mass = document.getElementById("mass").value;
        c = [document.getElementById("r").value, document.getElementById("g").value, document.getElementById("b").value]
        var current = [x, y, vel_x, vel_y, mass, c, document.getElementById("show-trajectory").checked];
        body = bodies[bodies.length - 1];


        var same = true;
        for (var i = 0; i < current.length; ++i) {
            if (typeof (current[i]) == "object") {
                for (var j = 0; j < current[i].length; j++) {
                    if (current[i][j] !== last[i][j]) same = false
                }
            }
            else {
                if (last[i] !== current[i]) same = false;
            }
        }

        if (!same) {
            body.x = parseInt(x);
            body.y = parseInt(y);
            body.initial_x = body.x;
            body.initial_y = body.y;
            body.vel_x = parseInt(vel_x);
            body.vel_y = parseInt(vel_y);
            body.initial_vel_x = body.vel_x;
            body.inital_vel_y = body.vel_y;
            body.r = parseInt(radius);
            body.c = c;
            if (mass.includes("e")) {
                var num = mass.split("e")
                body.m = parseInt(num[0]) * (10 ** parseInt(num[1]));
            }
            else {
                body.m = parseInt(mass);
            }
            clear();

            if (calculating_trajectory) {
                calc_trajectory(true);
            }
            else {
                for (body_num in bodies) {
                    bodies[body_num].draw();
                }
            }
        }

        if (body.selected) {
            document.getElementById("x").value = mouse.x;
            document.getElementById("y").value = mouse.y;
        }
        last = current;
    }, 0);
}


function cancel() {
    calculating_trajectory = false;
    document.getElementsByClassName("add_body")[0].style = "display: none;";
    inputs = document.getElementsByTagName("input");
    for (input in inputs) {
        inputs[input].value = ""
    }
    if (adding_body) {
        adding_body = false;
        clearInterval(adding_body_loop);
        bodies.pop()
        clear();
        for (body_num in bodies) {
            bodies[body_num].draw();
        }
    }
}

function check() {
    if (document.getElementById("show-trajectory").checked || document.getElementById("show-trajectory1").checked) {
        calculating_trajectory = true;
    }
    else {
        calculating_trajectory = false;
    }
}

function select(evt) {
    mouse = getMousePos(canvas, evt);
    var selected = [];

    selected_body = null;

    for (var body_num = bodies.length - 1; body_num >= 0; body_num--) {
        body = bodies[body_num];
        if (body.selected) {
            selected_body = body;
        }
        if ((body.initial_x - body.r) < mouse.x && mouse.x < (body.initial_x + body.r) && (body.initial_y - body.r) < mouse.y && mouse.y < (body.initial_y + body.r)) {
            selected.push(body);
        } 
    }
    if (selected.length == 1) {
        if (adding_body && selected[0] == bodies[bodies.length - 1]) {
            body = selected[0];
            if (body.selected) {
                body.selected = false;
            }
            else {
                body.selected = true;
                selected_body = body;
            }
        }
        else if (!adding_body) {
            body = selected[0];
            if (body.selected) {
                body.selected = false;
            }
            else {
                body.selected = true;
                selected_body = body;
            }
        }
    }
    else {
        var radii = []
        for (var i = 0; i < selected.length; i++) {
            radii.push(selected[i].r);
            body = selected[radii.indexOf(Math.min(...radii))]
            if (body.selected) {
                body.selected = false;
            }
            else {
                body.selected = true
                selected_body = body;
            }
        }
    }
    if (!calculating_trajectory) {
        clear()
        for (body_num in bodies) {
            bodies[body_num].draw();
        }
    }
    var body_selected = false
    if (selected_body && !adding_body) {
        body_selected = true;
        selected_body.selected = false;
    }

    if (!adding_body && body_selected) {
        editing_planet = true;
        calculating_trajectory = true;
        document.getElementById("show-trajectory1").checked = true;
        document.getElementById("x1").value = selected_body.x;
        document.getElementById("y1").value = selected_body.y;
        document.getElementById("x_vel1").value = selected_body.vel_x;
        document.getElementById("y_vel1").value = selected_body.vel_y;
        document.getElementById("radius1").value = selected_body.r;
        document.getElementById("mass1").value = selected_body.m;
        document.getElementById("r1").value = selected_body.c[0];
        document.getElementById("g1").value = selected_body.c[1];
        document.getElementById("b1").value = selected_body.c[2];

        var x = parseInt(document.getElementById("x1").value);
        var y = parseInt(document.getElementById("y1").value);
        var vel_x = parseInt(document.getElementById("x_vel1").value);
        var vel_y = parseInt(document.getElementById("y_vel1").value);
        var radius = parseInt(document.getElementById("radius1").value);
        var mass = parseInt(document.getElementById("mass1").value);
        var c = [document.getElementById("r1").value, document.getElementById("g1").value, document.getElementById("b1").value]
        var last = [x, y, vel_x, vel_y, mass, radius, c, document.getElementById("show-trajectory1").checked];
        document.getElementsByClassName("edit_body")[0].style = "display: flex";
        editing_planet_loop = setInterval(function () {
            if (!selected_body) {
                exit();
            }
            x = document.getElementById("x1").value;
            y = document.getElementById("y1").value;
            vel_x = document.getElementById("x_vel1").value;
            vel_y = document.getElementById("y_vel1").value;
            radius = document.getElementById("radius1").value;
            mass = document.getElementById("mass1").value;
            c = [document.getElementById("r1").value, document.getElementById("g1").value, document.getElementById("b1").value]
            var current = [x, y, vel_x, vel_y, mass, c, document.getElementById("show-trajectory1").checked];

            var same = true;
            for (var i = 0; i < current.length; ++i) {
                if (typeof (current[i]) == "object") {
                    for (var j = 0; j < current[i].length; j++) {
                        if (current[i][j] !== last[i][j]) same = false
                    }
                }
                else {
                    if (last[i] !== current[i]) same = false;
                }
            }

            if (!same && selected_body) {
                selected_body.x = parseInt(x);
                selected_body.y = parseInt(y);
                selected_body.initial_x = body.x;
                selected_body.initial_y = body.y;
                selected_body.vel_x = parseInt(vel_x);
                selected_body.vel_y = parseInt(vel_y);
                selected_body.initial_vel_x = body.vel_x;
                selected_body.inital_vel_y = body.vel_y;
                selected_body.r = parseInt(radius);
                selected_body.c = c;
                if (mass.includes("e")) {
                    var num = mass.split("e")
                    selected_body.m = parseInt(num[0]) * (10 ** parseInt(num[1]));
                }
                else {
                    selected_body.m = parseInt(mass);
                }
                clear()

                if (selected_body) {

                    selected_body.selected = true;
                    if (calculating_trajectory) {
                        calc_trajectory(true);
                    }
                    else {
                        for (body_num in bodies) {
                            bodies[body_num].draw();
                        }
                    }
                    selected_body.selected = false;
                } 

            }
            last = current;
        }, 0)
    }

}

function add() {
    adding_body = false;
    clearInterval(adding_body_loop);
    clear();
    calculating_trajectory = false;
    document.getElementsByClassName("add_body")[0].style = "display: none;";
    inputs = document.getElementsByTagName("input");

    for (input in inputs) {
        inputs[input].value = ""
    }
    for (body_num in bodies) {
        bodies[body_num].draw();
    }

}

function pause() {
    update_bodies = !update_bodies
    if (update_bodies) {
        document.getElementById("pause").innerHTML = "Pause"
    }
    else {
        document.getElementById("pause").innerHTML = "Resume"
    }
}

function stop() {
    clearInterval(loop);
    document.getElementById("add_body").style = "";
    document.getElementById("trajectory").style = "";
    document.getElementById("run").style = "";
    document.getElementById("pause").style = "display: none;";
    document.getElementById("stop").style = "display: none;";
    document.getElementsByClassName("show-trails-container")[0].style = "display: none;";
    reset();
    clear();
    for (body_num in bodies) {
        bodies[body_num].draw();
    }
}

function exit() {
    clearInterval(editing_planet_loop);
    document.getElementsByClassName("edit_body")[0].style = "display: none";
    document.getElementById("show-trajectory1").checked = false;
    calculating_trajectory = false;
    clear();
    selected_body = null;
    for (body_num in bodies) {
        bodies[body_num].draw();
    }
}

function delete_body() {
    bodies.splice(bodies.indexOf(selected_body), 1);
    exit();
}

function trails() {
    show_trails = !show_trails;
}

canvas.addEventListener('mousedown', function (evt) {
    select(evt);
});

canvas.addEventListener('mousemove', function (evt) {
    mouse = getMousePos(canvas, evt);
});
