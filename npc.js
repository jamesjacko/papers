function NPC(game, texture){
  this.game = game;
  this.texture = game;
  Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, texture);
  this.heading = {
    x: 0,
    y: 0
  }

  this.anchor.setTo(0.5, 0.5);
  game.physics.enable(this);

  this.updateHeading = function(_this){
    var ANGLE = 90 * (Math.PI / 180); // Constraint in radians
    var DIST = 200; // Within 200 pixels of current position
    // Grab an offset angle based on the constraint
    var offset = (Math.floor(Math.random() * ANGLE) -  ANGLE/2); 
    // Get a random point within the constraint angle at DIST length away
    var newX = _this.position.x + Math.cos(_this.rotation + offset) * DIST;
    var newY = _this.position.y + Math.sin(_this.rotation + offset) * DIST;
    // set the new heading for the NPC
    _this.heading = {
      x: newX,
      y: newY
    }
  }
}
NPC.prototype = Object.create(Phaser.Sprite.prototype);

NPC.prototype.constructor = NPC;

NPC.prototype.update = function(){
  if(Math.floor(Math.random() * 20) === 0)
    this.updateHeading(this);

  // Invoke the moveToXY function of the arcade physics to move NPC
  game.physics.arcade.moveToXY(this, this.heading.x, this.heading.y);
  var dx = this.heading.x - this.position.x;
  var dy = this.heading.y - this.position.y;
  // Rotate the NPC toward the new heading
  this.rotation = Math.atan2(dy, dx);
}