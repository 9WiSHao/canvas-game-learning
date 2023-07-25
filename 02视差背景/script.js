const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

let gameSpeed = 4;
// let gameFrame = 0;

const backgroundLayer1 = new Image();
backgroundLayer1.src = '../img/02/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = '../img/02/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = '../img/02/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = '../img/02/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = '../img/02/layer-5.png';

window.addEventListener('load', () => {

    const slider = document.querySelector('#slider');
    slider.value = gameSpeed;
    const showGameSpeed = document.querySelector('#showGameSpeed');
    showGameSpeed.innerHTML = gameSpeed;
    slider.addEventListener('change', (e) => {
        gameSpeed = e.target.value;
        showGameSpeed.innerHTML = e.target.value;
    });

    class Layer {
        constructor(image, speedModifier) {
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }

        update() {
            // 更新速度
            this.speed = gameSpeed * this.speedModifier;
            // 这是让背景图循环播放，向左移动到底之后就回来重新移动。
            if (this.x <= -this.width) {
                this.x = 0;
            }
            this.x = Math.floor(this.x - this.speed);
            // 本来想说这么写游戏速度就和帧率相关了，不太好，但是看了看之前写的其实也是
            // this.x = gameFrame * gameSpeed % this.width;
        }

        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            // this.width + this.x 这句让第二张图补充第一张图返回的空隙
            ctx.drawImage(this.image, this.width + this.x, this.y, this.width, this.height);
        }
    }

    const Layer1 = new Layer(backgroundLayer1, 0.2);
    const Layer2 = new Layer(backgroundLayer2, 0.4);
    const Layer3 = new Layer(backgroundLayer3, 0.6);
    const Layer4 = new Layer(backgroundLayer4, 0.8);
    const Layer5 = new Layer(backgroundLayer5, 1);

    const gameObjects = [Layer1, Layer2, Layer3, Layer4, Layer5];


    function animate() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        gameObjects.forEach((object) => {
            object.update();
            object.draw();
        });
        // gameFrame--;
        requestAnimationFrame(animate);
    }

    animate();
});