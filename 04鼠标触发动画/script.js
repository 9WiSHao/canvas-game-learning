/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;

const explosions = [];

let canvasPosition = canvas.getBoundingClientRect();

class Explosions {
	constructor(x, y) {
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		// 这是画到画布上的大小调整，可以任意值，最好和原始图一个比例避免缩放
		this.width = this.spriteWidth * 0.7;
		this.height = this.spriteHeight * 0.7;
		this.x = x;
		this.y = y;
		this.image = new Image();
		this.image.src = '../img/04/boom.png';
		this.frame = 0;
		this.timer = 0;
		this.angle = Math.random() * 6.28;
		this.sound = new Audio();
		this.sound.src = '../sound/boom.wav';
	}
	update() {
		if (this.frame === 0) {
			this.sound.play();
		}
		this.timer++;
		if (this.timer % 20 === 0) {
			this.frame++;
		}
	}
	draw() {
		ctx.save();
		/**
		 * 这里的旋转是通过旋转整体画布的坐标来实现的，所以保存一个初始状态供恢复
		 * 移动了整体坐标，所以就直接在坐标起始点0，0开画，就是鼠标点击起始点
		 * 然后移动图到中心就行了
		 */
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		// 图片，图片上剪裁起始点与大小，绘制起始点与大小
		ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
		ctx.restore();
	}
}

window.addEventListener('click', (e) => {
	creatAnimation(e);
});

function creatAnimation(e) {
	let positionX = e.x - canvasPosition.left;
	let positionY = e.y - canvasPosition.top;
	explosions.push(new Explosions(positionX, positionY));
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < explosions.length; i++) {
		explosions[i].update();
		explosions[i].draw();
		// 删除动画走完了的对象
		if (explosions[i].frame > 5) {
			explosions.splice(i, 1);
			i--;
		}
	}

	requestAnimationFrame(animate);
}
animate();
