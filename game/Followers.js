/*
 * Follower Class, extends the Phaser sprite class
 * @param game the game objct for use in the instnance
 * @param textrue the texture to use to draw the sprite
 * @param player the player sprite to be used for game logic
*/
var Follower = function(game, texture, position, followerType){
  var rand = new RandPoint();

  rand.x += 100;
  rand.y += 100;

  Phaser.Sprite.call(this, game, rand.x, rand.y, texture);
  this.followerType = followerType;
  this.player = game.player;
  this.moniker = "Timmy"
  this.index = position;
  this.game = game;
  this.underAttack = false;
  this.movementStack = new Array();
  this.health = 120;
  this.helpmecounter = 0;
  this.helpwait = 60;
  this.speed = 80;
  this.attackcounter = 0;
  this.attackTime = 0;
  this.attackStart = 0;
  this.seen = false;
  this.heading = {
    x: 0,
    y: 0
  };

  this.helpalerts = {
    0: "Help I'm under attack!!",
    1: "Please help i'm taking heavy fire",
    2: "I'm not sure I'm going to survive this on my own",
    3: "They've spotted me and have me in their sights, help qucik!!",
    4: "Oh no, I've been spotted, quick, help!!"
  }

  this.currentHeading = {
    x: 0,
    y: 0
  };


  var _this = this;

  
  
  // Call the Sprite constructor using the JS.prototype call function
  

  //set central anchor point.

  this.anchor = {
    x: 0.5,
    y: 0.5
  }
  game.physics.enable(this);

  this.attack = function(){
    this.attackcounter = this.helpwait;
    this.underAttack = true;
  }

  this.helpme = function(_this){
    game.broadcast(_this.helpalerts[Math.floor(Math.random() * (Object.keys(_this.helpalerts).length - 1))]);
    _this.helpmecounter = _this.helpwait;
  }

  updateHeading(this);


  //game.camera.follow(this);
  
}

/*
 * Send extended object back to the Sprite object
 */
Follower.prototype = Object.create(Phaser.Sprite.prototype);

/*
 * Override the sprite constructor for new instances of the class
 */
Follower.prototype.constructor = Follower;

/*
 * Phaser will call any game objects update function on game.update
 */
Follower.prototype.update = function(){
  ask({prob: 20, func: updateHeading, params: this});
  wander(this, game);
  if(this.underAttack){
    // start calculating the attack timespan
    if(this.attackTime === 0)
      this.attackStart = game.time.time
    if(this.attackStart > 0 && !this.seen){
      this.attackTime = game.time.time;
    }
    // when the player turns to see the follower stop the timer
    // by doing this we can calculate how long it took the player to
    // react to the attack.
    var angle = findAngle(game.player.position, this.position, game.player.rotation);
    this.seen = Math.abs(toDegrees(angle)) < 60;
    if(this.underAttack && this.helpmecounter < 1){
      ask({prob: 20, func: this.helpme, params: this});
    } else if(this.helpmecounter > 0){
      this.helpmecounter--;
    }
    this.attackcounter--
    if(this.attackcounter === 0){
      this.underAttack = false;
      sendData({reactionTime:this.attackTime - this.attackStart});
      sendData({time:this.attackTime, start: this.attackStart});
      this.attackStart = this.attackTime = 0;
      this.seen = false;
    }
  } else {
    
  }
}

var Followers = function(game, amnt, texture){
  Phaser.Group.call(this, game);

  this.averageCoord = {
    x: 0,
    y: 0
  }
  
  for(var i = 0; i < amnt; i++){
    var follower = new Follower(game, texture, i);
    var sprite = this.add(follower);
  }

  game.physics.enable(this);

}

Followers.prototype = Object.create(Phaser.Group.prototype);
Followers.prototype.constructor = Followers;

Followers.prototype.update = function(){
  Phaser.Group.prototype.update.call(this);
}