class Play extends Phaser.Scene {
  constructor() {
    super('playScene')
  }

  init() {
    // useful variables
    this.SHOT_VELOCITY_X = 200
    this.SHOT_VELOCITY_Y_MIN = 700
    this.SHOT_VELOCITY_Y_MAX = 1100

    // challenge
    this.shotCounter = 0
    this.score = 0
  }

  preload() {
    this.load.path = './assets/img/'
    this.load.image('grass', 'grass.jpg')
    this.load.image('cup', 'cup.jpg')
    this.load.image('ball', 'ball.png')
    this.load.image('wall', 'wall.png')
    this.load.image('oneway', 'one_way_wall.png')
  }

  create() {
    // add background grass
    this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

    // add cup
    this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
    this.cup.body.setCircle(this.cup.width / 4)
    this.cup.body.setOffset(this.cup.width / 4)
    this.cup.body.setImmovable(true)

    // add ball
    this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
    this.ball.body.setCircle(this.ball.width / 2)
    this.ball.body.setCollideWorldBounds(true)
    this.ball.body.setBounce(0.5)
    this.ball.body.setDamping(true).setDrag(0.5)

    // add walls
    this.wallA = this.physics.add.sprite(0, height / 4, 'wall')
    this.wallA.setX(Phaser.Math.Between(0 + this.wallA.width / 2, width - this.wallA.width / 2))
    this.wallADirection = 1;
    this.wallA.body.setImmovable(true)

    this.wallB = this.physics.add.sprite(0, height / 2, 'wall') // ctrl+D select multiple instances
    this.wallB.setX(Phaser.Math.Between(0 + this.wallB.width / 2, width - this.wallB.width / 2))
    this.wallB.body.setImmovable(true)

    this.walls = this.add.group([this.wallA, this.wallB])

    // add one-way
    this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
    this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
    this.oneWay.body.setImmovable(true)
    this.oneWay.body.checkCollision.down = false

    // add pointer input
    this.input.on('pointerdown', (pointer) => {
      this.shotCounter += 1 // increase shot counter
      let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1 // pointer is above ball
      let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1; // add x direction

      this.ball.body.setVelocityX(Phaser.Math.Between(1, this.SHOT_VELOCITY_X) * shotDirectionX)
      this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
    })

    // cup/ball collision
    this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
      // ball.destroy() // disable body and delete it
      this.score += 1
      ball.setVelocity(0)
      ball.x = width / 2;
      ball.y = height - height / 10;
    })

    // ball/wall collision
    this.physics.add.collider(this.ball, this.walls)

    // ball/one-way collision
    this.physics.add.collider(this.ball, this.oneWay)

    // shot counter and percentage
    this.shotText = this.add.text(20, 20, `Shots: ${this.shotCounter}`, { fontFamily: 'Arial', fontSize: '30px', color: '#000' });
    this.successText = this.add.text(20, 50, `Success: 0%`, { fontFamily: 'Arial', fontSize: '30px', color: '#000' });
  }

  update() {
    // moving obstacle
    this.wallA.x += 5 * this.wallADirection;
    if (this.wallA.x <= this.wallA.width / 2 || this.wallA.x >= width - this.wallA.width / 2) {
      this.wallADirection *= -1;
    }

    // update shot counter and success percentage text
    this.shotText.setText(`Shots: ${this.shotCounter}`);
    let successPercentage = (this.shotCounter > 0) ? Math.floor((this.score / this.shotCounter) * 100) : 0;
    this.successText.setText(`Success: ${successPercentage}%`);
  }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[+] Add ball reset logic on successful shot
[+] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[+] Make one obstacle move left/right and bounce against screen edges
[+] Create and display shot counter, score, and successful shot percentage
*/