function updateLimit(div) {
    document.getElementById(div.id + "-value").innerHTML = div.value;

    if (parseInt(document.getElementById("r-lower-limit").value) > parseInt(document.getElementById("r-upper-limit").value)) {
        document.getElementById("r-upper-limit").value = document.getElementById("r-lower-limit").value;
        updateLimit(document.getElementById("r-upper-limit"))
    }
    
    if (parseInt(document.getElementById("g-lower-limit").value) > parseInt(document.getElementById("g-upper-limit").value)) {
        document.getElementById("g-upper-limit").value = document.getElementById("g-lower-limit").value;
        updateLimit(document.getElementById("g-upper-limit"))
    }

    if (parseInt(document.getElementById("b-lower-limit").value) > parseInt(document.getElementById("b-upper-limit").value)) {
        document.getElementById("b-upper-limit").value = document.getElementById("b-lower-limit").value;
        updateLimit(document.getElementById("b-upper-limit"))
    }

    if (parseInt(document.getElementById("size-lower-limit").value) > parseInt(document.getElementById("size-upper-limit").value)) {
        document.getElementById("size-upper-limit").value = document.getElementById("size-lower-limit").value;
        updateLimit(document.getElementById("size-upper-limit"));
    }
}

var displayMenu = false;

function toggleMenu() {
    displayMenu = !displayMenu;
    if (displayMenu) {
        document.getElementsByClassName("menu-container")[0].style = "transform: scaleY(1); transition: transform 0.1s;";
        document.getElementById("menu").innerHTML = "Close Menu";
    }
    else {
        document.getElementsByClassName("menu-container")[0].style = "transform: scaleY(0); transition: transform 0.1s;";
        document.getElementById("menu").innerHTML = "Menu";
    }
}

toggleMenu();

updateLimit(document.getElementById("r-lower-limit"));
updateLimit(document.getElementById("g-lower-limit"));
updateLimit(document.getElementById("b-lower-limit"));

updateLimit(document.getElementById("r-upper-limit"));
updateLimit(document.getElementById("g-upper-limit"));
updateLimit(document.getElementById("b-upper-limit"));


updateLimit(document.getElementById("size-lower-limit"));
updateLimit(document.getElementById("size-upper-limit"));
updateLimit(document.getElementById("size-scale"));
updateLimit(document.getElementById("terminal-size-change"));

updateLimit(document.getElementById("variation-slider"));

