const c = document.getElementById("canvas"),
    ctx = c.getContext("2d"),
    console = document.getElementById("console"),
    WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
var x_offset = 0,
    y_offset = 0,
    entities = [];

function insideRect(x, y, i, options = 1) {
    //checks if the x/y position given is within button number i, and return what option for selectors
    //console.innerHTML = (x > i.x && x < i.x + i.width && y > i.y && y < i.y + i.height)
    if (options == 1) return (x > i.x && x < i.x + i.width && y > i.y && y < i.y + i.height)
    for (let j = 0; j < options; j++) {
        if (x > i.x && x < i.x + i.width && y > i.y + (i.height / options * j) && y < i.y + i.height - (i.height - (i.height / options * (j + 1)))) return j;
    }
}

// Entities
class Entity {
    //initialize the entity and fill it with whatever text is needed
    constructor(PROPS = [1, 1, 1, 1, entities.length], CONTENT = ["", 1, 1, "start", 1], type) {
        this.x = PROPS[0];
        this.y = PROPS[1];
        this.width = PROPS[2];
        this.height = PROPS[3];
        this.state = 1;
        this.id = PROPS[4];
        this.type = type;
        if (type == 3) this.state = 0
        this.refresh = function () {
            let stringLines = [];
            ctx.beginPath();
            ctx.lineWidth = 2;
            switch (type) {
                case 3:
                    this.options = (CONTENT[0].match(/#b/g) || []).length + 1;
                    for (let i = 0; i < this.options; i++) {
                        if (this.state == i) ctx.fillStyle = "grey";
                        else ctx.fillStyle = "white";
                        ctx.beginPath();
                        ctx.rect(this.x, this.y + (i * (this.height / this.options)), this.width, this.height / this.options);
                        ctx.fill();
                    }
                    ctx.textAlign = CONTENT[3];
                    ctx.font = (CONTENT[4]) + "px Corsiva";
                    stringLines = CONTENT[0].split("#b");
                    for (let i = 0; i < stringLines.length; i++) {
                        ctx.fillStyle = 'black';
                        ctx.fillText(i + "- " + stringLines[i], this.x + CONTENT[1], this.y + CONTENT[2] + (CONTENT[4]) + (i * (this.height / this.options)));
                    }
                    break;
                case 2:
                    //if it's a button add click sensing and functions based on id
                    break;
                case 1:
                    /*ctx.beginPath();
                    ctx.textAlign = "center";
                    ctx.fillText("press enter", this.x + (this.width / 2), this.y + this.height - (this.height / 20));*/
                    break;
            }
            this.clicked = function (event) {
                switch (this.id) {
                    case "optionsBack":
                        entities = [];
                        startScreen();
                        break;
                    case "gamestartselect":
                    case "optionsMenu":
                        numberSubmit(insideRect(event.clientX, event.clientY, this, this.options))
                        break;
                }
            }
            if (type == 2 || type == 1) {
                ctx.textAlign = CONTENT[3];
                ctx.font = (CONTENT[4]) + "px Corsiva";
                stringLines = CONTENT[0].split("#b");
                for (let i = 0; i < stringLines.length; i++) {
                    while (stringLines[i].length > (WIDTH - 20) / (WIDTH / 90)) {
                        stringLines.splice(i, 0, stringLines[i].substring(0, (WIDTH - 20) / (WIDTH / 90)));
                        stringLines[i + 1] = stringLines[i + 1].substring((WIDTH - 20) / (WIDTH / 90));
                        if (stringLines[i + 1][0] == " ") stringLines[i + 1] = stringLines[i + 1].substring(1);
                    }
                    ctx.fillText(stringLines[i], this.x + CONTENT[1], this.y + CONTENT[2] + (CONTENT[4] * i));
                    if (i > 2) break;
                }
            }
            ctx.beginPath();
            ctx.fillStyle = "black"
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
}

function refresh() {
    //refreshes the page and all its components when called
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < entities.length; i++) entities[i].refresh();
}

function moveIn() {
    //used to make an entity glide onscreen such as a textbox
    //first argument is the total movement (will be over the course of 1/2 a second), the rest are properties used to spawn an entity
    let t = new Entity(arguments[1], arguments[2], arguments[3]);
    entities.push(t);
    for (let i = 0; i < 100; i++)
        setTimeout(() => {
            t.x += arguments[0] / 100;
            refresh();
        }, 5 * i);
}

function init() {
    //sizes the canvas appropriately and resets the console before refreshing everything
    ctx.canvas.width = WIDTH;
    ctx.canvas.height = HEIGHT;
    console.innerHTML = "";
    startScreen();
    refresh();
}

function getMousePosition(event) {
    //runs on click and checks if you are hovering any buttons on the list
    for (let i = 0; i < entities.length; i++) if (insideRect(event.clientX, event.clientY, entities[i])) entities[i].clicked(event);
}
function numberSubmit(num) {
    for (let i = 0; i < entities.length; i++) if (entities[i].type == 3 && entities[i].options > num) select = entities[i];
    if (num == -1) num = select.state;
    if (num == -3 && select.state + 1 < select.options) num = select.state + 1;
    else if (num == -2 && select.state - 1 >= 0) num = select.state - 1;
    else if (num == -2 || num == -3) return;
    if (select.state != num) select.state = num;
    else {
        switch (select.id) {
            case "gamestartselect":
                switch (select.state) {
                    case 0:
                        createNewGame()
                        break;
                    case 1:
                        loadSaveGame()
                        break;
                    case 2:
                        showOptions()
                        break;
                }
                break;
        }
    }
    refresh();
}
function keyPress(event) {
    var keyCode = event.which || event.keyCode;
    switch (keyCode) {
        case 13:
            numberSubmit(-1);
            break;
        case 48:
            numberSubmit(0);
            break;
        case 49:
            numberSubmit(1);
            break;
        case 50:
            numberSubmit(2);
            break;
        case 51:
            numberSubmit(3);
            break;
        case 38:
            numberSubmit(-2);
            break;
        case 40:
            numberSubmit(-3);
            break;
    }
}

c.addEventListener("mousedown", function (e) {
    getMousePosition(e);
});
document.addEventListener('keydown', function (e) {
    keyPress(e);
});

function createNewGame() {
    console.innerHTML = "creating!"
}
function loadSaveGame() {
    console.innerHTML = "loading!"
}
function startScreen() {
    moveIn(WIDTH / 4 + 10, [-WIDTH / 4, HEIGHT / 45, WIDTH / 4, HEIGHT / 4, "testingbtn"], ["press me", HEIGHT / 45, HEIGHT / 20, "start", WIDTH / 47], 2);
    moveIn(WIDTH + 10, [-WIDTH, HEIGHT - (HEIGHT / 4) - (HEIGHT / 30), WIDTH - 20, HEIGHT / 4, "gamestartselect"],
        ["Load Game#bNew Game#bOptions", HEIGHT / 45, 0, "start", WIDTH / 47], 3);
}
function showOptions() {
    entities = [];
    moveIn(WIDTH + 10, [-WIDTH, 0 + (HEIGHT / 45), WIDTH - 20 - (WIDTH/5), HEIGHT * 0.2 - (HEIGHT / 15), "optionsTitle"],
        ["Options Menu", HEIGHT / 45, HEIGHT * 0.2 - (HEIGHT / 8), "start", WIDTH / 47], 1);
    moveIn(-WIDTH + WIDTH - (WIDTH/5), [WIDTH, 0 + (HEIGHT / 45), WIDTH/5 - 10, HEIGHT * 0.2 - (HEIGHT / 15), "optionsBack"],
        ["< Back", HEIGHT / 45, HEIGHT * 0.2 - (HEIGHT / 8), "start", WIDTH / 47], 2);
    moveIn(-WIDTH + 10, [WIDTH, HEIGHT - (HEIGHT * 0.8) - (HEIGHT / 30), WIDTH - 20, HEIGHT * 0.8, "optionsMenu"],
        ["Game Speed#bCheat Mode#bImortal Mode#bOption 4#bOption 5#bOption 6", HEIGHT / 45, 0, "start", WIDTH / 47], 3);
}

//set everything important up then set up the front page to start
init()