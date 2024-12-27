function rectangularCollision(rectangle1, rectangle2) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner(player1, player2) {
  clearTimeout(timerId);
  const announcement = document.querySelector("#announcement");
  if (player1.health === player2.health) {
    announcement.innerHTML = "Tie";
  } else if (player1.health > player2.health) {
    announcement.innerHTML = "Player 1 Wins";
  } else if (player1.health < player2.health) {
    announcement.innerHTML = "Player 2 Wins";
  }
}

function decreaseTimer(player1, player2) {
  if (timer > 0) {
    timerId = setTimeout(() => decreaseTimer(player1, player2), 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  } else {
    determineWinner(player1, player2);
  }
}

function update(player1, player2) {
  player1.update();

  player1.velocity.x = 0;

  if (player1.keys.left.pressed && player1.lastKey === "left") {
    player1.velocity.x = player1.movementSpeed * -1;
    player1.switchSprite(player1.sprites.run);
  } else if (player1.keys.right.pressed && player1.lastKey === "right") {
    player1.velocity.x = player1.movementSpeed;
    player1.switchSprite(player1.sprites.run);
  } else {
    player1.switchSprite(player1.sprites.idle);
  }

  // Jumping logic
  if (player1.velocity.y < 0) {
    player1.switchSprite(player1.sprites.jump);
  } else if (player1.velocity.y > 0) {
    player1.switchSprite(player1.sprites.fall);
  }

  // Detect for collision
  if (
    rectangularCollision(player1, player2) &&
    player1.isAttacking &&
    player1.framesCurrent === player1.sprites.attack.frameHit - 1
  ) {
    player2.takeHit(player1.damage);
  }

  // Player misses
  if (
    player1.isAttacking &&
    player1.framesCurrent === player1.sprites.attack.frameHit - 1
  ) {
    player1.isAttacking = false;
  }
}

function addMovement(player) {
  window.addEventListener("keydown", (e) => {
    if (player.isDead) return;

    switch (e.key.toLowerCase()) {
      case player.keys.jump.key.toLowerCase():
        if (player.keys.jump.pressed === false)
          player.velocity.y = player.jumpHeight;
        player.keys.jump.pressed = true;
        break;
      case player.keys.left.key.toLowerCase():
        player.lastKey = "left";
        player.keys.left.pressed = true;
        break;
      case player.keys.right.key.toLowerCase():
        player.lastKey = "right";
        player.keys.right.pressed = true;
        break;
      case player.keys.attack.key.toLowerCase():
        if (!player.isAttacking) player.attack();
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (player.isDead) return;

    switch (e.key.toLowerCase()) {
      case player.keys.left.key.toLowerCase():
        player.keys.left.pressed = false;
        break;
      case player.keys.right.key.toLowerCase():
        player.keys.right.pressed = false;
        break;
    }
  });
}
