/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const NUMBER_OF_ENEMIES = 50;
let enemiesArry = [];
let gameFrame = 0;

const enemyImage = new Image();
enemyImage.src = '../img/03/enemy1.png';

class Enemy {
	constructor() {
		// this.speed = Math.random() * 4 - 2;
		this.spriteWidth = 293;
		this.spriteHeight = 155;
		this.width = this.spriteWidth / 2;
		this.height = this.spriteHeight / 2;
		this.x = Math.random() * (canvas.width - this.width);
		this.y = Math.random() * (canvas.height - this.height);
		this.frame = 0;
		this.flapSpeed = Math.floor(Math.random() * 6 + 1);
	}
	update() {
		this.x += Math.random() * 5 - 2.5;
		this.y += Math.random() * 10 - 5;
		if (gameFrame % this.flapSpeed == 0) {
			this.frame++;
			this.frame %= 6;
		}
	}
	draw() {
		// 1图像路径，2-4原图上剪裁起始点与大小，6-8画到画面上的起始点与大小
		ctx.drawImage(enemyImage, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
	}
}

for (let i = 0; i < NUMBER_OF_ENEMIES; i++) {
	enemiesArry.push(new Enemy());
}

function animate() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	enemiesArry.forEach((enemy) => {
		enemy.update();
		enemy.draw();
	});
	gameFrame++;
	requestAnimationFrame(animate);
}

animate();
