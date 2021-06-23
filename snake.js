function drawGrid(context, w, h, sqrSize) {
    context.lineWidth = 1;
    context.fillStyle = "white";
    context.strokeStyle = "rgb(33,33,33)";
    for (let x = 0; x < w; x += sqrSize) {
        for (let y = 0; y < h; y += sqrSize) {
            context.fillRect(x, y, sqrSize, sqrSize);
            context.strokeRect(x, y, sqrSize, sqrSize);
        }
    }
}

function drawSnake(context, snake, snakeColor, sqrSize) {
    snake.forEach(snek => {
        context.lineWidth = 3;
        context.fillStyle = snakeColor.inner;
        context.strokeStyle = snakeColor.border;
        context.fillRect(snek.x, snek.y, sqrSize, sqrSize);
        context.strokeRect(snek.x, snek.y, sqrSize, sqrSize);
    });
}

function randFood(min, max, sqrSize) {
    return Math.round((Math.random() * (max - min) + min) / sqrSize) * sqrSize;
}

function drawFood(snakeCanvas, context, snake, snakeColor, sqrSize) {
    context.lineWidth = 3;
    context.fillStyle = snakeColor.inner;
    context.strokeStyle = snakeColor.border;

    let x = randFood(0, snakeCanvas.width, sqrSize);
    let y = randFood(0, snakeCanvas.height, sqrSize);

    let redo = true;
    while (redo) {
        for (let snek of snake) {
            if (snek.x === x || snek.y === y) {
                x = randFood(0, snakeCanvas.width, sqrSize);
                y = randFood(0, snakeCanvas.height, sqrSize);
                break;
            }
        }
        redo = false;
    }

    context.fillRect(x, y, sqrSize, sqrSize);
    context.strokeRect(x, y, sqrSize, sqrSize);
    return {x: x, y: y};
}

function redrawFood(context, food, sqrSize) {
    context.lineWidth = 3;
    context.fillStyle = snakeColor.inner;
    context.strokeStyle = snakeColor.border;

    context.fillRect(food.x, food.y, sqrSize, sqrSize);
    context.strokeRect(food.x, food.y, sqrSize, sqrSize);
}

function drawText(snakeCanvas, context, text, sqrSize) {
    context.font = "50px serif";
    context.fillStyle = "black";
    context.fillRect(0, 0, snakeCanvas.width, 60)
    context.fillStyle = "white";
    context.fillText(text, sqrSize, 4 * sqrSize);
}

function moveSnake(snake, dx, dy) {
    snake.push({x: snake[snake.length - 1].x + dx, y: snake[snake.length - 1].y + dy});
    snake.shift();
}

function hasGameEnded(snakeCanvas, snake, sqrSize) {
    for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].x === snake[snake.length - 1].x && snake[i].y === snake[snake.length - 1].y) { // collision
            return true;
        }
    }
    return snake[snake.length - 1].x < 0 || snake[snake.length - 1].x > snakeCanvas.width - sqrSize || snake[snake.length - 1].y < 0 || snake[snake.length - 1].y > snakeCanvas.height - sqrSize;
}


let snakeCanvas = document.getElementById("snake-canvas");
let context = snakeCanvas.getContext("2d");
const sqrSize = 10;

snakeCanvas.width = 700;
snakeCanvas.height = 500;

let snake = [
    {x: snakeCanvas.width / 2 - 2 * sqrSize, y: snakeCanvas.height / 2},
    {x: snakeCanvas.width / 2 - sqrSize, y: snakeCanvas.height / 2},
    {x: snakeCanvas.width / 2, y: snakeCanvas.height / 2},
    {x: snakeCanvas.width / 2 + sqrSize, y: snakeCanvas.height / 2},
    {x: snakeCanvas.width / 2 + 2 * sqrSize, y: snakeCanvas.height / 2},
];

let snakeColor = {
    inner: "turquoise",
    border: "#009879",
};

let playing = false;
let ended = false;
// initial direction right
let dx = sqrSize;
let dy = 0;
const speed = 45;
let down = false;
document.addEventListener("keydown", event => {
    if (down) return;
    down = true;
    const goingUp = dy === -sqrSize;
    const goingDown = dy === sqrSize;
    const goingRight = dx === sqrSize;
    const goingLeft = dx === -sqrSize;

    if (event.key === "ArrowUp" && !goingDown) {
        dx = 0;
        dy = -sqrSize;
    }

    if (event.key === "ArrowDown" && !goingUp) {
        dx = 0;
        dy = sqrSize;
    }

    if (event.key === "ArrowLeft" && !goingRight) {
        dx = -sqrSize;
        dy = -0;
    }

    if (event.key === "ArrowRight" && !goingLeft) {
        dx = sqrSize;
        dy = 0;
    }

    if (event.key === "Enter" && !playing) {
        snake = [
            {x: snakeCanvas.width / 2 - 2 * sqrSize, y: snakeCanvas.height / 2},
            {x: snakeCanvas.width / 2 - sqrSize, y: snakeCanvas.height / 2},
            {x: snakeCanvas.width / 2, y: snakeCanvas.height / 2},
            {x: snakeCanvas.width / 2 + sqrSize, y: snakeCanvas.height / 2},
            {x: snakeCanvas.width / 2 + 2 * sqrSize, y: snakeCanvas.height / 2},
        ];
        playing = true;
        ended = false;
        window.requestAnimationFrame(loop);
    }
}, false);

document.addEventListener("keyup", () => {
    down = false;
}, false)

window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

// Init
drawGrid(context, snakeCanvas.width, snakeCanvas.height, sqrSize);
drawText(snakeCanvas, context, "Press ENTER to play", sqrSize);
let food = drawFood(snakeCanvas, context, snake, snakeColor, sqrSize);
drawSnake(context, snake, snakeColor, sqrSize);

let previousTime = 0.0;
const loop = time => {
    const dt = time - previousTime;
    if (dt > speed) {
        previousTime = time;

        // render + update
        drawGrid(context, snakeCanvas.width, snakeCanvas.height, sqrSize);
        if (snake[snake.length - 1].x === food.x && snake[snake.length - 1].y === food.y) { // collision
            console.log("HERE");
            snake.push({x: snake[snake.length - 1].x + dx, y: snake[snake.length - 1].y + dy});
            food = drawFood(snakeCanvas, context, snake, snakeColor, sqrSize);
        } else {
            redrawFood(context, food, sqrSize);
        }
        moveSnake(snake, dx, dy);
        drawSnake(context, snake, snakeColor, sqrSize);
    }

    if (hasGameEnded(snakeCanvas, snake, sqrSize)) {
        playing = false;
        ended = true;
    }

    // repeat
    if (playing) {
        window.requestAnimationFrame(loop);
    } else {
        if (ended) {
            drawText(snakeCanvas, context, "Press ENTER to restart", sqrSize);
        }
        playing = false;
    }
};

// launch
window.requestAnimationFrame(time => {
    previousTime = time;
    window.requestAnimationFrame(loop);
});

