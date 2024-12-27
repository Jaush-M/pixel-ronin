class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    framesCurrent = 0,
    framesEllapsed = 0,
    framesHold = 8,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = framesCurrent;
    this.framesEllapsed = framesEllapsed;
    this.framesHold = framesHold;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      (this.image.width / this.framesMax) * this.framesCurrent,
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesEllapsed++;

    if (this.framesEllapsed % this.framesHold === 0) {
      this.framesEllapsed = 0;

      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    keys,
    position,
    velocity,
    color = "red",
    offset = { x: 0, y: 0 },
    imageSrc,
    scale = 1,
    framesMax = 1,
    framesCurrent = 0,
    framesEllapsed = 0,
    framesHold = 5,
    sprites,
    attackBox,
    width = 50,
    height = 150,
    healthBarId,
    damage,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      framesCurrent,
      framesEllapsed,
      framesHold,
      offset,
    });

    this.keys = {
      left: {
        pressed: false,
        key: keys.left.key,
      },
      right: {
        pressed: false,
        key: keys.right.key,
      },
      jump: {
        pressed: false,
        key: keys.jump.key,
      },
      attack: {
        pressed: false,
        key: keys.attack.key,
      },
    };

    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };

    this.lastKey;
    this.isAttacking;
    this.movementSpeed = 5;
    this.jumpHeight = -20;
    this.health = 100;
    this.isDead = false;
    this.damage = damage;
    this.healthBarId = healthBarId;
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.width = width;
    this.height = height;

    this.sprites = sprites;
    for (const key in this.sprites) {
      const sprite = this.sprites[key];

      if (Array.isArray(sprite.imageSrc)) {
        sprite.image = sprite.imageSrc.map((src) => {
          const img = new Image();
          img.src = src;
          return img;
        });
        sprite.imageCurrent = 0;
      } else {
        const img = new Image();
        img.src = sprite.imageSrc;
        sprite.image = img;
      }
    }
  }

  update() {
    this.draw();

    if (!this.isDead) this.animateFrames();

    // Draw sprite
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Attackbox
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Draw attackbox
    // if (this.isAttacking) {
    //   c.fillRect(
    //     this.attackBox.position.x,
    //     this.attackBox.position.y,
    //     this.attackBox.width,
    //     this.attackBox.height
    //   );
    // }

    // Prevent out of bounds movement
    if (
      (this.position.x > 0 || this.velocity.x > 0) &&
      (this.position.x < canvas.width - 60 || this.velocity.x < 0)
    ) {
      this.position.x += this.velocity.x;
    }
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.keys.jump.pressed = false;
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite(this.sprites.attack);
    this.isAttacking = true;
  }

  takeHit(damage) {
    if (timer === 0) return;

    this.health -= damage;

    if (this.health <= 0) {
      this.switchSprite(this.sprites.death);
    } else {
      this.switchSprite(this.sprites.takeHit);
    }

    gsap.to(this.healthBarId, {
      width: this.health + "%",
    });
  }

  shouldHoldAnimation(animations) {
    return animations.some((animation) => {
      const currentImage = Array.isArray(animation.image)
        ? animation.image[animation.imageCurrent]
        : animation.image;

      // Check if the current image matches and the animation is not complete
      const shouldHold =
        this.image === currentImage &&
        this.framesCurrent < animation.framesMax - 1;

      // Only change to the next image when the animation is fully rendered
      if (!shouldHold && this.framesCurrent === animation.framesMax - 1) {
        animation.imageCurrent =
          (animation.imageCurrent + 1) % animation.image.length;
      }

      return shouldHold;
    });
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.isDead = true;
      return;
    }

    // Check if the current animation should hold
    if (this.shouldHoldAnimation([this.sprites.takeHit, this.sprites.attack]))
      return;

    // Prevent reassigning the same sprite
    if (this.image === sprite.image) return;

    // Switch to new sprite
    if (Array.isArray(sprite.image)) {
      this.image = sprite.image[sprite.imageCurrent];
      // sprite.imageCurrent = (sprite.imageCurrent + 1) % sprite.image.length;
    } else this.image = sprite.image;
    this.framesMax = sprite.framesMax;
    this.framesCurrent = 0;
  }
}
