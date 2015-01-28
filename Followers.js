/*
 * Follower Class, extends the Phaser sprite class
 * @param game the game objct for use in the instnance
 * @param textrue the texture to use to draw the sprite
 * @param player the player sprite to be used for game logic
*/
var Follower = function(game, texture ,position){
  this.player = game.player;
  this.index = position;
  this.heading = {
    x: 0,
    y: 0
  }
  

  var _this = this;

  this.updateHeading = function(){
    var rand = new RandPoint();
    _this.heading = {
      x: _this.player.position.x - _this.position.x,
      y: _this.player.position.y - _this.position.y
    };
    
  }
  var rand = new RandPoint();

  rand.x += 100;
  rand.y += 100;
  // Call the Sprite constructor using the JS.prototype call function
  Phaser.Sprite.call(this, game, rand.x, rand.y, texture);

  //set central anchor point.

  this.anchor = {
    x: 0.5,
    y: 0.5
  }
  game.physics.enable(this);

  
  
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
  ask({prob: 20, func: this.updateHeading, params: this});
  this.body.velocity.x = this.heading.x;
  this.body.velocity.y = this.heading.y;
  var dx = this.player.position.x - this.position.x;
  var dy = this.player.position.y - this.position.y;
  this.rotation = Math.atan2(dy, dx);
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
  var xs = 0;
  var ys = 0;
  var _this = this;

}