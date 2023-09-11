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
enemyImage.src = '../img/03/enemy4.png';

class Enemy {
	constructor() {
		this.speed = Math.random() * 4 + 1;
		this.spriteWidth = 213;
		this.spriteHeight = 213;
		this.width = this.spriteWidth / 2;
		this.height = this.spriteHeight / 2;
		this.x = Math.random() * (canvas.width - this.width);
		this.y = Math.random() * (canvas.height - this.height);
		this.newX = Math.random() * (canvas.width - this.width);
		this.newY = Math.random() * (canvas.height - this.height);
		this.frame = 0;
		this.flapSpeed = Math.floor(Math.random() * 6 + 1);
		this.interval = Math.floor(Math.random() * 200 + 200);
	}
	update() {
		if (gameFrame % this.interval === 0) {
			this.newX = Math.random() * (canvas.width - this.width);
			this.newY = Math.random() * (canvas.height - this.height);
		}
		let dx = this.x - this.newX;
		let dy = this.y - this.newY;
		this.x -= dx / 100;
		this.y -= dy / 100;

		this.angle += this.angleSpeed;
		if (this.x + this.width < 0) {
			this.x = canvas.width;
		}

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
