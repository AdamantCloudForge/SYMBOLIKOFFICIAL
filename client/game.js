// client/game.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;  // Width of the game area
canvas.height = 400; // Height of the game area

let player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    color: 'green',
    speed: 5,
    isAlive: true,
};

let levelComplete = false;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawLevel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawPlayer();

    // Simulate level completion
    if (player.x >= canvas.width - player.width) {
        levelComplete = true;
        player.isAlive = false;
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Level Complete!", canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText("Redirecting...", canvas.width / 2 - 100, canvas.height / 2 + 40);
        setTimeout(() => {
            window.location.href = "#music"; // Redirect to main page
        }, 2000);
    }
}

function update() {
    if (player.isAlive) {
        if (keys.ArrowRight && player.x < canvas.width - player.width) {
            player.x += player.speed; // Move right
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed; // Move left
        }
        drawLevel();
    }
}

let keys = {
    ArrowRight: false,
    ArrowLeft: false,
};

window.addEventListener("keydown", (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Start game when button is clicked
document.getElementById("startGameButton").addEventListener("click", () => {
    document.getElementById("game").style.display = "block";
    document.getElementById("startGameButton").style.display = "none";
    gameLoop();
});
