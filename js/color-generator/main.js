function doIt() {
    var r = random_int(0, 255);
    var g = random_int(0, 255);
    var b = random_int(0, 255);
    
    ctx.fillStyle = "rgb(15, 16, 20)"; 
    ctx.fillRect(0,0,w,h,);
    
    //ctx.fillStyle = "rgb(255, 255, 255)";
    //ctx.fillRect(50 - 1, 50 - 1, (w-160)/3 + 2, (h - 200)/4 + 2);
    ctx.fillStyle = "rgb(" + r + ",0,0)"; 
    ctx.fillRect(50, 50, (w-160)/3, (h - 200)/4);

    //ctx.fillStyle = "rgb(255, 255, 255)";
    //ctx.fillRect(50 + (w-160)/3 + 30 - 1, 50 - 1, (w-160)/3 + 2, (h - 200)/4 + 2);
    ctx.fillStyle = "rgb(0," + g + ",0)"; 
    ctx.fillRect(50 + (w-160)/3 + 30, 50, (w-160)/3, (h - 200)/4);
    

    //ctx.fillStyle = "rgb(255, 255, 255)";
    //ctx.fillRect(50 + (w-160)/3 * 2 + 60 - 1, 50 - 1, (w-160)/3 + 2, (h - 200)/4 + 2);
    ctx.fillStyle = "rgb(0,0," + b + ")"; 
    ctx.fillRect(50 + (w-160)/3 * 2 + 60, 50, (w-160)/3, (h - 200)/4);
    

    //ctx.fillStyle = "rgb(255, 255, 255)";
    //ctx.fillRect(50 - 1, (h - 200)/4 * 2 - 1, (w-160)/3 + 2, (h - 200)/4 + 2);
    ctx.fillStyle = "rgb(" + r + "," + g + ",0)"; 
    ctx.fillRect(50, (h - 200)/4 * 2, (w-160)/3, (h - 200)/4);
    
    //ctx.fillStyle = "rgb(255, 255, 255)";
    //ctx.fillRect(50 + (w-160)/3 + 30 - 1, (h - 200)/4 * 2 -1 , (w-160)/3 + 2, (h - 200)/4 + 2);
    ctx.fillStyle = "rgb(" + r + ", 0," + b + ")"; 
    ctx.fillRect(50 + (w-160)/3 + 30, (h - 200)/4 * 2, (w-160)/3, (h - 200)/4);
    
    //ctx.fillStyle = "rgb(255, 255, 255)";
    //ctx.fillRect(50 + (w-160)/3 * 2 + 60 - 1, (h - 200)/4 * 2 - 1, (w-160)/3 + 2, (h - 200)/4 + 2);
    ctx.fillStyle = "rgb(0, " + g + ", " + b + ")";
    ctx.fillRect(50 + (w-160)/3 * 2 + 60, (h - 200)/4 * 2, (w-160)/3, (h - 200)/4);
    
    //ctx.fillStyle = "rgb(255, 255, 255)";
    //ctx.fillRect(50 - 1, (h - 200)/4 * 3 + 50 - 1, w-100 + 2, (h - 200)/4 + 2); 
    ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
    ctx.fillRect(50, (h - 200)/4 * 3 + 50, w-100, (h - 200)/4); 
    
    document.getElementById("color").innerHTML = "rgb(" + r + ", " + g + ", " + b + ")";
}


doIt();