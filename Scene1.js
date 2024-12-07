class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' }); 
    }

 preload() {
    // Load assets
    this.load.image('player', ''); // Replace with sprite filepath
    this.load.image('enemy', ''); // Replace with sprite filepath
}

create() {
    // Add player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);

    //setup keyboard input
    cursors = this.input.keyboard.createCursorKeys();

    // Add group for enemies
    enemies = this.physics.add.group();

    // Spawn enemies periodically
    this.time.addEvent({
        delay: 1000, // Spawn every second
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    // Collision detection between player and enemies
    this.physics.add.overlap(player, enemies, handleCollision, null, this);

    // Display score and health
    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });
    healthText = this.add.text(10, 40, 'Health: 3', { fontSize: '20px', fill: '#fff' });
}

update() {
    // Player movement
    const speed = 200;
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.setVelocityY(speed);
    }
}

spawnEnemy() {
    const x = Phaser.Math.Between(0, config.width);
    const y = Phaser.Math.Between(0, config.height);
    const enemy = enemies.create(x, y, 'enemy');
    enemy.setCollideWorldBounds(true);

    // Make enemies move toward the player
    this.physics.moveToObject(enemy, player, 100);
}

handleCollision(player, enemy) {
    enemy.destroy(); // Remove the enemy
    health--;

    // Update health display
    healthText.setText(`Health: ${health}`);

    if (health <= 0) {
        this.physics.pause(); // Stop the game
        player.setTint(0xff0000);
        this.add.text(300, 250, 'Game Over', { fontSize: '40px', fill: '#fff' });
    }
}
}
