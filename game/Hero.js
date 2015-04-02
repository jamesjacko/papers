
/*
 Hero class, this is the player class
 */
var Hero = function(game, texture, god){
  this.game = game;
  this.texture = texture;
  this.onWater = false;
  this.god = god;

  

  Phaser.Sprite.call(this, game, 400, 400, texture);

  this.followermarker = new Phaser.Sprite(game, 400, 400, 'arrow');

  this.followermarker.width = 17;

  this.followermarker.height = 20;

  this.followermarker.animations.add('go', [
        'arrow1.png',
        'arrow2.png',
    ], 10, true, false);


  this.followermarker.animations.play('go');
  this.followermarker = game.add.existing(this.followermarker);

  

  this.followermarker.anchor.setTo(0.5, 0.5);
  this.followermarker.kill();

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
    var bullet = game.bullets.getFirstDead();

    if(bullet){
      bullet.reset(this.position.x, this.position.y);
      bullet.fire(game.player, game.badGuyGroup);
      this.nextRound = game.time.now + game.player.FIRE_RATE;
    }
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
      this.inc = (this.onWater)? 100: 200;

      if(this.cursors.left.isDown){
        this.body.angularVelocity = -this.inc;
      } else if (this.cursors.right.isDown){
        this.body.angularVelocity = this.inc;
      }
      if(this.cursors.up.isDown){
        this.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(this.angle, this.inc));
      }
      if( !game.follower.inCamera && game.follower.alive ){
            if(game.follower.underAttack){
              this.followermarker.animations.play('go');
            }
            else{
              this.followermarker.animations.stop('go', true);
            }
            this.followermarker.revive(0);
            this.dx = game.follower.position.x - this.position.x;
            this.dy = game.follower.position.y - this.position.y;
            this.pointangle = Math.atan2(this.dy, this.dx);
            this.pointer_x = this.position.x + Math.cos(this.pointangle) * 60;
            this.pointer_y = this.position.y + Math.sin(this.pointangle) * 60;
            this.followermarker.rotation = this.pointangle;
            this.followermarker.position.x = this.pointer_x;
            this.followermarker.position.y = this.pointer_y;

          }else if (game.follower.alive) {

            this.followermarker.kill();
          }
};