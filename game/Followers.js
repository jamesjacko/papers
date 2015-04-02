/*
 * Follower Class, extends the Phaser sprite class
 * @param game the game objct for use in the instnance
 * @param textrue the texture to use to draw the sprite
 * @param player the player sprite to be used for game logic
*/
var Follower = function(game, texture, ft){
  var rand = new RandPoint();

  rand.x += 100;
  rand.y += 100;

  Phaser.Sprite.call(this, game, rand.x, rand.y, texture);
  this.followerType = ft;
  this.player = game.player;
  this.moniker = "Timmy"
  this.game = game;
  this.underAttack = false;
  this.movementStack = new Array();
  this.health = 120;
  
  this.helpwait = 60;
  this.speed = 80;
  this.attackcounter = this.attackTime = this.attackStart = this.helpmecounter = 0;
  this.seen = this.engaged = this.timeToEngage = this.sent = 0;
  this.playerDistance = 401;
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
    if(this.followerType === 2){
      game.broadcast("** Follower Under Attack **");
      _this.helpmecounter = _this.helpwait;
    } else {
      game.broadcast(_this.helpalerts[Math.floor(Math.random() * (Object.keys(_this.helpalerts).length - 1))]);
      _this.helpmecounter = _this.helpwait;
    }
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

function changeBG(){
  console.log(document.getElementById("padd").style.backgroundImage);
  if(document.getElementById("padd").style.backgroundImage == "url(images/profile"+followerType+".jpg)"){
    document.getElementById("padd").style.backgroundImage == "url(images/profile"+followerType+"a.jpg)"
  }else{
    document.getElementById("padd").style.backgroundImage == "url(images/profile"+followerType+".jpg)"
  }
}

/*
 * Phaser will call any game objects update function on game.update
 */
Follower.prototype.update = function(){
  ask({prob: 20, func: updateHeading, params: this});
  wander(this, game);
  if(this.underAttack){
    if(this.attackStart === 0){
      this.attackStart = game.time.time
      bgChanger = setInterval(function(){ changeBG() }, 200);
    }
    if(!this.seen)
      this.attackTime = game.time.time;
    if(!this.engaged){
      this.timeToEngage = game.time.time;
    }
    // when the player turns to see the follower stop the timer
    // by doing this we can calculate how long it took the player to
    // react to the attack.
    this.playerDistance = game.physics.arcade.distanceBetween(this, game.player);
    this.engaged = this.playerDistance < 400;
    var angle = findAngle(game.player.position, this.position, game.player.rotation);
    if(!this.seen)
      this.seen = Math.abs(toDegrees(angle)) < 10;
    if(this.underAttack && this.helpmecounter < 1){
      ask({prob: 20, func: this.helpme, params: this});
    } else if(this.helpmecounter > 0){
      this.helpmecounter--;
    }
    this.attackcounter--
    if(this.engaged && this.sent == 0){
      var attTime = (this.attackTime - this.attackStart < 0)? -1 : this.attackTime - this.attackStart;
      sendData({turnTowardsTime:attTime, timeToEngage:this.timeToEngage - this.attackStart})
      this.sent = 1;
    }
    if(this.attackcounter === 0){
      this.underAttack = false;
      this.attackStart = this.attackTime = this.timeToEngage = this.sent = 0;
      this.playerDistance = 401;
      this.seen = this.engaged = false;
    }
  } else {
    if(typeof bgChanger != "undefined"){
      clearInterval(bgChanger);
      document.getElementById("padd").style.backgroundImage == "url('images/profile"+followerType+".jpg')"
    }
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