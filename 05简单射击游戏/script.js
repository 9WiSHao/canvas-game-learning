/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// 分开两个canvas，一个放图像，另一个是碰撞箱
const collisionCanvas = document.querySelector('#collisionCanvas');
const collisionCanvasCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
ctx.font = '50px Impact';
let gameOver = false;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let timeToNextUpdate = 0;
let updateInterval = 16;

// 乌鸦
let ravens = [];
class Raven {
	constructor() {
		this.spriteWidth = 271;
		this.spriteHeith = 194;
		this.sizeModifier = Math.random() * 0.6 + 0.4;
		this.width = this.spriteWidth * this.sizeModifier;
		this.height = this.spriteHeith * this.sizeModifier;
		this.x = canvas.width;
		this.y = Math.random() * (canvas.height - this.height);
		this.directionX = Math.random() * 5 + 3;
		this.directionY = Math.random() * 5 - 2.5;
		// 清除标志
		this.markedForDeletion = false;
		this.image = new Image();
		this.image.src = '../img/05/raven.png';
		this.frame = 0;
		this.maxFrame = 4;
		this.timeSinceFlap = 0;
		this.flapInterval = Math.random() * 50 + 50;
		// hitbox颜色
		this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
		this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;
		this.hasTrail = Math.random() > 0.5;
	}
	update(deltatime) {
		// 到顶底反弹
		if (this.y < 0 || this.y > canvas.height - this.height) {
			this.directionY *= -1;
		}
		this.x -= this.directionX;
		this.y += this.directionY;
		// 清除标志置零
		if (this.x < 0 - this.width) {
			this.markedForDeletion = true;
		}

		this.timeSinceFlap += deltatime;
		// 设置一个最小时间间隔才切换翅膀的动画帧
		if (this.timeSinceFlap > this.flapInterval) {
			if (this.frame > this.maxFrame) {
				this.frame = 0;
			} else {
				this.frame++;
			}
			this.timeSinceFlap = 0;
		}
		// 随机出乌鸦拥有粒子效果
		if (this.hasTrail) {
			for (let i = 0; i < 3; i++) {
				particles.push(new Particles(this.x, this.y, this.width, this.color));
			}
		}
		if (this.x < 0 - this.width) {
			gameOver = true;
		}
	}
	draw() {
		collisionCanvasCtx.fillStyle = this.color;
		collisionCanvasCtx.fillRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeith, this.x, this.y, this.width, this.height);
	}
}

// 点击后的爆炸
let explosions = [];
class Explosions {
	constructor(x, y, size) {
		this.image = new Image();
		this.image.src = '../img/05/boom.png';
		this.spriteWidth = 200;
		this.spriteHeith = 179;
		this.size = size;
		this.x = x;
		this.y = y;
		this.frame = 0;
		this.sound = new Audio();
		this.sound.src = '../sound/boom.wav';
		this.timeSinceLastFrame = 0;
		this.frameInterval = 60;
		this.markedForDeletion = false;
	}
	update(deltatime) {
		if (this.frame === 0) {
			this.sound.play();
		}
		this.timeSinceLastFrame += deltatime;
		if (this.timeSinceLastFrame > this.frameInterval) {
			this.frame++;
			this.timeSinceLastFrame = 0;
			if (this.frame > 5) {
				this.markedForDeletion = true;
			}
		}
	}
	draw() {
		ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeith, this.x, this.y - this.size / 4, this.size, this.size);
	}
}

// 粒子效果
let particles = [];
class Particles {
	constructor(x, y, size, color) {
		this.size = size;
		// 加了个随机出现位置
		this.x = x + this.size / 2 + Math.random() * 50 - 25;
		this.y = y + this.size / 3 + Math.random() * 50 - 25;
		this.radius = (Math.random() * this.size) / 10;
		this.maxRadius = Math.random() * 20 + 35;
		this.markedForDeletion = false;
		this.speedX = Math.random() * 1 + 0.5;
		this.color = color;
	}
	update() {
		this.x += this.speedX;
		this.radius += 0.5;
		if (this.radius > this.maxRadius - 5) {
			this.markedForDeletion = true;
		}
	}
	draw() {
		// 还是弄的调整的整个canvas的透明度，要只让它对一个东西生效就先保存再还原
		ctx.save();
		// 这里让更大的粒子更透明，实现渐消失
		ctx.globalAlpha = 1 - this.radius / this.maxRadius;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

function drawScore() {
	ctx.fillStyle = 'black';
	ctx.fillText('得分: ' + score, 50, 75);
	ctx.fillStyle = 'white';
	ctx.fillText('得分: ' + score, 52, 77);
}
function drawGameOver() {
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText('游戏结束，你的得分是 ' + score + ' 分', canvas.width / 2 - 2, canvas.height / 2 - 2);
	ctx.fillStyle = 'white';
	ctx.fillText('游戏结束，你的得分是 ' + score + ' 分', canvas.width / 2, canvas.height / 2);
}

// 点击判定并放爆炸效果
window.addEventListener('click', (e) => {
	const detectPixelColor = collisionCanvasCtx.getImageData(e.x, e.y, 1, 1);
	const pc = detectPixelColor.data;
	ravens.forEach((obj) => {
		if (obj.randomColors[0] === pc[0] && obj.randomColors[1] === pc[1] && obj.randomColors[2] === pc[2]) {
			obj.markedForDeletion = true;
			score++;
			explosions.push(new Explosions(obj.x, obj.y, obj.width));
		}
	});
});

// 这个参数是时间戳，在requestAnimationFrame调用的时候会被传入。
// 帧动画利用时间戳保证帧速率在不同电脑一样，而不是电脑快的就放的也快
function animate(timestamp = 0) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	collisionCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
	let deltatime = timestamp - lastTime;
	lastTime = timestamp;
	timeToNextRaven += deltatime;
	if (timeToNextRaven > ravenInterval) {
		ravens.push(new Raven());
		timeToNextRaven = 0;
		// 让大的在小的前面，有个景深效果，也就是小的排前面先渲染
		ravens.sort((a, b) => a.width - b.width);
	}
	drawScore();

	// 这里使用时间戳来控制每帧更新间隔，让所有机器一个速度。绘制就没用了，虽然说也能写里面
	timeToNextUpdate += deltatime;
	if (timeToNextUpdate > updateInterval) {
		/**
		 * 完全可以直接调数组的forEach方法，但是这么写扩展性好
		 * 比如说后续添加其他enemy类，只需要修改为[...ravens,...enemy1]
		 */
		[...particles, ...ravens, ...explosions].forEach((obj) => obj.update(deltatime));
		timeToNextUpdate = 0;
	}
	[...particles, ...ravens, ...explosions].forEach((obj) => obj.draw());
	// 删除飞过屏幕的乌鸦，点击过的乌鸦，走完的爆炸效果和粒子
	ravens = ravens.filter((obj) => !obj.markedForDeletion);
	explosions = explosions.filter((obj) => !obj.markedForDeletion);
	particles = particles.filter((obj) => !obj.markedForDeletion);
	if (!gameOver) {
		requestAnimationFrame(animate);
	} else {
		drawGameOver();
	}
}
animate();
