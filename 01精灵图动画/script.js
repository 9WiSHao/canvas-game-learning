let playerState = 'idle';
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function (e) {
	playerState = e.target.value;
});

const canvas = document.getElementById('canvas1');
// 获取画布上下文，2d是说明是2d画布。ctx里现在存所有的画布方法
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

// 创建一个存精灵图的对象
const playerImage = new Image();
playerImage.src = '../img/01/项目1.png';
const spriteWidth = 575;
const spriteHeight = 523;

let frameX = 0;
let frameY = 0;
let gameFrame = 0;
let staggerFrames = 5;
let spriteAnimations = [];
const animationStates = [
	{
		name: 'idle',
		frames: 7,
	},
	{
		name: 'jump',
		frames: 7,
	},
	{
		name: 'fall',
		frames: 7,
	},
	{
		name: 'run',
		frames: 9,
	},
	{
		name: 'dizzy',
		frames: 11,
	},
	{
		name: 'sit',
		frames: 5,
	},
	{
		name: 'roll',
		frames: 7,
	},
	{
		name: 'bite',
		frames: 7,
	},
	{
		name: 'ko',
		frames: 12,
	},
	{
		name: 'getHit',
		frames: 4,
	},
];
animationStates.forEach((state, index) => {
	let frames = {
		location: [],
	};
	for (let j = 0; j < state.frames; j++) {
		let positionX = j * spriteWidth;
		let positionY = index * spriteHeight;
		frames.location.push({ x: positionX, y: positionY });
	}
	spriteAnimations[state.name] = frames;
});

function animate() {
	// 每一帧开始先清除画布之前内容
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	// 矩形画法，前两个参数是左上角，后两个是宽高
	// ctx.fillRect(50, 50, 100, 100);

	// 图片的传法，第一个是图片，2 3是图片起始点（左上角），4 5是图片拉伸大小
	// ctx.drawImage(playerImage, 0, 0, 6000, 6000);
	// 还有九个参数的版本，sx sy是图片剪裁起始点，sw sh是剪裁长宽
	// dx dy是图片放置位置起始点，dw dh是图片放置长宽
	// ctx.drawImage(playerImage, sx, sy, sw, sh, dx, dy, dw, dh);

	let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].location.length;
	frameX = spriteAnimations[playerState].location[position].x;
	frameY = spriteAnimations[playerState].location[position].y;
	ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);

	gameFrame++;

	requestAnimationFrame(animate);
}

animate();
