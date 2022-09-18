function hsl2rgb(h,s,l){s=s/100;l=l/100;var c,x,m,rgb;c=(1-Math.abs(2*l-1))*s;x=c*(1-Math.abs(((h/60)%2)-1));m=l-c/2;if(h>=0&&h<60)rgb=[c,x,0];if(h>=60&&h<120)rgb=[x,c,0];if(h>=120&&h<180)rgb=[0,c,x];if(h>=180&&h<240)rgb=[0,x,c];if(h>=240&&h<300)rgb=[x,0,c];if(h>=300&&h<360)rgb=[c,0,x];return rgb.map(v=>255*(v+m)|0);}
// SETUP
var num = 2000;
document.getElementById("num").value = num;
var update = true;
var comparisons = 0;
var draw_list;
var global_lists;
var iter;
var iter_add = 0;
var total_lists = [];
var last_index = num;
var comb_spaces = [];
var shell_spaces = [];
var space;

var shellSort_loop;
var insertionSort_loop;
var mergeSort_loop;
var bubbleSort_loop;
var quickSort_loop;
var selectionSort_loop;

// Clear screen
function clear() {
    draw_rect(0, 0, w, h, [34, 40, 81], true);
}

// Run when list has been sorted
function end() {
    document.getElementById("done").style = "display: block";
    document.getElementById("reset").disabled = false;
}

// Run before list is sorted
function start(method) {
    document.getElementById("method").innerHTML = "method: " + method;
    var buttons = document.getElementsByTagName("button");
    var i = 0;
    for (i; i <= buttons.length-1; i++) {
        buttons[i].disabled = true;
    }
    document.getElementById("reset").disabled = false;
}

class Item {
    constructor(value, c) {
        this.value = value;
        var i = 359/10000;
        this.c = [i * this.value, Math.abs(127.5 - i*this.value), 255 - i*this.value];
        //console.log(value*i);
        this.c = hsl2rgb(Math.min(value*i, 360), 100, 50);
    }
    draw(i) {
        var x = 150 + (w-500)/num * i;
        var height = Math.min(canvas.height, 1000);
        var y = h - 20 - (height-200)/10000 * this.value;
        draw_line(x, h - 20, x, y, this.c);
        var y =Math.min( w/5, 150);
        var x = 360/num * i;
        draw_line(w - 175, h - 200, w - 175 + y * Math.cos(x * Math.PI/180), h - 200 + y * Math.sin(x * Math.PI/180), this.c);
        //var y = 80/10000 * this.value;
        draw_circle(w - 25 - Math.min(w/5, 150), h - y - 360, i/num*Math.min(w/5, 150), this.c, false);
    }
}

// Draw each item
function draw(list) {
    var i = 0;
    list.forEach(item => {
        item.draw(i);
        i++;
    })
}

// Take a list of lists and add it into one overall list
function add_lists(list, lists) {
    clear()
    if (lists.length == 0) {
        var i = 0;
        total_lists.push(list);
        list.forEach(item => {
            item.draw(i);
            i++;
        });
        total_lists.push(list);
        return;
    }
    var new_list = [...list, ...lists[0]];
    lists.splice(lists[0], 1);
    add_lists(new_list, lists);
}

// QUICKSORT
function quickSortCompare(list) {
    if (list.length == 0) return [[], 0];
    var index = random_int(0, list.length-1);
    var pivot = list[index];
    var index = 1;

    var new_list = [];
    new_list.push(pivot, pivot);
    var same = [];
    list.forEach(item => {
            if (item.value > pivot.value) {
                new_list.splice(index, 0, item);
            }
            else if (item.value < pivot.value) {
                new_list.splice(index - 1, 0, item);
                index ++;
            }
            else {
                same.push(item);
            }
            comparisons++;
    })
    new_list.splice(index - 1, 0, ...same);
    new_list.splice(new_list[index], 1);
    return [new_list, pivot, same.length];
}

function quickSort() {
    iter ++;
    draw_list = [];
    var new_lists = [];
    var stop = true;
    global_lists.forEach(list => {
        if (list.length > 0) {
            const allEqual = arr => arr.every(v => v === arr[0]);
            if (!allEqual(list)) stop = false;
            var val = quickSortCompare(list);
            var new_list = val[0];
            var pivot = val[1];
            
            var list1 = new_list.slice(0, new_list.indexOf(pivot));
            var list2 = new_list.slice(new_list.indexOf(pivot), new_list.length-1);
            if (list1.length != 0) new_lists.push(list1);
            if (list2.length != 0) new_lists.push(list2);

            draw_list.push(...list1);
            draw_list.push(...list2);
        }
    })
    if (stop) {
        end();
        return false;
    }
    global_lists = new_lists;
    return true
}



function bubbleSort(bi, comb) {
    iter++;
    if(space != 1) space = (comb) ? Math.max(comb_spaces[Math.min(comb_spaces.length-1, iter)], 1) : 1;
    var index = 0;
    var go = false;
    for (index = 0; index < draw_list.length - iter; index ++) {
        var n1 = draw_list[index];
        var n2 = draw_list[index + space];
        try {
            if (n1.value > n2.value) {
                draw_list[index] = n2;
                draw_list[index + space] = n1;
                go = true;
            }
        } catch {go=true; break}
        if (index >= draw_list.length - 1 - iter) {
            break;
        }
        comparisons++;
    }
    if (bi) {
        for (index = draw_list.length - 1 - iter; index > 0; index --) {
            var n1 = draw_list[index];
            var n2 = draw_list[index - space];
            try {
                if (n1.value < n2.value) {
                    draw_list[index] = n2;
                    draw_list[index - space] = n1;
                    go = true;
                }
            } catch {go=true; break}
            if (index < iter) {
                break;
            }
            comparisons++;
        }
    }
    if (space != 1) {
        go = true;
    }
    if (!go) {
        end();
        return false;
    }
    return go;
}


function shellSort() {
    iter ++;
    space = Math.max(shell_spaces[Math.min(shell_spaces.length-1, iter)], 1);

    for (var i = space; i < draw_list.length; i++) {
        var temp = draw_list[i];
        for (var j = i; j >= space && draw_list[j - space].value > temp.value; j-=space) {
            draw_list[j] = draw_list[j-space];
            comparisons++;
        }
        draw_list[j] = temp;
    }
    if (space == 1) {
        end();
        return false;
    }
    return true;
}

function insertionSort() {
    var n1 = draw_list[iter];
    var n2;
    for (var index = iter - 1; index > 0; index --) {
        n2 = draw_list[index];
        comparisons++;
        if (n1.value < n2.value) {
            draw_list[index] = n1;
            draw_list[index+1] = n2;
        }
        else {
            break;
        }
    }
    iter ++;
    if (iter >= draw_list.length) {
        var n1 = draw_list[0]
        for (var index = 1; index < draw_list.length; index ++) {
            n2 = draw_list[index];
            comparisons++;
            if (n1.value > n2.value) {
                draw_list[index-1] = n2;
                draw_list[index] = n1;
            }
            else {
                break;
            }
        }
        end();
        return false;
    }

    return true;
}

function mergeSort() {
    iter ++;
    draw_list = [];
    var new_list = [];

    if (iter == 1) {
        global_lists[0].forEach(list =>{
            new_list.push([list]);
        })
        global_lists = new_list;
        return true;
    }
    for (var i = 0; i < global_lists.length; i += 2) {
        if (i + 1 >= global_lists.length && global_lists.length > 2 && i != 2) {
            l3 = global_lists[global_lists.length-1];
            break;
        }
        var l1 = global_lists[i];
        var l2 = global_lists[i+1];
        var l3 = [];
            
        var i1 = 0;
        var i2 = 0;
        while (l3.length < (l1.length + l2.length)) {
            if (i1 == l1.length &&  i2 != l2.length && i1 != 0) {
                l3.push(l2[i2]);
                i2++;
                
            }
            if (i2 == l2.length && i1 != l1.length && i2 != 0) {
                l3.push(l1[i1]);
                i1++;
            }

            if (i1 < l1.length && i2 < l2.length) {
                if (l1[i1].value < l2[i2].value) {
                    l3.push(l1[i1]);
                    i1++;
                }
                else {
                    l3.push(l2[i2]);
                    i2++;
                }
            }
            comparisons++;
        }

        new_list.push(l3);
        draw_list.push(...l3);
    }
    if ((2**(iter-1))*new_list.length < num && new_list.length > 2) {
        new_list.push(global_lists[global_lists.length-1])
    }
    global_lists = new_list;
    if (global_lists.length == 1) {
        end();
        return false;
    }
    return true;
}

function selectionSort(bi) {
    var lowest = draw_list[iter];
    var index = iter;
    for (var i = iter; i < draw_list.length; i++) {
        if (draw_list[i].value < lowest.value) {
            lowest = draw_list[i];
            index = i;
            comparisons++;
        }
    }
    draw_list[index] = draw_list[iter];
    draw_list[iter] = lowest;
    if (bi) {
        var highest = draw_list[draw_list.length - 1 - iter];
        var index = draw_list.length - 1 - iter;
        for (var i = draw_list.length - 1 - iter; i >= 0; i--) {
            if (draw_list[i].value > highest.value) {
                highest = draw_list[i];
                index = i;
                comparisons++;
            }
        }
        draw_list[index] = draw_list[draw_list.length - 1 - iter];
        draw_list[draw_list.length - 1 - iter] = highest;
    }
    
    if (iter == draw_list.length-1 || (bi && iter == Math.round((draw_list.length-1)/2))) {
        end();
        return false;
    }
    iter++;
    return true;
}


// END_QUICKSORT
function reset() {
    comb_spaces = [];
    shell_spaces = [];
    add = 0;
    for (var i = num; Math.round(i) >= 1; i/=1.3) {
        comb_spaces.push(Math.round(i));
    }
    shell_spaces.push(1);

    for (var i = num; Math.round(i) >= 1; i/=2.2) {
        shell_spaces.push(Math.round(i));
    }
    shell_spaces.push(1);
    space = num;

    clearInterval(shellSort_loop);
    clearInterval(insertionSort_loop);
    clearInterval(mergeSort_loop);
    clearInterval(bubbleSort_loop);
    clearInterval(quickSort_loop);
    clearInterval(selectionSort_loop);
    document.getElementById("method").innerHTML = "choose method";
    document.getElementById("done").style = "";
    var buttons = document.getElementsByTagName("button");
    var i = 0;
    for (i; i <= buttons.length-1; i++) {
        buttons[i].disabled = false;
    }
    clear();
    var items = []
    for (var i = 0; i < num; i++) {
        var l = random_int(5, 10000);
        items.push(new Item(l, [57*1.5, 50 + ((255-50)/(10000-5)) * l, 135*1.5]))
    }
    draw(items);
    
    draw_list = [];
    global_lists = [items];
    iter = 0;
    comparisons = 0;
}

reset();

function start_insertionSort() {
    start("Insertion Sort");
    draw_list = global_lists[0];
    var keep_going = true;
    insertionSort_loop = setInterval(function() {
        if (update) {
            if (keep_going) keep_going = insertionSort();
            if (!keep_going) clearInterval(insertionSort_loop);
            clear();
            draw(draw_list);
        }
    }, 0);
}

function start_bubbleSort(bi, comb) {
    if (bi) {
        if(!comb) {
            start("Cocktail Shaker Sort")
        }
        else {
            start("Bidirectional Comb Sort");
        }
    }
    else {
        if (!comb) {
            start("Bubble Sort");
        }
        else {
            start("Comb Sort")
        }
    }
    var keep_going = true;
    draw_list = global_lists[0];
    bubbleSort_loop = setInterval(function (){
            if(update) {
                if (keep_going){
                    keep_going = bubbleSort(bi, comb);
                }
                if (!keep_going){
                    if (comb) {
                        comb = false;
                        keep_going = true;
                        add = iter;
                        iter = 0;
                        bi = true;
                    }
                    else{
                        clearInterval(bubbleSort_loop);
                    }
                }
                clear();
                draw(draw_list);
            }
    }, 0);
}

function start_quickSort() {
    start("Quick Sort");
    var keep_going = true;
    quickSort_loop = setInterval(function (){
            if(update) {
                if (keep_going) keep_going = quickSort();
                if (!keep_going) clearInterval(quickSort_loop);
                clear();
                draw(draw_list);
        }
    }, 0);
}

function start_mergeSort() {
    start("Merge Sort");
    var keep_going = true;
    mergeSort_loop = setInterval(function() {
        if (update) {
            if (keep_going) keep_going = mergeSort();
            if (!keep_going) clearInterval(mergeSort_loop);
            clear();
            draw(draw_list);
        }
    }, 0);
}

function start_shellSort() {
    start("Shell Sort");
    var keep_going = true;
    draw_list = global_lists[0];
    shellSort_loop = setInterval(function() {
        if (update) {
            if (keep_going) keep_going = shellSort();
            if (!keep_going) clearInterval(shellSort_loop);
            clear();
            draw(draw_list);
        }
    }, 0)
}

function start_selectionSort(bi) {
    start("Selection Sort");
    var keep_going = true;
    draw_list = global_lists[0];
    selectionSort_loop = setInterval(function() {
        if (update) {
            if (keep_going) keep_going = selectionSort(bi);
            if (!keep_going) clearInterval(selectionSort_loop);
            clear();
            draw(draw_list);
        }
    }, 0)
}


var stats = setInterval(function() {
    num = document.getElementById("num").value;
    document.getElementById("items").innerHTML = "items: " + num;
    document.getElementById("comparisons").innerHTML = "comparisons: " + comparisons;
    document.getElementById("iterations").innerHTML = "iterations: " + (iter + add);
}, 0);