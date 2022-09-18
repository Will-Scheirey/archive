var basePath = 'https://cdn.rawgit.com/Petlja/pygame4skulpt/3435847b/pygame/';
    Sk.externalLibraries = {
        'pygame': {
            path: basePath + '__init__.js',
        },
        'pygame.display': {
            path: basePath + 'display.js',
        },
        'pygame.draw': {
            path: basePath + 'draw.js',
        },
        'pygame.event': {
            path: basePath + 'event.js',
        },
        'pygame.font': {
            path: basePath + 'font.js',
        },
        'pygame.image': {
            path: basePath + 'image.js',
        },
        'pygame.key': {
            path: basePath + 'key.js',
        },
        'pygame.mouse': {
            path: basePath + 'mouse.js',
        },
        'pygame.time': {
            path: basePath + 'time.js',
        },
        'pygame.transform': {
            path: basePath + 'transform.js',
        },
        'pygame.version': {
            path: basePath + 'version.js',
        },
    };

    function printString(text) {
        var output = document.getElementById("output");
        text = text.replace(/</g, '&lt;');
        output.innerHTML = output.innerHTML + text;
    }

    function clearOutput() {
        var output = document.getElementById("output");
        output.innerHTML = '';
    }

    function builtinRead(x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    }

    function runCode() {
        document.getElementById('runbutton').disabled = true;
        $(".output-container").css("display", "flex");

        var div = document.createElement("div")
        div.className = "cover"
        document.getElementsByTagName("main")[0].appendChild(div);

        Sk.main_canvas = document.createElement("canvas");
        
        var cont = document.getElementsByClassName("canvas-container")[0]
        cont.appendChild(Sk.main_canvas)
        $("#exit").css("display", "block");
        Sk.quitHandler = function () {
            sessionStorage.setItem("code", ace.edit("editor").getValue());
            location.reload();
        };
        var prog = ace.edit("editor").getValue();

        Sk.misceval.asyncToPromise(function () {
            try {
                return Sk.importMainWithBody("<stdin>", false, prog, true);
            } catch (e) {
                alert(e)
            }
        });
    }

    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
    Sk.configure({read: builtinRead, output: printString});
    $("#runbutton").click(function () {
        sessionStorage.setItem("code", ace.edit("editor").getValue());
        sessionStorage.setItem("run_code", true)
        location.reload();
    });

    if (sessionStorage.getItem("code")){
        editor.setValue(sessionStorage.getItem("code"), -1)
        if (sessionStorage.getItem("run_code")) {
            runCode()
        }
    }
    else{
        var sourcePath = "main.py";
        $.get(sourcePath, function (data) {
            editor.setValue(data, -1);
        });
    }

    sessionStorage.removeItem("code");
    sessionStorage.removeItem("run_code");

    window.onbeforeunload = closingCode;
    function closingCode(){
        Sk.insertEvent('quit');
        return null;
    }


