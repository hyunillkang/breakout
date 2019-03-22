const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let stage = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
];
addEventListener("keypress", function (event) {

    switch (event.keyCode) {
        case 97:
            player.positionX -= 5;
            break;
        case 100:
            player.positionX += 5;
            break;
    }
    player.draw();

});


function Block(positionX, positionY, color) {
    this.width = 48;
    this.height = 24;
    this.positionX = positionX;
    this.positionY = positionY;
    this.color = color;

    this.draw = function () {
        context.fillStyle = this.color;
        context.fillRect(this.positionX, this.positionY, this.width, this.height);
        context.strokeStyle = "black";
        context.strokeRect(this.positionX, this.positionY, this.width, this.height);
    };

    this.destroy = function () {
        context.clearRect(this.positionX, this.positionY, this.width, this.height);
        stage[positionY/this.height][positionX/this.width] = 0;
        delete this;
    }
}

let player = {
    width: 400,
    height: 40,
    positionX: canvas.width / 2 - 50,
    positionY: canvas.height - 100,
    velocityX: 0,
    velocityY: 0,

    draw: function () {
        context.fillStyle = "#cccccc";
        context.fillRect(this.positionX, this.positionY, this.width, this.height);
        context.strokeStyle = "red";
        context.strokeRect(this.positionX, this.positionY, this.width, this.height);
    },
}

let ball = {
    radius: 10,
    positionX: canvas.width / 2,
    positionY: canvas.width / 2,
    velocityX: 5,
    velocityY: 10,

    draw: function () {
        context.fillStyle = "blue";
        context.strokeStyle = "black";
        context.beginPath();
        context.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    },


    collision: function (object, type) {
        if (this.positionX + this.velocityX < 0 || this.positionX + this.velocityX > canvas.width) {
            this.velocityX = -this.velocityX;
        }

        if (this.positionY + this.velocityY < 0 || this.positionY + this.velocityY > canvas.height) {
            this.velocityY = -this.velocityY;
        }

        if (object.positionX < this.positionX + this.radius + this.velocityX &&
            this.positionX - this.radius + this.velocityX < object.positionX + object.width &&
            object.positionY < this.positionY && this.positionY < object.positionY + object.height) {
            this.velocityX = -this.velocityX;
            if (object instanceof Block) {
                console.log("block");
                object.destroy();
            }
        }

        if (object.positionY < this.positionY + this.radius + this.velocityY &&
            this.positionY - this.radius + this.velocityY < object.positionY + object.height &&
            object.positionX < this.positionX && this.positionX < object.positionX + object.width) {
            this.velocityY = -this.velocityY;
            if (object instanceof Block) {
                console.log("block");
                object.destroy();
            }
        }


    },

    update: function () {
        this.collision(player);
        this.positionX += this.velocityX;
        this.positionY += this.velocityY;
    },
}

let lastTime = 0;
let deltaTime = 0;

function update(currentTime) {
    deltaTime += currentTime - lastTime;

    if (deltaTime >= 1000 / 60) {
        ball.update();
        draw();
        deltaTime = 0;
    }

    lastTime = currentTime;
    requestAnimationFrame(update);
}

requestAnimationFrame(update);

let color = "#" + Math.floor((Math.random() * 0xFFFFFF)).toString(16);

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < stage.length; row++) {
        for (let col = 0; col < stage[row].length; col++) {
            if (stage[row][col] == 1) {
                let block = new Block(col * 48, row * 24, color);
                block.draw();
                ball.collision(block);
            }
        }
    }

    player.draw();
    ball.draw();

}

function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.strokeStyle = "black";
    context.fillRect(x * 48, y * 24, 48, 24);
    context.strokeRect(x * 48, y * 24, 48, 24);
}

function drawPlayer() {
    console.log(player);
    player.test();
    context.fillRect(player.positionX, player.positionY, player.width, player.height);
}