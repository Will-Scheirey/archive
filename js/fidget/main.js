if (!localStorage.getItem("willfs.com-total_hits")) localStorage.setItem("willfs.com-total_hits", 0);

var mode = "click_box";

function clear() {
    ctx.fillStyle = "rgb(5, 0, 12)";
    ctx.fillRect(0, 0, w, h);
}
clear();
var click = true;


var show_stats = true;

var mouseX = 0;
var mouseY = 0;
var mouseR = 10;
var mouseDown = false;
var mouseCoordsLength = 50;
var mouseCoords = [];
for(let i = 0; i < mouseCoordsLength; i++) {
    mouseCoords.push([0,0]);
}

randomBoxes = [];
var clicks = 0;
var hits = 0;

followers = [];

class Follower {
    constructor(color, speed, size, x, y) {
        this.color = color;
        this.speed = speed;
        this.size = size;
        this.x = x;
        this.y = y;
        this.heading = {x: 0, y: 0};
    }

    update_pos() {
        this.heading = {x: mouseX, y: mouseY};
        var distance = Math.sqrt((this.x - this.heading.x)**2 + (this.y - this.heading.y)**2);        
        
        var mult = this.speed / distance;
        this.x -= (this.x - this.heading.x) * mult;
        this.y -= (this.y - this.heading.y) * mult;
        if (Math.sqrt((this.x - mouseX)**2 + (this.y - mouseY)**2) < 100) {
            this.x = random_int(0, w);
            this.y = random_int(0, h);
        }
    }

    draw() {
        draw_circle(this.x, this.y, this.size, this.color, true);
    }
}

class RandomBox {
    constructor(i, x, y, c, size) {
        this.i = i;
        this.x = x;
        this.y = y;
        this.c = c;
        this.size = size;
        this.t = 0.8;
        this.fading = false;
        this.hovered = false;
    }

    draw() {
        if (this.fading) {
            this.t -= 0.025;
        }
        if (this.t <= 0 && this.fading) {
            randomBoxes.splice(randomBoxes.indexOf(this), 1);
            addRandomBox();
            this.fading = false;
        }
        
        ctx.fillStyle = "rgba(" + this.c[0] + ", " + this.c[1] + ", " + this.c[2] + ", " + this.t + ")";
        if(this.hovered) {
            ctx.fillRect(this.x-5, this.y-5, this.size+10, this.size+10);
            ctx.strokeStyle = "rgba(255, 255, 255, " + (this.t+0.2) + ")";
            ctx.strokeRect(this.x - 6, this.y-6, this.size+12, this.size+12);
        }
        else{
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
        
    }
}

function addRandomBox() {
    var size = random_int(40, 75);
    var cont = false;
    var x;
    var y;
    var j = 0;
    while (!cont) {
        cont = true;
        let margin = 200;
        x = random_int(margin,w-margin);
        y = random_int(margin/2, h-margin/2);
        for (var i = 0; i < randomBoxes.length; i++) {
            var x1 = randomBoxes[i].x;
            var y1 = randomBoxes[i].y;
            var distance = Math.sqrt((x1-x)**2 + (y1-y)**2);
            if (distance < 100) {
                 cont = false;
            }
        }
        j++;
        if(j > 50) {
            break;
        }
    }
    
    randomBoxes.push(new RandomBox(randomBoxes.length, x, y, [random_int(50, 150), random_int(50, 150), random_int(50, 150)], size));
}

for(let i = 0; i < 5; i++) {
    //followers.push(new Follower([255, 255, 255], 5, 5, random_int(0, w), random_int(0, h)));
}


for(let j = 0; j < 5; j++) {
    addRandomBox();
}

document.onmousemove = function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    randomBoxes.forEach(box => {
        box.hovered = false;
        if (box.x < mouseX && mouseX < box.x + box.size && (box.y < mouseY && mouseY < box.y + box.size)) {
                //box.fading = true;
                //hits++;
                box.hovered = true;
        }
        else {
            ;
        }
    })
}

document.onmousedown = function(event) {
    mouseDown = true;
    mouseR = 12;
    clicks++;
    randomBoxes.forEach(box => {
        if (box.x < mouseX && mouseX < box.x + box.size) {
            if (box.y < mouseY && mouseY < box.y + box.size) {
                box.fading = true;
                hits++;
                localStorage.setItem("willfs.com-total_hits", parseInt(localStorage.getItem("willfs.com-total_hits")) + 1);
            }
        }
    })
}

document.onmouseup = function () {
    mouseDown = false;
    mouseR = 10;
}

function changeShowStats() {
    show_stats = !show_stats;
}

function drawMouse() {
    //draw_circle(mouseX, mouseY, mouseR, [255, 255, 255], false);
    var i = mouseCoordsLength;
    mouseCoords.forEach(coord => {
        i--;
        draw_circle(coord[0], coord[1], mouseR-Math.sqrt(i), [255, 255, 255, 0.05], true);
    }) 
    
    if (mouseCoords.indexOf([mouseX, mouseY]) == -1) {
        mouseCoords.push([mouseX, mouseY]);
        mouseCoords.splice(0,1);
    }

    if (mouseDown) {
        draw_circle(mouseX, mouseY, mouseR, [100, 200, 100, 0.8], true);
    }
    else {
        draw_circle(mouseX, mouseY, mouseR, [255, 255, 255, 0.2], true);
    }
    
}

grid_width = 5;

var grid = [];

for (let i = 0; i < grid_width; i++) {
    for (let j = 0; j < grid_width; j++) {
        grid.push([j, i]);
    }
}

selected = 0;

document.onkeydown = function(e) {
    if (e.keyCode == '37') {
        if (selected % grid_width) selected --; 
    }
    if (e.keyCode == '38') {
        if (selected >= grid_width) selected -= grid_width;
    }
    if (e.keyCode == '39') {
        if ((selected+1) % grid_width) selected ++; 
    }
    if (e.keyCode == '40') {
        if (selected < grid_width*(grid_width-1)) selected += grid_width;
    }
}

var box = {selected: random_int(0, 8), color: [random_int(50, 150), random_int(50, 150), random_int(50, 150)]}


var i = 0;
var loop = setInterval(function() {
    clear();
    if (mode == "click_box") {
        randomBoxes.forEach(box => {
            box.draw();
        });
    }
    
    followers.forEach(follower => {
        follower.update_pos();
        follower.draw();
    })
    if(show_stats) {
        ctx.font = Math.max(w/100, 20)+"px arial";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText("Total hits: " + localStorage.getItem("willfs.com-total_hits"), 10, h - 100);
        ctx.fillText("Clicks: " + clicks, 10, 50);
        ctx.fillText("Hits: " + hits, 10, 100);
        ctx.fillText("Accuracy: " + parseFloat(hits/clicks*100).toFixed(2) + "%", 10, 150);
        ctx.fillText("Average speed: " + parseFloat((hits)/(i/250)).toFixed(2) + "/sec", 10, 200);
    }
    if(mode == "box_grid") {
        var size = (Math.min(h, w)*2/3)/grid_width;
        grid.forEach(coord=> {
            ctx.strokeStyle = "rgba(100, 100, 100, 0.5)";
            ctx.strokeRect(center_w-size/2*grid_width + coord[0]*size, center_h - size/2*grid_width + coord[1]*size, size, size)
        })
    
        ctx.fillStyle = "rgb(" + box.color[0] + ", " + box.color[1] + ", " + box.color[2] + ")";
        ctx.fillRect(center_w-size/2*grid_width + grid[box.selected][0]*size - 1, center_h - size/2*grid_width + grid[box.selected][1]*size - 1, size + 2, size + 2);
        
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeRect(center_w-size/2*grid_width + grid[selected][0]*size - 1, center_h - size/2*grid_width + grid[selected][1]*size - 1, size + 2, size + 2);
        ctx.strokeRect(center_w-size/2*grid_width + grid[selected][0]*size, center_h - size/2*grid_width + grid[selected][1]*size, size, size);
    
        if(selected == box.selected) {
            box.selected = random_int(0, grid_width**2-1);
            box.color = [random_int(50, 150), random_int(50, 150), random_int(50, 150)];
            hits++;
            localStorage.setItem("willfs.com-total_hits", parseInt(localStorage.getItem("willfs.com-total_hits")) + 1);
        }
    }
    
    drawMouse();
    i++;
}, 0);