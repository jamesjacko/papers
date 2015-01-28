
/*
 Hero class, this is the player class
 */
var Hero = function(game, texture){
  this.game = game;
  this.texture = texture;
  this.onWater = false;

  

  Phaser.Sprite.call(this, game, 400, 400, texture);

  this.anchor.setTo(0.5, 0.5);
  this.health = 20;
  // health bar shown above user
  this.healthBar = this.game.add.sprite(this.position.x - this.width / 2,this.position.y - this.height / 2 - 10,'healthbar');
  this.healthBar.cropEnabled = true;
  this.healthBar.anchor.setTo(0, 0);

  game.physics.enable(this.healthBar);
  

  game.physics.enable(this);
  game.camera.follow(this);

  this.fire = function(){
    bullet = new Round(game, 'round', this, game.badGuyGroup);
    game.add.existing(bullet);
    bullet.fire();
  };

  this.placeMine = function(){
    mine = new Mine(game, 'mine', this, game.badGuyGroup);
    game.add.existing(mine);
  };
  // ad callbacks to button presses space and m button
  this.cursors = game.input.keyboard.createCursorKeys();
  this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.mineButton = game.input.keyboard.addKey(Phaser.Keyboard.M);
  this.fireButton.onDown.add(this.fire, this);
  this.mineButton.onDown.add(this.placeMine, this);

  this.setOnWater = function(on){
    this.onWater = on;
  }
}

/*
 * Send extended object back to the Sprite object
 */
Hero.prototype = Object.create(Phaser.Sprite.prototype);

/*
 * Override the sprite constructor for new instances of the class
 */
Hero.prototype.constructor = Hero;

/*
 * Phaser will call any game objects update function on game.update
 */
Hero.prototype.update = function(){
      
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      this.body.angularVelocity = 0;
      this.healthBar.width = (this.health / 20) * 50;
      this.healthBar.position.x = this.position.x - this.width / 2;
      this.healthBar.position.y = this.position.y - this.height / 2 - 10;
      // slow the player down when on water
      var inc = (this.onWater)? 100: 200;

      if(this.cursors.left.isDown){
        this.body.angularVelocity = -inc;
      } else if (this.cursors.right.isDown){
        this.body.angularVelocity = inc;
      }
      if(this.cursors.up.isDown){
        this.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(this.angle, inc));
      }
};