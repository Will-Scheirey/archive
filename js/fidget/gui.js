var menu_shown = false;
function menu(new_mode) {
    if (!menu_shown) {
        document.getElementsByClassName("menu")[0].style = "display: flex;";
        document.getElementById("menu").innerHTML = "close";
    }
    else {
        document.getElementsByClassName("menu")[0].style = "display: none;";
        document.getElementById("menu").innerHTML = "menu";
    }
    menu_shown = !menu_shown
    clicks--;

}

function changeMode(new_mode) {
    mode = new_mode;
    clicks--;
}