function clear() {
    draw_rect(0, 0, w, h, [150, 150, 255], true);
}
clear();

var waves = new Array();
var start = {x: 0, y: 0};



var horizontal_stretch;
var vertical_stretch;
const num_waves = 50;
var color_multiplier = 4;
var blue_add = 300;
for (var j = 0; j < num_waves; j++) {
    ctx.fillStyle = "rgb(" + random_int(0, Math.min(50, j*4)) * color_multiplier  + ", " + random_int(50, Math.min(50+j*6, 150)) * color_multiplier + ", " + (random_int(Math.max(0, 50 - j*3), Math.min(50+j*3, 50)) * color_multiplier + blue_add) + ")";

    horizontal_stretch = random_int(Math.max(50, 200 - (150/num_waves*j)), Math.max(50, 250 - (200/num_waves*j)));

    start.x = random_int(-horizontal_stretch*4, 0);
    ctx.moveTo(start.x, start.y);
    ctx.beginPath();
    
    let x = 0;
    let smoothness = random_int(1,100)/100;
    while ((x-smoothness) * horizontal_stretch + start.x < w) {
        ctx.lineTo(start.x + x*horizontal_stretch, start.y + 100 * Math.sin(x));
        x += smoothness;
    }

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.lineTo(start.x, start.y);
    ctx.closePath();
    ctx.fill();

    start.y += h/num_waves;
    color_multiplier -= 5/num_waves;
    color_multiplier = Math.max(1, color_multiplier);
    blue_add -= 600/num_waves;
    blue_add = Math.max(1, blue_add);
}




