const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

let timer = 60;
let timerId;

const gravity = 0.7;

const background = new Sprite({
  imageSrc: "assets/background.png",

  position: {
    x: 0,
    y: 0,
  },
});

const shop = new Sprite({
  imageSrc: "assets/shop.png",

  position: {
    x: 610,
    y: 128,
  },
  framesMax: 6,
  scale: 2.75,
});

const samuraiMack = new Fighter({
  healthBarId: "#player1-health",
  scale: 2.5,

  sprites: {
    idle: {
      imageSrc: "assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack: {
      imageSrc: [
        "assets/samuraiMack/Attack2.png",
        "assets/samuraiMack/Attack1.png",
      ],
      framesMax: 6,
      frameHit: 5,
    },
    takeHit: {
      imageSrc: "assets/samuraiMack/Take Hit - White Silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  offset: {
    x: 215,
    y: 157,
  },

  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  keys: {
    jump: {
      key: "W",
    },
    left: {
      key: "A",
    },
    right: {
      key: "D",
    },
    attack: {
      key: " ",
    },
  },
  attackBox: {
    offset: { x: 70, y: 50 },
    width: 160,
    height: 50,
  },
  damage: 20,
});

const kenji = new Fighter({
  healthBarId: "#player2-health",
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack: {
      imageSrc: ["assets/kenji/Attack1.png", "assets/kenji/Attack2.png"],
      framesMax: 4,
      frameHit: 2,
    },
    takeHit: {
      imageSrc: "assets/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "assets/kenji/Death.png",
      framesMax: 7,
    },
  },

  position: {
    x: 400,
    y: 0,
  },
  offset: {
    x: 215,
    y: 167,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  keys: {
    jump: {
      key: "ArrowUp",
    },
    left: {
      key: "ArrowLeft",
    },
    right: {
      key: "ArrowRight",
    },
    attack: {
      key: "Meta",
    },
  },
  attackBox: {
    offset: { x: -170, y: 50 },
    width: 170,
    height: 50,
  },
  damage: 10,
});

const updateSamuraiMack = () => update(samuraiMack, kenji);
const updateKenji = () => update(kenji, samuraiMack);

function animate() {
  window.requestAnimationFrame(animate);

  background.update();
  shop.update();

  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  updateSamuraiMack();
  updateKenji();

  if (samuraiMack.health === 0 || kenji.health === 0)
    determineWinner(samuraiMack, kenji);
}

decreaseTimer(samuraiMack, kenji);
animate();

addMovement(samuraiMack);
addMovement(kenji);
